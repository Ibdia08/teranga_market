const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de la catégorie est requis'],
    unique: true,
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  description: {
    type: String,
    maxlength: [200, 'La description ne peut pas dépasser 200 caractères']
  },
  icone: {
    type: String,
    default: 'category'
  },
  couleur: {
    type: String,
    default: '#FF9800',
    match: [/^#[0-9A-F]{6}$/i, 'Couleur hexadécimale invalide']
  },
  image: String,
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  ordre: {
    type: Number,
    default: 0
  },
  estActive: {
    type: Boolean,
    default: true
  },
  motsCles: [String]
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
categorySchema.index({ parent: 1, ordre: 1 });
categorySchema.index({ nom: 'text', description: 'text' });

module.exports = mongoose.model('Category', categorySchema);