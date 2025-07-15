import 'package:flutter/material.dart';

class DashboardCommercant extends StatelessWidget {
  const DashboardCommercant({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tableau de bord'),
        backgroundColor: Colors.orange,
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _ActionCard(
              icon: Icons.add_shopping_cart,
              label: 'Ajouter un produit',
              onTap: () => Navigator.pushNamed(context, '/ajouter-produit'),
            ),
            const SizedBox(height: 12),
            _ActionCard(
              icon: Icons.list,
              label: 'Mes produits',
              onTap: () => Navigator.pushNamed(context, '/mes-produits'),
            ),
            const SizedBox(height: 12),
            _ActionCard(
              icon: Icons.receipt_long,
              label: 'Commandes reçues',
              onTap: () => Navigator.pushNamed(context, '/commandes-reçues'),
            ),
            const SizedBox(height: 12),
            _ActionCard(
              icon: Icons.person,
              label: 'Mon profil',
              onTap: () => Navigator.pushNamed(context, '/profil-commercant'),
            ),
          ],
        ),
      ),
    );
  }
}

class _ActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _ActionCard({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: ListTile(
        leading: CircleAvatar(backgroundColor: Colors.orange, child: Icon(icon, color: Colors.white)),
        title: Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
        trailing: const Icon(Icons.arrow_forward_ios),
        onTap: onTap,
      ),
    );
  }
}
