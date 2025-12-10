/// Constantes API
class ApiConstants {
  // Base URL (à modifier selon environnement)
  static const String baseUrl = 'http://localhost:8000/api/v1';
  
  // Endpoints Auth
  static const String login = '/auth/login';
  static const String loginPin = '/auth/login-pin';
  static const String requestOtp = '/auth/request-otp';
  static const String loginOtp = '/auth/login-otp';
  static const String me = '/auth/me';
  static const String refresh = '/auth/refresh';
  static const String logout = '/auth/logout';
  
  // Endpoints Attendance
  static const String clockIn = '/attendance/clock-in';
  static const String clockOut = '/attendance/clock-out';
  static const String syncOffline = '/attendance/sync-offline';
  static const String today = '/attendance/today';
  static const String history = '/attendance/history';
  static const String weekStats = '/attendance/week-stats';
  
  // Endpoints Leave Requests
  static const String leaveRequests = '/leave-requests';
  
  // Endpoints Profile
  static const String profile = '/profile';
  static const String changePassword = '/profile/change-password';
  static const String changePin = '/profile/change-pin';
  static const String uploadPhoto = '/profile/upload-photo';
  
  // Timeouts
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
}

