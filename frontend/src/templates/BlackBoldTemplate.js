import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

const BlackBoldTemplate = ({ data }) => {
    const { personalInfo, experience, education, skills, projects, certifications, customSections } = data;

    return (
        <div className="bg-white min-h-[1100px] text-black font-sans selection:bg-black selection:text-white pb-20">
            {/* Header - Premium Black & Gold */}
            <header className="bg-black text-white p-16 mb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 blur-[120px] rounded-full"></div>
                <div className="relative z-10">
                    <h1 className="text-8xl font-black uppercase tracking-tighter leading-[0.8] mb-8 grayscale">
                        {personalInfo.fullName || 'YOUR NAME'}
                    </h1>
                    <div className="flex flex-wrap gap-x-10 gap-y-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                        {personalInfo.email && <span className="flex items-center gap-2"><Mail size={12} className="text-white" /> {personalInfo.email}</span>}
                        {personalInfo.phone && <span className="flex items-center gap-2"><Phone size={12} className="text-white" /> {personalInfo.phone}</span>}
                        {personalInfo.location && <span className="flex items-center gap-2"><MapPin size={12} className="text-white" /> {personalInfo.location}</span>}
                        {personalInfo.linkedin && <span className="flex items-center gap-2"><Linkedin size={12} className="text-white" /> LinkedIn</span>}
                        {personalInfo.website && <span className="flex items-center gap-2"><Globe size={12} className="text-white" /> Portfolio</span>}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#D4AF37]"></div>
            </header>

            <div className="px-16 space-y-20">
                {/* Summary */}
                {personalInfo.summary && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 text-black/20 italic">Biography</h2>
                        <p className="text-2xl font-bold leading-[1.1] uppercase tracking-tighter max-w-3xl">
                            {personalInfo.summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-12 flex items-center gap-4">
                            Work Experience
                            <div className="h-px bg-black/10 flex-1"></div>
                        </h2>
                        <div className="space-y-16">
                            {experience.map((exp, i) => (
                                <div key={i} className="relative">
                                    <div className="flex justify-between items-baseline mb-4">
                                        <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{exp.jobTitle}</h3>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] bg-black px-3 py-1">
                                            {exp.startDate} — {exp.current ? 'PRESENT' : exp.endDate}
                                        </span>
                                    </div>
                                    <div className="text-xs font-black uppercase tracking-widest mb-6 opacity-60 italic">{exp.company} • {exp.location}</div>
                                    <p className="text-[15px] font-medium leading-relaxed opacity-80 max-w-2xl border-l-[3px] border-[#D4AF37] pl-8">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Grid for Secondary Content */}
                <div className="grid lg:grid-cols-3 gap-20">
                    <div className="lg:col-span-2 space-y-20">
                        {/* Projects */}
                        {projects && projects.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-10 text-black/20 italic">Key Projects</h2>
                                <div className="space-y-12">
                                    {projects.map((proj, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-xl font-black uppercase tracking-tighter">{proj.name}</h3>
                                                {proj.link && <span className="text-[8px] font-black uppercase tracking-widest opacity-40">URL Attached</span>}
                                            </div>
                                            <p className="text-sm font-medium opacity-70 leading-relaxed">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education && education.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-10 text-black/20 italic">Academic</h2>
                                <div className="grid md:grid-cols-2 gap-10">
                                    {education.map((edu, i) => (
                                        <div key={i} className="border-t border-black/5 pt-6">
                                            <h3 className="text-lg font-black uppercase tracking-tighter leading-tight mb-1">{edu.degree}</h3>
                                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">{edu.institution}</div>
                                            <div className="text-[10px] font-black tracking-widest opacity-30">{edu.startDate} — {edu.endDate}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Custom Sections */}
                        {customSections && customSections.map((section, i) => (
                            <section key={i}>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-10 text-black/20 italic">{section.title}</h2>
                                <div className="space-y-10">
                                    {section.items.map((item, j) => (
                                        <div key={j} className="border-l-2 border-black/5 pl-8">
                                            <div className="flex justify-between items-baseline mb-2">
                                                <h4 className="text-lg font-black uppercase tracking-tighter">{item.title}</h4>
                                                <span className="text-[10px] font-black opacity-30 tracking-widest">{item.date}</span>
                                            </div>
                                            {item.subtitle && <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">{item.subtitle}</div>}
                                            <p className="text-sm font-medium opacity-70">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    <div className="space-y-20">
                        {/* Skills */}
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 text-black/20">Competencies</h2>
                            <div className="space-y-8">
                                {['technical', 'soft', 'projects'].map(type => (
                                    skills[type] && skills[type].length > 0 && (
                                        <div key={type}>
                                            <h4 className="text-[8px] font-black uppercase tracking-widest mb-4 opacity-40">
                                                {type === 'technical' ? 'Technical Stack' : type === 'soft' ? 'Interpersonal' : 'Strategic Focus'}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {skills[type].map((s, i) => (
                                                    <span key={i} className="text-[9px] font-black uppercase tracking-widest border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors cursor-default">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </section>

                        {/* Certifications */}
                        {certifications && certifications.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 text-black/20">Credentials</h2>
                                <div className="space-y-6">
                                    {certifications.map((cert, i) => (
                                        <div key={i} className="border-b border-black/5 pb-4">
                                            <h3 className="text-xs font-black uppercase tracking-widest mb-1">{cert.name}</h3>
                                            <div className="text-[9px] font-bold opacity-60 uppercase">{cert.issuer}</div>
                                            <div className="text-[9px] font-black opacity-30 mt-1">{cert.date}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Accent */}
            <div className="mt-20 px-16">
                <div className="h-4 bg-black w-32"></div>
            </div>
        </div>
    );
};

export default BlackBoldTemplate;
