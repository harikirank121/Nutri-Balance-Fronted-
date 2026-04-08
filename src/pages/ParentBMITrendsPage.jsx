import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';
import { staggerContainer, fadeSlideUp } from '../animations/variants';

const bmiData = [
    { month: 'Jan', bmi: 18.5 },
    { month: 'Feb', bmi: 18.6 },
    { month: 'Mar', bmi: 18.8 },
    { month: 'Apr', bmi: 19.0 },
    { month: 'May', bmi: 19.2 },
    { month: 'Jun', bmi: 19.5 },
];

export default function ParentBMITrendsPage() {
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">BMI Trends</h1>
                    <p className="text-slate-500 mt-1">Track your child's growth and Body Mass Index over time.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={fadeSlideUp} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500">Current BMI</p>
                        <h2 className="text-3xl font-bold text-slate-900">19.5</h2>
                        <p className="text-xs text-emerald-600 font-medium mt-1">Healthy Range</p>
                    </div>
                </motion.div>
                <motion.div variants={fadeSlideUp} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600">
                        <Activity className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500">Growth Percentile</p>
                        <h2 className="text-3xl font-bold text-slate-900">75th</h2>
                        <p className="text-xs text-blue-600 font-medium mt-1">Consistent Growth</p>
                    </div>
                </motion.div>
            </div>

            <motion.div variants={fadeSlideUp} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-96 flex flex-col">
                <h2 className="text-lg font-bold text-slate-900 mb-4">6-Month Trend</h2>
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={bmiData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                            <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: '500' }} />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#64748b' }} />
                            <Line type="monotone" dataKey="bmi" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} animationDuration={1500} name="BMI Score" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </motion.div>
    );
}
