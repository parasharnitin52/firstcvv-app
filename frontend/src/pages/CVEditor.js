import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { FileText, Save, ArrowLeft, Trash2 } from 'lucide-react';
import ModernTemplate from '../templates/ModernTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import BlackBoldTemplate from '../templates/BlackBoldTemplate';
import ResumePreviewScale from '../components/ResumePreviewScale';

const TemplateMap = {
  'modern': ModernTemplate,
  'modern-ats': ModernTemplate,
  'professional-corp': ProfessionalTemplate,
  'minimalist-tech': MinimalTemplate,
  'creative-clean': MinimalTemplate,
  'executive-brief': ProfessionalTemplate,
  'startup-bold': ModernTemplate,
  'entry-level': ModernTemplate,
  'academic-cv': ProfessionalTemplate,
  'compact-one-page': MinimalTemplate,
  'designer-showcase': MinimalTemplate,
  'blackbold': BlackBoldTemplate
};


const CVEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [cvData, setCvData] = useState({
    title: '',
    templateId: 'modern',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: [],
      languages: []
    },
    projects: [],
    certifications: [],
    customSections: []
  });

  useEffect(() => {
    const fetchCV = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/cvs/${id}`);
        setCvData(response.data.cv);
      } catch (error) {
        console.error('Error fetching CV:', error);
        alert('Failed to load CV');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCV();
    }
  }, [id]);

  // Read templateId from query params for new CVs
  useEffect(() => {
    const templateId = searchParams.get('templateId');
    if (templateId && !id) {
      setCvData(prev => ({ ...prev, templateId }));
    }
  }, [searchParams, id]);



  const handleSave = async () => {
    if (!cvData.title.trim()) {
      alert('Please enter a CV Title');
      return;
    }
    if (!cvData.personalInfo.fullName.trim()) {
      alert('Please enter your Full Name');
      return;
    }
    if (!cvData.personalInfo.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cvData.personalInfo.email)) {
      alert('Please enter a valid Email Address');
      return;
    }

    setSaving(true);
    try {
      if (id) {
        await api.put(`/cvs/${id}`, cvData);
        // Changed: Redirect to template selection instead of just alert
        navigate(`/select-template/${id}`);
      } else {
        const response = await api.post('/cvs', cvData);
        console.log('Create Response:', response.data);

        if (response.data && response.data.cv && response.data.cv.id) {
          navigate(`/select-template/${response.data.cv.id}`);
        } else {
          console.error('Invalid response structure:', response.data);
          alert('CV created but failed to retrieve ID. Please check Dashboard.');
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error saving CV:', error);
      const msg = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || 'Failed to save CV';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const updatePersonalInfo = (field, value) => {
    setCvData({
      ...cvData,
      personalInfo: { ...cvData.personalInfo, [field]: value }
    });
  };

  const addExperience = () => {
    setCvData({
      ...cvData,
      experience: [...cvData.experience, {
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: []
      }]
    });
  };

  const updateExperience = (index, field, value) => {
    const newExperience = [...cvData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setCvData({ ...cvData, experience: newExperience });
  };

  const removeExperience = (index) => {
    setCvData({
      ...cvData,
      experience: cvData.experience.filter((_, i) => i !== index)
    });
  };

  const addEducation = () => {
    setCvData({
      ...cvData,
      education: [...cvData.education, {
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        gpa: '',
        description: ''
      }]
    });
  };

  const updateEducation = (index, field, value) => {
    const newEducation = [...cvData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setCvData({ ...cvData, education: newEducation });
  };

  const removeEducation = (index) => {
    setCvData({
      ...cvData,
      education: cvData.education.filter((_, i) => i !== index)
    });
  };

  const addSkill = (type, value) => {
    if (!value.trim()) return;
    setCvData({
      ...cvData,
      skills: {
        ...cvData.skills,
        [type]: [...cvData.skills[type], value.trim()]
      }
    });
  };

  const removeSkill = (type, index) => {
    setCvData({
      ...cvData,
      skills: {
        ...cvData.skills,
        [type]: cvData.skills[type].filter((_, i) => i !== index)
      }
    });
  };

  // Projects
  const addProject = () => {
    setCvData({
      ...cvData,
      projects: [...cvData.projects, {
        name: '',
        description: '',
        technologies: [],
        link: '',
        achievements: []
      }]
    });
  };

  const updateProject = (index, field, value) => {
    const newProjects = [...cvData.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setCvData({ ...cvData, projects: newProjects });
  };

  const removeProject = (index) => {
    setCvData({
      ...cvData,
      projects: cvData.projects.filter((_, i) => i !== index)
    });
  };

  // Certifications
  const addCertification = () => {
    setCvData({
      ...cvData,
      certifications: [...cvData.certifications, {
        name: '',
        issuer: '',
        date: '',
        link: ''
      }]
    });
  };

  const updateCertification = (index, field, value) => {
    const newCerts = [...cvData.certifications];
    newCerts[index] = { ...newCerts[index], [field]: value };
    setCvData({ ...cvData, certifications: newCerts });
  };

  const removeCertification = (index) => {
    setCvData({
      ...cvData,
      certifications: cvData.certifications.filter((_, i) => i !== index)
    });
  };

  // Custom Sections
  const addCustomSection = () => {
    setCvData({
      ...cvData,
      customSections: [...cvData.customSections, {
        title: 'New Section',
        items: [{ title: '', subtitle: '', date: '', description: '' }]
      }]
    });
  };

  const updateCustomSection = (index, field, value) => {
    const newSections = [...cvData.customSections];
    newSections[index] = { ...newSections[index], [field]: value };
    setCvData({ ...cvData, customSections: newSections });
  };

  const updateCustomSectionItem = (sectionIndex, itemIndex, field, value) => {
    const newSections = [...cvData.customSections];
    newSections[sectionIndex].items[itemIndex] = { ...newSections[sectionIndex].items[itemIndex], [field]: value };
    setCvData({ ...cvData, customSections: newSections });
  };

  const addCustomSectionItem = (sectionIndex) => {
    const newSections = [...cvData.customSections];
    newSections[sectionIndex].items.push({ title: '', subtitle: '', date: '', description: '' });
    setCvData({ ...cvData, customSections: newSections });
  };

  const removeCustomSectionItem = (sectionIndex, itemIndex) => {
    const newSections = [...cvData.customSections];
    newSections[sectionIndex].items = newSections[sectionIndex].items.filter((_, i) => i !== itemIndex);
    setCvData({ ...cvData, customSections: newSections });
  };

  const removeCustomSection = (index) => {
    setCvData({
      ...cvData,
      customSections: cvData.customSections.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-white selection:text-black">
      {/* Header */}
      <nav className="bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={() => navigate('/dashboard')} className="hover:text-white/60 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="h-6 w-px bg-white/10"></div>
              <div className="flex items-center gap-4">
                <FileText className="w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={cvData.title}
                  onChange={(e) => setCvData({ ...cvData, title: e.target.value })}
                  placeholder="Untitled Document"
                  className="bg-transparent text-lg font-black uppercase tracking-widest border-none focus:outline-none focus:ring-0 placeholder:text-white/5"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-white text-black px-8 py-3 font-black uppercase tracking-widest text-[10px] hover:bg-white/90 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Finalize'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Editor */}
      <div className="flex-1 container mx-auto px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12 h-[calc(100vh-160px)]">
          {/* Editor Form */}
          <div className="space-y-4 overflow-y-auto pr-4 scrollbar-hide">
            {/* Personal Info Section */}
            <EditorSection title="Personal Information">
              <div className="grid md:grid-cols-2 gap-8 p-10 bg-[#0a0a0a] border border-white/5">
                <InputField label="Full Name" value={cvData.personalInfo.fullName} onChange={v => updatePersonalInfo('fullName', v)} required />
                <InputField label="Email Address" type="email" value={cvData.personalInfo.email} onChange={v => updatePersonalInfo('email', v)} required />
                <InputField label="Contact" value={cvData.personalInfo.phone} onChange={v => updatePersonalInfo('phone', v)} />
                <InputField label="Location" value={cvData.personalInfo.location} onChange={v => updatePersonalInfo('location', v)} />
                <InputField label="Portfolio" value={cvData.personalInfo.website} onChange={v => updatePersonalInfo('website', v)} />
                <InputField label="LinkedIn" value={cvData.personalInfo.linkedin} onChange={v => updatePersonalInfo('linkedin', v)} />
                <div className="md:col-span-2">
                  <label className="label">Professional Summary</label>
                  <textarea
                    value={cvData.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                    className="input bg-transparent border-white/5 min-h-[120px]"
                    placeholder="Briefly define your professional value..."
                  />
                </div>
              </div>
            </EditorSection>

            {/* Experience Section */}
            <EditorSection title="Work Experience" onAdd={addExperience}>
              <div className="grid gap-4">
                {cvData.experience.map((exp, index) => (
                  <ExperienceForm
                    key={index}
                    data={exp}
                    index={index}
                    onChange={updateExperience}
                    onRemove={removeExperience}
                  />
                ))}
              </div>
            </EditorSection>

            {/* Education Section */}
            <EditorSection title="Education" onAdd={addEducation}>
              <div className="grid gap-4">
                {cvData.education.map((edu, index) => (
                  <EducationForm
                    key={index}
                    data={edu}
                    index={index}
                    onChange={updateEducation}
                    onRemove={removeEducation}
                  />
                ))}
              </div>
            </EditorSection>

            {/* Projects Section */}
            <EditorSection title="Key Projects" onAdd={addProject}>
              <div className="grid gap-4">
                {cvData.projects.map((project, index) => (
                  <ProjectForm
                    key={index}
                    data={project}
                    index={index}
                    onChange={updateProject}
                    onRemove={removeProject}
                  />
                ))}
              </div>
            </EditorSection>

            {/* Certifications Section */}
            <EditorSection title="Certifications" onAdd={addCertification}>
              <div className="grid gap-4">
                {cvData.certifications.map((cert, index) => (
                  <CertificationForm
                    key={index}
                    data={cert}
                    index={index}
                    onChange={updateCertification}
                    onRemove={removeCertification}
                  />
                ))}
              </div>
            </EditorSection>

            {/* Skills & Projects Section */}
            <EditorSection title="Skills & Competencies">
              <div className="bg-[#0a0a0a] border border-white/5 p-1">
                <SkillsForm
                  skills={cvData.skills}
                  onAdd={addSkill}
                  onRemove={removeSkill}
                  education={cvData.education}
                />
              </div>
            </EditorSection>

            {/* Custom Sections */}
            <div className="mt-12 space-y-12">
              {cvData.customSections.map((section, sIdx) => (
                <EditorSection
                  key={sIdx}
                  title={section.title}
                  onAdd={() => addCustomSectionItem(sIdx)}
                >
                  <div className="flex gap-4 mb-4">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateCustomSection(sIdx, 'title', e.target.value)}
                      className="bg-transparent border-b border-white/10 py-2 font-black uppercase tracking-widest text-xs focus:border-white focus:outline-none flex-1"
                    />
                    <button onClick={() => removeCustomSection(sIdx)} className="text-red-500 text-xs uppercase tracking-widest font-black">[ Remove Section ]</button>
                  </div>
                  <div className="grid gap-4">
                    {section.items.map((item, iIdx) => (
                      <CustomSectionItemForm
                        key={iIdx}
                        data={item}
                        sectionIndex={sIdx}
                        itemIndex={iIdx}
                        onChange={updateCustomSectionItem}
                        onRemove={removeCustomSectionItem}
                      />
                    ))}
                  </div>
                </EditorSection>
              ))}
              <button
                onClick={addCustomSection}
                className="w-full py-6 border border-dashed border-white/10 text-white/40 font-black uppercase tracking-[0.3em] hover:border-white hover:text-white transition-all"
              >
                + Add Custom Section
              </button>
            </div>
          </div>

          {/* CV Preview */}
          <div className="relative flex flex-col h-full bg-white border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-8 py-4 border-b border-black/5 bg-gray-50">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Real-time Rendering</span>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-black/10"></div>
                <div className="w-2 h-2 rounded-full bg-black/10"></div>
                <div className="w-2 h-2 rounded-full bg-black/10"></div>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-12 bg-gray-100">
              <ResumePreviewScale>
                {(() => {
                  const Template = TemplateMap[cvData.templateId] || ModernTemplate;
                  return <Template data={cvData} />;
                })()}
              </ResumePreviewScale>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, required, type = "text" }) => (
  <div className="space-y-2 group">
    <label className="label group-focus-within:text-white transition-colors uppercase text-[10px] tracking-widest underline decoration-white/0 group-focus-within:decoration-white/100">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border-b border-white/10 py-2 font-medium focus:border-white focus:outline-none transition-all placeholder:text-white/5"
      required={required}
    />
  </div>
);

const EditorSection = ({ title, children, onAdd }) => (
  <div className="space-y-6 mb-12">
    <div className="flex items-center justify-between px-2">
      <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">{title}</h2>
      {onAdd && (
        <button onClick={onAdd} className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors text-white/40">
          [ + Add ]
        </button>
      )}
    </div>
    {children}
  </div>
);

const ExperienceForm = ({ data, index, onChange, onRemove }) => (
  <div className="p-8 bg-[#0a0a0a] border border-white/5 space-y-6 relative group">
    <div className="flex justify-between items-start">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Experience #{index + 1}</h4>
      <button onClick={() => onRemove(index)} className="text-white/20 hover:text-red-500 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
    <div className="grid md:grid-cols-2 gap-8">
      <InputField label="Job Title" value={data.jobTitle} onChange={v => onChange(index, 'jobTitle', v)} />
      <InputField label="Company Name" value={data.company} onChange={v => onChange(index, 'company', v)} />
      <InputField label="Start Date" type="month" value={data.startDate} onChange={v => onChange(index, 'startDate', v)} />
      <div className="space-y-4">
        <InputField label="End Date" type="month" value={data.endDate} onChange={v => onChange(index, 'endDate', v)} />
        <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 cursor-pointer">
          <input
            type="checkbox"
            checked={data.current}
            onChange={(e) => onChange(index, 'current', e.target.checked)}
            className="w-4 h-4 rounded-none border-white/10 bg-transparent text-white focus:ring-0"
          />
          Present Role
        </label>
      </div>
    </div>
    <div className="space-y-2">
      <label className="label text-[10px] uppercase tracking-widest text-white/40">Key Responsibilities</label>
      <textarea
        value={data.description}
        onChange={(e) => onChange(index, 'description', e.target.value)}
        className="input bg-transparent border-white/5 min-h-[100px]"
        placeholder="Briefly describe your achievements..."
      />
    </div>
  </div>
);

const EducationForm = ({ data, index, onChange, onRemove }) => (
  <div className="p-8 bg-[#0a0a0a] border border-white/5 space-y-6 relative group">
    <div className="flex justify-between items-start">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Education #{index + 1}</h4>
      <button onClick={() => onRemove(index)} className="text-white/20 hover:text-red-500 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
    <div className="grid md:grid-cols-2 gap-8">
      <InputField label="Degree / Major" value={data.degree} onChange={v => onChange(index, 'degree', v)} />
      <InputField label="University / School" value={data.institution} onChange={v => onChange(index, 'institution', v)} />
      <InputField label="Graduation Start" type="month" value={data.startDate} onChange={v => onChange(index, 'startDate', v)} />
      <InputField label="Graduation End" type="month" value={data.endDate} onChange={v => onChange(index, 'endDate', v)} />
    </div>
  </div>
);


const ProjectForm = ({ data, index, onChange, onRemove }) => (
  <div className="p-8 bg-[#0a0a0a] border border-white/5 space-y-6 relative group">
    <div className="flex justify-between items-start">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Project #{index + 1}</h4>
      <button onClick={() => onRemove(index)} className="text-white/20 hover:text-red-500 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
    <div className="grid md:grid-cols-2 gap-8">
      <InputField label="Project Title" value={data.name} onChange={v => onChange(index, 'name', v)} />
      <InputField label="Project Link" value={data.link} onChange={v => onChange(index, 'link', v)} />
    </div>
    <div className="space-y-2">
      <label className="label text-[10px] uppercase tracking-widest text-white/40">Project Description</label>
      <textarea
        value={data.description}
        onChange={(e) => onChange(index, 'description', e.target.value)}
        className="input bg-transparent border-white/5 min-h-[100px]"
        placeholder="Define the scope and outcomes of this project..."
      />
    </div>
  </div>
);

const CertificationForm = ({ data, index, onChange, onRemove }) => (
  <div className="p-8 bg-[#0a0a0a] border border-white/5 space-y-6 relative group">
    <div className="flex justify-between items-start">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Certification #{index + 1}</h4>
      <button onClick={() => onRemove(index)} className="text-white/20 hover:text-red-500 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
    <div className="grid md:grid-cols-2 gap-8">
      <InputField label="Certification Name" value={data.name} onChange={v => onChange(index, 'name', v)} />
      <InputField label="Issuing Authority" value={data.issuer} onChange={v => onChange(index, 'issuer', v)} />
      <InputField label="Issue Date" value={data.date} onChange={v => onChange(index, 'date', v)} />
      <InputField label="Verification Link" value={data.link} onChange={v => onChange(index, 'link', v)} />
    </div>
  </div>
);

const CustomSectionItemForm = ({ data, sectionIndex, itemIndex, onChange, onRemove }) => (
  <div className="p-8 bg-[#0a0a0a] border border-white/5 space-y-6 relative group">
    <div className="flex justify-between items-start">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Item #{itemIndex + 1}</h4>
      <button onClick={() => onRemove(sectionIndex, itemIndex)} className="text-white/20 hover:text-red-500 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
    <div className="grid md:grid-cols-2 gap-8">
      <InputField label="Entry Heading" value={data.title} onChange={v => onChange(sectionIndex, itemIndex, 'title', v)} />
      <InputField label="Sub-title / Role" value={data.subtitle} onChange={v => onChange(sectionIndex, itemIndex, 'subtitle', v)} />
      <InputField label="Duration" value={data.date} onChange={v => onChange(sectionIndex, itemIndex, 'date', v)} />
    </div>
    <div className="space-y-2">
      <label className="label text-[10px] uppercase tracking-widest text-white/40">Details</label>
      <textarea
        value={data.description}
        onChange={(e) => onChange(sectionIndex, itemIndex, 'description', e.target.value)}
        className="input bg-transparent border-white/5 min-h-[80px]"
      />
    </div>
  </div>
);

const SkillsForm = ({ skills, onAdd, onRemove, education = [] }) => {
  const [newSkill, setNewSkill] = useState('');
  const [skillType, setSkillType] = useState('technical');
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const degree = education.length > 0 ? education[0].degree : '';
      if (!degree) return;
      try {
        const res = await api.get(`/smart/skills/${encodeURIComponent(degree)}`);
        setSuggestions(res.data.skills || []);
      } catch (error) {
        console.error('Error fetching skill suggestions:', error);
      }
    };
    fetchSuggestions();
  }, [education]);

  useEffect(() => {
    if (newSkill.trim() === '') {
      setFilteredSuggestions([]);
      return;
    }
    const filtered = suggestions.filter(s =>
      s.name.toLowerCase().includes(newSkill.toLowerCase()) &&
      !skills[skillType]?.includes(s.name)
    );
    setFilteredSuggestions(filtered);
  }, [newSkill, suggestions, skills, skillType]);

  const handleAdd = (value) => {
    const valToAdd = value || newSkill;
    if (!valToAdd.trim()) return;
    if (skills[skillType]?.includes(valToAdd.trim())) {
      setNewSkill('');
      setFilteredSuggestions([]);
      return;
    }
    onAdd(skillType, valToAdd);
    setNewSkill('');
    setFilteredSuggestions([]);
  };

  return (
    <div className="space-y-8 p-10">
      <div className="flex flex-col md:flex-row gap-8 items-end">
        <div className="w-full md:w-48 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Skill Category</label>
          <select
            value={skillType}
            onChange={(e) => setSkillType(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 py-2 font-black uppercase tracking-widest text-[10px] focus:border-white focus:outline-none transition-all"
          >
            <option value="technical" className="bg-black text-white">Technical Stack</option>
            <option value="soft" className="bg-black text-white">Interpersonal</option>
            <option value="projects" className="bg-black text-white">Domain Focus</option>
          </select>
        </div>

        <div className="flex-1 space-y-2 relative">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Enter Skill Name</label>
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            className="w-full bg-transparent border-b border-white/10 py-2 font-medium focus:border-white focus:outline-none transition-all placeholder:text-white/5"
            placeholder="Search or add skill..."
            autoComplete="off"
          />
          {filteredSuggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-[#0a0a0a] border border-white/5 shadow-2xl mt-4 max-h-48 overflow-y-auto">
              {filteredSuggestions.map(s => (
                <div
                  key={s.id}
                  onClick={() => handleAdd(s.name)}
                  className="px-6 py-4 hover:bg-white hover:text-black cursor-pointer flex justify-between items-center transition-all group"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">{s.name}</span>
                  <span className="text-[8px] font-bold opacity-40 uppercase tracking-widest group-hover:opacity-100">{s.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => handleAdd()} className="bg-white text-black px-10 py-3 font-black uppercase tracking-widest text-[10px] hover:bg-white/90 transition-all">
          Add Skill
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-12 pt-8 border-t border-white/5">
        {['technical', 'soft', 'projects'].map((type) => (
          <div key={type} className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{type === 'projects' ? 'Strategic Focus' : type + ' stack'}</h4>
            <div className="flex flex-wrap gap-2">
              {skills[type]?.map((skill, index) => (
                <span
                  key={index}
                  className="bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-white/5 flex items-center gap-3 group hover:border-white/20 transition-all cursor-default"
                >
                  {skill}
                  <button onClick={() => onRemove(type, index)} className="text-white/20 hover:text-white transition-colors">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVEditor;
