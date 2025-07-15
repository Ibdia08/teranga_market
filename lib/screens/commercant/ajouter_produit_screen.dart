import 'package:flutter/material.dart';

class AjouterProduitScreen extends StatefulWidget {
  const AjouterProduitScreen({super.key});

  @override
  State<AjouterProduitScreen> createState() => _AjouterProduitScreenState();
}

class _AjouterProduitScreenState extends State<AjouterProduitScreen> {
  final _formKey = GlobalKey<FormState>();
  String? _categorie;
  final List<String> _categories = ['Fruits', 'Légumes', 'Poisson', 'Cosmétiques'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Ajouter un produit'),
        backgroundColor: Colors.orange,
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              // Nom
              TextFormField(
                decoration: const InputDecoration(labelText: 'Nom du produit'),
                validator: (value) =>
                    value!.isEmpty ? 'Veuillez entrer un nom' : null,
              ),
              const SizedBox(height: 16),

              // Prix
              TextFormField(
                decoration: const InputDecoration(labelText: 'Prix (FCFA)'),
                keyboardType: TextInputType.number,
                validator: (value) =>
                    value!.isEmpty ? 'Veuillez entrer un prix' : null,
              ),
              const SizedBox(height: 16),

              // Quantité
              TextFormField(
                decoration: const InputDecoration(labelText: 'Quantité disponible'),
                keyboardType: TextInputType.number,
                validator: (value) =>
                    value!.isEmpty ? 'Veuillez entrer une quantité' : null,
              ),
              const SizedBox(height: 16),

              // Catégorie
              DropdownButtonFormField<String>(
                value: _categorie,
                items: _categories.map((cat) {
                  return DropdownMenuItem(
                    value: cat,
                    child: Text(cat),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() => _categorie = val);
                },
                decoration: const InputDecoration(labelText: 'Catégorie'),
                validator: (value) =>
                    value == null ? 'Sélectionnez une catégorie' : null,
              ),
              const SizedBox(height: 16),

              // Description
              TextFormField(
                maxLines: 3,
                decoration: const InputDecoration(labelText: 'Description'),
              ),
              const SizedBox(height: 24),

              // Bouton Enregistrer
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Produit ajouté !')),
                    );
                    Navigator.pop(context); // Retour après ajout
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orange,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text('Enregistrer le produit'),
              )
            ],
          ),
        ),
      ),
    );
  }
}
