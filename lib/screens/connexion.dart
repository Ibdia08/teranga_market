import 'package:flutter/material.dart';

class ConnexionScreen extends StatefulWidget {
  const ConnexionScreen({super.key});

  @override
  State<ConnexionScreen> createState() => _ConnexionScreenState();
}

class _ConnexionScreenState extends State<ConnexionScreen> {
  String? _role; // Variable pour stocker le rôle sélectionné

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.orange.shade50,
      appBar: AppBar(
        title: const Text("Connexion"),
        backgroundColor: Colors.orange,
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/images/logo.png',
              width: 120,
            ),
            const SizedBox(height: 24),
            const Text(
              "Bienvenue dans Teranga Market !",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.deepOrange,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 30),

            // Champ email
            TextField(
              decoration: const InputDecoration(
                labelText: 'Email',
                prefixIcon: Icon(Icons.email),
              ),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 20),

            // Champ mot de passe
            TextField(
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Mot de passe',
                prefixIcon: Icon(Icons.lock),
              ),
            ),
            const SizedBox(height: 20),

            // Sélection du rôle
            DropdownButtonFormField<String>(
              value: _role,
              decoration: const InputDecoration(
                labelText: "Je suis un",
                prefixIcon: Icon(Icons.person_outline),
              ),
              items: const [
                DropdownMenuItem(value: 'client', child: Text('Client')),
                DropdownMenuItem(value: 'commercant', child: Text('Commerçant')),
              ],
              onChanged: (value) {
                setState(() {
                  _role = value;
                });
              },
            ),
            const SizedBox(height: 30),

            // Bouton connexion
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  if (_role == null) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Veuillez choisir votre rôle")),
                    );
                  } else if (_role == 'client') {
                    Navigator.pushReplacementNamed(context, '/main');
                  } else if (_role == 'commercant') {
                    Navigator.pushReplacementNamed(context, '/commercant');
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orange,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text(
                  'Se connecter',
                  style: TextStyle(fontSize: 16),
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Lien vers l’inscription
            GestureDetector(
              onTap: () {
                Navigator.pushNamed(context, '/inscription');
              },
              child: const Text(
                "Pas encore de compte ? Inscrivez-vous ici",
                style: TextStyle(
                  color: Colors.deepOrange,
                  decoration: TextDecoration.underline,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
