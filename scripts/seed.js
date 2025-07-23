const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Category = require('../models/Category');
const Shop = require('../models/Shop');
const Product = require('../models/Product');

// Données de test
const categories = [
  {
    nom: 'Fruits',
    description: 'Fruits frais du Sénégal',
    icone: 'apple',
    couleur: '#4CAF50'
  },
  {
    nom: 'Légumes',
    description: 'Légumes frais et de saison',
    icone: 'grass',
    couleur: '#8BC34A'
  },
  {
    nom: 'Poisson',
    description: 'Poissons frais de la côte sénégalaise',
    icone: 'set_meal',
    couleur: '#2196F3'
  },
  {
    nom: 'Cosmétiques',
    description: 'Produits de beauté naturels',
    icone: 'spa',
    couleur: '#E91E63'
  },
  {
    nom: 'Céréales',
    description: 'Riz, mil, maïs et autres céréales',
    icone: 'grain',
    couleur: '#FF9800'
  }
];

const users = [
  {
    nom: 'Aïssatou Ndiaye',
    email: 'aissatou@example.com',
    motDePasse: 'password123',
    typeUtilisateur: 'commercant',
    telephone: '+221771234567',
    adresse: {
      ville: 'Dakar',
      region: 'Dakar'
    }
  },
  {
    nom: 'Mamadou Diop',
    email: 'mamadou@example.com',
    motDePasse: 'password123',
    typeUtilisateur: 'commercant',
    telephone: '+221772345678',
    adresse: {
      ville: 'Touba',
      region: 'Diourbel'
    }
  },
  {
    nom: 'Fatou Ba',
    email: 'fatou@example.com',
    motDePasse: 'password123',
    typeUtilisateur: 'client',
    telephone: '+221773456789',
    adresse: {
      ville: 'Dakar',
      region: 'Dakar'
    }
  }
];

async function seedDatabase() {
  try {
    // Connexion à la base de données
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/teranga_market');
    console.log('✅ Connexion à MongoDB réussie');

    // Nettoyer la base de données
    await User.deleteMany({});
    await Category.deleteMany({});
    await Shop.deleteMany({});
    await Product.deleteMany({});
    console.log('🧹 Base de données nettoyée');

    // Créer les catégories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ ${createdCategories.length} catégories créées`);

    // Créer les utilisateurs
    const createdUsers = await User.insertMany(users);
    console.log(`✅ ${createdUsers.length} utilisateurs créés`);

    // Créer les boutiques
    const shops = [
      {
        nom: 'Diop Commerce',
        description: 'Boutique de produits frais au marché central',
        proprietaire: createdUsers[0]._id,
        adresse: {
          rue: 'Marché Central',
          ville: 'Dakar',
          region: 'Dakar'
        },
        contact: {
          telephone: '+221771234567',
          email: 'diop.commerce@example.com'
        },
        categories: [createdCategories[0]._id, createdCategories[1]._id],
        horaires: {
          lundi: { ouverture: '08:00', fermeture: '18:00' },
          mardi: { ouverture: '08:00', fermeture: '18:00' },
          mercredi: { ouverture: '08:00', fermeture: '18:00' },
          jeudi: { ouverture: '08:00', fermeture: '18:00' },
          vendredi: { ouverture: '08:00', fermeture: '18:00' },
          samedi: { ouverture: '08:00', fermeture: '18:00' },
          dimanche: { ferme: true }
        }
      },
      {
        nom: 'Binta Boutique',
        description: 'Spécialiste des produits cosmétiques naturels',
        proprietaire: createdUsers[1]._id,
        adresse: {
          rue: 'Avenue Cheikh Ahmadou Bamba',
          ville: 'Touba',
          region: 'Diourbel'
        },
        contact: {
          telephone: '+221772345678',
          email: 'binta.boutique@example.com'
        },
        categories: [createdCategories[3]._id],
        horaires: {
          lundi: { ouverture: '09:00', fermeture: '19:00' },
          mardi: { ouverture: '09:00', fermeture: '19:00' },
          mercredi: { ouverture: '09:00', fermeture: '19:00' },
          jeudi: { ouverture: '09:00', fermeture: '19:00' },
          vendredi: { ouverture: '14:00', fermeture: '19:00' },
          samedi: { ouverture: '09:00', fermeture: '19:00' },
          dimanche: { ferme: true }
        }
      }
    ];

    const createdShops = await Shop.insertMany(shops);
    console.log(`✅ ${createdShops.length} boutiques créées`);

    // Créer des produits
    const products = [
      {
        nom: 'Mangues Kent',
        description: 'Mangues Kent fraîches et sucrées, directement du verger',
        prix: 1500,
        quantiteDisponible: 50,
        unite: 'kg',
        categorie: createdCategories[0]._id,
        commercant: createdUsers[0]._id,
        boutique: createdShops[0]._id,
        motsCles: ['mangue', 'fruit', 'kent', 'frais'],
        origine: 'Casamance'
      },
      {
        nom: 'Tomates cerises',
        description: 'Tomates cerises bio, parfaites pour les salades',
        prix: 800,
        quantiteDisponible: 30,
        unite: 'kg',
        categorie: createdCategories[1]._id,
        commercant: createdUsers[0]._id,
        boutique: createdShops[0]._id,
        motsCles: ['tomate', 'cerise', 'bio', 'salade'],
        certification: ['bio']
      },
      {
        nom: 'Thiouraye frais',
        description: 'Poisson thiouraye pêché ce matin',
        prix: 2500,
        quantiteDisponible: 20,
        unite: 'kg',
        categorie: createdCategories[2]._id,
        commercant: createdUsers[0]._id,
        boutique: createdShops[0]._id,
        motsCles: ['thiouraye', 'poisson', 'frais', 'mer']
      },
      {
        nom: 'Beurre de Karité',
        description: 'Beurre de karité pur, fabriqué artisanalement',
        prix: 3000,
        quantiteDisponible: 15,
        unite: 'pièce',
        categorie: createdCategories[3]._id,
        commercant: createdUsers[1]._id,
        boutique: createdShops[1]._id,
        motsCles: ['karité', 'beurre', 'naturel', 'peau'],
        certification: ['bio', 'commerce-equitable']
      },
      {
        nom: 'Riz brisé',
        description: 'Riz brisé de qualité supérieure',
        prix: 450,
        quantiteDisponible: 100,
        unite: 'kg',
        categorie: createdCategories[4]._id,
        commercant: createdUsers[0]._id,
        boutique: createdShops[0]._id,
        motsCles: ['riz', 'brisé', 'céréale']
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} produits créés`);

    // Mettre à jour les statistiques des boutiques
    for (const shop of createdShops) {
      const productCount = await Product.countDocuments({ boutique: shop._id });
      await Shop.findByIdAndUpdate(shop._id, {
        'statistiques.nombreProduits': productCount
      });
    }

    console.log('🎉 Base de données initialisée avec succès!');
    console.log('\n📋 Comptes de test:');
    console.log('Commerçant 1: aissatou@example.com / password123');
    console.log('Commerçant 2: mamadou@example.com / password123');
    console.log('Client: fatou@example.com / password123');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnexion de MongoDB');
  }
}

// Exécuter le script
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;