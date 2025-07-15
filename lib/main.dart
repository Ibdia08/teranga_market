import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// Auth
import 'screens/connexion.dart';
import 'screens/inscription.dart';

// Client
import 'screens/home_screen.dart';
import 'screens/confirmation_page.dart';
import 'screens/panier_page.dart';
import 'screens/main_navigation.dart'; // ✅ ajout pour bottom nav

// Commerçant
import 'screens/commercant/commercant_home.dart';
import 'screens/commercant/ajouter_produit_screen.dart';
import 'screens/commercant/mes_produits_screen.dart';
import 'screens/commercant/commandes_recues_screen.dart';
import 'screens/commercant/profile_commercant.dart';

// Providers
import 'providers/commande_provider.dart';
import 'providers/panier_provider.dart';

void main() {
  runApp(const TerangaMarketApp());
}

class TerangaMarketApp extends StatelessWidget {
  const TerangaMarketApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => CommandeProvider()),
        ChangeNotifierProvider(create: (_) => PanierProvider()),
      ],
      child: MaterialApp(
        title: 'Teranga Market',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primarySwatch: Colors.orange,
          scaffoldBackgroundColor: Colors.orange.shade50,
          inputDecorationTheme: const InputDecorationTheme(
            border: OutlineInputBorder(),
          ),
        ),
        initialRoute: '/connexion',
        routes: {
          // Auth
          '/connexion': (_) => const ConnexionScreen(),
          '/inscription': (_) => const InscriptionScreen(),

          // Client
          '/main': (_) => const MainNavigation(), // ✅ route du menu principal
          '/accueil': (_) => const HomeScreen(),
          '/confirmation': (_) => const ConfirmationPage(),
          '/panier': (_) => const PanierPage(),

          // Commerçant
          '/commercant': (_) => const CommercantHome(),
          '/ajouter-produit': (_) => const AjouterProduitScreen(),
          '/mes-produits': (_) => const MesProduitsScreen(),
          '/commandes-reçues': (_) => const CommandesRecuesScreen(),
          '/profil-commercant': (_) => const ProfileCommercant(),
        },
      ),
    );
  }
}
