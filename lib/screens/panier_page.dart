import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/panier_provider.dart';

class PanierPage extends StatelessWidget {
  const PanierPage({super.key});

  @override
  Widget build(BuildContext context) {
    final panierProv = context.watch<PanierProvider>();
    final panier = panierProv.items;
    final total = panierProv.total;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Mon Panier"),
        backgroundColor: Colors.orange,
        centerTitle: true,
      ),
      body: panier.isEmpty
          ? const Center(child: Text("Votre panier est vide"))
          : Column(
              children: [
                // Liste des produits dans le panier
                Expanded(
                  child: ListView.builder(
                    itemCount: panier.length,
                    itemBuilder: (context, index) {
                      final article = panier[index];
                      final nom = article['nom'] ?? 'Produit';
                      final quantite = article['quantite'] ?? 0;
                      final prix = article['prix'] ?? 0;

                      return Card(
                        margin: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 6),
                        child: ListTile(
                          title: Text(nom),
                          subtitle: Text('Qté : $quantite  ×  $prix CFA'),
                          trailing: Text('${quantite * prix} CFA'),
                        ),
                      );
                    },
                  ),
                ),

                // Résumé et bouton de validation
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Total :',
                            style: TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            '$total CFA',
                            style: const TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: () {
                            Navigator.pushNamed(context, '/confirmation');
                          },
                          icon: const Icon(Icons.check_circle),
                          label: const Text('Valider la commande'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.orange,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                        ),
                      )
                    ],
                  ),
                )
              ],
            ),
    );
  }
}
