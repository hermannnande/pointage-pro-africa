<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class LeaveRequestController extends Controller
{
    /**
     * Liste des demandes de congés
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        $query = LeaveRequest::with(['user', 'leaveType', 'reviewedBy']);
        
        // Si l'utilisateur est un simple employé, montrer seulement ses demandes
        if (!$user->hasRole(['admin', 'manager'])) {
            $query->where('user_id', $user->id);
        }
        // Si manager, montrer seulement son équipe
        elseif ($user->hasRole('manager')) {
            $subordinateIds = $user->subordinates()->pluck('id');
            $query->whereIn('user_id', $subordinateIds);
        }
        
        // Filtres
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('leave_type_id')) {
            $query->where('leave_type_id', $request->leave_type_id);
        }
        
        if ($request->has('start_date')) {
            $query->whereDate('start_date', '>=', $request->start_date);
        }
        
        if ($request->has('end_date')) {
            $query->whereDate('end_date', '<=', $request->end_date);
        }
        
        $leaveRequests = $query->orderBy('created_at', 'desc')
                              ->paginate($request->per_page ?? 30);
        
        return response()->json($leaveRequests);
    }
    
    /**
     * Créer une demande de congé
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string|max:1000',
            'document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $user = auth()->user();
        
        // Calculer le nombre de jours
        $startDate = \Carbon\Carbon::parse($request->start_date);
        $endDate = \Carbon\Carbon::parse($request->end_date);
        $daysCount = $startDate->diffInDays($endDate) + 1;
        
        // Vérifier le solde de congés
        if ($user->remaining_leave_days < $daysCount) {
            return response()->json([
                'message' => 'Solde de congés insuffisant',
                'remaining_days' => $user->remaining_leave_days,
                'requested_days' => $daysCount,
            ], 400);
        }
        
        // Vérifier qu'il n'y a pas de chevauchement
        $overlap = LeaveRequest::where('user_id', $user->id)
            ->where('status', '!=', 'REJECTED')
            ->where(function ($query) use ($request) {
                $query->whereBetween('start_date', [$request->start_date, $request->end_date])
                      ->orWhereBetween('end_date', [$request->start_date, $request->end_date])
                      ->orWhere(function ($q) use ($request) {
                          $q->where('start_date', '<=', $request->start_date)
                            ->where('end_date', '>=', $request->end_date);
                      });
            })
            ->exists();
        
        if ($overlap) {
            return response()->json([
                'message' => 'Vous avez déjà une demande de congé pour cette période',
            ], 400);
        }
        
        // Traiter le document si fourni
        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('leave_documents', 'public');
        }
        
        DB::beginTransaction();
        try {
            $leaveRequest = LeaveRequest::create([
                'user_id' => $user->id,
                'leave_type_id' => $request->leave_type_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'days_count' => $daysCount,
                'reason' => $request->reason,
                'document_path' => $documentPath,
                'status' => 'PENDING',
            ]);
            
            // TODO: Envoyer une notification au manager
            
            DB::commit();
            
            return response()->json([
                'message' => 'Demande de congé créée avec succès',
                'leave_request' => $leaveRequest->load(['leaveType']),
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Erreur lors de la création de la demande',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
    
    /**
     * Afficher une demande
     */
    public function show($id)
    {
        $user = auth()->user();
        
        $leaveRequest = LeaveRequest::with(['user', 'leaveType', 'reviewedBy'])
                                    ->findOrFail($id);
        
        // Vérifier les permissions
        if (!$user->hasRole(['admin', 'manager']) && $leaveRequest->user_id !== $user->id) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }
        
        return response()->json($leaveRequest);
    }
    
    /**
     * Mettre à jour une demande (seulement si PENDING)
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();
        $leaveRequest = LeaveRequest::findOrFail($id);
        
        // Vérifier les permissions
        if ($leaveRequest->user_id !== $user->id) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }
        
        if ($leaveRequest->status !== 'PENDING') {
            return response()->json([
                'message' => 'Impossible de modifier une demande déjà traitée',
            ], 400);
        }
        
        $validator = Validator::make($request->all(), [
            'leave_type_id' => 'sometimes|exists:leave_types,id',
            'start_date' => 'sometimes|date|after_or_equal:today',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'reason' => 'nullable|string|max:1000',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $leaveRequest->update($request->only([
            'leave_type_id',
            'start_date',
            'end_date',
            'reason',
        ]));
        
        return response()->json([
            'message' => 'Demande mise à jour avec succès',
            'leave_request' => $leaveRequest->load(['leaveType']),
        ]);
    }
    
    /**
     * Annuler une demande
     */
    public function destroy($id)
    {
        $user = auth()->user();
        $leaveRequest = LeaveRequest::findOrFail($id);
        
        // Vérifier les permissions
        if ($leaveRequest->user_id !== $user->id && !$user->hasRole(['admin', 'manager'])) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }
        
        if ($leaveRequest->status === 'APPROVED') {
            return response()->json([
                'message' => 'Impossible d\'annuler une demande déjà approuvée',
            ], 400);
        }
        
        $leaveRequest->update(['status' => 'CANCELLED']);
        
        return response()->json([
            'message' => 'Demande annulée avec succès',
        ]);
    }
    
    /**
     * Approuver une demande (Manager/Admin)
     */
    public function approve(Request $request, $id)
    {
        $user = auth()->user();
        
        if (!$user->hasRole(['admin', 'manager'])) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }
        
        $leaveRequest = LeaveRequest::with('user')->findOrFail($id);
        
        if ($leaveRequest->status !== 'PENDING') {
            return response()->json([
                'message' => 'Cette demande a déjà été traitée',
            ], 400);
        }
        
        DB::beginTransaction();
        try {
            $leaveRequest->approve($user->id, $request->comment);
            
            // TODO: Envoyer notification à l'employé
            
            DB::commit();
            
            return response()->json([
                'message' => 'Demande approuvée avec succès',
                'leave_request' => $leaveRequest->fresh(['user', 'leaveType', 'reviewedBy']),
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Erreur lors de l\'approbation',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
    
    /**
     * Refuser une demande (Manager/Admin)
     */
    public function reject(Request $request, $id)
    {
        $user = auth()->user();
        
        if (!$user->hasRole(['admin', 'manager'])) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'comment' => 'required|string|max:500',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $leaveRequest = LeaveRequest::with('user')->findOrFail($id);
        
        if ($leaveRequest->status !== 'PENDING') {
            return response()->json([
                'message' => 'Cette demande a déjà été traitée',
            ], 400);
        }
        
        DB::beginTransaction();
        try {
            $leaveRequest->reject($user->id, $request->comment);
            
            // TODO: Envoyer notification à l'employé
            
            DB::commit();
            
            return response()->json([
                'message' => 'Demande refusée',
                'leave_request' => $leaveRequest->fresh(['user', 'leaveType', 'reviewedBy']),
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Erreur lors du refus',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
    
    /**
     * Types de congés disponibles
     */
    public function leaveTypes()
    {
        $user = auth()->user();
        $leaveTypes = LeaveType::where('company_id', $user->company_id)
                              ->where('is_active', true)
                              ->get();
        
        return response()->json($leaveTypes);
    }
}

