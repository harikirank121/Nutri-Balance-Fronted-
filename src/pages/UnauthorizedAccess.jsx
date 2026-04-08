import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { pageTransition, fadeSlideUp } from '../animations/variants';

export default function UnauthorizedAccess() {
    return (
        <motion.div
            className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageTransition}
        >
            <motion.div variants={fadeSlideUp} className="text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                        <ShieldAlert className="w-10 h-10 text-red-600" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Unauthorized Access</h1>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    You do not have the required permissions to view this page. Please contact your administrator if you believe this is a mistake.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition"
                >
                    Return Home
                </Link>
            </motion.div>
        </motion.div>
    );
}
