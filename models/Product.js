const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  prix: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  devise: {
    type: String,
    default: 'FCFA',
    enum: ['FCFA', 'EUR', 'USD']
  },
  quantiteDisponible: {
    type: Number,
    required: [true, 'La quantité disponible est requise'],
    min: [0, 'La quantité ne peut pas être négative']
  },
  unite: {
    type: String,
    required: [true, 'L\'unité est requise'],
    enum: ['kg', 'g', 'L', 'mL', 'pièce', 'paquet', 'boîte', 'sac']
  },
  categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La catégorie est requise']
  },
  commercant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le commerçant est requis']
  },
  boutique: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: [true, 'La boutique est requise']
  },
  images: [{
    url: String,
    altText: String,
    estPrincipale: {
      type: Boolean,
      default: false
    }
  }],
  caracteristiques: [{
    nom: String,
    valeur: String
  }],
  motsCles: [String],
  estDisponible: {
    type: Boolean,
    default: true
  },
  estPromu: {
    type: Boolean,
    default: false
  },
  dateExpiration: Date,
  poids: Number,
  dimensions: {
    longueur: Number,
    largeur: Number,
    hauteur: Number
  },
  origine: {
    type: String,
    default: 'Sénégal'
  },
  certification: [{
    type: String,
    enum: ['bio', 'halal', 'commerce-equitable', 'local']
  }],
  note: {
    moyenne: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    nombreAvis: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index pour la recherche
productSchema.index({ nom: 'text', description: 'text', motsCles: 'text' });
productSchema.index({ categorie: 1, prix: 1 });
productSchema.index({ commercant: 1, estDisponible: 1 });

module.exports = mongoose.model('Product', productSchema);