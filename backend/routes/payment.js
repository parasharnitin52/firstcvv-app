const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Template = require('../models/Template');
const UserTemplateUnlock = require('../models/UserTemplateUnlock');

// @route   GET /api/payment/unlocked
// @desc    Get list of templates unlocked by current user
// @access  Private
router.get('/unlocked', auth, async (req, res) => {
    try {
        const unlocks = await UserTemplateUnlock.findAll({
            where: { userId: req.userId },
            attributes: ['templateId', 'unlockedAt', 'amountPaid']
        });

        const unlockedTemplateIds = unlocks.map(u => u.templateId);

        res.json({
            success: true,
            unlockedTemplateIds,
            unlocks
        });
    } catch (error) {
        console.error('Get unlocked templates error:', error);
        res.status(500).json({ success: false, message: 'Error fetching unlocked templates' });
    }
});

// @route   POST /api/payment/unlock
// @desc    Mock payment - unlock a template for the user
// @access  Private
router.post('/unlock', auth, async (req, res) => {
    try {
        const { templateId } = req.body;

        if (!templateId) {
            return res.status(400).json({ success: false, message: 'templateId is required' });
        }

        // Check template exists
        const template = await Template.findByPk(templateId);
        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        // Check if already unlocked
        const existing = await UserTemplateUnlock.findOne({
            where: { userId: req.userId, templateId }
        });
        if (existing) {
            return res.json({
                success: true,
                message: 'Template already unlocked',
                alreadyUnlocked: true
            });
        }

        // ========== MOCK PAYMENT ==========
        // In production, integrate Stripe/Razorpay here
        // For now, we just simulate a successful payment
        const unlock = await UserTemplateUnlock.create({
            userId: req.userId,
            templateId,
            amountPaid: template.price,
            paymentMethod: 'mock',
            unlockedAt: new Date()
        });
        // ===================================

        res.status(201).json({
            success: true,
            message: 'Template unlocked successfully!',
            unlock
        });
    } catch (error) {
        console.error('Unlock template error:', error);
        res.status(500).json({ success: false, message: 'Error unlocking template', error: error.message });
    }
});

module.exports = router;
