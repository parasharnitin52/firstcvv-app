const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const { auth } = require('../middleware/auth');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// Helper function to extract info from text
const parseResumeText = (text) => {
    const info = {
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            github: '',
            summary: ''
        },
        skills: { technical: [], soft: [], projects: [] },
        experience: [],
        education: [],
        projects: []
    };

    // 1. Email
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    const emailMatch = text.match(emailRegex);
    if (emailMatch) info.personalInfo.email = emailMatch[0];

    // 2. Phone
    const phoneRegex = /(\+?(\d{1,3})?[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4})/;
    const phoneMatch = text.match(phoneRegex);
    if (phoneMatch) info.personalInfo.phone = phoneMatch[0].trim();

    // 3. Links (LinkedIn, GitHub)
    const linkedinMatch = text.match(/(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
    if (linkedinMatch) info.personalInfo.linkedin = linkedinMatch[0];

    const githubMatch = text.match(/(github\.com\/[a-zA-Z0-9_-]+)/i);
    if (githubMatch) info.personalInfo.github = githubMatch[0];

    // 4. Name (Heuristic)
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length > 0) {
        let potentialName = lines[0];
        // If first line is a common header, try second
        if (/resume|curriculum|cv|profile/i.test(potentialName) && lines[1]) {
            potentialName = lines[1];
        }
        if (potentialName.length < 50 && !potentialName.includes('@')) {
            info.personalInfo.fullName = potentialName;
        }
    }

    // 5. Section Extraction
    const lowerText = text.toLowerCase();
    const sections = {
        summary: ['summary', 'profile', 'objective', 'about me'],
        experience: ['experience', 'work history', 'professional experience', 'employment'],
        education: ['education', 'academic background', 'qualifications'],
        skills: ['skills', 'technologies', 'technical skills', 'expertise'],
        projects: ['projects', 'personal projects', 'key initiatives']
    };

    // Find indices of each section
    const sectionIndices = [];
    for (const [key, keywords] of Object.entries(sections)) {
        for (const keyword of keywords) {
            const idx = lowerText.indexOf(keyword);
            if (idx !== -1) {
                sectionIndices.push({ key, index: idx, keywordLength: keyword.length });
                break; // Found one keyword for this section
            }
        }
    }

    // Sort sections by their appearance
    sectionIndices.sort((a, b) => a.index - b.index);

    // Extract content between sections
    for (let i = 0; i < sectionIndices.length; i++) {
        const current = sectionIndices[i];
        const next = sectionIndices[i + 1];
        const start = current.index + current.keywordLength;
        const end = next ? next.index : text.length;

        let content = text.substring(start, end).trim();
        content = content.replace(/^[:\-\s\n\r]+/, '');

        if (current.key === 'summary') {
            info.personalInfo.summary = content.substring(0, 1000);
        } else if (current.key === 'skills') {
            // Basic comma or newline separation
            const skillLines = content.split(/,|\n/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 30);
            info.skills.technical = skillLines.slice(0, 15);
        } else if (current.key === 'experience') {
            // Just capture the first chunk as a summary for now, or split by double newline
            const chunks = content.split(/\n\n/).filter(c => c.length > 20);
            info.experience = chunks.map(c => ({
                jobTitle: c.split('\n')[0].substring(0, 50),
                description: c.substring(c.indexOf('\n') + 1, 500)
            })).slice(0, 3);
        }
    }

    return info;
};

// @route   POST /api/upload/resume
router.post('/resume', auth, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const dataBuffer = req.file.buffer;
        const pdfData = await pdf(dataBuffer);
        const text = pdfData.text;

        const parsedData = parseResumeText(text);

        res.json({
            success: true,
            data: parsedData
        });

    } catch (error) {
        console.error('Resume upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing resume',
            error: error.message
        });
    }
});

module.exports = router;
