import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100">
                <p className="font-semibold text-slate-900 mb-2 border-b border-slate-100 pb-2">{label}</p>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-emerald-600">
                        Intake: <span className="font-bold">{payload[1]?.value || 0}</span> kcal
                    </p>
                    <p className="text-sm font-medium text-slate-400">
                        Target: <span className="font-bold">{payload[0]?.value || 2200}</span> kcal
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function WeeklyProgressChart() {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeeklyData = async () => {
            if (!user) return;
            try {
                const res = await API.get(`/diet/${user.id}`);
                const dietEntries = res.data;

                // Create last 7 days range
                const days = [];
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    days.push({
                        dateString: d.toISOString().split('T')[0],
                        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
                        calories: 0,
                        target: 2200
                    });
                }

                dietEntries.forEach(entry => {
                    const entryDate = entry.date; // already YYYY-MM-DD
                    const dayMatch = days.find(d => d.dateString === entryDate);
                    if (dayMatch) {
                        dayMatch.calories += entry.calories || 0;
                    }
                });

                setData(days.map(d => ({ day: d.label, calories: d.calories, target: d.target })));
            } catch (err) {
                console.error("Failed to fetch weekly progress:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWeeklyData();
    }, [user]);

    if (loading) return <div className="h-[280px] flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;
    return (
        <div className="w-full mt-4">
            <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f1f5f9', strokeWidth: 2, fill: 'transparent' }} />
                    <Area
                        type="monotone"
                        dataKey="target"
                        stroke="#cbd5e1"
                        strokeDasharray="5 5"
                        fillOpacity={1}
                        fill="url(#colorTarget)"
                        name="Daily Target"
                    />
                    <Area
                        type="monotone"
                        dataKey="calories"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCalories)"
                        activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                        name="Actual Intake"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
