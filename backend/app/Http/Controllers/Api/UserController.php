<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Profile de l'utilisateur connecté
     */
    public function profile()
    {
        $user = auth()->user()->load([
            'company',
            'site',
            'department',
            'manager',
            'workSchedule',
            'roles',
        ]);
        
        return response()->json($user);
    }
    
    /**
     * Mettre à jour le profil
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();
        
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string|unique:users,phone,' . $user->id,
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $user->update($request->only([
            'first_name',
            'last_name',
            'email',
            'phone',
        ]));
        
        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user->fresh(),
        ]);
    }
    
    /**
     * Changer le mot de passe
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $user = auth()->user();
        
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect',
            ], 400);
        }
        
        $user->update([
            'password' => Hash::make($request->new_password),
        ]);
        
        return response()->json([
            'message' => 'Mot de passe changé avec succès',
        ]);
    }
    
    /**
     * Changer le PIN
     */
    public function changePin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_pin' => 'required|string|size:4',
            'new_pin' => 'required|string|size:4|confirmed',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $user = auth()->user();
        
        if ($user->pin !== $request->current_pin) {
            return response()->json([
                'message' => 'Le PIN actuel est incorrect',
            ], 400);
        }
        
        $user->update([
            'pin' => $request->new_pin,
        ]);
        
        return response()->json([
            'message' => 'PIN changé avec succès',
        ]);
    }
    
    /**
     * Upload photo de profil
     */
    public function uploadPhoto(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $user = auth()->user();
        
        // Supprimer l'ancienne photo
        if ($user->photo) {
            Storage::disk('public')->delete($user->photo);
        }
        
        // Upload la nouvelle photo
        $path = $request->file('photo')->store('profile_photos', 'public');
        
        $user->update(['photo' => $path]);
        
        return response()->json([
            'message' => 'Photo mise à jour avec succès',
            'photo_url' => Storage::url($path),
        ]);
    }
    
    /**
     * Liste des employés (Admin uniquement)
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        if (!$user->hasRole(['admin', 'manager'])) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }
        
        $query = User::with(['site', 'department', 'roles']);
        
        // Si manager, montrer seulement son équipe
        if ($user->hasRole('manager') && !$user->hasRole('admin')) {
            $query->where('manager_id', $user->id);
        } else {
            $query->where('company_id', $user->company_id);
        }
        
        // Filtres
        if ($request->has('site_id')) {
            $query->where('site_id', $request->site_id);
        }
        
        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }
        
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }
        
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('employee_code', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        $employees = $query->orderBy('created_at', 'desc')
                          ->paginate($request->per_page ?? 30);
        
        return response()->json($employees);
    }
    
    /**
     * Créer un employé (Admin uniquement)
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        
        if (!$user->hasRole('admin')) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'employee_code' => 'required|string|unique:users,employee_code',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'phone' => 'required|string|unique:users,phone',
            'password' => 'required|string|min:6',
            'pin' => 'nullable|string|size:4',
            'site_id' => 'required|exists:sites,id',
            'department_id' => 'nullable|exists:departments,id',
            'manager_id' => 'nullable|exists:users,id',
            'position' => 'required|string|max:255',
            'contract_type' => 'required|in:CDI,CDD,JOURNALIER,STAGIAIRE,FREELANCE',
            'hire_date' => 'required|date',
            'base_salary' => 'nullable|numeric|min:0',
            'annual_leave_days' => 'nullable|integer|min:0',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $newUser = User::create([
            'company_id' => $user->company_id,
            'employee_code' => $request->employee_code,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'pin' => $request->pin,
            'site_id' => $request->site_id,
            'department_id' => $request->department_id,
            'manager_id' => $request->manager_id,
            'position' => $request->position,
            'contract_type' => $request->contract_type,
            'hire_date' => $request->hire_date,
            'base_salary' => $request->base_salary,
            'annual_leave_days' => $request->annual_leave_days ?? 22,
            'is_active' => true,
        ]);
        
        // Assigner le rôle par défaut
        $newUser->assignRole('employee');
        
        return response()->json([
            'message' => 'Employé créé avec succès',
            'user' => $newUser->load(['site', 'department', 'roles']),
        ], 201);
    }
    
    /**
     * Mettre à jour un employé (Admin uniquement)
     */
    public function update(Request $request, $id)
    {
        $currentUser = auth()->user();
        
        if (!$currentUser->hasRole('admin')) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }
        
        $employee = User::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'sometimes|string|unique:users,phone,' . $id,
            'site_id' => 'sometimes|exists:sites,id',
            'department_id' => 'nullable|exists:departments,id',
            'position' => 'sometimes|string|max:255',
            'base_salary' => 'nullable|numeric|min:0',
            'is_active' => 'sometimes|boolean',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $employee->update($request->only([
            'first_name',
            'last_name',
            'email',
            'phone',
            'site_id',
            'department_id',
            'position',
            'base_salary',
            'is_active',
        ]));
        
        return response()->json([
            'message' => 'Employé mis à jour avec succès',
            'user' => $employee->fresh(['site', 'department', 'roles']),
        ]);
    }
    
    /**
     * Désactiver un employé (Admin uniquement)
     */
    public function destroy($id)
    {
        $currentUser = auth()->user();
        
        if (!$currentUser->hasRole('admin')) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }
        
        $employee = User::findOrFail($id);
        
        // Soft delete
        $employee->update(['is_active' => false]);
        $employee->delete();
        
        return response()->json([
            'message' => 'Employé désactivé avec succès',
        ]);
    }
}

