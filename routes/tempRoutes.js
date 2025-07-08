const express = require('express');
const { getTemplates, createTemplates, updateTemplates, deletTemplates } = require('../controllers/templatesControllers');
const authMiddleware = require('../authMiddlewares/authMiddleware')
const { param } = require('express-validator');
const router = express.Router();

// Get all templates (protected route)
router.get('/', authMiddleware, getTemplates);

// Create a new template (protected route)
router.post('/create', authMiddleware, createTemplates);

// Update a template by ID (protected route)
router.put('/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('Invalid template ID'),
], updateTemplates);

// Delete a template by ID (protected route)
router.delete('/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('Invalid template ID'),
], deletTemplates);

module.exports = router;
