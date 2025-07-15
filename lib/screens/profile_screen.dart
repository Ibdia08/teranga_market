// lib/screens/profile_screen.dart
import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // TODO : remplace ces valeurs par les vraies données de l’utilisateur
    const String userName  = "Nom Utilisateur";
    const String userEmail = "email@exemple.com";

    return Scaffold(
      appBar: AppBar(
        title: const Text("Mon Compte"),
        backgroundColor: Colors.orange,
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 48,
              backgroundColor: Colors.orange,
              child: Icon(Icons.person, size: 48, color: Colors.white),
            ),
            const SizedBox(height: 16),
            Text(
              userName,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              userEmail,
              style: const TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 32),
            ListTile(
              leading: const Icon(Icons.settings, color: Colors.orange),
              title: const Text("Paramètres"),
              onTap: () {
                // TODO : naviguer vers l'écran des paramètres
              },
            ),
            ListTile(
              leading: const Icon(Icons.help_outline, color: Colors.orange),
              title: const Text("Aide & Support"),
              onTap: () {
                // TODO : naviguer vers l'écran d'aide
              },
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  // 💡 Déconnecter et retourner à la connexion
                  Navigator.pushNamedAndRemoveUntil(
                      context, '/connexion', (route) => false);
                },
                icon: const Icon(Icons.logout),
                label: const Text("Déconnexion"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.redAccent,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
