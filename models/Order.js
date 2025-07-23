const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  numeroCommande: {
    type: String,
    unique: true,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le client est requis']
  },
  articles: [{
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantite: {
      type: Number,
      required: true,
      min: [1, 'La quantité doit être au moins 1']
    },
    prixUnitaire: {
      type: Number,
      required: true,
      min: [0, 'Le prix ne peut pas être négatif']
    },
    sousTotal: {
      type: Number,
      required: true
    }
  }],
  montantTotal: {
    type: Number,
    required: true,
    min: [0, 'Le montant total ne peut pas être négatif']
  },
  fraisLivraison: {
    type: Number,
    default: 0,
    min: [0, 'Les frais de livraison ne peuvent pas être négatifs']
  },
  montantFinal: {
    type: Number,
    required: true
  },
  statut: {
    type: String,
    enum: ['en-attente', 'confirmee', 'en-preparation', 'prete', 'en-livraison', 'livree', 'annulee'],
    default: 'en-attente'
  },
  adresseLivraison: {
    nom: String,
    telephone: String,
    rue: String,
    ville: String,
    region: String,
    codePostal: String,
    instructions: String
  },
  modePaiement: {
    type: String,
    enum: ['especes', 'orange-money', 'wave', 'carte-bancaire', 'virement'],
    required: true
  },
  statutPaiement: {
    type: String,
    enum: ['en-attente', 'paye', 'echec', 'rembourse'],
    default: 'en-attente'
  },
  dateLivraisonPrevue: Date,
  dateLivraisonEffective: Date,
  commentaires: String,
  historiqueStatuts: [{
    statut: String,
    date: {
      type: Date,
      default: Date.now
    },
    commentaire: String
  }]
}, {
  timestamps: true
});

// Générer un numéro de commande unique
orderSchema.pre('save', async function(next) {
  if (!this.numeroCommande) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Compter les commandes du jour
    const count = await mongoose.model('Order').countDocuments({
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
      }
    });
    
    this.numeroCommande = `TM${year}${month}${day}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Calculer le montant final
orderSchema.pre('save', function(next) {
  this.montantFinal = this.montantTotal + this.fraisLivraison;
  next();
});

module.exports = mongoose.model('Order', orderSchema);