import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { ArrowLeft, Users, Trash2, FileText, Unlock, Search } from 'lucide-react';

const UserList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        fetchUsers();
    }, [user, navigate]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers(prev => prev.filter(u => u.id !== userId));
            setDeleteConfirm(null);
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting user');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

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
                                <Users className="w-6 h-6 text-[#D4AF37]" />
                                User Analytics
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{users.length} authenticated nodes</p>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8">
                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input pl-12 text-base"
                    />
                </div>

                {/* Users Table */}
                <div className="card bg-[#0a0a0a]/80 backdrop-blur-sm border-white/5 p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest">User</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Role</th>
                                    <th className="text-center px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest">CVs</th>
                                    <th className="text-center px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Unlocks</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Status</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Node Start</th>
                                    <th className="text-right px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Ops</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 border border-white/10 flex items-center justify-center text-white font-black text-xs">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-black text-white text-xs uppercase tracking-widest">{u.name}</p>
                                                    <p className="text-[10px] text-white/40 font-medium">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-widest ${u.role === 'admin'
                                                ? 'bg-[#D4AF37] text-black'
                                                : 'bg-white/10 text-white/60'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 text-xs text-white/60 font-black">
                                                {u.cvCount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 text-xs text-[#D4AF37] font-black">
                                                {u.unlockCount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] text-white/40 uppercase tracking-wider">
                                            {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Inactive'}
                                        </td>
                                        <td className="px-6 py-4 text-[10px] text-white/40 uppercase tracking-wider">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {u.role !== 'admin' && (
                                                <>
                                                    {deleteConfirm === u.id ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleDelete(u.id)}
                                                                className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm(null)}
                                                                className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setDeleteConfirm(u.id)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Delete user"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No users found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserList;
