import React from 'react';
import { motion } from 'framer-motion';

export default function ChildAvatar({ points }) {
    // Determine the character's mood/evolution based on points
    const getVariant = () => {
        if (points >= 500) return 'hero';
        if (points >= 200) return 'happy';
        return 'normal';
    };

    const variant = getVariant();

    const variants = {
        normal: {
            scale: [1, 1.05, 1],
            y: [0, -10, 0],
            rotate: [0, -5, 5, 0],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        },
        happy: {
            scale: [1, 1.1, 1],
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        },
        hero: {
            scale: [1.1, 1.2, 1.1],
            y: [0, -30, 0],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
    };

    return (
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
            {/* Simple SVG Avatar Representation */}
            <motion.div
                variants={variants}
                animate={variant}
                className="w-48 h-48 relative"
            >
                {/* Body */}
                <div className="absolute inset-0 bg-blue-500 rounded-[3rem] shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1)_inset]" />

                {/* Eyes */}
                <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-900 rounded-full" />
                </div>
                <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-900 rounded-full" />
                </div>

                {/* Mouth */}
                {variant === 'normal' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-10 h-2 bg-slate-900 rounded-full" />
                )}
                {variant === 'happy' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-12 h-6 bg-slate-900 rounded-b-full" />
                )}
                {variant === 'hero' && (
                    <>
                        {/* Superhero mask */}
                        <div className="absolute top-1/4 left-0 w-full h-12 bg-red-500 rounded-xl opacity-80" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-16 h-8 bg-slate-900 rounded-b-full flex justify-center overflow-hidden">
                            <div className="w-8 h-4 bg-red-400 absolute bottom-0 rounded-t-full" />
                        </div>
                    </>
                )}

                {/* Sparkles for happy/hero */}
                {(variant === 'happy' || variant === 'hero') && (
                    <motion.div
                        animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -top-4 -right-4 w-8 h-8 text-yellow-400"
                    >
                        ✨
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
