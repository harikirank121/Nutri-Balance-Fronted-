import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, ChevronDown, CheckCircle2, Camera, Upload } from 'lucide-react';
import { staggerContainer, fadeSlideUp, hoverLift } from '../animations/variants';
import { analyzeMealPhoto } from '../services/geminiVisionService';
import API from "../services/api";

const foodOptions = [
    { id: 1, name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
    { id: 2, name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fats: 1.8 },
    { id: 3, name: 'Broccoli', calories: 55, protein: 4, carbs: 11, fats: 0.6 },
    { id: 4, name: 'Salmon Filet', calories: 206, protein: 22, carbs: 0, fats: 13 },
];

export default function DietEntryPage() {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    // ✅ Standardized userId extraction
    const userId = user.id; 
    
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [log, setLog] = useState([]);
    const [query, setQuery] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // ✅ FETCH existing diet entries on component mount
    useEffect(() => {
        const fetchDietLog = async () => {
            if (!userId) return;
            setIsLoading(true);
            try {
                const res = await API.get(`/diet/${userId}`);
                const entries = Array.isArray(res.data) ? res.data : [];
                const formatted = entries.map((entry) => ({
                    id: entry.id,
                    name: entry.foodName || entry.name,
                    calories: entry.calories,
                    protein: entry.protein || 0,
                    carbs: entry.carbs || 0,
                    fats: entry.fats || 0,
                    qty: entry.quantity || 1,
                    totalCals: entry.calories,
                }));
                setLog(formatted);
            } catch (err) {
                console.error("Could not fetch diet log:", err);
                setApiError('Failed to sync with server. Using local view.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDietLog();
    }, [userId]);

    const filteredOptions = foodOptions.filter(f =>
        f.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsAnalyzing(true);
        try {
            const result = await analyzeMealPhoto(file);
            if (result.success) {
                // For AI results, we'd ideally save each to the backend too
                setLog(prev => [...prev, ...result.items]);
            }
        } catch (error) {
            console.error("Failed to analyze image:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAdd = async () => {
        if (selectedFood && quantity > 0) {
            setApiError('');
            try {
                const res = await API.post(`/diet/${userId}`, {
                    foodName: selectedFood.name,
                    calories: selectedFood.calories * quantity,
                    protein: selectedFood.protein * quantity,
                    carbs: selectedFood.carbs * quantity,
                    fats: selectedFood.fats * quantity,
                    quantity: quantity,
                    date: new Date().toISOString().split("T")[0]
                });

                // ✅ Use the real ID returned from backend
                const newEntry = {
                    ...selectedFood,
                    id: res.data.id, 
                    qty: quantity,
                    totalCals: selectedFood.calories * quantity
                };

                setLog([...log, newEntry]);
            } catch (err) {
                console.error("API Error:", err);
                setApiError('Could not save to server. Item not added.');
            }
            setSelectedFood(null);
            setQuantity(1);
            setQuery('');
        }
    };

    const handleRemove = async (id) => {
        if (!userId) return;
        
        try {
            // ✅ Call backend to delete
            await API.delete(`/diet/${userId}/${id}`);
            setLog(log.filter(item => item.id !== id));
        } catch (err) {
            console.error("Delete Error:", err);
            setApiError('Failed to delete from server.');
        }
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto space-y-8"
        >
            <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">Diet Entry</h1>
                <p className="text-slate-500 mt-1">Log your daily meals accurately.</p>
            </div>

            {/* Loading indicator */}
            {isLoading && (
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <div className="w-5 h-5 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin"></div>
                    Loading your diet log...
                </div>
            )}

            {/* API error banner */}
            {apiError && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                    <span>⚠️</span> {apiError}
                    <button onClick={() => setApiError('')} className="ml-auto text-amber-500 font-bold">&times;</button>
                </div>
            )}

            <motion.div
                variants={fadeSlideUp}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row gap-4 items-end"
            >
                <div className="flex-1 w-full relative">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Search Food</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={selectedFood ? selectedFood.name : query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setSelectedFood(null);
                                setDropdownOpen(true);
                            }}
                            onFocus={() => setDropdownOpen(true)}
                            className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                            placeholder="e.g., Grilled Chicken..."
                        />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>

                    <AnimatePresence>
                        {dropdownOpen && !selectedFood && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 max-h-60 overflow-y-auto"
                            >
                                {filteredOptions.length > 0 ? filteredOptions.map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => {
                                            setSelectedFood(option);
                                            setDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 focus:bg-emerald-50 focus:outline-none transition-colors group flex justify-between items-center"
                                    >
                                        <span className="font-medium text-slate-700 group-hover:text-emerald-700">{option.name}</span>
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{option.calories} kcal</span>
                                    </button>
                                )) : (
                                    <div className="px-4 py-3 text-slate-500 text-sm text-center">No results found</div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="w-full md:w-32">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-center"
                    />
                </div>

                <motion.button
                    whileHover="hover"
                    variants={hoverLift}
                    onClick={handleAdd}
                    disabled={!selectedFood}
                    className={`w-full md:w-auto px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm
            ${selectedFood
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                >
                    <Plus className="w-5 h-5" /> Add to Log
                </motion.button>
            </motion.div>

            {/* AI Photo Upload Section */}
            <motion.div variants={fadeSlideUp} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
                            <Camera className="w-5 h-5 text-emerald-600" /> AI Meal Scanner
                        </h2>
                        <p className="text-sm text-slate-600 mb-4">Snap a picture of your plate, and our AI will automatically estimate the nutritional content for you!</p>

                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="meal-photo-upload"
                                onChange={handleImageUpload}
                            />
                            <label
                                htmlFor="meal-photo-upload"
                                className="cursor-pointer bg-slate-50 border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 px-6 py-4 rounded-xl flex items-center justify-center gap-3 transition-colors text-slate-600 hover:text-emerald-700 font-medium w-full md:w-auto"
                            >
                                <Upload className="w-5 h-5" /> Upload Photo
                            </label>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isAnalyzing && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-center justify-center p-4 bg-emerald-50 rounded-xl border border-emerald-100 min-w-[200px]"
                            >
                                <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-3"></div>
                                <p className="text-sm font-semibold text-emerald-700 animate-pulse">Analyzing Meal...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <motion.div variants={fadeSlideUp} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h2 className="font-semibold text-slate-900">Today's Log</h2>
                    <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-md border border-slate-200">
                        {log.length} items
                    </span>
                </div>

                <div className="divide-y divide-slate-100">
                    <AnimatePresence>
                        {log.length > 0 ? (
                            log.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="px-6 py-4 flex items-center justify-between group hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-slate-900">{item.name}</h3>
                                            <p className="text-sm text-slate-500">Qty: {item.qty} &times; {item.calories} kcal</p>
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">P: {item.protein}g</span>
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600">C: {item.carbs}g</span>
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-600">F: {item.fats}g</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">{item.totalCals}</p>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">kcal</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(item.id)}
                                            className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors focus:outline-none opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-12 text-center"
                            >
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                    <Search className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="font-medium text-slate-900 mb-1">No foods logged yet</h3>
                                <p className="text-slate-500 text-sm">Search and add foods above to start tracking.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}
