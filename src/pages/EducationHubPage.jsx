import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, PlayCircle, Award, Search, CheckCircle2, Star, Loader2, Youtube } from 'lucide-react';
import { staggerContainer, fadeSlideUp, hoverLift } from '../animations/variants';
import API from '../services/api';

export default function EducationHubPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await API.get('/education');
                console.log('📚 Education content loaded:', res.data);
                setVideos(res.data);
            } catch (err) {
                console.error("❌ Failed to fetch videos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    const filteredVideos = videos.filter(v => 
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleWatchVideo = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">Education Hub</h1>
                    <p className="text-slate-500 mt-1">Learn about nutrition and earn bonus points!</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700 font-medium shadow-sm"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-emerald-600 w-10 h-10" />
                </div>
            ) : filteredVideos.length === 0 ? (
                <div className="p-20 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                    <Youtube className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-slate-500 font-bold text-lg">No videos found</h3>
                    <p className="text-slate-400">Check back later for more content!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredVideos.map((video) => (
                        <motion.div
                            key={video.id}
                            variants={fadeSlideUp}
                            whileHover="hover"
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group h-full"
                        >
                            <div className="aspect-video bg-slate-100 relative group-hover:opacity-90 transition-opacity">
                                <img 
                                    src={`https://img.youtube.com/vi/${video.youtubeUrl.split('v=')[1]?.split('&')[0] || 'default'}/maxresdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                    <div className="bg-white/90 p-3 rounded-full shadow-lg">
                                        <PlayCircle className="w-8 h-8 text-rose-500" />
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1">
                                    +{video.rewardPoints} <Star className="w-4 h-4 fill-white" />
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-emerald-700 transition-colors">
                                    {video.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {video.description}
                                </p>
                                <div className="mt-auto">
                                    <motion.button
                                        variants={hoverLift}
                                        whileHover="hover"
                                        onClick={() => handleWatchVideo(video.youtubeUrl)}
                                        className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                                    >
                                        <Youtube className="w-5 h-5 text-rose-500" /> Watch & Earn Points
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
