const sequelize = require('./config/database');
const Template = require('./models/Template');
const Skill = require('./models/Skill');

const templates = [
    {
        id: 'modern-ats',
        name: 'Modern ATS',
        description: 'Clean, parseable design optimized for Applicant Tracking Systems.',
        atsScore: 98,
        thumbnail: '/thumbnails/modern-ats.png',
        structure: { sections: ['summary', 'experience', 'education', 'skills'], layout: 'single-column' }
    },
    {
        id: 'professional-corp',
        name: 'Corporate Pro',
        description: 'Traditional layout perfect for finance and law sectors.',
        atsScore: 96,
        thumbnail: '/thumbnails/pro-corp.png',
        structure: { sections: ['experience', 'education', 'skills', 'summary'], layout: 'single-column' }
    },
    {
        id: 'minimalist-tech',
        name: 'Tech Minimalist',
        description: 'Simple, effective layout highlighting technical skills.',
        atsScore: 95,
        thumbnail: '/thumbnails/minimal-tech.png',
        structure: { sections: ['skills', 'experience', 'projects', 'education'], layout: 'single-column' }
    },
    {
        id: 'creative-clean',
        name: 'Clean Creative',
        description: 'A bit of flair while maintaining high readability.',
        atsScore: 92,
        thumbnail: '/thumbnails/creative-clean.png',
        structure: { sections: ['summary', 'experience', 'education', 'skills'], layout: 'two-column' }
    },
    {
        id: 'executive-brief',
        name: 'Executive Brief',
        description: 'Concise layout for senior roles.',
        atsScore: 94,
        thumbnail: '/thumbnails/executive.png',
        structure: { sections: ['summary', 'experience', 'skills', 'education'], layout: 'single-column' }
    },
    {
        id: 'academic-cv',
        name: 'Academic CV',
        description: 'Extended layout for research and academia.',
        atsScore: 90,
        thumbnail: '/thumbnails/academic.png',
        structure: { sections: ['education', 'experience', 'publications', 'research'], layout: 'single-column' }
    },
    {
        id: 'entry-level',
        name: 'Entry Level',
        description: 'Focuses on education and skills for freshers.',
        atsScore: 97,
        thumbnail: '/thumbnails/entry.png',
        structure: { sections: ['education', 'skills', 'projects', 'experience'], layout: 'single-column' }
    },
    {
        id: 'startup-bold',
        name: 'Startup Bold',
        description: 'Modern typography for startup roles.',
        atsScore: 93,
        thumbnail: '/thumbnails/startup.png',
        structure: { sections: ['summary', 'skills', 'experience', 'education'], layout: 'single-column' }
    },
    {
        id: 'compact-one-page',
        name: 'Compact One-Page',
        description: 'Fits everything onto a single page efficiently.',
        atsScore: 99,
        thumbnail: '/thumbnails/compact.png',
        structure: { sections: ['summary', 'experience', 'education', 'skills'], layout: 'two-column-compact' }
    },
    {
        id: 'designer-showcase',
        name: 'Designer Showcase',
        description: 'Visual hierarchy focused on portfolio links.',
        atsScore: 88,
        thumbnail: '/thumbnails/designer.png',
        structure: { sections: ['portfolio', 'experience', 'skills', 'education'], layout: 'two-column' }
    }
];

const skills = [
    // Computer Science / IT
    { name: 'JavaScript', category: 'Technical', relatedDegrees: ['Computer Science', 'Information Technology', 'Software Engineering'] },
    { name: 'Python', category: 'Technical', relatedDegrees: ['Computer Science', 'Data Science', 'Information Technology'] },
    { name: 'React', category: 'Technical', relatedDegrees: ['Computer Science', 'Web Development'] },
    { name: 'Node.js', category: 'Technical', relatedDegrees: ['Computer Science', 'Web Development'] },
    { name: 'SQL', category: 'Technical', relatedDegrees: ['Computer Science', 'Information Systems', 'Data Science'] },
    { name: 'Git', category: 'Tool', relatedDegrees: ['Computer Science', 'Software Engineering'] },
    { name: 'Machine Learning', category: 'Technical', relatedDegrees: ['Computer Science', 'Data Science', 'Artificial Intelligence'] },

    // Marketing
    { name: 'SEO', category: 'Technical', relatedDegrees: ['Marketing', 'Business Administration', 'Communications'] },
    { name: 'Content Strategy', category: 'Technical', relatedDegrees: ['Marketing', 'Communications'] },
    { name: 'Google Analytics', category: 'Tool', relatedDegrees: ['Marketing', 'Data Analytics'] },
    { name: 'Social Media Management', category: 'Technical', relatedDegrees: ['Marketing', 'Communications'] },
    { name: 'Copywriting', category: 'Technical', relatedDegrees: ['Marketing', 'English', 'Journalism'] },

    // Finance / Business
    { name: 'Financial Modeling', category: 'Technical', relatedDegrees: ['Finance', 'Economics', 'Accounting'] },
    { name: 'Excel (Advanced)', category: 'Tool', relatedDegrees: ['Finance', 'Business Administration', 'Accounting'] },
    { name: 'QuickBooks', category: 'Tool', relatedDegrees: ['Accounting', 'Finance'] },
    { name: 'Project Management', category: 'Soft', relatedDegrees: ['Business Administration', 'Management'] },
    { name: 'Strategic Planning', category: 'Soft', relatedDegrees: ['Business Administration', 'Management'] },

    // Soft Skills (General)
    { name: 'Communication', category: 'Soft', relatedDegrees: ['All'] },
    { name: 'Leadership', category: 'Soft', relatedDegrees: ['All'] },
    { name: 'Problem Solving', category: 'Soft', relatedDegrees: ['All'] },
    { name: 'Teamwork', category: 'Soft', relatedDegrees: ['All'] }
];

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database');

        // Sync models (force: true drops existing tables for clean seed)
        await sequelize.sync({ alter: true }); // Using alter to add new tables without dropping Users/CVs

        // Check if templates exist, if so skip or upsert
        console.log('🌱 Seeding Templates...');
        for (const t of templates) {
            await Template.upsert(t);
        }

        console.log('🌱 Seeding Skills...');
        for (const s of skills) {
            // Find or create to avoid duplicates
            await Skill.findOrCreate({
                where: { name: s.name },
                defaults: s
            });
        }

        console.log('✅ Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seed();
