import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Check, ArrowLeft, Download, Lock } from 'lucide-react';
import ModernTemplate from '../templates/ModernTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import PaymentModal from '../components/PaymentModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    'designer-showcase': MinimalTemplate
};

const TemplateSelection = () => {
    const { id } = useParams(); // CV ID
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [cvData, setCvData] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [unlockedTemplateIds, setUnlockedTemplateIds] = useState([]);
    const [paymentTemplate, setPaymentTemplate] = useState(null); // template to show payment modal for

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await api.get('/smart/templates');
                setTemplates(res.data.templates);
            } catch (error) {
                console.error('Error fetching templates:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCV = async () => {
            try {
                const res = await api.get(`/cvs/${id}`);
                setCvData(res.data.cv);
                setSelectedTemplate(res.data.cv.templateId); // Default to current
            } catch (error) {
                console.error('Error fetching CV:', error);
            }
        };

        const fetchUnlocked = async () => {
            try {
                const res = await api.get('/payment/unlocked');
                setUnlockedTemplateIds(res.data.unlockedTemplateIds || []);
            } catch (error) {
                console.error('Error fetching unlocked templates:', error);
            }
        };

        fetchTemplates();
        fetchUnlocked();
        if (id && id !== 'undefined') fetchCV();
    }, [id]);

    const isTemplateAccessible = (template) => {
        // Template is accessible if it's not locked, OR if the user has unlocked it
        return !template.isLocked || unlockedTemplateIds.includes(template.id);
    };

    const handleSelectTemplate = async (template) => {
        if (!isTemplateAccessible(template)) {
            // Show payment modal
            setPaymentTemplate(template);
            return;
        }

        setSelectedTemplate(template.id);
        // Update CV with new template
        try {
            await api.put(`/cvs/${id}`, { templateId: template.id });
            setCvData(prev => ({ ...prev, templateId: template.id }));
        } catch (error) {
            console.error('Error updating template:', error);
        }
    };

    const handlePaymentSuccess = (templateId) => {
        // Add to unlocked list
        setUnlockedTemplateIds(prev => [...prev, templateId]);
        setPaymentTemplate(null);
        // Auto-select the unlocked template
        setSelectedTemplate(templateId);
        // Update CV
        api.put(`/cvs/${id}`, { templateId }).then(() => {
            setCvData(prev => ({ ...prev, templateId }));
        }).catch(console.error);
    };

    const handleDownload = async () => {
        // Check if current template is accessible
        const currentTpl = templates.find(t => t.id === selectedTemplate);
        if (currentTpl && !isTemplateAccessible(currentTpl)) {
            setPaymentTemplate(currentTpl);
            return;
        }

        setGenerating(true);
        const cvElement = document.getElementById('cv-preview-container');
        if (!cvElement) return;

        try {
            const canvas = await html2canvas(cvElement, {
                scale: 2,
                useCORS: true,
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${cvData.personalInfo.fullName || 'CV'}_${selectedTemplate}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF');
        } finally {
            setGenerating(false);
        }
    };

    if (loading || !cvData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Payment Modal */}
            {paymentTemplate && (
                <PaymentModal
                    template={paymentTemplate}
                    onClose={() => setPaymentTemplate(null)}
                    onSuccess={handlePaymentSuccess}
                />
            )}

            {/* Header */}
            <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(`/cv/edit/${id}`)} className="btn btn-outline text-sm">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Editor
                        </button>
                        <h1 className="text-xl font-bold">Select Template</h1>
                    </div>

                    <button
                        onClick={handleDownload}
                        disabled={generating}
                        className="btn btn-primary"
                    >
                        <Download className="w-4 h-4" />
                        {generating ? 'Generating...' : 'Download PDF'}
                    </button>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8 flex-1 flex gap-8">

                {/* Template List (Sidebar) */}
                <div className="w-1/3 overflow-y-auto h-[calc(100vh-100px)] pr-2">
                    <h2 className="text-lg font-semibold mb-4">Available Templates ({templates.length})</h2>
                    <div className="grid gap-4">
                        {templates.map(template => {
                            const accessible = isTemplateAccessible(template);
                            return (
                                <div
                                    key={template.id}
                                    onClick={() => handleSelectTemplate(template)}
                                    className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all relative ${selectedTemplate === template.id
                                            ? 'border-primary-600 ring-2 ring-primary-100'
                                            : 'border-gray-200 hover:border-primary-300'
                                        }`}
                                >
                                    {/* Live Thumbnail */}
                                    <div className="bg-gray-100 h-64 overflow-hidden relative">
                                        <div className="absolute top-0 left-0 w-[210mm] h-[297mm] transform scale-[0.25] origin-top-left pointer-events-none bg-white">
                                            {(() => {
                                                const ThumbComponent = TemplateMap[template.id] || ModernTemplate;
                                                const thumbData = cvData || {
                                                    personalInfo: { fullName: 'John Doe', title: 'Software Engineer', summary: 'Experienced developer...' },
                                                    experience: [{ jobTitle: 'Developer', company: 'Tech Corp', startDate: '2020-01', endDate: 'Present', description: 'Built amazing things.' }],
                                                    education: [{ degree: 'B.Sc. CS', institution: 'University', startDate: '2016', endDate: '2020' }],
                                                    skills: { technical: ['React', 'Node.js'], soft: ['Leadership'] }
                                                };
                                                return <ThumbComponent data={thumbData} />;
                                            })()}
                                        </div>

                                        {/* Lock Overlay */}
                                        {!accessible && (
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                                                <div className="bg-white/90 rounded-2xl p-4 flex flex-col items-center shadow-xl">
                                                    <Lock className="w-8 h-8 text-amber-500 mb-2" />
                                                    <p className="text-sm font-bold text-gray-800">Premium</p>
                                                    <p className="text-lg font-extrabold text-primary-600">₹{template.price}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Click to unlock</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 bg-white">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-medium">{template.name}</h3>
                                            {selectedTemplate === template.id && accessible && (
                                                <Check className="w-5 h-5 text-primary-600" />
                                            )}
                                            {!accessible && (
                                                <Lock className="w-4 h-4 text-amber-500" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                                ATS Score: {template.atsScore}
                                            </span>
                                            {!accessible && (
                                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                                                    ₹{template.price}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{template.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Live Preview (Main) */}
                <div className="flex-1 bg-gray-200 rounded-lg p-8 flex justify-center overflow-y-auto h-[calc(100vh-100px)]">
                    <div id="cv-preview-container" className="shadow-2xl bg-white transition-all duration-300">
                        {(() => {
                            const TemplateComponent = TemplateMap[selectedTemplate] || ModernTemplate;
                            return <TemplateComponent data={cvData} />;
                        })()}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TemplateSelection;
