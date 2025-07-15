import 'package:flutter/foundation.dart';

class PanierProvider extends ChangeNotifier {
  final List<Map<String, dynamic>> _items = [];

  List<Map<String, dynamic>> get items => _items;

  int get total {
    return _items.fold(0, (sum, item) =>
        sum + (item['prix'] as int) * (item['quantite'] as int));
  }

  int get totalItems {
    return _items.fold(0, (sum, item) => sum + (item['quantite'] as int));
  }

  void ajouterProduit(Map<String, dynamic> produit) {
    final index = _items.indexWhere((item) => item['id'] == produit['id']);
    if (index >= 0) {
      _items[index]['quantite'] += produit['quantite'];
    } else {
      _items.add(produit);
    }
    notifyListeners();
  }

  void supprimerProduit(String id) {
    _items.removeWhere((item) => item['id'] == id);
    notifyListeners();
  }

  void viderPanier() {
    _items.clear();
    notifyListeners();
  }
}
