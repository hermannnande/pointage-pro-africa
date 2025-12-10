/// Constantes générales de l'application
class AppConstants {
  // App Info
  static const String appName = 'Pointage Pro Africa';
  static const String appVersion = '1.0.0';
  
  // Storage Keys
  static const String keyToken = 'auth_token';
  static const String keyUser = 'user_data';
  static const String keyRememberMe = 'remember_me';
  static const String keyOfflineAttendances = 'offline_attendances';
  
  // Géolocalisation
  static const double defaultGpsAccuracy = 50.0; // mètres
  static const int gpsTimeout = 30; // secondes
  
  // Formats de date
  static const String dateFormat = 'dd/MM/yyyy';
  static const String timeFormat = 'HH:mm';
  static const String dateTimeFormat = 'dd/MM/yyyy HH:mm';
  
  // Pagination
  static const int defaultPageSize = 30;
  
  // Images
  static const int maxPhotoSizeMB = 5;
  static const int photoQuality = 80;
  
  // Langue par défaut
  static const String defaultLanguage = 'fr';
  
  // Statuts de pointage
  static const String statusPresent = 'PRESENT';
  static const String statusLate = 'LATE';
  static const String statusAbsent = 'ABSENT';
  static const String statusHalfDay = 'HALF_DAY';
  static const String statusLeave = 'LEAVE';
  
  // Statuts de demandes
  static const String statusPending = 'PENDING';
  static const String statusApproved = 'APPROVED';
  static const String statusRejected = 'REJECTED';
  static const String statusCancelled = 'CANCELLED';
  
  // Types de contrat
  static const String contractCDI = 'CDI';
  static const String contractCDD = 'CDD';
  static const String contractDaily = 'JOURNALIER';
  static const String contractIntern = 'STAGIAIRE';
  static const String contractFreelance = 'FREELANCE';
}

