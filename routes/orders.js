const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Créer une nouvelle commande
router.post('/', [auth], [
  body('articles').isArray({ min: 1 }).withMessage('Au moins un article est requis'),
  body('articles.*.produit').isMongoId().withMessage('ID produit invalide'),
  body('articles.*.quantite').isInt({ min: 1 }).withMessage('Quantité invalide'),
  body('adresseLivraison.nom').trim().notEmpty().withMessage('Nom requis pour la livraison'),
  body('adresseLivraison.telephone').matches(/^(\+221|00221)?[0-9]{9}$/).withMessage('Téléphone invalide'),
  body('adresseLivraison.ville').trim().notEmpty().withMessage('Ville requise'),
  body('modePaiement').isIn(['especes', 'orange-money', 'wave', 'carte-bancaire', 'virement']).withMessage('Mode de paiement invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { articles, adresseLivraison, modePaiement, commentaires } = req.body;

    // Vérifier et calculer les articles
    let montantTotal = 0;
    const articlesValides = [];

    for (const article of articles) {
      const produit = await Product.findById(article.produit);
      if (!produit) {
        return res.status(400).json({
          success: false,
          message: `Produit ${article.produit} non trouvé`
        });
      }

      if (!produit.estDisponible) {
        return res.status(400).json({
          success: false,
          message: `Le produit ${produit.nom} n'est plus disponible`
        });
      }

      if (produit.quantiteDisponible < article.quantite) {
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant pour ${produit.nom}. Disponible: ${produit.quantiteDisponible}`
        });
      }

      const sousTotal = produit.prix * article.quantite;
      montantTotal += sousTotal;

      articlesValides.push({
        produit: produit._id,
        quantite: article.quantite,
        prixUnitaire: produit.prix,
        sousTotal
      });
    }

    // Calculer les frais de livraison (exemple simple)
    const fraisLivraison = montantTotal > 10000 ? 0 : 1000; // Livraison gratuite au-dessus de 10000 FCFA

    // Créer la commande
    const order = new Order({
      client: req.user.userId,
      articles: articlesValides,
      montantTotal,
      fraisLivraison,
      adresseLivraison,
      modePaiement,
      commentaires
    });

    await order.save();

    // Mettre à jour les stocks
    for (const article of articlesValides) {
      await Product.findByIdAndUpdate(article.produit, {
        $inc: { quantiteDisponible: -article.quantite }
      });
    }

    // Populer la commande pour la réponse
    const populatedOrder = await Order.findById(order._id)
      .populate('articles.produit', 'nom images')
      .populate('client', 'nom email telephone');

    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      data: { order: populatedOrder }
    });

  } catch (error) {
    console.error('Erreur création commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la commande'
    });
  }
});

// Obtenir les commandes de l'utilisateur connecté
router.get('/mes-commandes', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filters = { client: req.user.userId };

    if (req.query.statut) {
      filters.statut = req.query.statut;
    }

    const orders = await Order.find(filters)
      .populate('articles.produit', 'nom images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filters);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes'
    });
  }
});

// Obtenir une commande spécifique
router.get('/:id', auth, async (req, res) => {
  try {
    let filters = { _id: req.params.id };

    // Les clients ne peuvent voir que leurs commandes
    if (req.user.typeUtilisateur === 'client') {
      filters.client = req.user.userId;
    }

    const order = await Order.findOne(filters)
      .populate('articles.produit', 'nom images commercant')
      .populate('client', 'nom email telephone')
      .populate({
        path: 'articles.produit',
        populate: {
          path: 'commercant',
          select: 'nom telephone'
        }
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    res.json({
      success: true,
      data: { order }
    });

  } catch (error) {
    console.error('Erreur récupération commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la commande'
    });
  }
});

// Mettre à jour le statut d'une commande (commerçants et admins)
router.patch('/:id/statut', auth, [
  body('statut').isIn(['en-attente', 'confirmee', 'en-preparation', 'prete', 'en-livraison', 'livree', 'annulee']).withMessage('Statut invalide'),
  body('commentaire').optional().trim().isLength({ max: 500 }).withMessage('Commentaire trop long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { statut, commentaire } = req.body;

    const order = await Order.findById(req.params.id)
      .populate('articles.produit', 'commercant');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Vérifier les permissions
    if (req.user.typeUtilisateur === 'commercant') {
      // Le commerçant ne peut modifier que les commandes de ses produits
      const commercantIds = order.articles.map(a => a.produit.commercant.toString());
      if (!commercantIds.includes(req.user.userId)) {
        return res.status(403).json({
          success: false,
          message: 'Non autorisé à modifier cette commande'
        });
      }
    }

    // Mettre à jour le statut
    order.statut = statut;
    
    // Ajouter à l'historique
    order.historiqueStatuts.push({
      statut,
      commentaire,
      date: new Date()
    });

    // Mettre à jour la date de livraison si nécessaire
    if (statut === 'livree') {
      order.dateLivraisonEffective = new Date();
      order.statutPaiement = 'paye'; // Supposer que la livraison = paiement
    }

    await order.save();

    res.json({
      success: true,
      message: 'Statut mis à jour avec succès',
      data: { order }
    });

  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut'
    });
  }
});

// Annuler une commande
router.patch('/:id/annuler', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Vérifier les permissions
    if (req.user.typeUtilisateur === 'client' && order.client.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à annuler cette commande'
      });
    }

    // Vérifier si la commande peut être annulée
    if (['en-livraison', 'livree'].includes(order.statut)) {
      return res.status(400).json({
        success: false,
        message: 'Cette commande ne peut plus être annulée'
      });
    }

    // Remettre les stocks
    for (const article of order.articles) {
      await Product.findByIdAndUpdate(article.produit, {
        $inc: { quantiteDisponible: article.quantite }
      });
    }

    order.statut = 'annulee';
    order.historiqueStatuts.push({
      statut: 'annulee',
      commentaire: 'Commande annulée par le client',
      date: new Date()
    });

    await order.save();

    res.json({
      success: true,
      message: 'Commande annulée avec succès',
      data: { order }
    });

  } catch (error) {
    console.error('Erreur annulation commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'annulation de la commande'
    });
  }
});

module.exports = router;