import { useNavigate } from 'react-router-dom';
import { Calendar, Users, TrendingUp, ArrowUpRight, CheckCircle, ChefHat, GlassWater, Truck, Timer } from 'lucide-react';
import { useStore } from '../store';
import { format, startOfWeek, addDays, isToday, parseISO } from 'date-fns';

export function Dashboard() {
    const navigate = useNavigate();
    const { users, shifts, teams, timeOffRequests, currentUser } = useStore();
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });

    const todayShifts = shifts.filter(s => {
        const shiftDate = parseISO(s.startTime);
        return isToday(shiftDate);
    });

    const pendingRequests = timeOffRequests.filter(r => r.status === 'Pending');

    const stats = [
        {
            label: 'Total Personnel',
            value: users.length,
            icon: Users,
            change: '+2 this month',
            trend: 'up',
            color: 'indigo',
            gradient: 'from-indigo-500 to-blue-500',
            iconColor: 'text-indigo-600',
            bgLight: 'bg-indigo-50'
        },
        {
            label: 'Active Shifts',
            value: shifts.length,
            icon: Calendar,
            change: '12% increase',
            trend: 'up',
            color: 'blue',
            gradient: 'from-blue-500 to-cyan-500',
            iconColor: 'text-blue-600',
            bgLight: 'bg-blue-50'
        },
        {
            label: 'Pending Approval',
            value: pendingRequests.length,
            icon: Timer,
            change: 'Action required',
            trend: 'neutral',
            color: 'amber',
            gradient: 'from-amber-500 to-orange-500',
            iconColor: 'text-amber-600',
            bgLight: 'bg-amber-50'
        },
        {
            label: 'Team Efficiency',
            value: '98.2%',
            icon: TrendingUp,
            change: '+4.1% today',
            trend: 'up',
            color: 'emerald',
            gradient: 'from-emerald-500 to-teal-500',
            iconColor: 'text-emerald-600',
            bgLight: 'bg-emerald-50'
        },
    ];

    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
        <div className="space-y-10">
            {/* Hero Welcome Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="animate-fade-in animate-slide-up">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                            Status Report: <span className="text-indigo-600">{currentUser?.name.split(' ')[0]}</span>
                        </h2>
                    </div>
                    <p className="text-slate-500 font-medium text-lg ml-5">
                        Operational overview for <span className="text-slate-900 font-bold">{format(today, 'MMMM do')}</span>. All systems optimized.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] shadow-premium border border-slate-100 animate-slide-in-right">
                    <div className="flex flex-col items-end px-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{format(today, 'EEEE')}</p>
                        <p className="text-xl font-black text-slate-900">{format(today, 'MMM d, yyyy')}</p>
                    </div>
                    <div className="w-14 h-14 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                        <Calendar size={28} />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={stat.label}
                        className="group card p-8 relative overflow-hidden animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-full`} />

                        <div className="relative z-10">
                            <div className={`w-14 h-14 rounded-2xl ${stat.bgLight} flex items-center justify-center mb-6 border border-white group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                <stat.icon size={28} className={stat.iconColor} />
                            </div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h4>
                                <div className={`flex items-center gap-0.5 text-[10px] font-black uppercase tracking-tighter ${stat.trend === 'up' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {stat.trend === 'up' && <ArrowUpRight size={12} />}
                                    {stat.change}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Today's Operations */}
                <div className="lg:col-span-8 card overflow-hidden flex flex-col animate-slide-up delay-200">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-premium border border-slate-100">
                                <Timer className="text-indigo-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Today's Operations</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{todayShifts.length} personnel scheduled</p>
                            </div>
                        </div>
                        <button onClick={() => navigate('/schedule')} className="btn btn-outline text-xs px-6 rounded-2xl">
                            Live View
                        </button>
                    </div>

                    <div className="p-8">
                        {todayShifts.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                <Calendar size={48} className="mx-auto mb-4 text-slate-300" />
                                <h4 className="text-lg font-bold text-slate-900">Quiet Day Ahead</h4>
                                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">No active shifts detected for today. Take this time for administrative tasks.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {todayShifts.map((shift) => {
                                    const user = users.find(u => u.id === shift.userId);
                                    const team = teams.find(t => t.id === user?.teamId);
                                    return (
                                        <div
                                            key={shift.id}
                                            className="group flex items-center gap-5 p-5 rounded-[2rem] bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-premium transition-all duration-300"
                                        >
                                            <div className="relative">
                                                <img
                                                    src={user?.avatarUrl}
                                                    alt={user?.name}
                                                    className="w-14 h-14 rounded-2xl object-cover ring-4 ring-slate-50 border border-slate-200 group-hover:ring-indigo-50"
                                                />
                                                <div
                                                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg border-2 border-white shadow-sm flex items-center justify-center"
                                                    style={{ backgroundColor: team?.color }}
                                                >
                                                    {team?.name.includes('Kitchen') ? <ChefHat size={10} className="text-white" /> :
                                                        team?.name.includes('Delivery') ? <Truck size={10} className="text-white" /> :
                                                            <GlassWater size={10} className="text-white" />}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-slate-900 leading-none mb-1 truncate">{user?.name}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{team?.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                                                        {format(parseISO(shift.startTime), 'h:mm a')}
                                                    </span>
                                                    <span className="text-slate-300">→</span>
                                                    <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg">
                                                        {format(parseISO(shift.endTime), 'h:mm a')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Side Panels */}
                <div className="lg:col-span-4 space-y-8 animate-slide-up delay-300">
                    {/* Pending Actions */}
                    <div className="card p-8 bg-slate-900 border-none shadow-2xl shadow-indigo-900/10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-white tracking-tight">Pending Actions</h3>
                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                                <ArrowUpRight size={16} className="text-indigo-400" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {pendingRequests.length > 0 ? (
                                pendingRequests.slice(0, 3).map((request) => {
                                    const user = users.find(u => u.id === request.userId);
                                    return (
                                        <div key={request.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all group cursor-pointer" onClick={() => navigate('/time-off')}>
                                            <img src={user?.avatarUrl} alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/10" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-white leading-tight">{user?.name}</p>
                                                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{request.type} • {format(parseISO(request.startDate), 'MMM d')}</p>
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 px-4 bg-white/5 rounded-[2rem] border border-white/5 border-dashed">
                                    <CheckCircle size={32} className="mx-auto text-emerald-400/50 mb-3" />
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Workflow Verified</p>
                                </div>
                            )}
                        </div>

                        <button onClick={() => navigate('/time-off')} className="w-full mt-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all">
                            Review All Documents
                        </button>
                    </div>

                    {/* Department Performance */}
                    <div className="card p-8">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6">Department Metrics</h3>
                        <div className="space-y-6">
                            {teams.map((team, idx) => {
                                const percentage = [85, 92, 78, 95][idx % 4];
                                return (
                                    <div key={team.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: team.color }} />
                                                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{team.name}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{percentage}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${percentage}%`, backgroundColor: team.color }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Timeline Preview */}
            <div className="card p-10 animate-slide-up delay-400">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Operations Blueprint</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Weekly capacity projection & timeline</p>
                    </div>
                    <button onClick={() => navigate('/schedule')} className="btn btn-primary px-8 rounded-2xl text-xs">Full Schedule</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {weekDays.map((day, i) => {
                        const dayShifts = shifts.filter(s => format(parseISO(s.startTime), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
                        const isActive = isToday(day);

                        return (
                            <div
                                key={i}
                                className={`p-6 rounded-[2.5rem] text-center transition-all duration-500 cursor-pointer group border-2 ${isActive
                                    ? 'bg-gradient-to-br from-indigo-600 to-blue-700 border-indigo-500 shadow-2xl shadow-indigo-600/30 -translate-y-2'
                                    : 'bg-white border-slate-50 hover:border-indigo-100 hover:shadow-premium'
                                    }`}
                            >
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${isActive ? 'text-white/60' : 'text-slate-400'}`}>
                                    {format(day, 'EEE')}
                                </p>
                                <p className={`text-4xl font-black ${isActive ? 'text-white' : 'text-slate-900'} tracking-tighter mb-4`}>
                                    {format(day, 'd')}
                                </p>
                                <div className={`py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block ${isActive ? 'bg-white/20 text-white' : 'bg-slate-50 text-indigo-600 group-hover:bg-indigo-50'}`}>
                                    {dayShifts.length} Units
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
