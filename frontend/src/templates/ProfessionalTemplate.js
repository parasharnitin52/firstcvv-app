import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

const ProfessionalTemplate = ({ data }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <div className="bg-white font-serif text-gray-800 flex" style={{ width: '210mm', minHeight: '297mm' }}>
            {/* Sidebar for Contact & Skills */}
            <div className="w-1/3 bg-slate-900 text-white p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold leading-tight mb-4">
                        {data.personalInfo.fullName?.split(' ').map((n, i) => (
                            <span key={i} className="block">{n}</span>
                        )) || 'Your Name'}
                    </h1>
                    <p className="text-slate-300 text-sm uppercase tracking-widest border-b border-slate-700 pb-4 mb-4">
                        {data.title || 'Professional Title'}
                    </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 text-sm text-slate-300 mb-8">
                    {data.personalInfo.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{data.personalInfo.email}</span>
                        </div>
                    )}
                    {data.personalInfo.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{data.personalInfo.phone}</span>
                        </div>
                    )}
                    {data.personalInfo.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{data.personalInfo.location}</span>
                        </div>
                    )}
                    {data.personalInfo.linkedin && (
                        <div className="flex items-center gap-2">
                            <Linkedin className="w-4 h-4" />
                            <span>LinkedIn</span>
                        </div>
                    )}
                    {data.personalInfo.github && (
                        <div className="flex items-center gap-2">
                            <Github className="w-4 h-4" />
                            <span>Github</span>
                        </div>
                    )}
                </div>

                {/* Skills */}
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b border-slate-700 pb-2 mb-4">
                        Expertise
                    </h2>
                    {data.skills?.technical?.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-xs text-slate-400 mb-2 uppercase">Technical</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.technical.map((skill, i) => (
                                    <span key={i} className="bg-slate-800 px-2 py-1 rounded text-xs">
                                        {typeof skill === 'string' ? skill : skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {data.skills?.soft?.length > 0 && (
                        <div>
                            <h3 className="text-xs text-slate-400 mb-2 uppercase">Professional</h3>
                            <ul className="text-xs space-y-1">
                                {data.skills.soft.map((skill, i) => (
                                    <li key={i} className="text-slate-300">
                                        • {typeof skill === 'string' ? skill : skill.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>

                {/* Education (Sidebar style) */}
                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-slate-700 pb-2 mb-4">
                            Education
                        </h2>
                        <div className="space-y-4">
                            {data.education.map((edu, index) => (
                                <div key={index}>
                                    <h3 className="font-bold text-white">{edu.degree}</h3>
                                    <p className="text-slate-400 text-xs">{edu.institution}</p>
                                    <p className="text-slate-500 text-xs">
                                        {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">

                {/* Summary */}
                {data.personalInfo.summary && (
                    <section className="mb-8">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-2 mb-4">
                            Profile
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-sm">
                            {data.personalInfo.summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-2 mb-4">
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {data.experience.map((exp, index) => (
                                <div key={index} className="relative pl-4 border-l-2 border-slate-200">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-lg font-bold text-slate-800">{exp.jobTitle}</h3>
                                        <span className="text-xs font-semibold text-slate-500">
                                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 font-medium text-sm mb-2">{exp.company}, {exp.location}</p>
                                    {exp.description && (
                                        <p className="text-gray-700 text-sm mb-2">
                                            {exp.description}
                                        </p>
                                    )}
                                    {exp.achievements && exp.achievements.length > 0 && (
                                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                            {exp.achievements.map((acc, i) => (
                                                <li key={i}>{acc}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Custom Sections */}
                {data.customSections && data.customSections.length > 0 && data.customSections.map((section, index) => (
                    <section key={index} className="mb-8">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-2 mb-4">
                            {section.title}
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                            {section.content}
                        </p>
                    </section>
                ))}

                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-2 mb-4">
                            Key Projects
                        </h2>
                        <div className="grid gap-4">
                            {data.projects.map((proj, index) => (
                                <div key={index} className="bg-slate-50 p-4 rounded">
                                    <h3 className="font-bold text-slate-800">{proj.name}</h3>
                                    <p className="text-sm text-gray-700 mt-1">{proj.description}</p>
                                    {proj.technologies && Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                                        <div className="mt-2 text-xs text-slate-500">
                                            <span className="font-semibold">Tech:</span> {proj.technologies.join(', ')}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProfessionalTemplate;
