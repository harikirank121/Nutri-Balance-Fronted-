import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Plus, Trash2, Loader2, AlertCircle, CheckCircle2, Star, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function AdminEducationPage() {
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        youtubeUrl: '',
        rewardPoints: 10
    });

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await API.get('/education');
            setVideos(res.data);
        } catch (err) {
            console.error("Failed to fetch videos:", err);
            setError("Failed to load existing content");
        } finally {
            setLoading(false);
        }
    };

    const handleAddVideo = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await API.post('/education', formData);
            setVideos([...videos, res.data]);
            setSuccess("Education content published successfully!");
            setFormData({ title: '', description: '', youtubeUrl: '', rewardPoints: 10 });
        } catch (err) {
            console.error("Failed to add video:", err);
            setError(err.message || "Failed to publish content");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Youtube className="text-rose-500" size={32} />
                        Education Management
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Curate and publish nutritional educational content</p>
                </div>
                <button 
                    onClick={() => navigate('/admin-dashboard')}
                    className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                >
                    <LayoutDashboard size={18} />
                    Back to Console
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Content Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 sticky top-8">
                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Plus size={20} className="text-emerald-600" />
                            New Content
                        </h2>

                        <form onSubmit={handleAddVideo} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Video Title</label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g. Healthy Eating Habits"
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none font-bold text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Description</label>
                                <textarea 
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Brief overview of the content..."
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none font-bold text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">YouTube URL</label>
                                <input 
                                    required
                                    type="url" 
                                    value={formData.youtubeUrl}
                                    onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})}
                                    placeholder="https://youtube.com/watch?v=..."
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none font-bold text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Reward Points</label>
                                <div className="relative">
                                    <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
                                    <input 
                                        type="number" 
                                        value={formData.rewardPoints}
                                        onChange={(e) => setFormData({...formData, rewardPoints: parseInt(e.target.value)})}
                                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none font-bold text-slate-800"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            {success && (
                                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold flex items-center gap-2 border border-emerald-100 animate-pulse">
                                    <CheckCircle2 size={16} /> {success}
                                </div>
                            )}

                            <button 
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Publish Content</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Content List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        Active Catalog ({videos.length})
                    </h2>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50 bg-white rounded-3xl border border-dashed border-slate-200">
                            <Loader2 className="animate-spin text-emerald-600 mb-2" size={32} />
                            <span className="font-bold text-slate-400 text-sm uppercase tracking-widest">Scanning Catalog...</span>
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="p-20 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold">No education content published yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {videos.map((video) => (
                                <div key={video.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-6 hover:shadow-md transition-all group">
                                    <div className="w-40 aspect-video bg-slate-100 rounded-2xl overflow-hidden shrink-0 relative">
                                        <img 
                                            src={`https://img.youtube.com/vi/${video.youtubeUrl.split('v=')[1]?.split('&')[0] || 'default'}/mqdefault.jpg`}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black">
                                            +{video.rewardPoints}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 mb-1">{video.title}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{video.description}</p>
                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                            <span className="flex items-center gap-1"><Star size={12} className="text-amber-500" /> Reward Active</span>
                                            <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={12} /> Verified URL</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-3 text-red-100 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
