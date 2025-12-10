import 'package:flutter/foundation.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import '../services/api_service.dart';

class AttendanceProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  Map<String, dynamic>? _todayAttendance;
  List<Map<String, dynamic>> _offlineAttendances = [];
  bool _isOnline = true;
  List<Map<String, dynamic>> _attendanceHistory = [];
  Map<String, dynamic>? _weekStats;
  
  Map<String, dynamic>? get todayAttendance => _todayAttendance;
  List<Map<String, dynamic>> get offlineAttendances => _offlineAttendances;
  List<Map<String, dynamic>> get attendanceHistory => _attendanceHistory;
  Map<String, dynamic>? get weekStats => _weekStats;
  bool get isOnline => _isOnline;
  bool get hasClockedIn => _todayAttendance != null && _todayAttendance!['clock_in'] != null;
  bool get hasClockedOut => _todayAttendance != null && _todayAttendance!['clock_out'] != null;
  
  /// Pointer l'entrée
  Future<bool> clockIn(double latitude, double longitude, {String? photoPath}) async {
    try {
      if (_isOnline) {
        final response = await _apiService.clockIn(
          latitude: latitude,
          longitude: longitude,
          photoPath: photoPath,
          deviceInfo: 'Mobile App',
        );
        
        if (response.statusCode == 201) {
          _todayAttendance = response.data['attendance'];
          notifyListeners();
          return true;
        }
        return false;
      } else {
        // Mode offline
        _offlineAttendances.add({
          'type': 'clock_in',
          'date': DateTime.now().toIso8601String().split('T')[0],
          'clock_in': DateTime.now().toIso8601String(),
          'latitude': latitude,
          'longitude': longitude,
        });
        notifyListeners();
        return true;
      }
    } catch (e) {
      debugPrint('Erreur pointage entrée: $e');
      return false;
    }
  }
  
  /// Pointer la sortie
  Future<bool> clockOut(double latitude, double longitude, {String? photoPath}) async {
    try {
      if (_isOnline) {
        final response = await _apiService.clockOut(
          latitude: latitude,
          longitude: longitude,
          photoPath: photoPath,
          deviceInfo: 'Mobile App',
        );
        
        if (response.statusCode == 200) {
          _todayAttendance = response.data['attendance'];
          notifyListeners();
          return true;
        }
        return false;
      } else {
        // Mode offline - pas possible de pointer la sortie sans pointage d'entrée
        return false;
      }
    } catch (e) {
      debugPrint('Erreur pointage sortie: $e');
      return false;
    }
  }
  
  /// Synchroniser les pointages hors ligne
  Future<void> syncOfflineAttendances() async {
    if (_offlineAttendances.isEmpty || !_isOnline) return;
    
    try {
      final response = await _apiService.syncOfflineAttendances(_offlineAttendances);
      
      if (response.statusCode == 200) {
        _offlineAttendances.clear();
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Erreur de synchronisation: $e');
    }
  }
  
  /// Charger le pointage du jour
  Future<void> loadTodayAttendance() async {
    try {
      final response = await _apiService.getTodayAttendance();
      
      if (response.statusCode == 200) {
        _todayAttendance = response.data['attendance'];
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Erreur chargement pointage: $e');
    }
  }
  
  /// Charger l'historique
  Future<void> loadHistory() async {
    try {
      final response = await _apiService.getAttendanceHistory();
      
      if (response.statusCode == 200) {
        _attendanceHistory = List<Map<String, dynamic>>.from(
          response.data['data']
        );
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Erreur chargement historique: $e');
    }
  }
  
  /// Charger les stats de la semaine
  Future<void> loadWeekStats() async {
    try {
      final response = await _apiService.getWeekStats();
      
      if (response.statusCode == 200) {
        _weekStats = response.data;
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Erreur chargement stats: $e');
    }
  }
  
  /// Mettre à jour l'état de connexion
  void setOnlineStatus(bool isOnline) {
    if (_isOnline != isOnline) {
      _isOnline = isOnline;
      notifyListeners();
      
      // Tenter la synchronisation si on revient en ligne
      if (isOnline) {
        syncOfflineAttendances();
        loadTodayAttendance();
      }
    }
  }
  
  /// Initialiser le provider
  Future<void> initialize() async {
    // Vérifier la connexion
    final connectivityResult = await (Connectivity().checkConnectivity());
    _isOnline = connectivityResult != ConnectivityResult.none;
    
    // Écouter les changements de connexion
    Connectivity().onConnectivityChanged.listen((ConnectivityResult result) {
      setOnlineStatus(result != ConnectivityResult.none);
    });
    
    // Charger les données si en ligne
    if (_isOnline) {
      await loadTodayAttendance();
      await loadWeekStats();
    }
  }
}

