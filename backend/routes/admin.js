const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Template = require('../models/Template');
const UserTemplateUnlock = require('../models/UserTemplateUnlock');
const CV = require('../models/CV');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for thumbnail uploads
const uploadsDir = path.join(__dirname, '..', 'uploads', 'thumbnails');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['.png', '.jpg', '.jpeg', '.webp'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) cb(null, true);
        else cb(new Error('Only image files are allowed'));
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ========================
// USER MANAGEMENT
// ========================

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/users', auth, adminAuth, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'lastLogin', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });

        // Get CV counts per user
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const cvCount = await CV.count({ where: { userId: user.id } });
                const unlockCount = await UserTemplateUnlock.count({ where: { userId: user.id } });
                return {
                    ...user.toJSON(),
                    cvCount,
                    unlockCount
                };
            })
        );

        res.json({
            success: true,
            users: usersWithStats,
            total: users.length
        });
    } catch (error) {
        console.error('Admin get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user (admin only)
// @access  Private/Admin
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.role === 'admin') {
            return res.status(400).json({ success: false, message: 'Cannot delete admin user' });
        }
        await user.destroy();
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Admin delete user error:', error);
        res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
    }
});

// ========================
// TEMPLATE MANAGEMENT
// ========================

// @route   GET /api/admin/templates
// @desc    Get all templates (admin only)
// @access  Private/Admin
router.get('/templates', auth, adminAuth, async (req, res) => {
    try {
        const templates = await Template.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, templates });
    } catch (error) {
        console.error('Admin get templates error:', error);
        res.status(500).json({ success: false, message: 'Error fetching templates', error: error.message });
    }
});

// @route   POST /api/admin/templates
// @desc    Create a new template (admin only)
// @access  Private/Admin
router.post('/templates', auth, adminAuth, upload.single('thumbnail'), async (req, res) => {
    try {
        const { id, name, description, atsScore, structure, isLocked, price } = req.body;

        if (!id || !name || !description) {
            return res.status(400).json({
                success: false,
                message: 'id, name, and description are required'
            });
        }

        // Check if template with this id already exists
        const existing = await Template.findByPk(id);
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'A template with this ID already exists'
            });
        }

        const thumbnailPath = req.file ? `/uploads/thumbnails/${req.file.filename}` : null;

        const template = await Template.create({
            id,
            name,
            description,
            atsScore: atsScore ? parseInt(atsScore) : 90,
            thumbnail: thumbnailPath,
            structure: structure ? JSON.parse(structure) : {},
            isLocked: isLocked !== undefined ? isLocked === 'true' || isLocked === true : true,
            price: price ? parseFloat(price) : 99
        });

        res.status(201).json({
            success: true,
            message: 'Template created successfully',
            template
        });
    } catch (error) {
        console.error('Admin create template error:', error);
        res.status(500).json({ success: false, message: 'Error creating template', error: error.message });
    }
});

// @route   PUT /api/admin/templates/:id
// @desc    Update a template (admin only)
// @access  Private/Admin
router.put('/templates/:id', auth, adminAuth, upload.single('thumbnail'), async (req, res) => {
    try {
        const template = await Template.findByPk(req.params.id);
        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        const { name, description, atsScore, structure, isLocked, price } = req.body;

        if (name) template.name = name;
        if (description) template.description = description;
        if (atsScore) template.atsScore = parseInt(atsScore);
        if (structure) template.structure = JSON.parse(structure);
        if (isLocked !== undefined) template.isLocked = isLocked === 'true' || isLocked === true;
        if (price !== undefined) template.price = parseFloat(price);
        if (req.file) template.thumbnail = `/uploads/thumbnails/${req.file.filename}`;

        await template.save();

        res.json({ success: true, message: 'Template updated', template });
    } catch (error) {
        console.error('Admin update template error:', error);
        res.status(500).json({ success: false, message: 'Error updating template', error: error.message });
    }
});

// @route   DELETE /api/admin/templates/:id
// @desc    Delete a template (admin only)
// @access  Private/Admin
router.delete('/templates/:id', auth, adminAuth, async (req, res) => {
    try {
        const template = await Template.findByPk(req.params.id);
        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }
        await template.destroy();
        res.json({ success: true, message: 'Template deleted successfully' });
    } catch (error) {
        console.error('Admin delete template error:', error);
        res.status(500).json({ success: false, message: 'Error deleting template', error: error.message });
    }
});

// ========================
// DASHBOARD STATS
// ========================

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Private/Admin
router.get('/stats', auth, adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalTemplates = await Template.count();
        const totalCVs = await CV.count();
        const totalUnlocks = await UserTemplateUnlock.count();

        // Recent users (last 7 days)
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const { Op } = require('sequelize');
        const recentUsers = await User.count({
            where: { createdAt: { [Op.gte]: oneWeekAgo } }
        });

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalTemplates,
                totalCVs,
                totalUnlocks,
                recentUsers
            }
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ success: false, message: 'Error fetching stats', error: error.message });
    }
});

module.exports = router;
