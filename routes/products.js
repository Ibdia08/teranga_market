const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Shop = require('../models/Shop');
const auth = require('../middleware/auth');
const commercantAuth = require('../middleware/commercantAuth');

const router = express.Router();

// Obtenir tous les produits avec filtres et pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page invalide'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limite invalide'),
  query('prix_min').optional().isFloat({ min: 0 }).withMessage('Prix minimum invalide'),
  query('prix_max').optional().isFloat({ min: 0 }).withMessage('Prix maximum invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Paramètres invalides',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Construire les filtres
    let filters = { estDisponible: true };

    if (req.query.categorie) {
      filters.categorie = req.query.categorie;
    }

    if (req.query.commercant) {
      filters.commercant = req.query.commercant;
    }

    if (req.query.boutique) {
      filters.boutique = req.query.boutique;
    }

    if (req.query.ville) {
      // Recherche par ville via la boutique
      const boutiques = await Shop.find({ 'adresse.ville': new RegExp(req.query.ville, 'i') });
      const boutiqueIds = boutiques.map(b => b._id);
      filters.boutique = { $in: boutiqueIds };
    }

    if (req.query.prix_min || req.query.prix_max) {
      filters.prix = {};
      if (req.query.prix_min) filters.prix.$gte = parseFloat(req.query.prix_min);
      if (req.query.prix_max) filters.prix.$lte = parseFloat(req.query.prix_max);
    }

    if (req.query.recherche) {
      filters.$text = { $search: req.query.recherche };
    }

    // Tri
    let sort = {};
    switch (req.query.tri) {
      case 'prix_asc':
        sort.prix = 1;
        break;
      case 'prix_desc':
        sort.prix = -1;
        break;
      case 'nom_asc':
        sort.nom = 1;
        break;
      case 'nom_desc':
        sort.nom = -1;
        break;
      case 'note':
        sort['note.moyenne'] = -1;
        break;
      default:
        sort.createdAt = -1;
    }

    const products = await Product.find(filters)
      .populate('categorie', 'nom icone couleur')
      .populate('commercant', 'nom')
      .populate('boutique', 'nom adresse.ville')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filters);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erreur récupération produits:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits'
    });
  }
});

// Obtenir un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categorie', 'nom icone couleur')
      .populate('commercant', 'nom telephone')
      .populate('boutique', 'nom adresse contact horaires');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      data: { product }
    });

  } catch (error) {
    console.error('Erreur récupération produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du produit'
    });
  }
});

// Créer un nouveau produit (commerçants seulement)
router.post('/', [auth, commercantAuth], [
  body('nom').trim().isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('La description doit contenir entre 10 et 1000 caractères'),
  body('prix').isFloat({ min: 0 }).withMessage('Le prix doit être positif'),
  body('quantiteDisponible').isInt({ min: 0 }).withMessage('La quantité doit être positive'),
  body('unite').isIn(['kg', 'g', 'L', 'mL', 'pièce', 'paquet', 'boîte', 'sac']).withMessage('Unité invalide'),
  body('categorie').isMongoId().withMessage('Catégorie invalide'),
  body('boutique').isMongoId().withMessage('Boutique invalide')
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

    // Vérifier que la catégorie existe
    const category = await Category.findById(req.body.categorie);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    // Vérifier que la boutique appartient au commerçant
    const shop = await Shop.findOne({ _id: req.body.boutique, proprietaire: req.user.userId });
    if (!shop) {
      return res.status(403).json({
        success: false,
        message: 'Boutique non autorisée'
      });
    }

    const product = new Product({
      ...req.body,
      commercant: req.user.userId
    });

    await product.save();

    // Mettre à jour les statistiques de la boutique
    await Shop.findByIdAndUpdate(req.body.boutique, {
      $inc: { 'statistiques.nombreProduits': 1 }
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('categorie', 'nom icone couleur')
      .populate('boutique', 'nom');

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: { product: populatedProduct }
    });

  } catch (error) {
    console.error('Erreur création produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du produit'
    });
  }
});

// Mettre à jour un produit
router.put('/:id', [auth, commercantAuth], [
  body('nom').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('La description doit contenir entre 10 et 1000 caractères'),
  body('prix').optional().isFloat({ min: 0 }).withMessage('Le prix doit être positif'),
  body('quantiteDisponible').optional().isInt({ min: 0 }).withMessage('La quantité doit être positive')
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

    const product = await Product.findOne({ _id: req.params.id, commercant: req.user.userId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé ou non autorisé'
      });
    }

    Object.assign(product, req.body);
    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate('categorie', 'nom icone couleur')
      .populate('boutique', 'nom');

    res.json({
      success: true,
      message: 'Produit mis à jour avec succès',
      data: { product: updatedProduct }
    });

  } catch (error) {
    console.error('Erreur mise à jour produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du produit'
    });
  }
});

// Supprimer un produit
router.delete('/:id', [auth, commercantAuth], async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, commercant: req.user.userId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé ou non autorisé'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    // Mettre à jour les statistiques de la boutique
    await Shop.findByIdAndUpdate(product.boutique, {
      $inc: { 'statistiques.nombreProduits': -1 }
    });

    res.json({
      success: true,
      message: 'Produit supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du produit'
    });
  }
});

module.exports = router;