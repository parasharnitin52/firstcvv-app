import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FileText, Plus, Trash2, LogOut, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import ParticleBackground from '../components/ParticleBackground';

import ModernTemplate from '../templates/ModernTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import BlackBoldTemplate from '../templates/BlackBoldTemplate';

const Dashboard = () => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      const response = await api.get('/cvs');
      setCvs(response.data.cvs);
    } catch (error) {
      console.error('Error fetching CVs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this CV?')) return;

    try {
      await api.delete(`/cvs/${id}`);
      setCvs(cvs.filter(cv => cv.id !== id));
    } catch (error) {
      console.error('Error deleting CV:', error);
      alert('Failed to delete CV');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getTemplateComponent = (templateId) => {
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
    return TemplateMap[templateId] || ModernTemplate;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black relative overflow-hidden">
      <ParticleBackground />
      {/* Header */}
      <nav className="bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="FirstCV Logo" className="h-10 w-auto" />
            </Link>
            <div className="flex items-center gap-6">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                  Admin Control
                </Link>
              )}
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
                Member: <span className="text-white">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="hover:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-8 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero/Page Header */}
          <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="max-w-2xl">
              <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                Curated <br />
                <span className="text-white/20">Excellence.</span>
              </h1>
              <p className="text-white/40 text-lg font-medium max-w-md">
                Your professional narrative, refined and presented with uncompromising precision.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/cv/details"
                className="btn btn-primary group"
              >
                Start New CV
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* CVs Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 border-2 border-white/10 border-t-white animate-spin"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Syncing Data</span>
            </div>
          ) : cvs.length === 0 ? (
            <div className="py-32 border border-white/5 bg-[#0a0a0a] text-center">
              <div className="max-w-sm mx-auto space-y-8">
                <div className="w-16 h-16 bg-white/5 flex items-center justify-center mx-auto">
                  <Plus className="w-8 h-8 text-white/20" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight">The canvas is empty</h3>
                  <p className="text-white/40 text-sm">Initiate your career progression by crafting your first professional document.</p>
                </div>
                <Link to="/cv/details" className="btn btn-primary">
                  Create First CV
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1px bg-white/5 border border-white/5">
              {cvs.map((cv) => {
                const TemplateComponent = getTemplateComponent(cv.templateId);
                return (
                  <div key={cv.id} className="group bg-[#050505] p-8 hover:bg-[#0a0a0a] transition-all duration-500 flex flex-col min-h-[500px]">
                    <div className="flex justify-between items-start mb-12">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Document</span>
                        <h3 className="text-2xl font-black uppercase tracking-tight leading-none group-hover:text-white transition-colors truncate max-w-[200px]">
                          {cv.title}
                        </h3>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDelete(cv.id)}
                          className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-red-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Preview Area */}
                    <Link to={`/cv/edit/${cv.id}`} className="flex-1 relative bg-[#0a0a0a] border border-white/5 overflow-hidden mb-8 group/preview">
                      <div className="absolute inset-0 flex justify-center pointer-events-none transform scale-[0.3] origin-top pt-8 transition-transform duration-700 group-hover/preview:scale-[0.32]">
                        <div className="shadow-2xl bg-white" style={{ width: '210mm', minHeight: '297mm' }}>
                          <TemplateComponent data={cv} />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] border-b-2 border-white pb-1">Edit Master</span>
                      </div>
                    </Link>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-white/40">Status</span>
                        <span className="text-white">Active</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-white/40">Modified</span>
                        <span className="text-white">{format(new Date(cv.updatedAt), 'dd.MM.yy')}</span>
                      </div>
                      <div className="pt-4 border-t border-white/5 flex gap-4">
                        <Link
                          to={`/cv/edit/${cv.id}`}
                          className="flex-1 btn btn-primary py-4"
                        >
                          Open Editor
                        </Link>
                        <Link
                          to={`/select-template/${cv.id}`}
                          className="w-14 h-14 flex items-center justify-center border border-white/10 hover:border-white transition-colors"
                        >
                          <FileText className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
