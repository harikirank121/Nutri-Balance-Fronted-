import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertTriangle, Zap, Droplets, Apple, ActivitySquare, Watch, ShieldAlert, AlertCircle, RefreshCcw, Loader2 } from 'lucide-react';
import { pageTransition, staggerContainer, fadeSlideUp, hoverLift } from '../animations/variants';
import WeeklyProgressChart from '../components/WeeklyProgressChart';
import MacroDistributionChart from '../components/MacroDistributionChart';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const DEFAULT_TARGETS = [
    { name: 'Calories', key: 'calories', current: 0, target: 2200, unit: 'kcal', icon: Zap, color: 'emerald' },
    { name: 'Protein', key: 'protein', current: 0, target: 120, unit: 'g', icon: Apple, color: 'blue' },
    { name: 'Water', key: null, current: 1.5, target: 2.5, unit: 'L', icon: Droplets, color: 'cyan' },
];

export default function ParentDashboard() {
    const { user } = useAuth();
    const userId = user?.id; 
    
    const [nutrients, setNutrients] = useState(DEFAULT_TARGETS);
    const [isLoading, setIsLoading] = useState(false);

    const fetchTodayStats = async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const res = await API.get(`/diet/${userId}`);
            const entries = Array.isArray(res.data) ? res.data : [];
            const today = new Date().toISOString().split('T')[0];
            
            const todayEntries = entries.filter(e => (e.date || '').startsWith(today));

            const totalCalories = todayEntries.reduce((sum, e) => sum + (e.calories || 0), 0);
            const totalProtein = todayEntries.reduce((sum, e) => sum + (e.protein || 0), 0);

            setNutrients([
                { name: 'Calories', current: totalCalories || 0, target: 2200, unit: 'kcal', icon: Zap, color: 'emerald' },
                { name: 'Protein', current: totalProtein || 0, target: 120, unit: 'g', icon: Apple, color: 'blue' },
                { name: 'Water', current: 1.5, target: 2.5, unit: 'L', icon: Droplets, color: 'cyan' },
            ]);
        } catch (err) {
            console.error('Could not fetch diet summary:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTodayStats();
    }, [userId]);

    const todayDisplay = new Date().toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
    });

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">Parent Dashboard</h1>
                    <p className="text-slate-500 mt-1">Real-time nutritional summary for today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchTodayStats}
                        disabled={isLoading}
                        className={`p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-emerald-600 transition-colors shadow-sm disabled:opacity-50`}
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
                    </button>
                    <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 shadow-sm">
                        Today, {todayDisplay}
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {nutrients.map((n, idx) => (
                    <motion.div
                        key={idx}
                        variants={fadeSlideUp}
                        whileHover="hover"
                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-${n.color}-50 text-${n.color}-600 ring-1 ring-${n.color}-100`}>
                                <n.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{n.name}</span>
                        </div>
                        <div className="flex items-baseline gap-1 mb-3">
                            <span className="text-3xl font-bold text-slate-900">{n.current}</span>
                            <span className="text-slate-500 font-bold opacity-40">/ {n.target} {n.unit}</span>
                        </div>

                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((n.current / n.target) * 100, 100)}%` }}
                                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 + (idx * 0.1) }}
                                className={`h-full bg-${n.color}-500 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
                            />
                        </div>
                        <p className="mt-3 text-xs font-bold text-slate-400 text-right uppercase tracking-widest">
                            {Math.round((n.current / n.target) * 100)}% Achieved
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly Progress Chart */}
                <motion.div
                    variants={fadeSlideUp}
                    className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                             Weekly Trends
                        </h2>
                        <button className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
                            Detailed Report
                        </button>
                    </div>
                    <div className="h-[280px] w-full">
                        <WeeklyProgressChart />
                    </div>
                </motion.div>

                <div className="space-y-6">
                    <motion.div
                        variants={fadeSlideUp}
                        className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col"
                    >
                        <h3 className="font-bold text-slate-900 mb-4 tracking-tight">Today's Macros</h3>
                        <div className="h-[180px] w-full">
                            <MacroDistributionChart />
                        </div>
                    </motion.div>

                    {/* AI Insight Card */}
                    <motion.div
                        variants={fadeSlideUp}
                        className="bg-emerald-600 rounded-3xl p-6 shadow-xl shadow-emerald-600/20 text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Zap className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-emerald-50 mb-2 flex items-center gap-2 text-sm uppercase tracking-widest">
                                AI Smart Insight
                            </h3>
                            <p className="text-emerald-100 text-sm leading-relaxed font-medium">
                                Based on your child's recent meal logs, increasing fiber intake by 5g could significantly improve daily energy levels.
                            </p>
                        </div>
                    </motion.div>

                    {/* Deficiency Alert Section */}
                    <motion.div
                        variants={fadeSlideUp}
                        className="bg-amber-50 rounded-3xl p-6 border border-amber-100 relative overflow-hidden"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            <h3 className="font-bold text-amber-900 uppercase text-xs tracking-widest">Action Required</h3>
                        </div>
                        <p className="text-amber-800 text-sm leading-relaxed mb-4 font-medium">
                            Iron and Vitamin D intake are currently below the target for this week.
                        </p>
                        <button className="w-full bg-amber-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-sm hover:bg-amber-700 transition-colors">
                            View Plan
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={fadeSlideUp} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <ActivitySquare className="w-5 h-5 text-indigo-500" /> Connected Devices
                        </h2>
                        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                            Apple Watch Series 8
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Steps</span>
                            <div className="text-2xl font-black text-slate-800">8,432</div>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Target: 10,000</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Active Cals</span>
                            <div className="text-2xl font-black text-slate-800">340</div>
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Target: 400</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeSlideUp} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-rose-500" /> Allergy Tracker
                        </h2>
                        <button className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors uppercase tracking-widest">
                            Add Alert
                        </button>
                    </div>
                    <div className="space-y-3">
                        <div className="border border-slate-100 rounded-2xl p-3 flex items-start gap-3 bg-rose-50/20">
                            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Peanuts</h4>
                                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Severe Reaction. Emergency Protocol: EpiPen.</p>
                            </div>
                        </div>
                        <div className="border border-slate-100 rounded-2xl p-3 flex items-start gap-3 bg-amber-50/20">
                            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Dairy / Lactose</h4>
                                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Mild Reaction. Bloating / Discomfort.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
