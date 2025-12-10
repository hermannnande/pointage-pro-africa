import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/constants/api_constants.dart';
import '../../core/constants/app_constants.dart';

class ApiService {
  late Dio dio;
  
  ApiService() {
    dio = Dio(BaseOptions(
      baseUrl: ApiConstants.baseUrl,
      connectTimeout: ApiConstants.connectTimeout,
      receiveTimeout: ApiConstants.receiveTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));
    
    // Intercepteur pour ajouter le token
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString(AppConstants.keyToken);
        
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        
        return handler.next(options);
      },
      onError: (DioException error, handler) async {
        if (error.response?.statusCode == 401) {
          // Token expiré, déconnecter l'utilisateur
          final prefs = await SharedPreferences.getInstance();
          await prefs.remove(AppConstants.keyToken);
        }
        
        return handler.next(error);
      },
    ));
  }
  
  // ===== AUTHENTIFICATION =====
  
  Future<Response> login(String login, String password) {
    return dio.post(ApiConstants.login, data: {
      'login': login,
      'password': password,
    });
  }
  
  Future<Response> loginWithPin(String employeeCode, String pin) {
    return dio.post(ApiConstants.loginPin, data: {
      'employee_code': employeeCode,
      'pin': pin,
    });
  }
  
  Future<Response> requestOtp(String phone) {
    return dio.post(ApiConstants.requestOtp, data: {
      'phone': phone,
    });
  }
  
  Future<Response> loginWithOtp(String phone, String otp) {
    return dio.post(ApiConstants.loginOtp, data: {
      'phone': phone,
      'otp': otp,
    });
  }
  
  Future<Response> getMe() {
    return dio.get(ApiConstants.me);
  }
  
  Future<Response> logout() {
    return dio.post(ApiConstants.logout);
  }
  
  // ===== POINTAGE =====
  
  Future<Response> clockIn({
    required double latitude,
    required double longitude,
    String? photoPath,
    String? deviceInfo,
  }) async {
    FormData formData = FormData.fromMap({
      'latitude': latitude,
      'longitude': longitude,
      'device_info': deviceInfo,
    });
    
    if (photoPath != null) {
      formData.files.add(MapEntry(
        'photo',
        await MultipartFile.fromFile(photoPath),
      ));
    }
    
    return dio.post(ApiConstants.clockIn, data: formData);
  }
  
  Future<Response> clockOut({
    required double latitude,
    required double longitude,
    String? photoPath,
    String? deviceInfo,
  }) async {
    FormData formData = FormData.fromMap({
      'latitude': latitude,
      'longitude': longitude,
      'device_info': deviceInfo,
    });
    
    if (photoPath != null) {
      formData.files.add(MapEntry(
        'photo',
        await MultipartFile.fromFile(photoPath),
      ));
    }
    
    return dio.post(ApiConstants.clockOut, data: formData);
  }
  
  Future<Response> syncOfflineAttendances(List<Map<String, dynamic>> attendances) {
    return dio.post(ApiConstants.syncOffline, data: {
      'attendances': attendances,
    });
  }
  
  Future<Response> getTodayAttendance() {
    return dio.get(ApiConstants.today);
  }
  
  Future<Response> getAttendanceHistory({
    String? startDate,
    String? endDate,
    int? month,
    int? year,
    int perPage = 30,
  }) {
    return dio.get(ApiConstants.history, queryParameters: {
      if (startDate != null) 'start_date': startDate,
      if (endDate != null) 'end_date': endDate,
      if (month != null) 'month': month,
      if (year != null) 'year': year,
      'per_page': perPage,
    });
  }
  
  Future<Response> getWeekStats() {
    return dio.get(ApiConstants.weekStats);
  }
  
  // ===== CONGÉS =====
  
  Future<Response> getLeaveRequests({String? status}) {
    return dio.get(ApiConstants.leaveRequests, queryParameters: {
      if (status != null) 'status': status,
    });
  }
  
  Future<Response> createLeaveRequest({
    required int leaveTypeId,
    required String startDate,
    required String endDate,
    String? reason,
    String? documentPath,
  }) async {
    FormData formData = FormData.fromMap({
      'leave_type_id': leaveTypeId,
      'start_date': startDate,
      'end_date': endDate,
      if (reason != null) 'reason': reason,
    });
    
    if (documentPath != null) {
      formData.files.add(MapEntry(
        'document',
        await MultipartFile.fromFile(documentPath),
      ));
    }
    
    return dio.post(ApiConstants.leaveRequests, data: formData);
  }
  
  Future<Response> getLeaveTypes() {
    return dio.get('${ApiConstants.baseUrl}/leave-types');
  }
  
  // ===== PROFIL =====
  
  Future<Response> getProfile() {
    return dio.get(ApiConstants.profile);
  }
  
  Future<Response> updateProfile(Map<String, dynamic> data) {
    return dio.put(ApiConstants.profile, data: data);
  }
  
  Future<Response> changePassword({
    required String currentPassword,
    required String newPassword,
    required String newPasswordConfirmation,
  }) {
    return dio.post(ApiConstants.changePassword, data: {
      'current_password': currentPassword,
      'new_password': newPassword,
      'new_password_confirmation': newPasswordConfirmation,
    });
  }
  
  Future<Response> changePin({
    required String currentPin,
    required String newPin,
    required String newPinConfirmation,
  }) {
    return dio.post(ApiConstants.changePin, data: {
      'current_pin': currentPin,
      'new_pin': newPin,
      'new_pin_confirmation': newPinConfirmation,
    });
  }
  
  Future<Response> uploadPhoto(String photoPath) async {
    FormData formData = FormData.fromMap({
      'photo': await MultipartFile.fromFile(photoPath),
    });
    
    return dio.post(ApiConstants.uploadPhoto, data: formData);
  }
}

