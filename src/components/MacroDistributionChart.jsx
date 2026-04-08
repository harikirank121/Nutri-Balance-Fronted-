import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444']; // Blue, Amber, Red

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3">
                <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: payload[0].payload.color }}
                />
                <p className="font-semibold text-slate-900">
                    {payload[0].name}: <span className="font-bold">{payload[0].value}g</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function MacroDistributionChart() {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMacros = async () => {
            if (!user) return;
            try {
                const res = await API.get(`/diet/${user.id}`);
                const dietEntries = res.data;
                
                const totals = dietEntries.reduce((acc, entry) => {
                    acc.Protein += entry.protein || 0;
                    acc.Carbs += entry.carbs || 0;
                    acc.Fats += entry.fats || 0;
                    return acc;
                }, { Protein: 0, Carbs: 0, Fats: 0 });

                const chartData = [
                    { name: 'Protein', value: totals.Protein, color: COLORS[0] },
                    { name: 'Carbs', value: totals.Carbs, color: COLORS[1] },
                    { name: 'Fats', value: totals.Fats, color: COLORS[2] },
                ];
                setData(chartData);
            } catch (err) {
                console.error("Failed to fetch macro data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMacros();
    }, [user]);

    if (loading) return <div className="h-[240px] flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;
    if (data.every(d => d.value === 0)) return <div className="h-[240px] flex items-center justify-center text-slate-400 text-sm font-medium">No diet data logged yet.</div>;
    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        animationDuration={1500}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value, entry) => <span className="text-sm font-medium text-slate-700 ml-1">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
