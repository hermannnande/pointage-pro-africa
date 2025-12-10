import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:geolocator/geolocator.dart';
import '../../../core/theme/app_theme.dart';
import '../../../data/providers/attendance_provider.dart';
import '../../../data/providers/auth_provider.dart';

class AttendanceTab extends StatefulWidget {
  const AttendanceTab({super.key});

  @override
  State<AttendanceTab> createState() => _AttendanceTabState();
}

class _AttendanceTabState extends State<AttendanceTab> {
  bool _isLoading = false;
  String _currentTime = '';

  @override
  void initState() {
    super.initState();
    _updateTime();
    // Mettre à jour l'heure chaque seconde
    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 1));
      if (mounted) {
        _updateTime();
        return true;
      }
      return false;
    });
  }

  void _updateTime() {
    setState(() {
      final now = DateTime.now();
      _currentTime = '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}:${now.second.toString().padLeft(2, '0')}';
    });
  }

  Future<void> _handleClockIn() async {
    setState(() => _isLoading = true);
    
    try {
      // Obtenir la position GPS
      final position = await _getCurrentPosition();
      
      if (position == null) {
        _showError('Impossible d\'obtenir votre position GPS');
        return;
      }
      
      final attendanceProvider = Provider.of<AttendanceProvider>(context, listen: false);
      final success = await attendanceProvider.clockIn(
        position.latitude,
        position.longitude,
      );
      
      if (success && mounted) {
        _showSuccess('Pointage d\'entrée enregistré avec succès');
      } else {
        _showError('Erreur lors du pointage');
      }
    } catch (e) {
      _showError('Erreur: ${e.toString()}');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _handleClockOut() async {
    setState(() => _isLoading = true);
    
    try {
      final position = await _getCurrentPosition();
      
      if (position == null) {
        _showError('Impossible d\'obtenir votre position GPS');
        return;
      }
      
      final attendanceProvider = Provider.of<AttendanceProvider>(context, listen: false);
      final success = await attendanceProvider.clockOut(
        position.latitude,
        position.longitude,
      );
      
      if (success && mounted) {
        _showSuccess('Pointage de sortie enregistré avec succès');
      } else {
        _showError('Erreur lors du pointage');
      }
    } catch (e) {
      _showError('Erreur: ${e.toString()}');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<Position?> _getCurrentPosition() async {
    try {
      // Vérifier les permissions
      final permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        final requested = await Geolocator.requestPermission();
        if (requested == LocationPermission.denied) {
          return null;
        }
      }
      
      // Obtenir la position
      return await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
        timeLimit: const Duration(seconds: 30),
      );
    } catch (e) {
      debugPrint('Erreur GPS: $e');
      return null;
    }
  }

  void _showSuccess(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: AppTheme.success),
    );
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: AppTheme.error),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pointage'),
        actions: [
          Consumer<AttendanceProvider>(
            builder: (context, provider, _) {
              return Padding(
                padding: const EdgeInsets.all(AppTheme.space4),
                child: Center(
                  child: Row(
                    children: [
                      Icon(
                        Icons.wifi,
                        size: 16,
                        color: provider.isOnline ? AppTheme.success : AppTheme.error,
                      ),
                      const SizedBox(width: AppTheme.space1),
                      Text(
                        provider.isOnline ? 'En ligne' : 'Hors ligne',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
      body: Consumer2<AuthProvider, AttendanceProvider>(
        builder: (context, authProvider, attendanceProvider, _) {
          final user = authProvider.user;
          
          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppTheme.space6),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Carte de bienvenue
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(AppTheme.space6),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Bonjour ${user?['first_name'] ?? 'Employé'} 👋',
                          style: Theme.of(context).textTheme.headlineMedium,
                        ),
                        const SizedBox(height: AppTheme.space2),
                        Text(
                          _getGreeting(),
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  ),
                ),
                
                const SizedBox(height: AppTheme.space6),
                
                // Grande horloge
                Card(
                  color: AppTheme.primary,
                  child: Padding(
                    padding: const EdgeInsets.all(AppTheme.space8),
                    child: Column(
                      children: [
                        const Icon(
                          Icons.access_time_rounded,
                          size: 48,
                          color: Colors.white,
                        ),
                        const SizedBox(height: AppTheme.space4),
                        Text(
                          _currentTime,
                          style: Theme.of(context).textTheme.displayLarge?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: AppTheme.space2),
                        Text(
                          _getFormattedDate(),
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: Colors.white.withOpacity(0.9),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                
                const SizedBox(height: AppTheme.space6),
                
                // Boutons de pointage
                if (!attendanceProvider.hasClockedIn)
                  _buildClockInButton()
                else if (!attendanceProvider.hasClockedOut)
                  _buildClockOutButton()
                else
                  _buildCompletedCard(),
                
                const SizedBox(height: AppTheme.space6),
                
                // Statistiques du jour
                _buildTodayStats(attendanceProvider),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildClockInButton() {
    return SizedBox(
      height: 80,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _handleClockIn,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppTheme.success,
          shape: RoundedRectangleBorder(
            borderRadius: AppTheme.radius,
          ),
        ),
        child: _isLoading
            ? const CircularProgressIndicator(color: Colors.white)
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.login, size: 32),
                  const SizedBox(width: AppTheme.space4),
                  Text(
                    'Pointer l\'entrée',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
      ),
    );
  }

  Widget _buildClockOutButton() {
    return SizedBox(
      height: 80,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _handleClockOut,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppTheme.warning,
          shape: RoundedRectangleBorder(
            borderRadius: AppTheme.radius,
          ),
        ),
        child: _isLoading
            ? const CircularProgressIndicator(color: Colors.white)
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.logout, size: 32),
                  const SizedBox(width: AppTheme.space4),
                  Text(
                    'Pointer la sortie',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
      ),
    );
  }

  Widget _buildCompletedCard() {
    return Card(
      color: AppTheme.success.withOpacity(0.1),
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.space6),
        child: Row(
          children: [
            const Icon(Icons.check_circle, color: AppTheme.success, size: 48),
            const SizedBox(width: AppTheme.space4),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Journée terminée',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: AppTheme.success,
                    ),
                  ),
                  const SizedBox(height: AppTheme.space1),
                  Text(
                    'Vous avez pointé votre entrée et sortie aujourd\'hui',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTodayStats(AttendanceProvider provider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Aujourd\'hui',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: AppTheme.space4),
        Row(
          children: [
            Expanded(
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(AppTheme.space4),
                  child: Column(
                    children: [
                      const Icon(Icons.login, color: AppTheme.primary),
                      const SizedBox(height: AppTheme.space2),
                      Text(
                        'Entrée',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      const SizedBox(height: AppTheme.space1),
                      Text(
                        provider.hasClockedIn ? _formatTime(provider.todayAttendance!['clock_in']) : '--:--',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Expanded(
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(AppTheme.space4),
                  child: Column(
                    children: [
                      const Icon(Icons.logout, color: AppTheme.warning),
                      const SizedBox(height: AppTheme.space2),
                      Text(
                        'Sortie',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      const SizedBox(height: AppTheme.space1),
                      Text(
                        provider.hasClockedOut ? _formatTime(provider.todayAttendance!['clock_out']) : '--:--',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Bonne matinée !';
    if (hour < 18) return 'Bon après-midi !';
    return 'Bonne soirée !';
  }

  String _getFormattedDate() {
    final now = DateTime.now();
    final days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    final months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    
    return '${days[now.weekday - 1]} ${now.day} ${months[now.month - 1]} ${now.year}';
  }

  String _formatTime(String isoString) {
    final dt = DateTime.parse(isoString);
    return '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
  }
}

