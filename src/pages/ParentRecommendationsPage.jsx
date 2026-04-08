import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Stethoscope, Sparkles } from 'lucide-react';
import { staggerContainer, fadeSlideUp } from '../animations/variants';

export default function ParentRecommendationsPage() {
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">Daily Recommendations</h1>
                    <p className="text-slate-500 mt-1">Personalized action points from AI and your doctor.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div variants={fadeSlideUp} className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-blue-600" />
                        From Your Doctor
                    </h2>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        {[
                            { title: "Increase Iron Intake", description: "Incorporate more spinach and lentils into meals this week.", status: "completed" },
                            { title: "Monitor Sugar", description: "Keep processed sugar under 15g per day.", status: "pending" },
                            { title: "Hydration Goal", description: "Ensure at least 2L of water intake.", status: "pending" }
                        ].map((rec, idx) => (
                            <div key={idx} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                                {rec.status === 'completed' ? (
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                                ) : (
                                    <Circle className="w-6 h-6 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                                )}
                                <div>
                                    <h3 className={`font-semibold ${rec.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{rec.title}</h3>
                                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{rec.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={fadeSlideUp} className="space-y-4">
                    <h2 className="text-lg font-bold text-emerald-700 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        AI Insights
                    </h2>
                    <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
                        {[
                            { title: "Recovery Optimization", description: "After yesterday's high physical activity, increasing post-workout protein by 10g will accelerate recovery.", tag: "Nutrition" },
                            { title: "Sleep Connection", description: "A slight drop in energy levels noted. Adding a magnesium-rich snack before bed might improve sleep quality.", tag: "Wellness" }
                        ].map((rec, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">{rec.tag}</span>
                                <h3 className="font-semibold text-slate-900">{rec.title}</h3>
                                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{rec.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
