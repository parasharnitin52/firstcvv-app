import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Lock, Sparkles } from 'lucide-react';
import ModernTemplate from '../templates/ModernTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import BlackBoldTemplate from '../templates/BlackBoldTemplate';
import PaymentModal from '../components/PaymentModal';

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

const TemplateGallery = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [unlockedTemplateIds, setUnlockedTemplateIds] = useState([]);
    const [paymentTemplate, setPaymentTemplate] = useState(null);

    // Get user data from location state
    const userData = location.state?.cvData;

    useEffect(() => {
        if (!userData) {
            navigate('/cv/details');
            return;
        }
        fetchTemplates();
        fetchUnlocked();
    }, [userData, navigate]);

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

    const fetchUnlocked = async () => {
        try {
            const res = await api.get('/payment/unlocked');
            setUnlockedTemplateIds(res.data.unlockedTemplateIds || []);
        } catch (error) {
            console.error('Error fetching unlocked templates:', error);
        }
    };

    const isTemplateAccessible = (template) => {
        if (template.isFree) return true;
        return unlockedTemplateIds.includes(template.id);
    };

    const createCV = async (templateId) => {
        setCreating(true);
        try {
            const res = await api.post('/cvs', {
                ...userData,
                title: userData?.title || 'My Resume',
                templateId
            });
            if (res.data.success) {
                navigate(`/cv/edit/${res.data.cv.id}`);
            }
        } catch (error) {
            console.error('Error creating CV:', error);
            const message = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || 'Failed to create CV. Please try again.';
            alert(message);
        } finally {
            setCreating(false);
        }
    };

    const handleTemplateSelect = (template) => {
        if (!isTemplateAccessible(template)) {
            setPaymentTemplate(template);
            return;
        }
        createCV(template.id);
    };

    const handlePaymentSuccess = (templateId) => {
        setUnlockedTemplateIds(prev => [...prev, templateId]);
        setPaymentTemplate(null);
        createCV(templateId);
    };

    if (loading || creating) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white font-display">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-gray-600 font-medium">
                    {creating ? 'Creating your CV...' : 'Loading templates...'}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Payment Modal */}
            {paymentTemplate && (
                <PaymentModal
                    template={paymentTemplate}
                    onClose={() => setPaymentTemplate(null)}
                    onSuccess={handlePaymentSuccess}
                />
            )}

            {/* Header */}
            <nav className="bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
                <div className="container mx-auto px-8 py-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/dashboard')} className="hover:text-white/60 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="h-6 w-px bg-white/10"></div>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-[0.2em]">Select Blueprint</h1>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Choose your professional skin</p>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-10">
                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {templates.map(template => {
                        const accessible = isTemplateAccessible(template);
                        const TemplateComponent = TemplateMap[template.id] || ModernTemplate;

                        return (
                            <div
                                key={template.id}
                                onClick={() => handleTemplateSelect(template)}
                                className="group bg-[#0a0a0a] border border-white/5 p-8 hover:bg-white transition-all duration-700 cursor-pointer overflow-hidden flex flex-col"
                            >
                                {/* Template Preview Container */}
                                <div className="aspect-[3/4] bg-white relative overflow-hidden mb-8 border border-white/5 group-hover:border-black/5 transition-colors">
                                    <div className="absolute inset-0 transform scale-[0.4] origin-top pt-8 pointer-events-none">
                                        <div className="w-[210mm] min-h-[297mm] shadow-2xl">
                                            <TemplateComponent data={userData} />
                                        </div>
                                    </div>

                                    {!accessible && (
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px] flex flex-col items-center justify-center p-8 text-center group-hover:bg-black/60 transition-all">
                                            <Lock className="w-8 h-8 text-white mb-4" />
                                            <span className="text-xs font-black uppercase tracking-widest text-white mb-2">Premium Blueprint</span>
                                            <span className="text-3xl font-black text-white">₹{template.price}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Template Info */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-black transition-colors">{template.name}</h3>
                                        <span className="text-[10px] font-bold text-white/20 group-hover:text-black/20 transition-colors uppercase tracking-widest">Blueprint {template.id}</span>
                                    </div>
                                    <p className="text-sm text-white/40 group-hover:text-black/60 transition-colors line-clamp-2 uppercase font-medium">{template.description}</p>
                                    <div className="pt-6 border-t border-white/5 group-hover:border-black/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-3 h-3 text-white/20 group-hover:text-black/20" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-black/20">ATS {template.atsScore}%</span>
                                        </div>
                                        <button className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 transition-all ${accessible
                                            ? 'bg-white text-black group-hover:bg-black group-hover:text-white'
                                            : 'border border-white/10 group-hover:border-black/10 group-hover:text-black'}`}>
                                            {accessible ? 'Initialize' : 'Authorize Access'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {templates.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No templates available</h3>
                        <p className="text-gray-400">Templates will appear here once the admin uploads them.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplateGallery;
