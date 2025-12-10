import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class HistoryTab extends StatelessWidget {
  const HistoryTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Historique'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(AppTheme.space4),
        itemCount: 10, // Exemple
        itemBuilder: (context, index) {
          return Card(
            margin: const EdgeInsets.only(bottom: AppTheme.space4),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: index % 3 == 0 
                    ? AppTheme.error.withOpacity(0.2) 
                    : AppTheme.success.withOpacity(0.2),
                child: Icon(
                  index % 3 == 0 ? Icons.error_outline : Icons.check_circle_outline,
                  color: index % 3 == 0 ? AppTheme.error : AppTheme.success,
                ),
              ),
              title: Text('${10 - index} décembre 2025'),
              subtitle: Text(
                'Entrée: 08:${(index * 5).toString().padLeft(2, '0')} • Sortie: 17:00',
              ),
              trailing: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    '8h 00min',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  if (index % 3 == 0)
                    Text(
                      '+${index * 5} min',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppTheme.error,
                      ),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

