import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../data/providers/auth_provider.dart';
import '../auth/login_screen.dart';

class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profil'),
      ),
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, _) {
          final user = authProvider.user;
          
          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppTheme.space6),
            child: Column(
              children: [
                // Photo de profil et infos
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(AppTheme.space6),
                    child: Column(
                      children: [
                        CircleAvatar(
                          radius: 50,
                          backgroundColor: AppTheme.primary.withOpacity(0.2),
                          child: Text(
                            _getInitials(user),
                            style: Theme.of(context).textTheme.displaySmall?.copyWith(
                              color: AppTheme.primary,
                            ),
                          ),
                        ),
                        const SizedBox(height: AppTheme.space4),
                        Text(
                          '${user?['first_name'] ?? ''} ${user?['last_name'] ?? ''}',
                          style: Theme.of(context).textTheme.headlineMedium,
                        ),
                        const SizedBox(height: AppTheme.space1),
                        Text(
                          'Code: ${user?['employee_code'] ?? '--'}',
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  ),
                ),
                
                const SizedBox(height: AppTheme.space6),
                
                // Options du menu
                _buildMenuSection(
                  context,
                  'Compte',
                  [
                    _buildMenuItem(
                      context,
                      Icons.person_outline,
                      'Informations personnelles',
                      () {},
                    ),
                    _buildMenuItem(
                      context,
                      Icons.lock_outline,
                      'Changer le mot de passe',
                      () {},
                    ),
                    _buildMenuItem(
                      context,
                      Icons.pin_outlined,
                      'Changer le code PIN',
                      () {},
                    ),
                  ],
                ),
                
                const SizedBox(height: AppTheme.space4),
                
                _buildMenuSection(
                  context,
                  'Préférences',
                  [
                    _buildMenuItem(
                      context,
                      Icons.notifications_outline,
                      'Notifications',
                      () {},
                    ),
                    _buildMenuItem(
                      context,
                      Icons.language_outlined,
                      'Langue',
                      () {},
                      trailing: const Text('Français'),
                    ),
                  ],
                ),
                
                const SizedBox(height: AppTheme.space4),
                
                _buildMenuSection(
                  context,
                  'À propos',
                  [
                    _buildMenuItem(
                      context,
                      Icons.help_outline,
                      'Aide',
                      () {},
                    ),
                    _buildMenuItem(
                      context,
                      Icons.info_outline,
                      'Version',
                      () {},
                      trailing: const Text('1.0.0'),
                    ),
                  ],
                ),
                
                const SizedBox(height: AppTheme.space6),
                
                // Bouton de déconnexion
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () => _handleLogout(context, authProvider),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppTheme.error,
                      side: const BorderSide(color: AppTheme.error),
                      padding: const EdgeInsets.symmetric(vertical: AppTheme.space4),
                    ),
                    icon: const Icon(Icons.logout),
                    label: const Text('Se déconnecter'),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildMenuSection(BuildContext context, String title, List<Widget> items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppTheme.space2),
          child: Text(
            title,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              fontWeight: FontWeight.w600,
              color: AppTheme.textSecondary,
            ),
          ),
        ),
        const SizedBox(height: AppTheme.space2),
        Card(
          child: Column(children: items),
        ),
      ],
    );
  }

  Widget _buildMenuItem(
    BuildContext context,
    IconData icon,
    String title,
    VoidCallback onTap, {
    Widget? trailing,
  }) {
    return ListTile(
      leading: Icon(icon, color: AppTheme.textSecondary),
      title: Text(title),
      trailing: trailing ?? const Icon(Icons.chevron_right, color: AppTheme.textTertiary),
      onTap: onTap,
    );
  }

  String _getInitials(Map<String, dynamic>? user) {
    if (user == null) return '??';
    final firstName = user['first_name'] ?? '';
    final lastName = user['last_name'] ?? '';
    return '${firstName.isNotEmpty ? firstName[0] : ''}${lastName.isNotEmpty ? lastName[0] : ''}'.toUpperCase();
  }

  Future<void> _handleLogout(BuildContext context, AuthProvider authProvider) async {
    // Confirmer la déconnexion
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Déconnexion'),
        content: const Text('Voulez-vous vraiment vous déconnecter ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.error,
            ),
            child: const Text('Se déconnecter'),
          ),
        ],
      ),
    );
    
    if (confirm == true && context.mounted) {
      await authProvider.logout();
      
      if (context.mounted) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const LoginScreen()),
          (route) => false,
        );
      }
    }
  }
}

