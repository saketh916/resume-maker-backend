const express = require('express');
const router = express.Router();

// Predefined resume templates
const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and contemporary design with emphasis on typography',
    preview: '/templates/modern-preview.png',
    category: 'Professional',
    features: ['Clean typography', 'Professional layout', 'Easy to read']
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Bold and creative design for creative professionals',
    preview: '/templates/creative-preview.png',
    category: 'Creative',
    features: ['Colorful design', 'Creative layout', 'Portfolio focus']
  },
  {
    id: 'minimal',
    name: 'Minimalist',
    description: 'Simple and clean design with maximum readability',
    preview: '/templates/minimal-preview.png',
    category: 'Minimal',
    features: ['Minimal design', 'Maximum readability', 'Clean lines']
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated design for senior professionals',
    preview: '/templates/executive-preview.png',
    category: 'Executive',
    features: ['Sophisticated layout', 'Executive style', 'Professional appearance']
  }
];

// @route   GET /api/templates
// @desc    Get all available templates
// @access  Public
router.get('/', (req, res) => {
  res.json({ templates });
});

// @route   GET /api/templates/:id
// @desc    Get specific template by ID
// @access  Public
router.get('/:id', (req, res) => {
  const template = templates.find(t => t.id === req.params.id);
  
  if (!template) {
    return res.status(404).json({ message: 'Template not found' });
  }
  
  res.json({ template });
});

// @route   GET /api/templates/category/:category
// @desc    Get templates by category
// @access  Public
router.get('/category/:category', (req, res) => {
  const categoryTemplates = templates.filter(t => 
    t.category.toLowerCase() === req.params.category.toLowerCase()
  );
  
  res.json({ templates: categoryTemplates });
});

module.exports = router;
