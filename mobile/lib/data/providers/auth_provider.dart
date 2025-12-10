import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/constants/app_constants.dart';
import '../services/api_service.dart';
import 'dart:convert';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  bool _isAuthenticated = false;
  Map<String, dynamic>? _user;
  String? _token;
  String? _errorMessage;
  
  bool get isAuthenticated => _isAuthenticated;
  Map<String, dynamic>? get user => _user;
  String? get token => _token;
  String? get errorMessage => _errorMessage;
  
  /// Vérifier si l'utilisateur est déjà connecté
  Future<bool> checkLoginStatus() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _token = prefs.getString(AppConstants.keyToken);
      
      if (_token != null) {
        // TODO: Vérifier la validité du token avec l'API
        _isAuthenticated = true;
        return true;
      }
      
      return false;
    } catch (e) {
      return false;
    }
  }
  
  /// Connexion par email/téléphone + mot de passe
  Future<bool> loginWithEmail(String login, String password) async {
    try {
      _errorMessage = null;
      
      final response = await _apiService.login(login, password);
      
      if (response.statusCode == 200) {
        final data = response.data;
        
        _isAuthenticated = true;
        _token = data['access_token'];
        _user = data['user'];
        
        // Sauvegarder le token et l'utilisateur
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(AppConstants.keyToken, _token!);
        await prefs.setString(AppConstants.keyUser, json.encode(_user));
        
        notifyListeners();
        return true;
      } else {
        _errorMessage = 'Identifiants incorrects';
        return false;
      }
      
    } catch (e) {
      _errorMessage = 'Erreur de connexion: ${e.toString()}';
      _isAuthenticated = false;
      notifyListeners();
      return false;
    }
  }
  
  /// Connexion par code employé + PIN
  Future<bool> loginWithPin(String employeeCode, String pin) async {
    try {
      _errorMessage = null;
      
      final response = await _apiService.loginWithPin(employeeCode, pin);
      
      if (response.statusCode == 200) {
        final data = response.data;
        
        _isAuthenticated = true;
        _token = data['access_token'];
        _user = data['user'];
        
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(AppConstants.keyToken, _token!);
        await prefs.setString(AppConstants.keyUser, json.encode(_user));
        
        notifyListeners();
        return true;
      } else {
        _errorMessage = 'Code employé ou PIN incorrect';
        return false;
      }
      
    } catch (e) {
      _errorMessage = 'Erreur de connexion: ${e.toString()}';
      _isAuthenticated = false;
      notifyListeners();
      return false;
    }
  }
  
  /// Déconnexion
  Future<void> logout() async {
    try {
      await _apiService.logout();
      
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(AppConstants.keyToken);
      await prefs.remove(AppConstants.keyUser);
      
      _isAuthenticated = false;
      _user = null;
      _token = null;
      
      notifyListeners();
    } catch (e) {
      debugPrint('Erreur lors de la déconnexion: $e');
    }
  }
  
  /// Récupérer l'utilisateur depuis l'API
  Future<void> fetchUser() async {
    try {
      final response = await _apiService.getMe();
      
      if (response.statusCode == 200) {
        _user = response.data['user'];
        
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(AppConstants.keyUser, json.encode(_user));
        
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Erreur récupération utilisateur: $e');
    }
  }
}

