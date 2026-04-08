import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building, AlertCircle, CheckCircle2, Shield, Loader2 } from 'lucide-react';
import { pageTransition, fadeSlideUp, hoverLift } from '../animations/variants';
import { ROLES } from '../utils/rolePermissions';
import API from "../services/api";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        organizationName: '',
        fullName: '',
        email: '',
        password: '',
        role: ROLES.PARENT
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const validateField = (name, value) => {
        let error = "";
        if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = "Invalid email format";
        }
        if (name === "password" && value && value.length < 6) {
            error = "Password must be at least 6 characters";
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Final validation
        const newErrors = {};
        if (!formData.organizationName) newErrors.organizationName = "Required";
        if (!formData.fullName) newErrors.fullName = "Required";
        if (!formData.email) newErrors.email = "Required";
        if (!formData.password) newErrors.password = "Required";

        if (Object.keys(newErrors).length > 0 || Object.values(errors).some(e => e)) {
            setErrors({ ...errors, ...newErrors });
            return;
        }

        setIsLoading(true);

        try {
            await API.post("/auth/register", formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error("Registration Error:", err);
            const msg = err.message || "Registration Failed. Please try again.";
            setErrors({ submit: msg });
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
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shadow-inner">
                            <User className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-slate-900 tracking-tight">
                        Create an Account
                    </h2>
                </div>

                <div className="p-8">
                    <AnimatePresence>
                        {errors.submit && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-50 text-red-600 text-sm p-4 rounded-xl flex items-center gap-3 mb-6"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{errors.submit}</span>
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-emerald-50 text-emerald-600 text-sm p-4 rounded-xl flex items-center gap-3 mb-6"
                            >
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                <span>Registration successful. Redirecting to Login...</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* ROLE SELECTOR */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Join as a</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                >
                                    <option value={ROLES.PARENT}>Parent / Guardian</option>
                                    <option value={ROLES.DOCTOR}>Doctor / Nutritionist</option>
                                    <option value={ROLES.CHILD}>Child (Personal use)</option>
                                </select>
                            </div>
                        </div>

                        {/* ORGANIZATION */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Organization</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="organizationName"
                                    value={formData.organizationName}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.organizationName ? 'border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'} rounded-xl transition-all outline-none`}
                                    placeholder="Company Ltd."
                                />
                            </div>
                            {errors.organizationName && <p className="mt-1 text-xs text-red-500 ml-1">{errors.organizationName}</p>}
                        </div>

                        {/* FULL NAME */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.fullName ? 'border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'} rounded-xl transition-all outline-none`}
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.fullName && <p className="mt-1 text-xs text-red-500 ml-1">{errors.fullName}</p>}
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.email ? 'border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'} rounded-xl transition-all outline-none`}
                                    placeholder="john@example.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-500 ml-1">{errors.email}</p>}
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.password ? 'border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'} rounded-xl transition-all outline-none`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-500 ml-1">{errors.password}</p>}
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={!isLoading ? "hover" : ""}
                            variants={hoverLift}
                            disabled={isLoading || success}
                            className="w-full mt-6 bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                        </motion.button>
                    </form>
                </div>

                <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
                    <p className="text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}