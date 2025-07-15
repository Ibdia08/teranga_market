import 'package:flutter/material.dart';

class InscriptionScreen extends StatefulWidget {
  const InscriptionScreen({super.key});

  @override
  State<InscriptionScreen> createState() => _InscriptionScreenState();
}

class _InscriptionScreenState extends State<InscriptionScreen> {
  final _formKey = GlobalKey<FormState>();
  String _nom = '';
  String _email = '';
  String _password = '';
  String _confirmPassword = '';
  String _typeUtilisateur = 'Client';

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      // 👉 À remplacer plus tard par une logique de création réelle
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Inscription en cours...')),
      );

      // Redirige vers l'accueil ou connexion
      Navigator.pushReplacementNamed(context, '/accueil');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Créer un compte'),
        backgroundColor: Colors.orange,
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              const SizedBox(height: 20),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Nom complet'),
                onSaved: (value) => _nom = value ?? '',
                validator: (value) =>
                    value!.isEmpty ? 'Veuillez entrer votre nom' : null,
              ),
              const SizedBox(height: 20),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Email'),
                keyboardType: TextInputType.emailAddress,
                onSaved: (value) => _email = value ?? '',
                validator: (value) =>
                    value!.contains('@') ? null : 'Email invalide',
              ),
              const SizedBox(height: 20),
              TextFormField(
                obscureText: true,
                decoration: const InputDecoration(labelText: 'Mot de passe'),
                onSaved: (value) => _password = value ?? '',
                validator: (value) => (value != null && value.length >= 6)
                    ? null
                    : '6 caractères minimum',
              ),
              const SizedBox(height: 20),
              TextFormField(
                obscureText: true,
                decoration:
                    const InputDecoration(labelText: 'Confirmer le mot de passe'),
                validator: (value) =>
                    value != _password ? 'Les mots de passe ne correspondent pas' : null,
              ),
              const SizedBox(height: 20),
              DropdownButtonFormField<String>(
                value: _typeUtilisateur,
                decoration:
                    const InputDecoration(labelText: 'Type d’utilisateur'),
                items: ['Client', 'Commerçant'].map((type) {
                  return DropdownMenuItem(value: type, child: Text(type));
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _typeUtilisateur = value!;
                  });
                },
              ),
              const SizedBox(height: 30),
              ElevatedButton(
                onPressed: _submitForm,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orange,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text('S’inscrire'),
              ),
              const SizedBox(height: 20),
              TextButton(
                onPressed: () => Navigator.pushReplacementNamed(context, '/'),
                child: const Text('Déjà un compte ? Se connecter'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
