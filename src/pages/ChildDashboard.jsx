import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Droplets, Apple, CheckCircle2, Trophy, ArrowRight, Loader2 } from 'lucide-react';
import { staggerContainer, fadeSlideUp, hoverLift } from '../animations/variants';
import ChildAvatar from '../components/ChildAvatar';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function ChildDashboard() {
    const { user } = useAuth();
    const [points, setPoints] = useState(0);
    const [level, setLevel] = useState(1);
    const [loading, setLoading] = useState(true);

    // Dynamic quests driven by daily data
    const [quests, setQuests] = useState([
        { id: 1, title: 'Drink 3 glasses of water', icon: Droplets, color: 'blue', completed: false, reward: 50 },
        { id: 2, title: 'Eat a green vegetable', icon: Apple, color: 'emerald', completed: false, reward: 100 },
        { id: 3, title: 'Log a healthy meal', icon: Star, color: 'amber', completed: false, reward: 100 },
    ]);

    useEffect(() => {
        const fetchChildData = async () => {
            if (!user) return;
            try {
                const res = await API.get(`/diet/${user.id}`);
                const dietEntries = res.data;
                
                // Logic to update quests based on real diet entries
                const hasVegetable = dietEntries.some(e => e.foodName.toLowerCase().includes('vegetable') || e.foodName.toLowerCase().includes('salad'));
                const hasMeal = dietEntries.length > 0;

                setQuests(prev => prev.map(q => {
                    if (q.id === 2 && hasVegetable) return { ...q, completed: true };
                    if (q.id === 3 && hasMeal) return { ...q, completed: true };
                    return q;
                }));

                // Calculate points: 10 points per entry + quest rewards
                const entryPoints = dietEntries.length * 10;
                const completedQuestPoints = quests.filter(q => q.completed).reduce((acc, q) => acc + q.reward, 0);
                const totalPoints = entryPoints + completedQuestPoints;
                
                setPoints(totalPoints);
                setLevel(Math.floor(totalPoints / 100) + 1);
            } catch (err) {
                console.error("Failed to fetch child data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchChildData();
    }, [user]);

    const handleCompleteQuest = (id) => {
        // Simple client-side toggle for water quest for now
        setQuests(quests.map(q => {
            if (q.id === id && !q.completed) {
                const newPoints = points + q.reward;
                setPoints(newPoints);
                setLevel(Math.floor(newPoints / 100) + 1);
                return { ...q, completed: true };
            }
            return q;
        }));
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600 w-10 h-10" /></div>;

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans"
        >
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Profile & level */}
                <header className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                            {user?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-800">Hi, {user?.fullName.split(' ')[0]}! 👋</h1>
                            <p className="text-slate-500 font-medium">Ready for today's adventure?</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-2xl w-full md:w-auto overflow-hidden relative">
                        {/* Progress Bar Background */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-200">
                            <motion.div
                                className="h-full bg-yellow-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${(points / 500) * 100}%` }}
                            />
                        </div>

                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Level</span>
                            <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/30">
                                {level}
                            </div>
                        </div>

                        <div className="w-px h-10 bg-slate-200" />

                        <div className="flex flex-col items-start pr-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Points</span>
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                <motion.span
                                    key={points}
                                    initial={{ scale: 1.5, color: '#eab308' }}
                                    animate={{ scale: 1, color: '#1e293b' }}
                                    className="font-black text-2xl text-slate-800"
                                >
                                    {points}
                                </motion.span>
                                <span className="text-sm font-bold text-slate-400">/ 500</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Avatar Section */}
                    <motion.div variants={fadeSlideUp} className="bg-gradient-to-b from-indigo-50 to-white rounded-[2rem] p-8 border border-indigo-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between">
                            <span className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full text-indigo-800 font-bold text-sm shadow-sm">
                                Your Buddy
                            </span>
                            <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold text-sm shadow-sm flex items-center gap-1">
                                <Trophy className="w-4 h-4" /> Goal: Hero Form
                            </span>
                        </div>

                        <div className="mt-12 mb-8">
                            <ChildAvatar points={points} />
                        </div>

                        <div className="text-center space-y-2 relative z-10 bg-white/50 backdrop-blur-sm p-4 rounded-3xl w-full">
                            <h2 className="text-xl font-black text-indigo-900">
                                {points >= 500 ? "Super Buddy Unlocked!" : "Keep going!"}
                            </h2>
                            <p className="text-indigo-600 font-medium">
                                {points >= 500 ? "You've reached max level for today." : "Complete quests to upgrade your buddy."}
                            </p>
                        </div>
                    </motion.div>

                    {/* Quests Section */}
                    <motion.div variants={fadeSlideUp} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">Daily Quests</h2>
                                <p className="text-slate-500 font-medium mt-1">Complete these to earn points!</p>
                            </div>
                            <span className="bg-emerald-100 text-emerald-700 font-bold px-4 py-2 rounded-full text-sm">
                                {quests.filter(q => q.completed).length} / {quests.length} Done
                            </span>
                        </div>

                        <div className="flex-1 space-y-4">
                            <AnimatePresence>
                                {quests.map((quest) => (
                                    <motion.div
                                        key={quest.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between group
                                            ${quest.completed
                                                ? 'bg-slate-50 border-slate-100 opacity-60'
                                                : `bg-white border-${quest.color}-100 hover:border-${quest.color}-300 hover:shadow-md cursor-pointer`
                                            }
                                        `}
                                        onClick={() => handleCompleteQuest(quest.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110
                                                ${quest.completed ? 'bg-slate-200 text-slate-400' : `bg-${quest.color}-100 text-${quest.color}-500 shadow-inner`}
                                            `}>
                                                {quest.completed ? <CheckCircle2 className="w-6 h-6" /> : <quest.icon className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h3 className={`font-bold text-lg ${quest.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                                    {quest.title}
                                                </h3>
                                                <p className={`font-medium flex items-center gap-1 ${quest.completed ? 'text-slate-400' : 'text-yellow-600'}`}>
                                                    +{quest.reward} <Star className="w-3 h-3 fill-current" />
                                                </p>
                                            </div>
                                        </div>

                                        {!quest.completed && (
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
