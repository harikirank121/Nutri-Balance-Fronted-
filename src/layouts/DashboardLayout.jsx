import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    UtensilsCrossed,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    User,
    Bell,
    Users,
    FilePlus,
    FileText,
    ClipboardList,
    TrendingUp,
    Star,
    MessageSquare,
    BookOpen
} from 'lucide-react';
import { pageTransition } from '../animations/variants';
import { useAuth } from '../context/AuthContext';
import { usePermission } from '../hooks/usePermission';
import { PERMISSIONS } from '../utils/rolePermissions';

const allNavItems = [
    // Doctor items
    { path: '/doctor-dashboard', label: 'Assigned Children', icon: Users, permission: PERMISSIONS.VIEW_ASSIGNED_CHILDREN },
    { path: '/doctor-dashboard/recommendation', label: 'Add Recommendation', icon: FilePlus, permission: PERMISSIONS.ADD_MANUAL_RECOMMENDATION },
    { path: '/doctor-dashboard/reports', label: 'Reports', icon: FileText, permission: PERMISSIONS.DOWNLOAD_HEALTH_REPORT },
    { path: '/doctor-dashboard/chat', label: 'Telehealth Chat', icon: MessageSquare, permission: PERMISSIONS.VIEW_ASSIGNED_CHILDREN },

    // Parent items
    { path: '/parent-dashboard', label: 'My Child', icon: User, permission: PERMISSIONS.MANAGE_CHILD_PROFILE },
    { path: '/parent-dashboard/diet-entry', label: 'Add Daily Intake', icon: UtensilsCrossed, permission: PERMISSIONS.ENTER_DAILY_FOOD_INTAKE },
    { path: '/parent-dashboard/recommendations', label: 'Recommendations', icon: ClipboardList, permission: PERMISSIONS.VIEW_RECOMMENDATIONS },
    { path: '/parent-dashboard/bmi-trends', label: 'BMI Trends', icon: TrendingUp, permission: PERMISSIONS.VIEW_BMI_TRENDS },
    { path: '/parent-dashboard/meal-planner', label: 'Smart Meal Plan', icon: FilePlus, permission: PERMISSIONS.VIEW_RECOMMENDATIONS },
    { path: '/parent-dashboard/chat', label: 'Telehealth Chat', icon: MessageSquare, permission: PERMISSIONS.MANAGE_CHILD_PROFILE },
    { path: '/parent-dashboard/education', label: 'Education Hub', icon: BookOpen, permission: PERMISSIONS.MANAGE_CHILD_PROFILE },

    // Child items
    { path: '/child-dashboard', label: 'My Adventures', icon: Star, permission: PERMISSIONS.VIEW_CHILD_DASHBOARD },
    { path: '/child-dashboard/education', label: 'Fun Learning', icon: BookOpen, permission: PERMISSIONS.VIEW_CHILD_DASHBOARD },
];

export default function DashboardLayout() {
    const { logout, user } = useAuth();
    const { canAccess } = usePermission();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = allNavItems.filter(item => canAccess(item.permission));

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex bg-slate-50 min-h-screen overflow-hidden relative">
            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ 
                    width: isCollapsed ? '80px' : '280px',
                    x: isMobileMenuOpen ? 0 : (window.innerWidth < 1024 ? -280 : 0)
                }}
                className={`fixed lg:relative bg-slate-900 text-slate-300 flex flex-col z-40 shadow-2xl h-screen`}
                transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            >
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
                    <AnimatePresence mode="popLayout">
                        {!isCollapsed && (
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-lg font-bold text-white tracking-tight flex items-center gap-3 whitespace-nowrap"
                            >
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <span className="text-white font-black text-sm">N</span>
                                </div>
                                NutriBalance AI
                            </motion.h2>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex p-2 hover:bg-slate-800 rounded-lg transition-colors ms-auto focus:outline-none"
                    >
                        {isCollapsed ? <ChevronRight className="w-5 h-5 text-emerald-500" /> : <ChevronLeft className="w-5 h-5 text-emerald-500" />}
                    </button>
                    
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors ms-auto focus:outline-none"
                    >
                        <ChevronLeft className="w-5 h-5 text-emerald-500" />
                    </button>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/doctor-dashboard' || item.path === '/parent-dashboard'}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative group
                                ${isActive ? 'text-white' : 'hover:bg-slate-800/50 hover:text-white text-slate-400'}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-emerald-600/10 rounded-xl"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        >
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full" />
                                        </motion.div>
                                    )}
                                    <item.icon className={`w-5 h-5 z-10 transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                    <AnimatePresence mode="popLayout">
                                        {(!isCollapsed || window.innerWidth < 1024) && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="font-medium whitespace-nowrap z-10"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors 
                        ${isCollapsed ? 'lg:justify-center' : ''}`}
                    >
                        <LogOut className="w-5 h-5" />
                        <AnimatePresence mode="popLayout">
                            {(!isCollapsed || window.innerWidth < 1024) && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="font-medium whitespace-nowrap"
                                >
                                    Sign Out
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-20 shadow-sm relative shrink-0">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <LayoutDashboard className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-3 lg:gap-6 ml-auto">
                        <button className="relative p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-3 hover:bg-slate-50 p-1 rounded-full transition-all border border-transparent hover:border-slate-200"
                            >
                                <div className="w-9 h-9 bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 rounded-full flex items-center justify-center font-bold shadow-inner">
                                    {user?.fullName?.split(' ').map(n => n[0]).join('') || "U"}
                                </div>
                                <div className="text-left hidden md:block pr-2">
                                    <p className="text-sm font-bold text-slate-900 leading-tight">{user?.fullName || "User"}</p>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{user?.role || "Guest"}</p>
                                </div>
                            </button>

                            <AnimatePresence>
                                {profileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 origin-top-right overflow-hidden"
                                    >
                                        <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Profile</p>
                                            <p className="text-sm font-bold text-slate-900">{user?.fullName}</p>
                                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                        </div>
                                        <div className="py-2">
                                            <button className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                                                <Settings className="w-4 h-4" /> Account Settings
                                            </button>
                                        </div>
                                        <div className="border-t border-slate-100 py-2 bg-slate-50/30">
                                            <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
                                                <LogOut className="w-4 h-4" /> Sign out completely
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>
                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-slate-50/50 px-4 py-6 lg:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={pageTransition}
                            className="max-w-7xl mx-auto h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
