const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Template = require('../models/Template');
const Skill = require('../models/Skill');
const { auth } = require('../middleware/auth');

// @route   GET /api/smart/templates
// @desc    Get all available CV templates
// @access  Public (or Private)
router.get('/templates', async (req, res) => {
    try {
        const templates = await Template.findAll({
            order: [['atsScore', 'DESC']]
        });
        res.json({
            success: true,
            count: templates.length,
            templates
        });
    } catch (error) {
        console.error('Get Templates error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   GET /api/smart/skills/:degree
// @desc    Get skills suggestions based on degree
// @access  Public
router.get('/skills/:degree', async (req, res) => {
    try {
        const { degree } = req.params;

        // Simple fuzzy matching or direct array containment
        // Postgres array containment operator: @> or overlap &&
        // Sequelize needs specific operator syntax for arrays

        // For MVP/simplicity with Sequelize array queries:
        // We'll fetch all and filter in memory if the dataset is small (it is < 100).
        // OR use raw query if complex.

        // Let's try exact matches first or simple ILIKE search on the array string representation
        // But relatedDegrees is an array of strings. 
        // Op.contains is for array containment

        const skills = await Skill.findAll({
            where: {
                [Op.or]: [
                    { relatedDegrees: { [Op.contains]: [degree] } }, // Exact match in array
                    { relatedDegrees: { [Op.contains]: ['All'] } }   // General soft skills
                ]
            },
            order: [['category', 'ASC'], ['name', 'ASC']]
        });

        // If no exact match, maybe try a broader search or return popular ones
        // For now, return what we found.

        res.json({
            success: true,
            count: skills.length,
            skills
        });
    } catch (error) {
        console.error('Get Skills error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   POST /api/smart/suggestions
// @desc    Get AI-like content suggestions for a section
// @access  Private
router.post('/suggestions', auth, async (req, res) => {
    const { field, context } = req.body;
    // field: 'summary', 'experience', 'description'
    // context: { jobTitle: 'Developer', company: 'Google' }

    // In a real app, this would call OpenAI/Gemini API.
    // We will return static high-quality mock suggestions based on the requested field.

    const suggestions = [];

    if (field === 'summary') {
        if (context?.jobTitle?.toLowerCase().includes('developer')) {
            suggestions.push('Passionate Software Developer with 5+ years of experience in building scalable web applications. Proficient in JavaScript, React, and Node.js.');
            suggestions.push('Results-oriented Developer with a strong foundation in algorithms and data structures. Committed to writing clean, maintainable code.');
        } else {
            suggestions.push('Dedicated professional with a proven track record of success. Eager to leverage skills in a new challenging role.');
        }
    } else if (field === 'experience') {
        suggestions.push('Collaborated with cross-functional teams to define, design, and ship new features.');
        suggestions.push('Optimized application performance, reducing load times by 40%.');
        suggestions.push('Mentored junior developers and conducted code reviews to ensure code quality.');
    }

    res.json({
        success: true,
        suggestions
    });
});

module.exports = router;
