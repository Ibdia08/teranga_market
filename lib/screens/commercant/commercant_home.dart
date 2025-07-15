// lib/screens/commercant/commercant_home.dart
import 'package:flutter/material.dart';
import 'ajouter_produit_screen.dart';
import 'mes_produits_screen.dart';
import 'commandes_recues_screen.dart';
import 'profile_commercant.dart';
import 'dashboard_commercant.dart';

class CommercantHome extends StatefulWidget {
  const CommercantHome({super.key});

  @override
  State<CommercantHome> createState() => _CommercantHomeState();
}

class _CommercantHomeState extends State<CommercantHome> {
  int _currentIndex = 0;

  // Liste des écrans, exactement dans le même ordre que les items du BottomNav
  final List<Widget> _pages = const [
    DashboardCommercant(),      // onglet 0
    AjouterProduitScreen(),     // onglet 1
    MesProduitsScreen(),        // onglet 2
    CommandesRecuesScreen(),    // onglet 3
    ProfileCommercant(),        // onglet 4
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_currentIndex],  // <-- ici on récupère le bon écran
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed, 
        currentIndex: _currentIndex,
        selectedItemColor: Colors.orange,
        unselectedItemColor: Colors.grey,
        onTap: (index) {
          setState(() => _currentIndex = index);
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Tableau',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.add_box),
            label: 'Ajouter',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.list_alt),
            label: 'Mes produits',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.receipt_long),
            label: 'Commandes',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profil',
          ),
        ],
      ),
    );
  }
}
