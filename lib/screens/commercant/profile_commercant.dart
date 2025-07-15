// lib/screens/commercant/profile_commercant.dart
import 'package:flutter/material.dart';

class ProfileCommercant extends StatelessWidget {
  const ProfileCommercant({super.key});

  @override
  Widget build(BuildContext context) {
    // 👇 Données mockées ; à remplacer par vos données réelles
    const String commercantNom = 'Aïssatou Ndiaye';
    const String nomBoutique = 'Marché Central';
    const String ville = 'Dakar';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mon Profil'),
        backgroundColor: Colors.orange,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Avatar
            CircleAvatar(
              radius: 50,
              backgroundColor: Colors.orange.shade200,
              child: const Icon(Icons.store, size: 50, color: Colors.white),
            ),

            const SizedBox(height: 20),

            // Nom du commerçant
            Text(
              commercantNom,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 8),

            // Boutique et ville
            Text(
              '$nomBoutique • $ville',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey.shade700,
              ),
            ),

            const SizedBox(height: 32),

            // Statistiques rapides
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _StatCard(label: 'Produits', count: 24),
                _StatCard(label: 'Ventes', count: 128),
                _StatCard(label: 'Commandes', count: 42),
              ],
            ),

            const SizedBox(height: 40),

            // Boutons d'action
            _ActionButton(
              icon: Icons.edit,
              label: 'Modifier Profil',
              color: Colors.orange,
              onTap: () {
                // TODO: Naviguer vers l'écran d'édition
              },
            ),

            const SizedBox(height: 16),

            _ActionButton(
              icon: Icons.store_mall_directory,
              label: 'Gérer ma boutique',
              color: Colors.deepOrange,
              onTap: () {
                Navigator.pushNamed(context, '/mes-produits');
              },
            ),

            const SizedBox(height: 16),

            _ActionButton(
              icon: Icons.logout,
              label: 'Déconnexion',
              color: Colors.grey.shade600,
              onTap: () {
                Navigator.pushReplacementNamed(context, '/connexion');
              },
            ),
          ],
        ),
      ),
    );
  }
}

// Petit widget pour une statistique
class _StatCard extends StatelessWidget {
  final String label;
  final int count;

  const _StatCard({
    required this.label,
    required this.count,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        margin: const EdgeInsets.symmetric(horizontal: 4),
        decoration: BoxDecoration(
          color: Colors.orange.shade100,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Text(
              '$count',
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.deepOrange,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey.shade800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Bouton d'action principal
class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        icon: Icon(icon, color: Colors.white),
        label: Text(label, style: const TextStyle(fontSize: 16)),
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          padding: const EdgeInsets.symmetric(vertical: 14),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
        onPressed: onTap,
      ),
    );
  }
}
