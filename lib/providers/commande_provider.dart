import 'package:flutter/material.dart';

class CommandeProvider extends ChangeNotifier {
  final List<Map<String, dynamic>> _commandes = [
    {
      "client": "Fatou",
      "produit": "Riz 50kg",
      "quantite": 2,
      "total": 18000,
      "status": "En attente",
    },
    {
      "client": "Aliou",
      "produit": "Huile 5L",
      "quantite": 1,
      "total": 6500,
      "status": "Validée",
    },
  ];

  List<Map<String, dynamic>> get commandes => _commandes;

  void changerStatut(int index, String nouveauStatut) {
    _commandes[index]["status"] = nouveauStatut;
    notifyListeners();
  }
}
