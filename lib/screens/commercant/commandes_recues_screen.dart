import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/commande_provider.dart';

class CommandesRecuesScreen extends StatelessWidget {
  const CommandesRecuesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final commandes = context.watch<CommandeProvider>().commandes;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Commandes reçues"),
        backgroundColor: Colors.orange,
        centerTitle: true,
      ),
      body: ListView.builder(
        itemCount: commandes.length,
        itemBuilder: (context, index) {
          final cmd = commandes[index];

          return Card(
            margin: const EdgeInsets.all(8),
            child: ListTile(
              title: Text(cmd['produit']),
              subtitle: Text("Client : ${cmd['client']}\nQuantité : ${cmd['quantite']}"),
              trailing: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text("${cmd['total']} FCFA", style: const TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(cmd['status'], style: const TextStyle(color: Colors.orange)),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
