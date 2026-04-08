import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Clock, Loader2, AlertCircle, Phone, Video } from 'lucide-react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { ROLES } from '../utils/rolePermissions';

export default function TelehealthChatPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [connected, setConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const stompClient = useRef(null);
    const scrollRef = useRef(null);

    // ✅ FETCH CHAT HISTORY ON MOUNT
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                const res = await API.get('/chat/history');
                const history = Array.isArray(res.data) ? res.data : [];
                setMessages(history);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch history:", err);
                setError("Could not load chat history. Please try refreshing.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // ✅ WEBSOCKET SETUP
    useEffect(() => {
        const socket = new SockJS('/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (msg) => console.log('STOMP:', msg),
            onConnect: () => {
                console.log('✅ Connected to WebSocket');
                setConnected(true);
                setError(null);
                client.subscribe('/topic/messages', (msg) => {
                    try {
                        const newMessage = JSON.parse(msg.body);
                        console.log('📩 Received message:', newMessage);
                        setMessages(prev => {
                            // Deduplicate by ID if exists, otherwise by content/timestamp/sender combo
                            const isDuplicate = prev.some(m => 
                                (m.id && newMessage.id && m.id === newMessage.id) || 
                                (m.content === newMessage.content && m.sender === newMessage.sender && m.timestamp === newMessage.timestamp)
                            );
                            if (isDuplicate) return prev;
                            return [...prev, newMessage];
                        });
                    } catch (err) {
                        console.error("Error parsing incoming message:", err);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('❌ STOMP Error:', frame);
                setError("Connection lost. Retrying...");
                setConnected(false);
            },
            onWebSocketError: (event) => {
                console.error('❌ WebSocket Web Error:', event);
                setError("Network error. Please check if backend is running on port 8080.");
            },
            onDisconnect: () => {
                console.log('🔌 Disconnected from WebSocket');
                setConnected(false);
            }
        });

        client.activate();
        stompClient.current = client;

        return () => {
            if (stompClient.current) stompClient.current.deactivate();
        };
    }, []);

    // ✅ SCROLL TO BOTTOM
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim() && connected) {
            const chatMessage = {
                sender: user.fullName || (user.role === ROLES.DOCTOR ? "Doctor" : "Parent"),
                content: messageInput,
                timestamp: new Date().toISOString()
            };
            stompClient.current.publish({
                destination: '/app/send',
                body: JSON.stringify(chatMessage)
            });
            setMessageInput('');
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col bg-slate-50/30 rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
            {/* Header */}
            <div className="bg-white p-6 border-b border-slate-100 flex justify-between items-center z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                            <User className="text-emerald-600" />
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${connected ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900">Enterprise Medical Chat</h2>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            {connected ? 'Fully Encrypted' : 'Connecting...'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"><Phone size={20}/></button>
                    <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"><Video size={20}/></button>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-amber-50 text-amber-700 px-6 py-2 text-xs font-bold flex items-center gap-2 border-b border-amber-100">
                    <AlertCircle size={14} /> {error}
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-50">
                        <Loader2 className="animate-spin mb-2 text-emerald-600" />
                        <span className="text-sm font-bold text-slate-400">Loading History</span>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => {
                            const isMe = msg.sender === user.fullName || msg.sender === (user.role === ROLES.DOCTOR ? "Doctor" : "Parent");
                            return (
                                <motion.div
                                    key={msg.id || idx}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'} flex gap-3`}>
                                        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm ${isMe ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-emerald-600'}`}>
                                            {msg.sender.charAt(0)}
                                        </div>
                                        <div className="space-y-1">
                                            <div className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-sm transition-all hover:shadow-md ${isMe ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                                                {msg.content}
                                            </div>
                                            <div className={`flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <Clock size={10} /> {(() => {
                                                    try {
                                                        const date = new Date(msg.timestamp);
                                                        return isNaN(date.getTime()) ? 'Just now' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                    } catch {
                                                        return 'Just now';
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-100 overflow-hidden relative">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder={connected ? "Type an enterprise message..." : "Waiting for connection..."}
                        disabled={!connected}
                        className="flex-1 bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:border-emerald-500 transition-all text-sm font-medium"
                    />
                    <motion.button
                        whileHover="hover"
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={!messageInput.trim() || !connected}
                        className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg shadow-emerald-500/20 disabled:bg-slate-200 disabled:shadow-none transition-all"
                    >
                        <Send size={20} />
                    </motion.button>
                </form>
            </div>
        </div>
    );
}