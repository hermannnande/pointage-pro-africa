import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class LeavesTab extends StatelessWidget {
  const LeavesTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Congés'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              // TODO: Ouvrir le formulaire de demande de congé
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppTheme.space6),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Solde de congés
            Card(
              color: AppTheme.primary.withOpacity(0.1),
              child: Padding(
                padding: const EdgeInsets.all(AppTheme.space6),
                child: Column(
                  children: [
                    Text(
                      'Solde de congés',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: AppTheme.space4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStat(context, '18', 'Restants'),
                        Container(
                          width: 1,
                          height: 40,
                          color: AppTheme.borderMain,
                        ),
                        _buildStat(context, '4', 'Utilisés'),
                        Container(
                          width: 1,
                          height: 40,
                          color: AppTheme.borderMain,
                        ),
                        _buildStat(context, '22', 'Total'),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: AppTheme.space6),
            
            // Mes demandes
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Mes demandes',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                TextButton(
                  onPressed: () {},
                  child: const Text('Voir tout'),
                ),
              ],
            ),
            
            const SizedBox(height: AppTheme.space4),
            
            // Liste des demandes
            _buildLeaveRequest(
              context,
              'Congé payé',
              '15 - 19 janvier 2025',
              '5 jours',
              'En attente',
              AppTheme.warning,
            ),
            
            _buildLeaveRequest(
              context,
              'Permission',
              '3 décembre 2025',
              '4 heures',
              'Validé',
              AppTheme.success,
            ),
            
            _buildLeaveRequest(
              context,
              'Congé payé',
              '25 - 30 décembre 2025',
              '5 jours',
              'Refusé',
              AppTheme.error,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // TODO: Ouvrir le formulaire de demande
        },
        backgroundColor: AppTheme.primary,
        icon: const Icon(Icons.add),
        label: const Text('Nouvelle demande'),
      ),
    );
  }

  Widget _buildStat(BuildContext context, String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: Theme.of(context).textTheme.headlineLarge?.copyWith(
            color: AppTheme.primary,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: AppTheme.space1),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall,
        ),
      ],
    );
  }

  Widget _buildLeaveRequest(
    BuildContext context,
    String type,
    String dates,
    String duration,
    String status,
    Color statusColor,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: AppTheme.space4),
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.space4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  type,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppTheme.space3,
                    vertical: AppTheme.space1,
                  ),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.2),
                    borderRadius: AppTheme.radiusFull,
                  ),
                  child: Text(
                    status,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: statusColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppTheme.space2),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16, color: AppTheme.textSecondary),
                const SizedBox(width: AppTheme.space2),
                Text(
                  dates,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
            const SizedBox(height: AppTheme.space1),
            Row(
              children: [
                const Icon(Icons.timelapse, size: 16, color: AppTheme.textSecondary),
                const SizedBox(width: AppTheme.space2),
                Text(
                  duration,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

