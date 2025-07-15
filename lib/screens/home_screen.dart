import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'accueil_page.dart';
import 'boutique_screen.dart';
import 'panier_page.dart';
import 'commandes_screen.dart';
import 'profile_screen.dart';
import '../providers/panier_provider.dart';

final List<Map<String, dynamic>> boutiques = [
  {
    'nom': 'Diop Commerce',
    'ville': 'Dakar',
    'image': 'assets/images/diop.png',
    'note': 4.0
  },
  {
    'nom': 'Binta Boutique',
    'ville': 'Touba',
    'image': 'assets/images/binta.png',
    'note': 5.0
  },
];

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.orange.shade50,
      appBar: AppBar(
        backgroundColor: Colors.orange,
        title: const Text("Teranga Market"),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          )
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // 🧡 Barre de recherche
          TextField(
            decoration: InputDecoration(
              hintText: 'Rechercher un produit ou une boutique',
              prefixIcon: const Icon(Icons.search),
              fillColor: Colors.white,
              filled: true,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(30),
              ),
            ),
          ),
          const SizedBox(height: 20),

          // 🟡 Catégories horizontales
          SizedBox(
            height: 80,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                buildCategory("Fruits", Icons.apple),
                buildCategory("Poisson", Icons.set_meal),
                buildCategory("Légumes", Icons.grass),
                buildCategory("Cosmétiques", Icons.spa),
                buildCategory("Divers", Icons.more_horiz),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // 🟠 Bannière promo
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.orange,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                const Expanded(
                  child: Text(
                    "Promo spéciale",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Image.asset("assets/images/mangue.png", width: 80)
              ],
            ),
          ),
          const SizedBox(height: 20),

          const Text(
            "Boutiques populaires",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),

          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: boutiques.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.75,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
            ),
            itemBuilder: (context, index) {
              final boutique = boutiques[index];
              return Card(
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius:
                          const BorderRadius.vertical(top: Radius.circular(12)),
                      child: Image.asset(
                        boutique['image'],
                        width: double.infinity,
                        height: 100,
                        fit: BoxFit.cover,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            boutique['nom'],
                            style:
                                const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          Text(boutique['ville']),
                          const SizedBox(height: 6),
                          Row(
                            children: List.generate(
                              5,
                              (i) => Icon(
                                i < boutique['note']
                                    ? Icons.star
                                    : Icons.star_border,
                                color: Colors.orange,
                                size: 16,
                              ),
                            ),
                          ),
                        ],
                      ),
                    )
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget buildCategory(String label, IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Column(
        children: [
          CircleAvatar(
            radius: 24,
            backgroundColor: Colors.orange.shade100,
            child: Icon(icon, color: Colors.deepOrange),
          ),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(fontSize: 12))
        ],
      ),
    );
  }
}
