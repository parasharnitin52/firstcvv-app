import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Trash2, User, Briefcase, GraduationCap, Globe, FileText, Code, Sparkles } from 'lucide-react';

const CVDetailsForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [cvData, setCvData] = useState({
        title: location.state?.title || '',
        templateId: 'modern',
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            website: '',
            summary: ''
        },
        experience: [],
        education: [],
        skills: {
            technical: [],
            soft: [],
            projects: []
        },
        projects: [],
        certifications: [],
        customSections: []
    });

    React.useEffect(() => {
        if (location.state?.importedData) {
            const parsed = location.state.importedData;
            setCvData(prev => ({
                ...prev,
                personalInfo: {
                    ...prev.personalInfo,
                    fullName: parsed.personalInfo?.fullName || '',
                    email: parsed.personalInfo?.email || '',
                    phone: parsed.personalInfo?.phone || '',
                    location: parsed.personalInfo?.location || '',
                    linkedin: parsed.personalInfo?.linkedin || '',
                    website: parsed.personalInfo?.github || parsed.personalInfo?.website || '',
                    summary: parsed.personalInfo?.summary || ''
                },
                experience: parsed.experience || [],
                education: parsed.education || [],
                skills: parsed.skills || { technical: [], soft: [], projects: [] },
                projects: parsed.projects || []
            }));
        }
    }, [location.state]);

    const updatePersonalInfo = (field, value) => {
        setCvData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    };

    const addExperience = () => {
        setCvData(prev => ({
            ...prev,
            experience: [...prev.experience, { jobTitle: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }]
        }));
    };
    const updateExperience = (index, field, value) => {
        const newExp = [...cvData.experience];
        newExp[index] = { ...newExp[index], [field]: value };
        setCvData(prev => ({ ...prev, experience: newExp }));
    };
    const removeExperience = (index) => {
        setCvData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
    };

    const addEducation = () => {
        setCvData(prev => ({
            ...prev,
            education: [...prev.education, { degree: '', institution: '', location: '', startDate: '', endDate: '', current: false, gpa: '', description: '' }]
        }));
    };
    const updateEducation = (index, field, value) => {
        const newEdu = [...cvData.education];
        newEdu[index] = { ...newEdu[index], [field]: value };
        setCvData(prev => ({ ...prev, education: newEdu }));
    };
    const removeEducation = (index) => {
        setCvData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
    };

    const TECHNICAL_SKILLS_LIST = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'HTML/CSS', 'Git', 'TypeScript', 'Redux', 'Express.js', 'PHP', 'Laravel', 'Swift', 'Kotlin', 'Go', 'Rust', 'C#', 'SQL Server', 'PostgreSQL', 'UI/UX Design', 'Figma', 'Adobe XD'];
    const SOFT_SKILLS_LIST = ['Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Time Management', 'Adaptability', 'Conflict Resolution', 'Critical Thinking', 'Project Management', 'Public Speaking', 'Creativity', 'Empathy', 'Emotional Intelligence', 'Decision Making'];
    const PROJECT_TYPES_LIST = ['Web Application', 'Mobile App', 'Machine Learning', 'Data Analysis', 'Blockchain', 'E-commerce', 'Portfolio', 'Open Source', 'UI/UX Case Study', 'Embedded Systems', 'Cybersecurity', 'API Development', 'Cloud Architecture'];

    const [skillInput, setSkillInput] = useState({
        technical: TECHNICAL_SKILLS_LIST[0],
        soft: SOFT_SKILLS_LIST[0],
        projects: PROJECT_TYPES_LIST[0]
    });

    const addSkill = (type) => {
        const name = skillInput[type];
        if (!name || cvData.skills[type].includes(name)) return;
        setCvData(prev => ({
            ...prev,
            skills: { ...prev.skills, [type]: [...prev.skills[type], name] }
        }));
    };
    const removeSkill = (type, index) => {
        setCvData(prev => ({
            ...prev,
            skills: { ...prev.skills, [type]: prev.skills[type].filter((_, i) => i !== index) }
        }));
    };

    const addProject = () => {
        setCvData(prev => ({
            ...prev,
            projects: [...prev.projects, { name: '', description: '', link: '', role: '' }]
        }));
    };
    const updateProject = (index, field, value) => {
        const newProj = [...cvData.projects];
        newProj[index] = { ...newProj[index], [field]: value };
        setCvData(prev => ({ ...prev, projects: newProj }));
    };
    const removeProject = (index) => {
        setCvData(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!cvData.title) {
            alert('Please provide a title for your master document');
            return;
        }
        if (!cvData.personalInfo.fullName || !cvData.personalInfo.email) {
            alert('Core identification required (Name & Email)');
            return;
        }
        navigate('/templates', { state: { cvData } });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-white selection:text-black">
            <nav className="bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
                <div className="container mx-auto px-8 py-6 flex justify-between items-center">
                </div>
            </nav>

            <div className="container mx-auto px-8 py-20 max-w-5xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Header Section */}
                    <div className="bg-white p-12 mb-12">
                        <div className="flex items-center gap-4 mb-8">
                            <FileText className="w-8 h-8 text-black" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Personal Information</span>
                        </div>
                        <div className="max-w-2xl">
                            <label className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-3 block">Document Name</label>
                            <input
                                className="w-full bg-transparent border-b-2 border-black/10 py-4 text-3xl font-black text-black placeholder:text-black/5 focus:border-black outline-none transition-all uppercase tracking-tighter"
                                value={cvData.title}
                                onChange={e => setCvData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="My Resume"
                                required
                            />
                        </div>
                    </div>

                    <Section title="Personal Profile" icon={<User className="w-5 h-5" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-12 bg-[#0a0a0a]">
                            <InputField label="Full Name" value={cvData.personalInfo.fullName} onChange={v => updatePersonalInfo('fullName', v)} placeholder="John Doe" required />
                            <InputField label="Email Address" type="email" value={cvData.personalInfo.email} onChange={v => updatePersonalInfo('email', v)} placeholder="john.doe@example.com" required />
                            <InputField label="Contact Number" value={cvData.personalInfo.phone} onChange={v => updatePersonalInfo('phone', v)} placeholder="+1 123 456 7890" />
                            <InputField label="Location" value={cvData.personalInfo.location} onChange={v => updatePersonalInfo('location', v)} placeholder="New York, USA" />
                            <InputField label="LinkedIn" value={cvData.personalInfo.linkedin} onChange={v => updatePersonalInfo('linkedin', v)} />
                            <InputField label="GitHub / Portfolio" value={cvData.personalInfo.website} onChange={v => updatePersonalInfo('website', v)} />
                            <div className="md:col-span-2">
                                <label className="label">Professional Summary</label>
                                <textarea
                                    className="input min-h-[150px] border-white/5 bg-transparent"
                                    value={cvData.personalInfo.summary}
                                    onChange={e => updatePersonalInfo('summary', e.target.value)}
                                    placeholder="Define your professional value proposition in 3-4 impactful sentences."
                                />
                            </div>
                        </div>
                    </Section>

                    <Section title="Work Experience" icon={<Briefcase className="w-5 h-5" />} onAdd={addExperience}>
                        <div className="p-1 gap-px bg-white/5 grid grid-cols-1">
                            {cvData.experience.map((exp, idx) => (
                                <div key={idx} className="p-12 bg-[#0a0a0a] relative group/item">
                                    <button type="button" onClick={() => removeExperience(idx)} className="absolute top-8 right-8 text-white/20 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <InputField label="Job Title" value={exp.jobTitle} onChange={v => updateExperience(idx, 'jobTitle', v)} />
                                        <InputField label="Company Name" value={exp.company} onChange={v => updateExperience(idx, 'company', v)} />
                                        <InputField label="Start Date" type="month" value={exp.startDate} onChange={v => updateExperience(idx, 'startDate', v)} />
                                        <InputField label="End Date" type="month" value={exp.endDate} onChange={v => updateExperience(idx, 'endDate', v)} disabled={exp.current} />
                                        <div className="md:col-span-2">
                                            <label className="label">Key Responsibilities & Achievements</label>
                                            <textarea className="input bg-transparent border-white/5" value={exp.description} onChange={e => updateExperience(idx, 'description', e.target.value)} placeholder="Describe your impact and achievements..." />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {cvData.experience.length === 0 && <p className="text-center text-white/10 py-20 font-black tracking-widest uppercase text-xs italic">Syncing History Required</p>}
                        </div>
                    </Section>

                    <Section title="Key Projects" icon={<Globe className="w-5 h-5" />} onAdd={addProject}>
                        <div className="p-1 gap-px bg-white/5 grid grid-cols-1">
                            {cvData.projects.map((proj, idx) => (
                                <div key={idx} className="p-12 bg-[#0a0a0a] relative group/item">
                                    <button type="button" onClick={() => removeProject(idx)} className="absolute top-8 right-8 text-white/20 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <InputField label="Project Name" value={proj.name} onChange={v => updateProject(idx, 'name', v)} />
                                        <InputField label="Project Link" value={proj.link} onChange={v => updateProject(idx, 'link', v)} />
                                        <div className="md:col-span-2">
                                            <textarea className="input bg-transparent border-white/5" value={proj.description} onChange={e => updateProject(idx, 'description', e.target.value)} placeholder="Project description and technology stack..." />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="Education History" icon={<GraduationCap className="w-5 h-5" />} onAdd={addEducation}>
                        <div className="p-1 gap-px bg-white/5 grid grid-cols-1">
                            {cvData.education.map((edu, idx) => (
                                <div key={idx} className="p-12 bg-[#0a0a0a] relative group/item">
                                    <button type="button" onClick={() => removeEducation(idx)} className="absolute top-8 right-8 text-white/20 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <InputField label="Degree / Major" value={edu.degree} onChange={v => updateEducation(idx, 'degree', v)} />
                                        <InputField label="University / School" value={edu.institution} onChange={v => updateEducation(idx, 'institution', v)} />
                                        <InputField label="Graduation Start" type="month" value={edu.startDate} onChange={v => updateEducation(idx, 'startDate', v)} />
                                        <InputField label="Graduation End" type="month" value={edu.endDate} onChange={v => updateEducation(idx, 'endDate', v)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="Skills & Competencies" icon={<Code className="w-5 h-5" />}>
                        <div className="p-1 gap-px bg-white/5 grid grid-cols-1 md:grid-cols-3">
                            {[
                                { type: 'technical', list: TECHNICAL_SKILLS_LIST, label: 'Technical' },
                                { type: 'soft', list: SOFT_SKILLS_LIST, label: 'Strategic' },
                                { type: 'projects', list: PROJECT_TYPES_LIST, label: 'Projects' }
                            ].map(({ type, list, label }) => (
                                <div key={type} className="bg-[#0a0a0a] p-12">
                                    <label className="label mb-8 block">{label}</label>
                                    <div className="space-y-6">
                                        <div className="flex gap-2">
                                            <select
                                                className="w-full bg-transparent border-b border-white/20 py-2 text-sm focus:border-white outline-none transition-colors"
                                                value={skillInput[type]}
                                                onChange={e => setSkillInput(prev => ({ ...prev, [type]: e.target.value }))}
                                            >
                                                {list.map(skill => <option key={skill} value={skill} className="bg-black">{skill}</option>)}
                                            </select>
                                            <button type="button" onClick={() => addSkill(type)} className="w-10 h-10 flex items-center justify-center bg-white text-black shrink-0">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {cvData.skills[type].map((s, idx) => (
                                                <div key={idx} className="bg-white/5 border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                                                    {s}
                                                    <button type="button" onClick={() => removeSkill(type, idx)} className="text-white/20 hover:text-white">
                                                        <Plus className="w-3 h-3 rotate-45" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <div className="pt-20">
                        <button type="submit" className="w-full btn btn-primary py-8 text-2xl group">
                            Generate Preview
                            <Sparkles className="w-6 h-6 group-hover:scale-125 transition-transform" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Section = ({ title, icon, children, onAdd }) => (
    <div className="bg-[#050505] border border-white/5 overflow-hidden">
        <div className="px-12 py-8 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white">
                {icon}
                {title}
            </div>
            {onAdd && (
                <button type="button" onClick={onAdd} className="btn btn-outline border-white/10 text-[8px]">
                    Initialize New
                </button>
            )}
        </div>
        {children}
    </div>
);

const InputField = ({ label, type = "text", value, onChange, placeholder, required, disabled }) => (
    <div className="group">
        <label className="label group-focus-within:text-white transition-colors">{label}</label>
        <input
            type={type}
            className="w-full bg-transparent border-b border-white/10 py-3 text-sm focus:border-white focus:outline-none transition-all placeholder:text-white/5"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
        />
    </div>
);

export default CVDetailsForm;
