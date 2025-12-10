import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../data/providers/auth_provider.dart';
import '../home/home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  
  // Contrôleurs pour email/password
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  
  // Contrôleurs pour code employé + PIN
  final _employeeCodeController = TextEditingController();
  final _pinController = TextEditingController();
  
  // Contrôleurs pour téléphone + OTP
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  
  bool _isPasswordVisible = false;
  bool _isLoading = false;
  bool _otpSent = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _employeeCodeController.dispose();
    _pinController.dispose();
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  Future<void> _handleEmailLogin() async {
    if (_emailController.text.isEmpty || _passwordController.text.isEmpty) {
      _showError('Veuillez remplir tous les champs');
      return;
    }
    
    setState(() => _isLoading = true);
    
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final success = await authProvider.loginWithEmail(
      _emailController.text,
      _passwordController.text,
    );
    
    setState(() => _isLoading = false);
    
    if (success && mounted) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const HomeScreen()),
      );
    } else {
      _showError(authProvider.errorMessage ?? 'Erreur de connexion');
    }
  }

  Future<void> _handlePinLogin() async {
    if (_employeeCodeController.text.isEmpty || _pinController.text.isEmpty) {
      _showError('Veuillez remplir tous les champs');
      return;
    }
    
    setState(() => _isLoading = true);
    
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final success = await authProvider.loginWithPin(
      _employeeCodeController.text,
      _pinController.text,
    );
    
    setState(() => _isLoading = false);
    
    if (success && mounted) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const HomeScreen()),
      );
    } else {
      _showError(authProvider.errorMessage ?? 'Erreur de connexion');
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppTheme.error,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.all(AppTheme.space6),
              child: Column(
                children: [
                  const Icon(
                    Icons.access_time_rounded,
                    size: 64,
                    color: AppTheme.primary,
                  ),
                  const SizedBox(height: AppTheme.space4),
                  Text(
                    'Connexion',
                    style: Theme.of(context).textTheme.displaySmall,
                  ),
                  const SizedBox(height: AppTheme.space2),
                  Text(
                    'Choisissez votre mode de connexion',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            ),
            
            // Onglets
            TabBar(
              controller: _tabController,
              labelColor: AppTheme.primary,
              unselectedLabelColor: AppTheme.textSecondary,
              indicatorColor: AppTheme.primary,
              tabs: const [
                Tab(text: 'Email'),
                Tab(text: 'Code PIN'),
                Tab(text: 'OTP'),
              ],
            ),
            
            // Contenu des onglets
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildEmailLoginTab(),
                  _buildPinLoginTab(),
                  _buildOtpLoginTab(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmailLoginTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppTheme.space6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextField(
            controller: _emailController,
            decoration: const InputDecoration(
              labelText: 'Email ou Téléphone',
              prefixIcon: Icon(Icons.person_outline),
            ),
            keyboardType: TextInputType.emailAddress,
          ),
          
          const SizedBox(height: AppTheme.space4),
          
          TextField(
            controller: _passwordController,
            decoration: InputDecoration(
              labelText: 'Mot de passe',
              prefixIcon: const Icon(Icons.lock_outline),
              suffixIcon: IconButton(
                icon: Icon(
                  _isPasswordVisible ? Icons.visibility_off : Icons.visibility,
                ),
                onPressed: () {
                  setState(() => _isPasswordVisible = !_isPasswordVisible);
                },
              ),
            ),
            obscureText: !_isPasswordVisible,
          ),
          
          const SizedBox(height: AppTheme.space6),
          
          ElevatedButton(
            onPressed: _isLoading ? null : _handleEmailLogin,
            child: _isLoading
                ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  )
                : const Text('Se connecter'),
          ),
        ],
      ),
    );
  }

  Widget _buildPinLoginTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppTheme.space6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextField(
            controller: _employeeCodeController,
            decoration: const InputDecoration(
              labelText: 'Code Employé',
              prefixIcon: Icon(Icons.badge_outlined),
            ),
          ),
          
          const SizedBox(height: AppTheme.space4),
          
          TextField(
            controller: _pinController,
            decoration: const InputDecoration(
              labelText: 'Code PIN',
              prefixIcon: Icon(Icons.pin_outlined),
            ),
            keyboardType: TextInputType.number,
            maxLength: 6,
            obscureText: true,
          ),
          
          const SizedBox(height: AppTheme.space6),
          
          ElevatedButton(
            onPressed: _isLoading ? null : _handlePinLogin,
            child: _isLoading
                ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  )
                : const Text('Se connecter'),
          ),
        ],
      ),
    );
  }

  Widget _buildOtpLoginTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppTheme.space6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextField(
            controller: _phoneController,
            decoration: const InputDecoration(
              labelText: 'Numéro de téléphone',
              prefixIcon: Icon(Icons.phone_outlined),
              hintText: '+225 XX XX XX XX XX',
            ),
            keyboardType: TextInputType.phone,
          ),
          
          const SizedBox(height: AppTheme.space4),
          
          if (_otpSent) ...[
            TextField(
              controller: _otpController,
              decoration: const InputDecoration(
                labelText: 'Code OTP',
                prefixIcon: Icon(Icons.sms_outlined),
              ),
              keyboardType: TextInputType.number,
              maxLength: 6,
            ),
            
            const SizedBox(height: AppTheme.space4),
          ],
          
          ElevatedButton(
            onPressed: _isLoading ? null : () {
              // TODO: Implémenter la logique OTP
              setState(() => _otpSent = true);
            },
            child: Text(_otpSent ? 'Valider le code' : 'Recevoir le code OTP'),
          ),
          
          if (_otpSent) ...[
            const SizedBox(height: AppTheme.space4),
            TextButton(
              onPressed: () {
                // TODO: Renvoyer le code
              },
              child: const Text('Renvoyer le code'),
            ),
          ],
        ],
      ),
    );
  }
}

