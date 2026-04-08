import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';
import { fadeSlideUp, staggerContainer, hoverLift, pageTransition } from '../animations/variants';
import ScrollFloat from '../animations/ScrollFloat';

const features = [
    {
        icon: <Activity className="w-8 h-8 text-emerald-600" />,
        title: "Real-time Tracking",
        description: "Monitor your nutritional intake instantly with our intuitive enterprise-grade dashboard."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
        title: "Data Security",
        description: "Bank-level encryption ensures your health data remains completely private and secure."
    },
    {
        icon: <HeartPulse className="w-8 h-8 text-emerald-600" />,
        title: "Health Insights",
        description: "Receive AI-driven actionable insights to continually optimize your wellness journey."
    }
];

export default function LandingPage() {
    return (
        <motion.div
            className="min-h-screen bg-slate-50 overflow-hidden relative"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageTransition}
        >
            {/* Background GIF */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                    src="/1.gif"
                    alt="Background fluid animation"
                    className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-slate-50/85 backdrop-blur-[2px]" />
            </div>

            <header className="absolute top-0 w-full p-6 flex justify-between items-center z-10 max-w-7xl mx-auto left-0 right-0">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    NutriBalance <span className="text-emerald-600">AI</span>
                </h1>
                <div className="space-x-4">
                    <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                        Sign In
                    </Link>
                    <Link to="/register" className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm">
                        Get Started
                    </Link>
                </div>
            </header>

            <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto h-screen flex flex-col justify-center">

                <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-2xl">
                        <div className="mb-6">
                            <ScrollFloat
                                animationDuration={1}
                                ease="back.inOut(2)"
                                scrollStart="center bottom+=50%"
                                scrollEnd="bottom bottom-=40%"
                                stagger={0.03}
                                containerClassName="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight block"
                            >
                                Precision Nutrition,
                            </ScrollFloat>
                            <ScrollFloat
                                animationDuration={1}
                                ease="back.inOut(2)"
                                scrollStart="center bottom+=50%"
                                scrollEnd="bottom bottom-=40%"
                                stagger={0.03}
                                containerClassName="text-5xl lg:text-7xl font-extrabold text-emerald-600 leading-tight block"
                            >
                                Intelligent Health.
                            </ScrollFloat>
                        </div>

                        <motion.p variants={fadeSlideUp} className="text-lg text-slate-600 mb-10 leading-relaxed">
                            Empower your wellness team with data-driven insights. NutriBalance AI provides enterprise-grade nutritional tracking, reporting, and personalized guidance in one seamless platform.
                        </motion.p>

                        <motion.div variants={fadeSlideUp} className="flex gap-4">
                            <Link to="/register">
                                <motion.button
                                    whileHover="hover"
                                    variants={hoverLift}
                                    className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-emerald-700 transition-colors"
                                >
                                    Start Free Trial
                                </motion.button>
                            </Link>
                            <Link to="/login">
                                <motion.button
                                    whileHover="hover"
                                    variants={hoverLift}
                                    className="bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-md border border-slate-200 hover:text-slate-900 transition-colors"
                                >
                                    View Demo
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col gap-6"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeSlideUp}
                                whileHover="hover"
                                className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex gap-6 items-start"
                            >
                                <div className="bg-emerald-50 p-3 rounded-xl">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </main>
        </motion.div>
    );
}
