import 'package:flutter/material.dart';

class MesProduitsScreen extends StatelessWidget {
  const MesProduitsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // 👉 Liste fictive de produits pour l’exemple
    final List<Map<String, dynamic>> produits = [
      {"nom": "Mangues", "prix": 1000, "categorie": "Fruits"},
      {"nom": "Poisson sec", "prix": 2500, "categorie": "Poisson"},
      {"nom": "Savon bio", "prix": 800, "categorie": "Cosmétiques"},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text("Mes Produits"),
        backgroundColor: Colors.orange,
        centerTitle: true,
      ),
      body: produits.isEmpty
          ? const Center(child: Text("Aucun produit pour le moment."))
          : ListView.builder(
              itemCount: produits.length,
              itemBuilder: (context, index) {
                final produit = produits[index];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: ListTile(
                    leading: const Icon(Icons.shopping_bag, color: Colors.orange),
                    title: Text(produit["nom"]),
                    subtitle: Text("Catégorie: ${produit["categorie"]}"),
                    trailing: Text("${produit["prix"]} FCFA"),
                  ),
                );
              },
            ),
    );
  }
}
