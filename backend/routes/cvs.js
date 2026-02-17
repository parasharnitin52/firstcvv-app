const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const CV = require('../models/CV');
const { auth } = require('../middleware/auth');

// @route   GET /api/cvs
// @desc    Get all CVs for logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const cvs = await CV.findAll({
      where: { userId: req.userId },
      order: [['updatedAt', 'DESC']],
      where: { userId: req.userId },
      order: [['updatedAt', 'DESC']]
    });

    res.json({
      success: true,
      count: cvs.length,
      cvs
    });
  } catch (error) {
    console.error('Get CVs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching CVs',
      error: error.message
    });
  }
});

// @route   GET /api/cvs/:id
// @desc    Get single CV by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid CV ID' });
    }

    const cv = await CV.findOne({
      where: {
        id: id,
        userId: req.userId
      }
    });

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV not found'
      });
    }

    res.json({
      success: true,
      cv
    });
  } catch (error) {
    console.error('Get CV error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching CV',
      error: error.message
    });
  }
});

// @route   POST /api/cvs
// @desc    Create a new CV
// @access  Private
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('personalInfo').notEmpty().withMessage('Personal info is required'),
  body('personalInfo.fullName').trim().notEmpty().withMessage('Full name is required'),
  body('personalInfo.email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('❌ CV Validation Errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const cvData = {
      ...req.body,
      userId: req.userId
    };

    const cv = await CV.create(cvData);

    res.status(201).json({
      success: true,
      message: 'CV created successfully',
      cv
    });
  } catch (error) {
    console.error('Create CV error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating CV',
      error: error.message
    });
  }
});

// @route   PUT /api/cvs/:id
// @desc    Update a CV
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let cv = await CV.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV not found'
      });
    }

    // Update CV
    // In Sequelize, we can update fields directly
    // JSONB fields need to be handled carefully if we want partial updates,
    // but here we usually send the whole object for sections.
    // For simplicity with Sequelize JSONB, we'll assign req.body properties.

    // We shouldn't allow updating id or userId
    delete req.body.id;
    delete req.body.userId;
    delete req.body.createdAt;

    // Update the instance
    Object.assign(cv, req.body);
    cv.updatedAt = new Date(); // Explicitly update timestamp if needed, though Sequelize handles it

    // For JSONB changes to be detected by Sequelize in some versions/cases, 
    // we might need to be explicit or use cv.update(req.body)
    await cv.update(req.body);

    res.json({
      success: true,
      message: 'CV updated successfully',
      cv
    });
  } catch (error) {
    console.error('Update CV error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating CV',
      error: error.message
    });
  }
});

// @route   DELETE /api/cvs/:id
// @desc    Delete a CV
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await CV.destroy({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: 'CV not found'
      });
    }

    res.json({
      success: true,
      message: 'CV deleted successfully'
    });
  } catch (error) {
    console.error('Delete CV error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting CV',
      error: error.message
    });
  }
});

module.exports = router;
