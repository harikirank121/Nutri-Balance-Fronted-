import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Droplets, HeartPulse, Download, FileText, Loader2 } from 'lucide-react';
import { fadeSlideUp, staggerContainer } from '../animations/variants';
import PatientNutrientHistoryChart from '../components/PatientNutrientHistoryChart';
import API from '../services/api';

export default function DoctorDashboard() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [recommendation, setRecommendation] = useState({
        patientId: '',
        notes: ''
    });
    const [stats, setStats] = useState({
        assigned: 0,
        alerts: 0,
        pending: 0,
        critical: 0
    });

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await API.get('/users/patients');
                setPatients(res.data);
                setStats(prev => ({ ...prev, assigned: res.data.length }));
            } catch (err) {
                console.error("Failed to fetch patients:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const handleRecommendationSubmit = async (e) => {
        e.preventDefault();
        if (!recommendation.patientId || !recommendation.notes) return;
        setSubmitting(true);
        try {
            await API.post('/recommendations', {
                ...recommendation,
                doctorId: 1, // Default for now or get from context
                category: 'General'
            });
            setRecommendation({ patientId: '', notes: '' });
            alert("Recommendation sent!");
        } catch (err) {
            console.error("Failed to send:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">Doctor Dashboard</h1>
                    <p className="text-slate-500 mt-1">Manage your patients and review their nutritional plans.</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition">
                    <Download className="w-4 h-4" /> Download Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Dynamic metric cards for doctors */}
                {[
                    { title: "Assigned Children", value: stats.assigned, icon: Users, color: "blue" },
                    { title: "Deficiency Alerts", value: "3", icon: HeartPulse, color: "amber" },
                    { title: "Pending Reviews", value: "8", icon: FileText, color: "emerald" },
                    { title: "Critical Updates", value: "1", icon: Droplets, color: "red" }
                ].map((stat, idx) => (
                    <motion.div key={idx} variants={fadeSlideUp} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 mb-1">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                        </div>
                        <div className={`p-4 rounded-xl bg-slate-50 text-emerald-600`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div variants={fadeSlideUp} className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Patient Nutrient History</h3>
                    <PatientNutrientHistoryChart />
                </motion.div>

                <motion.div variants={fadeSlideUp} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Add Recommendation</h3>
                    {loading ? (
                        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-600" /></div>
                    ) : (
                        <form className="space-y-4" onSubmit={handleRecommendationSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Patient</label>
                                <select 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    value={recommendation.patientId}
                                    onChange={(e) => setRecommendation({...recommendation, patientId: e.target.value})}
                                    required
                                >
                                    <option value="">Select Patient...</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.fullName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                                <textarea 
                                    rows="4" 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500/20" 
                                    placeholder="Dietary adjustments..."
                                    value={recommendation.notes}
                                    onChange={(e) => setRecommendation({...recommendation, notes: e.target.value})}
                                    required
                                ></textarea>
                            </div>
                            <button 
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : "Submit"}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
