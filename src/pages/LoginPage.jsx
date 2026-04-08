import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, Shield, Loader2 } from 'lucide-react';
import { pageTransition, fadeSlideUp, hoverLift } from '../animations/variants';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/rolePermissions';
import API from "../services/api";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const res = await API.post("/auth/login", { email, password });

            // ✅ Log in to Context
            login(res.data);

            const { role: userRole } = res.data;

            // ✅ Dynamic navigation based on role from backend
            switch (userRole) {
                case ROLES.ADMIN: navigate('/admin-dashboard'); break;
                case ROLES.DOCTOR: navigate('/doctor-dashboard'); break;
                case ROLES.PARENT: navigate('/parent-dashboard'); break;
                case ROLES.CHILD: navigate('/child-dashboard'); break;
                default: setError("Unauthorized Role detected."); break;
            }

        } catch (err) {
            console.error("Login Error:", err);
            setError(err.message || 'Invalid credentials or connection failure.');
        } finally {
            setIsLoading(false);
        }
    };

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
                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100"
            >
                <div className="p-8 pb-6 border-b border-slate-100">
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <Lock className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-slate-900 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="text-center text-slate-500 mt-2 text-sm">
                        Sign in to continue to NutriBalance Enterprise
                    </p>
                </div>

                <div className="p-8">
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-50 text-red-600 text-sm p-4 rounded-xl flex items-center gap-3 mb-6"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* BUTTON */}
                        <motion.button
                            type="submit"
                            whileHover={!isLoading ? "hover" : ""}
                            variants={hoverLift}
                            disabled={isLoading}
                            className="w-full mt-6 bg-emerald-600 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight className="w-5 h-5" /></>
                            )}
                        </motion.button>
                    </form>
                </div>

                <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
                    <p className="text-sm text-slate-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
                            Register
                        </Link>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}