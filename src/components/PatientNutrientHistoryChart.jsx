import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import API from '../services/api';

export default function PatientNutrientHistoryChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get the first patient to display their data as a sample
                const userRes = await API.get('/users/patients');
                if (userRes.data.length === 0) {
                    setLoading(false);
                    return;
                }
                
                const firstPatientId = userRes.data[0].id;
                const dietRes = await API.get(`/diet/${firstPatientId}`);
                const dietEntries = dietRes.data;

                // 2. Aggregate by day of week
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const aggregated = days.map(day => ({ name: day, Protein: 0, Carbs: 0, Fat: 0 }));

                dietEntries.forEach(entry => {
                    const dayName = days[new Date(entry.date).getDay()];
                    const dayData = aggregated.find(d => d.name === dayName);
                    if (dayData) {
                        dayData.Protein += entry.protein || 0;
                        dayData.Carbs += entry.carbs || 0;
                        dayData.Fat += entry.fats || 0;
                    }
                });

                setData(aggregated);
            } catch (err) {
                console.error("Failed to fetch chart data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="h-[250px] flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;
    return (
        <div className="h-full w-full min-h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="name"
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
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: '500' }}
                        cursor={{ fill: '#f8fafc' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#64748b' }} />
                    <Bar dataKey="Protein" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="Carbs" stackId="a" fill="#10b981" />
                    <Bar dataKey="Fat" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
