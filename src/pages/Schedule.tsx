import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Search, Filter, Download, ChefHat, Truck, GlassWater, Sparkles, MoreHorizontal } from 'lucide-react';
import { useStore } from '../store';
import { format, startOfWeek, addDays, addWeeks, subWeeks, parseISO, isSameDay, set, isToday } from 'date-fns';
import { useToast } from '../components/Toast';
import { DndContext, useDraggable, useDroppable, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';

type ViewMode = 'week' | 'day' | 'month';

function DraggableShift({ shift, team, onDelete }: { shift: any, team: any, onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: shift.id,
        data: { shift }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
    } : undefined;

    const getIcon = () => {
        if (team?.name.includes('Kitchen')) return <ChefHat size={12} />;
        if (team?.name.includes('Delivery')) return <Truck size={12} />;
        return <GlassWater size={12} />;
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`p-3 rounded-2xl mb-2 cursor-grab active:cursor-grabbing transition-all relative group/shift border shadow-sm ${isDragging
                ? 'opacity-80 scale-105 shadow-2xl z-50 ring-2 ring-indigo-500 bg-white border-indigo-200'
                : 'bg-white border-slate-100 hover:shadow-md hover:border-indigo-100 active:scale-95'
                }`}
        >
            <div className="flex items-center justify-between gap-2 mb-2">
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tight`} style={{ backgroundColor: `${team?.color}15`, color: team?.color }}>
                    {getIcon()}
                    {team?.name.split(' ')[0]}
                </div>
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="w-5 h-5 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover/shift:opacity-100"
                >
                    <X size={10} strokeWidth={3} />
                </button>
            </div>

            <div className="space-y-0.5">
                <p className="text-[11px] font-black text-slate-900 leading-none">
                    {format(parseISO(shift.startTime), 'h:mm a')}
                </p>
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: team?.color }} />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        until {format(parseISO(shift.endTime), 'h:mm a')}
                    </p>
                </div>
            </div>

            {isDragging && (
                <div className="absolute inset-0 bg-indigo-600/5 rounded-2xl border-2 border-dashed border-indigo-200" />
            )}
        </div>
    );
}

function DroppableCell({ userId, day, children, isCurrentDay, onClickAdd }: { userId: string, day: Date, children: React.ReactNode, isCurrentDay: boolean, onClickAdd: () => void }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `${userId}-${format(day, 'yyyy-MM-dd')}`,
        data: { userId, date: format(day, 'yyyy-MM-dd') }
    });

    return (
        <div
            ref={setNodeRef}
            className={`p-3 border-r border-slate-200/50 last:border-r-0 min-h-[140px] relative group transition-all duration-300 ${isOver ? 'bg-indigo-50/50 ring-2 ring-indigo-400 ring-inset z-10' :
                isCurrentDay ? 'bg-indigo-50/10' : ''
                }`}
        >
            <div className="relative z-0 h-full">
                {children}
            </div>

            <button
                onClick={onClickAdd}
                className="absolute right-4 bottom-4 w-10 h-10 rounded-2xl bg-white shadow-premium border border-slate-100 flex items-center justify-center text-indigo-600 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all z-20"
            >
                <Plus size={20} strokeWidth={3} />
            </button>
        </div>
    );
}

export function Schedule() {
    const { users, shifts, teams, deleteShift, updateShift, setAddShiftModalOpen } = useStore();
    const { addToast } = useToast();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 }
        })
    );

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const baseFilteredUsers = selectedTeam
        ? users.filter(u => u.teamId === selectedTeam)
        : users.filter(u => u.role === 'Employee');

    const filteredUsers = baseFilteredUsers.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const navigateWeek = (direction: 'prev' | 'next') => {
        setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    };

    const goToToday = () => setCurrentDate(new Date());

    const getShiftsForUserAndDay = (userId: string, day: Date) => {
        return shifts.filter(s => {
            const shiftDate = parseISO(s.startTime);
            return s.userId === userId && isSameDay(shiftDate, day);
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over) {
            const shift = active.data.current?.shift;
            const target = over.data.current;

            if (shift && target) {
                const oldStart = parseISO(shift.startTime);
                const oldEnd = parseISO(shift.endTime);
                const targetDate = parseISO(target.date);

                const newStart = set(targetDate, {
                    hours: oldStart.getHours(),
                    minutes: oldStart.getMinutes(),
                });

                const newEnd = set(targetDate, {
                    hours: oldEnd.getHours(),
                    minutes: oldEnd.getMinutes(),
                });

                updateShift({
                    ...shift,
                    userId: target.userId,
                    startTime: newStart.toISOString(),
                    endTime: newEnd.toISOString()
                });

                addToast('Operational unit rescheduled', 'success');
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Action Bar */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="flex items-center bg-white p-1 rounded-2xl shadow-premium border border-slate-100">
                        <button onClick={() => navigateWeek('prev')} className="p-3 hover:bg-slate-50 text-slate-500 rounded-xl transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={goToToday} className="px-6 py-3 font-black text-xs uppercase tracking-[0.2em] text-slate-900 border-x border-slate-100 hover:bg-slate-50 transition-all">
                            Today
                        </button>
                        <button onClick={() => navigateWeek('next')} className="p-3 hover:bg-slate-50 text-slate-500 rounded-xl transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            {format(weekStart, 'MMMM yyyy')}
                            <span className="text-indigo-600 ml-2">W{format(weekStart, 'w')}</span>
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                            {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                    {/* Search & Filter */}
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-premium border border-slate-100 min-w-[280px]">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find personnel..."
                            className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 w-full placeholder:text-slate-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
                        {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === mode
                                    ? 'bg-white text-indigo-600 shadow-md'
                                    : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={selectedTeam || ''}
                            onChange={(e) => setSelectedTeam(e.target.value || null)}
                            className="bg-white border border-slate-200 rounded-2xl px-4 h-12 text-xs font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer shadow-premium"
                        >
                            <option value="">All Teams</option>
                            {teams.map(team => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                        </select>
                        <button className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-premium">
                            <Filter size={18} />
                        </button>
                        <button
                            onClick={() => setAddShiftModalOpen(true)}
                            className="px-6 h-12 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                        >
                            <Sparkles size={18} />
                            Deploy Unit
                        </button>
                    </div>
                </div>
            </div>

            {/* Schedule Viewport */}
            <div className="card border-slate-200/60 shadow-2xl shadow-slate-200/40 relative overflow-hidden bg-white">
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    {/* Board UI */}
                    <div className="overflow-x-auto scrollbar-premium">
                        <div className="min-w-[1400px]">
                            {/* Board Header */}
                            <div className="grid border-b border-slate-200" style={{ gridTemplateColumns: '320px repeat(7, 1fr)' }}>
                                <div className="p-8 bg-slate-50/50 border-r border-slate-200 sticky left-0 z-30 flex items-center backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-6 bg-indigo-500 rounded-full" />
                                        <span className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Deployment List</span>
                                    </div>
                                </div>
                                {weekDays.map((day, i) => {
                                    const isCurrent = isToday(day);
                                    return (
                                        <div
                                            key={i}
                                            className={`p-6 text-center border-r border-slate-200/50 last:border-r-0 ${isCurrent ? 'bg-indigo-600/5' : 'bg-slate-50/20'}`}
                                        >
                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`}>
                                                {format(day, 'EEE')}
                                            </p>
                                            <div className="flex items-center justify-center gap-2">
                                                {isCurrent && <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />}
                                                <p className={`text-2xl font-black ${isCurrent ? 'text-indigo-600 underline decoration-4 underline-offset-8' : 'text-slate-900'} tracking-tighter`}>
                                                    {format(day, 'd')}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Board Body */}
                            <div className="max-h-[800px] overflow-y-auto">
                                {filteredUsers.map((user) => {
                                    const team = teams.find(t => t.id === user.teamId);
                                    return (
                                        <div
                                            key={user.id}
                                            className="grid border-b border-slate-100 last:border-b-0 hover:bg-slate-50/30 transition-all group"
                                            style={{ gridTemplateColumns: '320px repeat(7, 1fr)' }}
                                        >
                                            {/* Person Identity Card */}
                                            <div className="p-6 border-r border-slate-100 flex items-center justify-between bg-white sticky left-0 z-20 shadow-[10px_0_30px_-15px_rgba(0,0,0,0.05)]">
                                                <div className="flex items-center gap-5">
                                                    <div className="relative shrink-0">
                                                        <img
                                                            src={user.avatarUrl}
                                                            alt={user.name}
                                                            className="w-14 h-14 rounded-2xl object-cover ring-4 ring-slate-50 shadow-sm group-hover:ring-indigo-50 transition-all"
                                                        />
                                                        <div
                                                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg border-4 border-white shadow-sm flex items-center justify-center"
                                                            style={{ backgroundColor: team?.color }}
                                                        >
                                                            {team?.name.includes('Kitchen') ? <ChefHat size={10} className="text-white" /> :
                                                                team?.name.includes('Delivery') ? <Truck size={10} className="text-white" /> :
                                                                    <GlassWater size={10} className="text-white" />}
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight truncate">{user.name}</p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 truncate">{team?.name}</p>
                                                    </div>
                                                </div>
                                                <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>

                                            {/* Content Lanes */}
                                            {weekDays.map((day, dayIndex) => {
                                                const dayShifts = getShiftsForUserAndDay(user.id, day);
                                                const currentDay = isToday(day);

                                                return (
                                                    <DroppableCell
                                                        key={dayIndex}
                                                        userId={user.id}
                                                        day={day}
                                                        isCurrentDay={currentDay}
                                                        onClickAdd={() => setAddShiftModalOpen(true, {
                                                            userId: user.id,
                                                            date: format(day, 'yyyy-MM-dd')
                                                        })}
                                                    >
                                                        {dayShifts.map((shift) => (
                                                            <DraggableShift
                                                                key={shift.id}
                                                                shift={shift}
                                                                team={team}
                                                                onDelete={() => {
                                                                    deleteShift(shift.id);
                                                                    addToast('Deployment unit terminated', 'info');
                                                                }}
                                                            />
                                                        ))}
                                                    </DroppableCell>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </DndContext>
            </div>

            {/* View Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-white rounded-[2.5rem] shadow-premium border border-slate-100 animate-slide-up">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Download size={20} className="text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Manifest Export</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Download current schedule (PDF/XLSX)</p>
                    </div>
                </div>

                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-8">
                        {teams.map(team => (
                            <div key={team.id} className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: team.color }} />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">{team.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="w-px h-8 bg-slate-100" />
                    <button className="btn btn-outline px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                        Sync Cloud
                    </button>
                </div>
            </div>
        </div>
    );
}
