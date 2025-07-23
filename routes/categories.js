const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// Obtenir toutes les catégories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ estActive: true })
      .populate('parent', 'nom')
      .sort({ ordre: 1, nom: 1 });

    // Organiser en arbre hiérarchique
    const categoriesMap = {};
    const rootCategories = [];

    // Créer une map de toutes les catégories
    categories.forEach(cat => {
      categoriesMap[cat._id] = { ...cat.toObject(), enfants: [] };
    });

    // Organiser la hiérarchie
    categories.forEach(cat => {
      if (cat.parent) {
        if (categoriesMap[cat.parent._id]) {
          categoriesMap[cat.parent._id].enfants.push(categoriesMap[cat._id]);
        }
      } else {
        rootCategories.push(categoriesMap[cat._id]);
      }
    });

    res.json({
      success: true,
      data: {
        categories: rootCategories,
        total: categories.length
      }
    });

  } catch (error) {
    console.error('Erreur récupération catégories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories'
    });
  }
});

// Obtenir une catégorie par ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'nom');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    // Obtenir les sous-catégories
    const sousCategories = await Category.find({ parent: req.params.id, estActive: true })
      .sort({ ordre: 1, nom: 1 });

    res.json({
      success: true,
      data: {
        category: {
          ...category.toObject(),
          sousCategories
        }
      }
    });

  } catch (error) {
    console.error('Erreur récupération catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la catégorie'
    });
  }
});

// Créer une nouvelle catégorie (admin seulement)
router.post('/', [auth], [
  body('nom').trim().isLength({ min: 2, max: 50 }).withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('description').optional().trim().isLength({ max: 200 }).withMessage('La description ne peut pas dépasser 200 caractères'),
  body('couleur').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Couleur hexadécimale invalide'),
  body('parent').optional().isMongoId().withMessage('Parent invalide')
], async (req, res) => {
  try {
    // Vérifier les permissions admin
    if (req.user.typeUtilisateur !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès réservé aux administrateurs'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    // Vérifier que le nom n'existe pas déjà
    const existingCategory = await Category.findOne({ nom: req.body.nom });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Une catégorie avec ce nom existe déjà'
      });
    }

    // Vérifier que le parent existe si spécifié
    if (req.body.parent) {
      const parentCategory = await Category.findById(req.body.parent);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: 'Catégorie parent non trouvée'
        });
      }
    }

    const category = new Category(req.body);
    await category.save();

    const populatedCategory = await Category.findById(category._id)
      .populate('parent', 'nom');

    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès',
      data: { category: populatedCategory }
    });

  } catch (error) {
    console.error('Erreur création catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la catégorie'
    });
  }
});

module.exports = router;