import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Users, LayoutDashboard, Settings, LogOut, Bell, Clock, ChefHat, GlassWater } from 'lucide-react';
import { useStore } from '../store';
import { AddShiftModal } from '../components/AddShiftModal';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        currentUser, logout, setAddShiftModalOpen,
        notifications, markAsRead, clearNotifications
    } = useStore();

    const navigation = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
        { name: 'Schedule', icon: Calendar, href: '/schedule' },
        { name: 'Team', icon: Users, href: '/team' },
        { name: 'Time Off', icon: Clock, href: '/time-off' },
        { name: 'Settings', icon: Settings, href: '/settings' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900 flex flex-col relative z-20 group">
                {/* Logo Section */}
                <div className="p-8 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-400 to-blue-400 p-0.5 shadow-xl shadow-indigo-500/20">
                        <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                            <Clock className="text-white" size={24} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-2xl text-white tracking-tight">Shift<span className="text-indigo-400 text-3xl italic">M</span></span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] -mt-1">Pro Manager</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <button
                                key={item.name}
                                onClick={() => navigate(item.href)}
                                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 relative group/btn ${isActive
                                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-xl shadow-indigo-600/30 translate-x-1"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? "text-white" : "text-slate-500 group-hover/btn:text-indigo-400 transition-colors"} />
                                {item.name}
                                {isActive && (
                                    <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer User Info */}
                <div className="p-6">
                    <div className="p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                                <img
                                    src={currentUser?.avatarUrl}
                                    alt={currentUser?.name}
                                    className="w-10 h-10 rounded-xl border border-white/20 object-cover"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate leading-tight">{currentUser?.name}</p>
                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{currentUser?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-300 border border-transparent hover:border-red-500/20"
                        >
                            <LogOut size={14} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-grid">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-200/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 -z-10" />

                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 px-10 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">ShiftMaster</span>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            {navigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Quick Team Stats */}
                        <div className="hidden lg:flex items-center gap-4 py-1.5 px-4 bg-slate-50 border border-slate-200/60 rounded-2xl">
                            <div className="flex items-center gap-2">
                                <ChefHat size={16} className="text-indigo-500" />
                                <span className="text-xs font-bold text-slate-600">4 Active</span>
                            </div>
                            <div className="w-px h-4 bg-slate-200" />
                            <div className="flex items-center gap-2">
                                <GlassWater size={16} className="text-blue-500" />
                                <span className="text-xs font-bold text-slate-600">2 Pending</span>
                            </div>
                        </div>

                        <div className="relative group">
                            <button className="w-11 h-11 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-slate-50 transition-all duration-300 relative">
                                <Bell size={20} />
                                {notifications.some(n => !n.isRead) && (
                                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                                )}
                            </button>

                            {/* Notifications Dropdown - Premium Glass */}
                            <div className="absolute right-0 top-full mt-4 w-96 bg-white rounded-[2rem] shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:translate-y-0 translate-y-4 scale-95 group-hover:scale-100">
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <h3 className="font-black text-slate-900 tracking-tight">Activity Feed</h3>
                                    <button
                                        onClick={clearNotifications}
                                        className="text-xs text-indigo-600 hover:text-indigo-700 font-black uppercase tracking-wider"
                                    >
                                        Clear all
                                    </button>
                                </div>
                                <div className="max-h-[28rem] overflow-y-auto p-2">
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                onClick={() => markAsRead(n.id)}
                                                className={`p-4 rounded-2xl mb-1 hover:bg-slate-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-slate-100 ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
                                            >
                                                <div className="flex gap-4">
                                                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!n.isRead ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50' : 'bg-transparent'}`} />
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-semibold text-slate-800 leading-snug">{n.message}</p>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-lg border border-slate-200/60 shadow-sm">
                                                                <Clock size={10} className="text-slate-400" />
                                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                                                                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-12 text-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                                <Bell size={24} className="text-slate-200" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-400">Environment Clear!</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                                    <button className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">See all history</button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setAddShiftModalOpen(true)}
                            className="btn btn-accent px-6"
                        >
                            <Calendar size={18} />
                            Create Shift
                        </button>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto px-10 py-10">
                    <div className="max-w-[1600px] mx-auto animate-fade-in">
                        {children}
                    </div>
                </div>
            </main>
            <AddShiftModal />
        </div>
    );
}
