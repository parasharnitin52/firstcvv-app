import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { ArrowLeft, Layout, Plus, Trash2, Edit3, Upload, DollarSign, Lock, Unlock, X } from 'lucide-react';

const ManageTemplates = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        id: '',
        name: '',
        description: '',
        atsScore: 90,
        price: 99,
        isLocked: true,
        structure: '{}'
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        fetchTemplates();
    }, [user, navigate]);

    const fetchTemplates = async () => {
        try {
            const res = await api.get('/admin/templates');
            setTemplates(res.data.templates);
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({ id: '', name: '', description: '', atsScore: 90, price: 99, isLocked: true, structure: '{}' });
        setThumbnailFile(null);
        setEditing(null);
        setShowForm(false);
    };

    const handleEdit = (template) => {
        setForm({
            id: template.id,
            name: template.name,
            description: template.description,
            atsScore: template.atsScore,
            price: template.price,
            isLocked: template.isLocked,
            structure: JSON.stringify(template.structure || {}, null, 2)
        });
        setEditing(template.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('id', form.id);
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('atsScore', form.atsScore);
            formData.append('price', form.price);
            formData.append('isLocked', form.isLocked);
            formData.append('structure', form.structure);
            if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

            if (editing) {
                await api.put(`/admin/templates/${editing}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/admin/templates', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            fetchTemplates();
            resetForm();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving template');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this template?')) return;
        try {
            await api.delete(`/admin/templates/${id}`);
            setTemplates(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting template');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blueprint">
            {/* Header */}
            <nav className="bg-black/60 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin')} className="btn btn-outline text-sm">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-widest text-white flex items-center gap-4">
                                <Layout className="w-6 h-6 text-[#D4AF37]" />
                                Template Architecture
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{templates.length} Active Prototypes</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="btn btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        New Template
                    </button>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8">
                {/* Upload Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.target === e.currentTarget && resetForm()}
                    >
                        <div className="bg-[#121212] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                                <h2 className="text-xl font-black uppercase tracking-widest text-white">
                                    {editing ? 'Update Prototype' : 'Initialize Prototype'}
                                </h2>
                                <button onClick={resetForm} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-white/40" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                {!editing && (
                                    <div>
                                        <label className="label">Template ID</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="e.g., modern-dark"
                                            value={form.id}
                                            onChange={e => setForm({ ...form, id: e.target.value })}
                                            required
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Lowercase, no spaces (used as identifier)</p>
                                    </div>
                                )}
                                <div>
                                    <label className="label">Template Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="e.g., Modern Dark"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Description</label>
                                    <textarea
                                        className="input"
                                        rows={3}
                                        placeholder="Brief description of this template..."
                                        value={form.description}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">ATS Score</label>
                                        <input
                                            type="number"
                                            className="input"
                                            min="0"
                                            max="100"
                                            value={form.atsScore}
                                            onChange={e => setForm({ ...form, atsScore: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Price (₹)</label>
                                        <input
                                            type="number"
                                            className="input"
                                            min="0"
                                            step="1"
                                            value={form.price}
                                            onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, isLocked: !form.isLocked })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isLocked ? 'bg-primary-600' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isLocked ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                    </button>
                                    <span className="text-sm text-gray-700 flex items-center gap-1.5">
                                        {form.isLocked ? <Lock className="w-4 h-4 text-amber-500" /> : <Unlock className="w-4 h-4 text-green-500" />}
                                        {form.isLocked ? 'Locked (Paid)' : 'Free'}
                                    </span>
                                </div>
                                <div>
                                    <label className="label">Thumbnail Image</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary-400 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setThumbnailFile(e.target.files[0])}
                                            className="hidden"
                                            id="thumbnail-upload"
                                        />
                                        <label htmlFor="thumbnail-upload" className="cursor-pointer">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">
                                                {thumbnailFile ? thumbnailFile.name : 'Click to upload thumbnail'}
                                            </p>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="label">Structure (JSON)</label>
                                    <textarea
                                        className="input font-mono text-xs"
                                        rows={4}
                                        value={form.structure}
                                        onChange={e => setForm({ ...form, structure: e.target.value })}
                                        placeholder="{}"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn btn-primary w-full"
                                >
                                    {submitting ? 'Saving...' : editing ? 'Update Template' : 'Create Template'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(template => (
                        <div key={template.id} className="card bg-[#0a0a0a]/80 backdrop-blur-sm border-white/5 group hover:shadow-2xl transition-all duration-300 overflow-hidden p-0">
                            {/* Thumbnail */}
                            <div className="h-48 bg-white/5 flex items-center justify-center relative overflow-hidden group">
                                {template.thumbnail ? (
                                    <img
                                        src={`http://localhost:5000${template.thumbnail}`}
                                        alt={template.name}
                                        className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                                    />
                                ) : (
                                    <Layout className="w-12 h-12 text-white/10" />
                                )}
                                {/* Lock badge */}
                                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${template.isLocked
                                    ? 'bg-[#D4AF37] text-black'
                                    : 'bg-white/10 text-white'
                                    }`}>
                                    {template.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                    {template.isLocked ? 'Premium' : 'Standard'}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-black text-white uppercase tracking-widest">{template.name}</h3>
                                        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">{template.id}</p>
                                    </div>
                                    {template.isLocked && (
                                        <span className="text-sm font-black text-[#D4AF37] flex items-center gap-0.5 tracking-tighter">
                                            ₹{template.price}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-white/40 font-medium line-clamp-2 mb-6 uppercase tracking-wider leading-relaxed">{template.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                        ATS: {template.atsScore}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleEdit(template)}
                                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                            title="Edit"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(template.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {templates.length === 0 && (
                    <div className="text-center py-20">
                        <Layout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No templates yet</h3>
                        <p className="text-gray-400 mb-6">Create your first template to get started</p>
                        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn btn-primary">
                            <Plus className="w-4 h-4" /> Create Template
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageTemplates;
