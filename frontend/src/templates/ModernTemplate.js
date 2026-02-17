import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

const ModernTemplate = ({ data }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white p-12 font-sans text-gray-900" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header */}
      <header className="mb-8 pb-6 border-b-2 border-gray-900">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mt-4">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
          {data.personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>{data.personalInfo.website}</span>
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-4 h-4" />
              <span>{data.personalInfo.linkedin}</span>
            </div>
          )}
          {data.personalInfo.github && (
            <div className="flex items-center gap-1">
              <Github className="w-4 h-4" />
              <span>{data.personalInfo.github}</span>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.personalInfo.summary && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide text-gray-900">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {data.personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 uppercase tracking-wide text-gray-900 border-b pb-2">
            Work Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold">{exp.jobTitle}</h3>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                    {exp.location && <div>{exp.location}</div>}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 leading-relaxed mt-2">
                    {exp.description}
                  </p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 uppercase tracking-wide text-gray-900 border-b pb-2">
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{edu.degree}</h3>
                    <p className="text-gray-700 font-medium">{edu.institution}</p>
                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>
                      {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                    </div>
                    {edu.location && <div>{edu.location}</div>}
                  </div>
                </div>
                {edu.description && (
                  <p className="text-gray-700 mt-2">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {((data.skills?.technical && data.skills.technical.length > 0) ||
        (data.skills?.soft && data.skills.soft.length > 0)) && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide text-gray-900 border-b pb-2">
              Skills
            </h2>
            {data.skills.technical && data.skills.technical.length > 0 && (
              <div className="mb-3">
                <h3 className="font-bold text-gray-800 mb-2">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.technical.map((skill, i) => (
                    <span key={i} className="text-gray-700 bg-gray-50 px-2 py-1 rounded text-sm border border-gray-100">
                      {typeof skill === 'string' ? skill : skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.skills.soft && data.skills.soft.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.soft.map((skill, i) => (
                    <span key={i} className="text-gray-700 bg-gray-50 px-2 py-1 rounded text-sm border border-gray-100">
                      {typeof skill === 'string' ? skill : skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

      {/* Custom Sections */}
      {data.customSections && data.customSections.length > 0 && data.customSections.map((section, index) => (
        <section key={index} className="mb-8">
          <h2 className="text-xl font-bold mb-4 uppercase tracking-wide text-gray-900 border-b pb-2">
            {section.title}
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {section.content}
          </p>
        </section>
      ))}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 uppercase tracking-wide text-gray-900 border-b pb-2">
            Projects
          </h2>
          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <div key={index}>
                <h3 className="text-lg font-bold">{project.name}</h3>
                {project.description && (
                  <p className="text-gray-700 mt-1">{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Technologies: {project.technologies.join(', ')}
                  </p>
                )}
                {project.link && (
                  <a href={project.link} className="text-sm text-blue-600 hover:underline">
                    {project.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 uppercase tracking-wide text-gray-900 border-b pb-2">
            Certifications
          </h2>
          <div className="space-y-3">
            {data.certifications.map((cert, index) => (
              <div key={index}>
                <h3 className="font-bold">{cert.name}</h3>
                <p className="text-gray-700">{cert.issuer}</p>
                {cert.date && (
                  <p className="text-sm text-gray-600">
                    Issued: {formatDate(cert.date)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ModernTemplate;
