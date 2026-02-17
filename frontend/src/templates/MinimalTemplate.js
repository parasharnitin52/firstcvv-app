import React from 'react';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

const MinimalTemplate = ({ data }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <div className="bg-white p-12 font-mono text-gray-800" style={{ width: '210mm', minHeight: '297mm' }}>

            {/* Header - Centered & Clean */}
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold uppercase tracking-widest mb-4">
                    {data.personalInfo.fullName || 'Your Name'}
                </h1>
                <p className="text-sm text-gray-500 mb-6 max-w-lg mx-auto leading-relaxed">
                    {data.personalInfo.summary}
                </p>

                <div className="flex justify-center flex-wrap gap-4 text-xs text-gray-600 border-t border-b border-gray-100 py-4">
                    {data.personalInfo.email && (
                        <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {data.personalInfo.email}
                        </span>
                    )}
                    {data.personalInfo.phone && (
                        <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {data.personalInfo.phone}
                        </span>
                    )}
                    {data.personalInfo.location && (
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {data.personalInfo.location}
                        </span>
                    )}
                    {data.personalInfo.linkedin && (
                        <span className="flex items-center gap-1">
                            <Linkedin className="w-3 h-3" /> LinkedIn
                        </span>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 gap-12">

                {/* Skills - Top Focus */}
                {((data.skills?.technical && data.skills.technical.length > 0) || (data.skills?.soft && data.skills.soft.length > 0)) && (
                    <section>
                        <h2 className="text-sm font-bold uppercase text-gray-400 mb-4">Skills Stack</h2>
                        <div className="flex flex-wrap gap-x-8 gap-y-4">
                            {data.skills.technical?.map((skill, i) => (
                                <span key={i} className="text-sm font-bold">
                                    {typeof skill === 'string' ? skill : skill.name}
                                </span>
                            ))}
                            {data.skills.soft?.map((skill, i) => (
                                <span key={i} className="text-sm text-gray-600">
                                    {typeof skill === 'string' ? skill : skill.name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Custom Sections */}
                {data.customSections && data.customSections.length > 0 && data.customSections.map((section, index) => (
                    <section key={index}>
                        <h2 className="text-sm font-bold uppercase text-gray-400 mb-4">{section.title}</h2>
                        <p className="text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
                    </section>
                ))}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase text-gray-400 mb-6">Experience</h2>
                        <div className="space-y-8">
                            {data.experience.map((exp, index) => (
                                <div key={index} className="grid grid-cols-4 gap-4">
                                    <div className="col-span-1 text-xs text-gray-500 pt-1">
                                        {formatDate(exp.startDate)} — <br />
                                        {exp.current ? 'Present' : formatDate(exp.endDate)}
                                    </div>
                                    <div className="col-span-3">
                                        <h3 className="font-bold text-lg">{exp.jobTitle}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{exp.company}, {exp.location}</p>
                                        <p className="text-sm leading-relaxed mb-2">{exp.description}</p>
                                        {exp.achievements && (
                                            <ul className="list-disc list-outside ml-4 text-xs text-gray-500 space-y-1">
                                                {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase text-gray-400 mb-6">Selected Work</h2>
                        <div className="grid grid-cols-2 gap-8">
                            {data.projects.map((proj, index) => (
                                <div key={index}>
                                    <h3 className="font-bold">{proj.name}</h3>
                                    <p className="text-xs text-gray-600 mt-1 mb-2">{proj.description}</p>
                                    {proj.technologies && (
                                        <p className="text-xs text-gray-400 font-mono">
                                            {proj.technologies.join(' / ')}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase text-gray-400 mb-4">Education</h2>
                        <div className="space-y-4">
                            {data.education.map((edu, index) => (
                                <div key={index} className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                                    <div>
                                        <span className="font-bold">{edu.degree}</span>
                                        <span className="text-gray-500 mx-2">/</span>
                                        <span className="text-sm">{edu.institution}</span>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {new Date(edu.startDate || edu.endDate).getFullYear()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
};

export default MinimalTemplate;
