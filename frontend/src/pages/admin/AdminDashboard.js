/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Users, Layout, ArrowLeft, TrendingUp, FileText, Unlock } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        fetchStats();
    }, [user, navigate]);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data.stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Templates', value: stats?.totalTemplates || 0, icon: Layout, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
        { label: 'Total CVs', value: stats?.totalCVs || 0, icon: FileText, color: 'from-green-500 to-green-600', bg: 'bg-green-50' },
        { label: 'Template Unlocks', value: stats?.totalUnlocks || 0, icon: Unlock, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
        { label: 'New Users (7d)', value: stats?.recentUsers || 0, icon: TrendingUp, color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50' },
    ];

    return (
        <div className="min-h-screen bg-blueprint">
            {/* Header */}
            <nav className="bg-black/60 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dashboard')} className="btn btn-outline text-sm">
                            <Icons.ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        <div className="flex items-center gap-6">
                            <img src="/logo.svg" alt="Logo" className="h-8 w-auto grayscale brightness-200" />
                            <div className="h-8 w-px bg-white/10 mx-2" />
                            <div>
                                <h1 className="text-lg font-black uppercase tracking-widest text-white">
                                    Control Console
                                </h1>
                                <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Blueprint System v1.0</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-white text-black px-4 py-1 rounded-full font-black uppercase tracking-widest">
                            Admin
                        </span>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
                    {statCards.map((stat, i) => (
                        <div
                            key={i}
                            className="card bg-[#0a0a0a]/80 backdrop-blur-sm border-white/5 group hover:scale-[1.02] transform transition-all duration-300"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`bg-white/5 p-2.5 rounded-xl group-hover:scale-110 transition-transform`}>
                                    <stat.icon className={`w-5 h-5 text-[#D4AF37]`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-white">{stat.value}</p>
                                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6">System Operations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Manage Users */}
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="card bg-[#0a0a0a]/80 backdrop-blur-sm border-white/5 text-left group hover:border-[#D4AF37]/50 cursor-pointer transition-all"
                    >
                        <div className="flex items-center gap-6">
                            <div className="bg-white/5 p-5 rounded-2xl group-hover:bg-[#D4AF37]/10 transition-colors">
                                <Icons.Users className="w-10 h-10 text-white group-hover:text-[#D4AF37] transition-colors" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-widest text-white group-hover:text-[#D4AF37] transition-colors">
                                    User Directory
                                </h3>
                                <p className="text-xs text-white/40 mt-1 uppercase tracking-wider font-medium">
                                    Core User Management & Activity
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* Manage Templates */}
                    <button
                        onClick={() => navigate('/admin/templates')}
                        className="card bg-[#0a0a0a]/80 backdrop-blur-sm border-white/5 text-left group hover:border-[#D4AF37]/50 cursor-pointer transition-all"
                    >
                        <div className="flex items-center gap-6">
                            <div className="bg-white/5 p-5 rounded-2xl group-hover:bg-[#D4AF37]/10 transition-colors">
                                <Icons.Layout className="w-10 h-10 text-white group-hover:text-[#D4AF37] transition-colors" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-widest text-white group-hover:text-[#D4AF37] transition-colors">
                                    System Templates
                                </h3>
                                <p className="text-xs text-white/40 mt-1 uppercase tracking-wider font-medium">
                                    Catalog & Pricing Architecture
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
