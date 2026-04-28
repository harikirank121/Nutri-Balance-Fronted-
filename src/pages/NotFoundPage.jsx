import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import { pageTransition, fadeSlideUp, hoverLift } from '../animations/variants';

export default function NotFoundPage() {
    return (
        <motion.div
            className="min-h-screen bg-slate-50 flex items-center justify-center p-6"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageTransition}
        >
            <motion.div
                variants={fadeSlideUp}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 p-8 text-center"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                </div>
                
                <h1 className="text-3xl font-bold text-slate-900 mb-2">404</h1>
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Page Not Found</h2>
                <p className="text-slate-500 mb-8">
                    Oops! The page you are looking for doesn't exist or has been moved.
                </p>

                <motion.div 
                    whileHover="hover" 
                    variants={hoverLift}
                >
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-colors"
                    >
                        <Home className="w-5 h-5" /> Back to Home
                    </Link>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
