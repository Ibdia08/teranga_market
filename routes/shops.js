const express = require('express');
const { body, validationResult } = require('express-validator');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const commercantAuth = require('../middleware/commercantAuth');

const router = express.Router();

// Obtenir toutes les boutiques
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filters = { estActive: true };

    if (req.query.ville) {
      filters['adresse.ville'] = new RegExp(req.query.ville, 'i');
    }

    if (req.query.recherche) {
      filters.$text = { $search: req.query.recherche };
    }

    const shops = await Shop.find(filters)
      .populate('proprietaire', 'nom')
      .populate('categories', 'nom icone couleur')
      .sort({ 'note.moyenne': -1, nom: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Shop.countDocuments(filters);

    res.json({
      success: true,
      data: {
        shops,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erreur récupération boutiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des boutiques'
    });
  }
});

// Obtenir une boutique par ID
router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('proprietaire', 'nom telephone')
      .populate('categories', 'nom icone couleur');

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Boutique non trouvée'
      });
    }

    // Obtenir quelques produits de la boutique
    const produits = await Product.find({ boutique: req.params.id, estDisponible: true })
      .populate('categorie', 'nom icone')
      .limit(10)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        shop: {
          ...shop.toObject(),
          produits
        }
      }
    });

  } catch (error) {
    console.error('Erreur récupération boutique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la boutique'
    });
  }
});

// Créer une nouvelle boutique
router.post('/', [auth, commercantAuth], [
  body('nom').trim().isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('adresse.ville').trim().notEmpty().withMessage('La ville est requise'),
  body('contact.telephone').matches(/^(\+221|00221)?[0-9]{9}$/).withMessage('Téléphone invalide')
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

    // Vérifier qu'un commerçant n'a pas déjà une boutique avec ce nom
    const existingShop = await Shop.findOne({ 
      nom: req.body.nom, 
      proprietaire: req.user.userId 
    });

    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà une boutique avec ce nom'
      });
    }

    const shop = new Shop({
      ...req.body,
      proprietaire: req.user.userId
    });

    await shop.save();

    const populatedShop = await Shop.findById(shop._id)
      .populate('categories', 'nom icone couleur');

    res.status(201).json({
      success: true,
      message: 'Boutique créée avec succès',
      data: { shop: populatedShop }
    });

  } catch (error) {
    console.error('Erreur création boutique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la boutique'
    });
  }
});

// Obtenir les boutiques du commerçant connecté
router.get('/mes-boutiques', [auth, commercantAuth], async (req, res) => {
  try {
    const shops = await Shop.find({ proprietaire: req.user.userId })
      .populate('categories', 'nom icone couleur')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { shops }
    });

  } catch (error) {
    console.error('Erreur récupération mes boutiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de vos boutiques'
    });
  }
});

// Mettre à jour une boutique
router.put('/:id', [auth, commercantAuth], async (req, res) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id, proprietaire: req.user.userId });
    
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Boutique non trouvée ou non autorisée'
      });
    }

    Object.assign(shop, req.body);
    await shop.save();

    const updatedShop = await Shop.findById(shop._id)
      .populate('categories', 'nom icone couleur');

    res.json({
      success: true,
      message: 'Boutique mise à jour avec succès',
      data: { shop: updatedShop }
    });

  } catch (error) {
    console.error('Erreur mise à jour boutique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la boutique'
    });
  }
});

module.exports = router;