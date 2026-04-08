import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar as CalendarIcon, Download, ShoppingCart, Check, X, Printer, Copy } from 'lucide-react';
import { staggerContainer, fadeSlideUp, hoverLift } from '../animations/variants';

// Mock Data
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

const initialMealPlan = {
    Monday: { Breakfast: 'Oats & Berries', Lunch: 'Quinoa Salad', Snack: 'Apple Slices', Dinner: 'Grilled Salmon' },
    Tuesday: { Breakfast: 'Smoothie Bowl', Lunch: 'Turkey Wrap', Snack: 'Greek Yogurt', Dinner: 'Chicken Stir-fry' },
    Wednesday: { Breakfast: 'Scrambled Eggs', Lunch: 'Lentil Soup', Snack: 'Carrot Sticks', Dinner: 'Beef Tacos' },
    Thursday: { Breakfast: 'Pancakes', Lunch: 'Tuna Salad', Snack: 'Almonds', Dinner: 'Vegetable Pasta' },
    Friday: { Breakfast: 'Avocado Toast', Lunch: 'Chicken Salad', Snack: 'Cheese Stick', Dinner: 'Homemade Pizza' },
    Saturday: { Breakfast: 'French Toast', Lunch: 'Leftover Pizza', Snack: 'Fruit Salad', Dinner: 'Burgers' },
    Sunday: { Breakfast: 'Waffles', Lunch: 'Roast Chicken', Snack: 'Popcorn', Dinner: 'Vegetable Curry' }
};

const mockGroceryList = {
    Produce: ['Berries', 'Apple', 'Carrots', 'Avocado', 'Fruit Assortment', 'Vegetable Assortment'],
    Protein: ['Salmon', 'Turkey', 'Chicken', 'Beef', 'Eggs', 'Tuna'],
    Dairy: ['Greek Yogurt', 'Cheese', 'Milk'],
    Pantry: ['Oats', 'Quinoa', 'Lentils', 'Pasta', 'Almonds', 'Taco Shells']
};

export default function MealPlannerPage() {
    const [plan, setPlan] = useState(initialMealPlan);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showGroceryModal, setShowGroceryModal] = useState(false);

    const handleGeneratePlan = () => {
        setIsGenerating(true);
        // Simulate API call for AI generation
        setTimeout(() => {
            setPlan({
                ...initialMealPlan,
                Monday: { Breakfast: 'Iron-fortified Cereal', Lunch: 'Spinach Salad', Snack: 'Orange Slices', Dinner: 'Lentil Stew' }, // Example of adjusting for iron
                Wednesday: { Breakfast: 'Greek Yogurt & Chia', Lunch: 'Chicken & Brocolli', Snack: 'Hummus & Veggies', Dinner: 'Baked Cod' }
            });
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">Smart Meal Planner</h1>
                    <p className="text-slate-500 mt-1">Auto-generate meals based on nutritional goals.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <motion.button
                        variants={hoverLift}
                        whileHover="hover"
                        onClick={handleGeneratePlan}
                        disabled={isGenerating}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-emerald-200 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /> Working...
                            </span>
                        ) : (
                            <><Sparkles className="w-4 h-4" /> AI Auto-Fill</>
                        )}
                    </motion.button>
                    <motion.button
                        variants={hoverLift}
                        whileHover="hover"
                        onClick={() => setShowGroceryModal(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                        <ShoppingCart className="w-4 h-4" /> Grocery List
                    </motion.button>
                </div>
            </div>

            {/* Weekly Calendar */}
            <motion.div variants={fadeSlideUp} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="p-4 font-semibold text-slate-600 w-32 border-r border-slate-100"><CalendarIcon className="w-5 h-5 text-slate-400" /></th>
                            {mealTypes.map(type => (
                                <th key={type} className="p-4 font-semibold text-slate-700 text-center">{type}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {weekDays.map(day => (
                            <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 font-medium text-slate-800 border-r border-slate-100 bg-slate-50/30">
                                    {day}
                                </td>
                                {mealTypes.map(type => (
                                    <td key={`${day}-${type}`} className="p-3">
                                        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group relative min-h-[60px] flex items-center justify-center text-center">
                                            <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700">{plan[day]?.[type] || '---'}</span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            {/* Grocery List Modal */}
            <AnimatePresence>
                {showGroceryModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowGroceryModal(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <ShoppingCart className="w-5 h-5 text-emerald-600" /> Weekly Grocery List
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">Based on your smart meal plan.</p>
                                </div>
                                <button
                                    onClick={() => setShowGroceryModal(false)}
                                    className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.entries(mockGroceryList).map(([category, items]) => (
                                        <div key={category} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                            <h3 className="font-bold text-slate-800 mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                                                {category}
                                                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{items.length}</span>
                                            </h3>
                                            <ul className="space-y-2">
                                                {items.map((item, idx) => (
                                                    <li key={idx} className="flex items-center gap-3 group">
                                                        <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center transition-colors cursor-pointer hover:border-emerald-400">
                                                            {/* Checkbox mock */}
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors cursor-pointer">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
                                    <Copy className="w-4 h-4" /> Copy Text
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-sm rounded-lg transition-colors">
                                    <Printer className="w-4 h-4" /> Print PDF
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
