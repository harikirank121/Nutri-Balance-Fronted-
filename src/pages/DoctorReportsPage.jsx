import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Search, User, Filter, Loader2 } from 'lucide-react';
import { staggerContainer, fadeSlideUp, hoverLift } from '../animations/variants';
import API from '../services/api';

export default function DoctorReportsPage() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await API.get('/reports');
                setReports(res.data);
            } catch (err) {
                console.error("Failed to fetch reports:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const filteredReports = reports.filter(r => 
        r.patient.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">Patient Reports</h1>
                    <p className="text-slate-500 mt-1">Generate and download comprehensive health reports.</p>
                </div>
                <motion.button
                    variants={hoverLift}
                    whileHover="hover"
                    className="flex flex-row items-center gap-2 bg-emerald-600 px-4 py-2 rounded-xl text-white font-medium hover:bg-emerald-700 transition"
                >
                    <Download className="w-4 h-4" /> Download All
                </motion.button>
            </div>

            <motion.div variants={fadeSlideUp} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search reports by patient name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700 font-medium"
                        />
                    </div>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium w-full md:w-auto justify-center">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>

                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" /></div>
                    ) : filteredReports.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 font-medium">No reports found matching your search.</div>
                    ) : (
                        filteredReports.map((report) => (
                            <div key={report.id} className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-slate-50 transition-colors group">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 flex items-center gap-2">
                                            <User className="w-4 h-4 text-slate-400" /> {report.patient}
                                        </p>
                                        <p className="text-sm text-slate-500 mt-1 flex gap-2 items-center">
                                            <span className="font-medium text-slate-700">{report.type}</span> &bull; <span>{report.date}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
                                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${report.status === 'Ready' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                        {report.status}
                                    </span>
                                    <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors
                                        ${report.status === 'Ready' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 cursor-not-allowed opacity-50'}`}
                                        disabled={report.status !== 'Ready'}
                                    >
                                        <Download className="w-4 h-4" /> <span className="hidden sm:inline">Download</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
