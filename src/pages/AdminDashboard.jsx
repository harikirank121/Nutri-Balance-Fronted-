import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Trash2, 
    Edit, 
    UserPlus, 
    Search, 
    Filter, 
    Shield, 
    Mail, 
    Building,
    X,
    Check,
    Loader2,
    AlertCircle,
    Utensils,
    Calendar,
    ChevronRight,
    LayoutDashboard,
    Youtube
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { ROLES } from '../utils/rolePermissions';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [view, setView] = useState('users'); // 'users' or 'diet'
    const [users, setUsers] = useState([]);
    const [dietEntries, setDietEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Fetch data
    const fetchData = async () => {
        setLoading(true);
        try {
            if (view === 'users') {
                const res = await API.get('/admin/users');
                setUsers(res.data);
            } else {
                const res = await API.get('/admin/diet-entries');
                setDietEntries(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [view]);

    // Handlers
    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            if (view === 'users') {
                await API.delete(`/admin/users/${itemToDelete}`);
                setUsers(users.filter(u => u.id !== itemToDelete));
            } else {
                await API.delete(`/admin/diet-entries/${itemToDelete}`);
                setDietEntries(dietEntries.filter(d => d.id !== itemToDelete));
            }
            setIsDeleteConfirmOpen(false);
            setItemToDelete(null);
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await API.put(`/admin/users/${selectedUser.id}`, selectedUser);
            setUsers(users.map(u => u.id === selectedUser.id ? res.data : u));
            setIsEditModalOpen(false);
            setSelectedUser(null);
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    const filteredUsers = users.filter(u => 
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredDiet = dietEntries.filter(d => 
        d.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            {/* Header */}
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Shield className="text-emerald-600" size={32} />
                        Administrative Console
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Manage users, roles, and platform data</p>
                </div>
                
                <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
                    <button 
                        onClick={() => setView('users')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${view === 'users' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Users size={18} />
                        Users
                    </button>
                    <button 
                        onClick={() => setView('diet')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${view === 'diet' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Utensils size={18} />
                        Diet Log
                    </button>
                    <button 
                        onClick={() => navigate('/admin-education')}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all flex items-center gap-2"
                    >
                        <Youtube size={18} className="text-rose-500" />
                        Manage Education
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4 items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder={`Search ${view}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <Loader2 className="animate-spin text-emerald-600 mb-2" size={32} />
                            <span className="font-bold text-slate-400 text-sm uppercase tracking-widest">Loading Infrastructure...</span>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    {view === 'users' ? (
                                        <>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Identify</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Organization</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User/Child</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Food Item</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Calories</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {(view === 'users' ? filteredUsers : filteredDiet).map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        {view === 'users' ? (
                                            <>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                                                            {item.fullName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 text-sm">{item.fullName}</div>
                                                            <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                                <Mail size={12} /> {item.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                                        item.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' :
                                                        item.role === 'DOCTOR' ? 'bg-emerald-100 text-emerald-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {item.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                                                        <Building size={14} className="text-slate-300" />
                                                        {item.organizationName}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => { setSelectedUser(item); setIsEditModalOpen(true); }}
                                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => { setItemToDelete(item.id); setIsDeleteConfirmOpen(true); }}
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-slate-900">{item.username || 'System User'}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: {item.id}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-slate-700">{item.foodName}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-black text-emerald-600">{item.calories} kcal</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                                        <Calendar size={14} />
                                                        {new Date(item.localDate || Date.now()).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => { setItemToDelete(item.id); setIsDeleteConfirmOpen(true); }}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Edit User Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm flex items-center gap-2">
                                    <Edit size={16} className="text-emerald-600" />
                                    Modify Authority Record
                                </h3>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleUpdateUser} className="p-8 space-y-5">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={selectedUser?.fullName || ''}
                                        onChange={(e) => setSelectedUser({...selectedUser, fullName: e.target.value})}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none font-bold text-slate-800"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Role Cluster</label>
                                        <select 
                                            value={selectedUser?.role || ''}
                                            onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none font-bold text-slate-800"
                                        >
                                            <option value={ROLES.ADMIN}>ADMIN</option>
                                            <option value={ROLES.DOCTOR}>DOCTOR</option>
                                            <option value={ROLES.PARENT}>PARENT</option>
                                            <option value={ROLES.CHILD}>CHILD</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Organization</label>
                                        <input 
                                            type="text" 
                                            value={selectedUser?.organizationName || ''}
                                            onChange={(e) => setSelectedUser({...selectedUser, organizationName: e.target.value})}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none font-bold text-slate-800"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Email Endpoint</label>
                                    <input 
                                        type="email" 
                                        value={selectedUser?.email || ''}
                                        onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none font-bold text-slate-800"
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 py-4 px-6 rounded-2xl text-slate-600 font-bold border border-slate-200 hover:bg-slate-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 py-4 px-6 rounded-2xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Check size={18} />
                                        Update Record
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteConfirmOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDeleteConfirmOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center border border-slate-200"
                        >
                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Wipe Record?</h3>
                            <p className="text-slate-500 font-medium mb-8 text-sm">
                                This action will permanently delist this {view === 'users' ? 'user' : 'diet entry'} from the primary clusters.
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setIsDeleteConfirmOpen(false)}
                                    className="flex-1 py-3 px-6 rounded-xl text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 transition-all"
                                >
                                    Abort
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className="flex-1 py-3 px-6 rounded-xl bg-red-600 text-white font-bold shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
