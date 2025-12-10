<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Connexion par email/téléphone + mot de passe
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login' => 'required|string', // Email ou téléphone
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Chercher l'utilisateur par email ou téléphone
        $user = User::where('email', $request->login)
                    ->orWhere('phone', $request->login)
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Identifiants incorrects'
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Votre compte est désactivé'
            ], 403);
        }

        // Générer le token JWT
        $token = JWTAuth::fromUser($user);

        // Mettre à jour la dernière activité
        $user->update(['last_activity_at' => now()]);

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user->load(['company', 'site', 'department', 'roles']),
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
        ]);
    }

    /**
     * Connexion par matricule + PIN (pour pointage rapide)
     */
    public function loginWithPin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_code' => 'required|string',
            'pin' => 'required|string|min:4|max:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('employee_code', $request->employee_code)->first();

        if (!$user || $user->pin !== $request->pin) {
            return response()->json([
                'message' => 'Code employé ou PIN incorrect'
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Votre compte est désactivé'
            ], 403);
        }

        $token = JWTAuth::fromUser($user);
        $user->update(['last_activity_at' => now()]);

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user->load(['company', 'site', 'department', 'roles']),
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
        ]);
    }

    /**
     * Demander un code OTP par SMS
     */
    public function requestOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Aucun compte trouvé avec ce numéro'
            ], 404);
        }

        // Générer code OTP (6 chiffres)
        $otp = random_int(100000, 999999);

        // Stocker en cache pour 5 minutes
        cache()->put("otp_{$request->phone}", $otp, now()->addMinutes(5));

        // TODO: Envoyer le SMS via Twilio ou autre
        // SendSmsService::send($request->phone, "Votre code de connexion: {$otp}");

        // En développement, retourner le code (à retirer en production)
        return response()->json([
            'message' => 'Code OTP envoyé par SMS',
            'otp' => config('app.debug') ? $otp : null, // Seulement en debug
        ]);
    }

    /**
     * Connexion par téléphone + OTP
     */
    public function loginWithOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'otp' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Vérifier le code OTP
        $cachedOtp = cache()->get("otp_{$request->phone}");

        if ($cachedOtp != $request->otp) {
            return response()->json([
                'message' => 'Code OTP invalide ou expiré'
            ], 401);
        }

        $user = User::where('phone', $request->phone)->first();

        if (!$user || !$user->is_active) {
            return response()->json([
                'message' => 'Compte introuvable ou désactivé'
            ], 403);
        }

        // Supprimer le code OTP du cache
        cache()->forget("otp_{$request->phone}");

        $token = JWTAuth::fromUser($user);
        $user->update(['last_activity_at' => now()]);

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user->load(['company', 'site', 'department', 'roles']),
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
        ]);
    }

    /**
     * Récupérer l'utilisateur connecté
     */
    public function me()
    {
        $user = auth()->user();
        
        return response()->json([
            'user' => $user->load(['company', 'site', 'department', 'manager', 'workSchedule', 'roles'])
        ]);
    }

    /**
     * Rafraîchir le token
     */
    public function refresh()
    {
        $token = JWTAuth::refresh();

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
        ]);
    }

    /**
     * Déconnexion
     */
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }
}

