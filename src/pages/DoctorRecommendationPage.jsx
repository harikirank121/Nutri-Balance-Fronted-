import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, FileHeart, UserCircle, Loader2 } from 'lucide-react';
import { staggerContainer, fadeSlideUp, hoverLift } from '../animations/variants';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DoctorRecommendationPage() {
    const { user: doctor } = useAuth();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [formData, setFormData] = useState({
        patientId: '',
        category: 'Dietary Adjustment',
        notes: ''
    });

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await API.get('/users/patients');
                setPatients(res.data);
            } catch (err) {
                console.error("Failed to fetch patients:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.patientId || !formData.notes) {
            setStatus('Please select a patient and add notes.');
            return;
        }

        try {
            await API.post('/recommendations', {
                ...formData,
                doctorId: doctor.id
            });
            setStatus('Recommendation sent successfully!');
            setFormData({ ...formData, notes: '' });
        } catch (err) {
            console.error("Failed to send recommendation:", err);
            setStatus('Failed to send. Try again.');
        }
        setTimeout(() => setStatus(''), 4000);
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8 max-w-4xl"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">Add Recommendation</h1>
                    <p className="text-slate-500 mt-1">Send personalized guidance to your patients.</p>
                </div>
            </div>

            <motion.div variants={fadeSlideUp} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" /></div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <UserCircle className="w-4 h-4 text-emerald-600" /> Patient
                                </label>
                                <select 
                                    value={formData.patientId}
                                    onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-700 appearance-none"
                                    required
                                >
                                    <option value="">Select Patient...</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.fullName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <FileHeart className="w-4 h-4 text-emerald-600" /> Category
                                </label>
                                <select 
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-700 appearance-none"
                                >
                                    <option>Dietary Adjustment</option>
                                    <option>Lifestyle Change</option>
                                    <option>Medication</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Detailed Notes</label>
                            <textarea
                                rows="6"
                                value={formData.notes}
                                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700 font-medium resize-none placeholder:text-slate-400"
                                placeholder="Write comprehensive guidance for the patient..."
                                required
                            ></textarea>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-emerald-600">{status}</span>
                            <motion.button
                                variants={hoverLift}
                                whileHover="hover"
                                type="submit"
                                className="bg-emerald-600 text-white font-semibold flex items-center gap-2 px-8 py-3.5 rounded-xl hover:bg-emerald-700 shadow-sm transition-colors"
                            >
                                <Send className="w-4 h-4" /> Send Recommendation
                            </motion.button>
                        </div>
                    </form>
                )}
            </motion.div>
        </motion.div>
    );
}
