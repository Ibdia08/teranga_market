const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de la boutique est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  proprietaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le propriétaire est requis']
  },
  adresse: {
    rue: String,
    ville: {
      type: String,
      required: [true, 'La ville est requise']
    },
    region: String,
    codePostal: String,
    coordonnees: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    telephone: {
      type: String,
      required: [true, 'Le téléphone est requis'],
      match: [/^(\+221|00221)?[0-9]{9}$/, 'Numéro de téléphone sénégalais invalide']
    },
    email: String,
    whatsapp: String
  },
  horaires: {
    lundi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
    mardi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
    mercredi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
    jeudi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
    vendredi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
    samedi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
    dimanche: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: true } }
  },
  images: [{
    url: String,
    altText: String,
    estPrincipale: {
      type: Boolean,
      default: false
    }
  }],
  logo: String,
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
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
  },
  estActive: {
    type: Boolean,
    default: true
  },
  estVerifiee: {
    type: Boolean,
    default: false
  },
  dateVerification: Date,
  statistiques: {
    nombreProduits: {
      type: Number,
      default: 0
    },
    nombreCommandes: {
      type: Number,
      default: 0
    },
    chiffreAffaires: {
      type: Number,
      default: 0
    }
  },
  reseauxSociaux: {
    facebook: String,
    instagram: String,
    twitter: String
  }
}, {
  timestamps: true
});

// Index pour la recherche géographique
shopSchema.index({ "adresse.coordonnees": "2dsphere" });
shopSchema.index({ "adresse.ville": 1, estActive: 1 });
shopSchema.index({ nom: 'text', description: 'text' });

module.exports = mongoose.model('Shop', shopSchema);