# Teranga Market - Backend API

Backend Node.js/Express pour l'application mobile Teranga Market, une plateforme de commerce électronique sénégalaise.

## 🚀 Fonctionnalités

- **Authentification JWT** - Inscription, connexion, gestion des sessions
- **Gestion des utilisateurs** - Clients et commerçants
- **Catalogue produits** - CRUD complet avec recherche et filtres
- **Système de commandes** - Création, suivi, gestion des statuts
- **Boutiques** - Gestion des boutiques par les commerçants
- **Catégories** - Organisation hiérarchique des produits
- **API RESTful** - Endpoints bien structurés et documentés
- **Sécurité** - Helmet, rate limiting, validation des données
- **Base de données MongoDB** - Avec Mongoose ODM

## 🛠️ Technologies

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification par tokens
- **bcryptjs** - Hachage des mots de passe
- **express-validator** - Validation des données
- **helmet** - Sécurité HTTP
- **cors** - Gestion CORS

## 📦 Installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd teranga-market-backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration**
```bash
cp .env.example .env
# Éditer le fichier .env avec vos configurations
```

4. **Démarrer MongoDB**
```bash
# Avec Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ou installer MongoDB localement
```

5. **Initialiser la base de données**
```bash
node scripts/seed.js
```

6. **Démarrer le serveur**
```bash
# Développement
npm run dev

# Production
npm start
```

## 🔧 Configuration (.env)

```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/teranga_market

# JWT
JWT_SECRET=votre_jwt_secret_tres_securise

# Serveur
PORT=3000
NODE_ENV=development

# Uploads
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## 📚 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/verify` - Vérifier le token
- `POST /api/auth/logout` - Déconnexion

### Utilisateurs
- `GET /api/users/profil` - Profil utilisateur
- `PUT /api/users/profil` - Mettre à jour le profil
- `PUT /api/users/mot-de-passe` - Changer le mot de passe

### Produits
- `GET /api/products` - Liste des produits (avec filtres)
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit (commerçant)
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders/mes-commandes` - Mes commandes
- `GET /api/orders/:id` - Détails d'une commande
- `PATCH /api/orders/:id/statut` - Changer le statut
- `PATCH /api/orders/:id/annuler` - Annuler une commande

### Boutiques
- `GET /api/shops` - Liste des boutiques
- `GET /api/shops/:id` - Détails d'une boutique
- `POST /api/shops` - Créer une boutique
- `GET /api/shops/mes-boutiques` - Mes boutiques
- `PUT /api/shops/:id` - Modifier une boutique

### Catégories
- `GET /api/categories` - Liste des catégories
- `GET /api/categories/:id` - Détails d'une catégorie
- `POST /api/categories` - Créer une catégorie (admin)

## 🔐 Authentification

L'API utilise JWT pour l'authentification. Incluez le token dans l'en-tête :

```
Authorization: Bearer <votre_token_jwt>
```

## 👥 Comptes de test

Après avoir exécuté le script d'initialisation :

- **Commerçant 1**: `aissatou@example.com` / `password123`
- **Commerçant 2**: `mamadou@example.com` / `password123`
- **Client**: `fatou@example.com` / `password123`

## 🧪 Tests

```bash
npm test
```

## 📱 Intégration Flutter

Pour connecter votre app Flutter à cette API :

1. **Configuration de base**
```dart
class ApiService {
  static const String baseUrl = 'http://localhost:3000/api';
  
  static Map<String, String> get headers => {
    'Content-Type': 'application/json',
    if (token != null) 'Authorization': 'Bearer $token',
  };
}
```

2. **Exemple d'appel API**
```dart
Future<List<Product>> getProducts() async {
  final response = await http.get(
    Uri.parse('$baseUrl/products'),
    headers: headers,
  );
  
  if (response.statusCode == 200) {
    final data = json.decode(response.body);
    return (data['data']['products'] as List)
        .map((json) => Product.fromJson(json))
        .toList();
  }
  throw Exception('Erreur lors du chargement des produits');
}
```

## 🚀 Déploiement

### Heroku
```bash
# Installer Heroku CLI
heroku create teranga-market-api
heroku config:set MONGODB_URI=<votre_mongodb_atlas_uri>
heroku config:set JWT_SECRET=<votre_jwt_secret>
git push heroku main
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -am 'Ajouter nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Email: support@terangamarket.sn
- Issues GitHub: [Créer un issue](../../issues)

---

**Teranga Market** - Connecter les commerçants sénégalais au monde numérique 🇸🇳