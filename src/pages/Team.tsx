import { useState } from 'react';
import { useStore } from '../store';
import { Filter, Search, Plus, Mail, Phone, Calendar, Edit2, Trash2, ChefHat, Truck, GlassWater, MoreVertical, Star, ShieldCheck, User as UserIcon } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';

export function Team() {
    const { users, teams, addUser, updateUser, deleteUser, currentUser } = useStore();
    const { addToast } = useToast();
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'Admin' | 'Manager' | 'Employee'>('Employee');
    const [teamId, setTeamId] = useState('');

    const isAdminOrManager = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';

    const filteredUsers = users.filter(user => {
        const matchesTeam = !selectedTeam || user.teamId === selectedTeam;
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTeam && matchesSearch;
    });

    const handleOpenModal = (user: any = null) => {
        if (user) {
            setEditingUser(user);
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
            setTeamId(user.teamId || '');
        } else {
            setEditingUser(null);
            setName('');
            setEmail('');
            setRole('Employee');
            setTeamId('');
        }
        setIsUserModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userData = {
            id: editingUser?.id || Math.random().toString(36).substring(2, 9),
            name,
            email,
            role,
            teamId: teamId || undefined,
            avatarUrl: editingUser?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        };

        if (editingUser) {
            updateUser(userData);
            addToast('Personnel profile updated', 'success');
        } else {
            addUser(userData);
            addToast('New personnel onboarded', 'success');
        }
        setIsUserModalOpen(false);
    };

    const getTeamIcon = (teamName?: string) => {
        if (!teamName) return <UserIcon size={14} />;
        if (teamName.includes('Kitchen')) return <ChefHat size={14} />;
        if (teamName.includes('Delivery')) return <Truck size={14} />;
        return <GlassWater size={14} />;
    };

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-slide-up">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Personnel <span className="text-indigo-600">Inventory</span></h2>
                    </div>
                    <p className="text-slate-500 font-medium text-lg ml-5">Managing <span className="text-slate-900 font-bold">{users.length}</span> active personnel across <span className="text-slate-900 font-bold">{teams.length}</span> operational departments.</p>
                </div>
                {isAdminOrManager && (
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn btn-accent px-8 py-4 rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all text-xs uppercase tracking-widest font-black"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Onboard Personnel
                    </button>
                )}
            </div>

            {/* Filtering & Intelligence */}
            <div className="flex flex-col xl:flex-row items-center gap-6 animate-slide-up delay-100">
                <div className="relative flex-1 w-full bg-white rounded-[2rem] shadow-premium border border-slate-100 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by identity or credential..."
                        className="w-full bg-transparent border-none focus:ring-0 py-5 pl-16 pr-6 font-bold text-slate-900 placeholder:text-slate-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">⌘ F</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full xl:w-auto">
                    <select
                        className="bg-white border border-slate-100 rounded-[2rem] px-8 py-5 font-black text-xs uppercase tracking-widest text-slate-900 shadow-premium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer min-w-[240px]"
                        value={selectedTeam || ''}
                        onChange={(e) => setSelectedTeam(e.target.value || null)}
                    >
                        <option value="">All Operational Units</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>
                    <button className="w-[60px] h-[60px] flex items-center justify-center bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-premium">
                        <Filter size={20} />
                    </button>
                    <div className="w-px h-8 bg-slate-200 hidden xl:block" />
                    <button className="flex items-center gap-2 px-6 h-[60px] bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
                        <MoreVertical size={18} />
                        View Options
                    </button>
                </div>
            </div>

            {/* Personnel Manifest Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredUsers.map((user, index) => {
                    const team = teams.find(t => t.id === user.teamId);
                    return (
                        <div
                            key={user.id}
                            className="group card p-8 relative overflow-hidden transition-all duration-500 hover:-translate-y-2 animate-slide-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Accent Beam */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-[2rem] blur opacity-0 group-hover:opacity-20 transition-opacity" />
                                        <img
                                            src={user.avatarUrl}
                                            alt={user.name}
                                            className="relative w-24 h-24 rounded-[2rem] object-cover border-2 border-white shadow-xl ring-4 ring-slate-50 group-hover:ring-indigo-50 transition-all"
                                        />
                                        <div
                                            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl border-4 border-white shadow-lg flex items-center justify-center text-white"
                                            style={{ backgroundColor: team?.color || '#cbd5e1' }}
                                        >
                                            {getTeamIcon(team?.name)}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3">
                                        {user.role === 'Admin' ? (
                                            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-xl border border-indigo-100 shadow-sm">
                                                <ShieldCheck size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                                            </div>
                                        ) : user.role === 'Manager' ? (
                                            <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-1.5 rounded-xl border border-amber-100 shadow-sm">
                                                <Star size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 bg-slate-50 text-slate-500 px-4 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                                                <UserIcon size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                                            </div>
                                        )}

                                        {isAdminOrManager && (
                                            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => handleOpenModal(user)}
                                                    className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Terminate personnel access?')) deleteUser(user.id);
                                                    }}
                                                    className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors uppercase">
                                            {user.name}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active System Status</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 py-6 border-y border-slate-50">
                                        <div className="flex items-center gap-3 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                                                <Mail size={14} />
                                            </div>
                                            <span className="text-xs font-bold truncate">{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <Phone size={14} />
                                            </div>
                                            <span className="text-xs font-bold">+1 (555) {Math.floor(Math.random() * 900) + 100}-{Math.floor(Math.random() * 9000) + 1000}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: team?.color }} />
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{team?.name || 'Auxiliary'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                                            <Calendar size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">8 Units Left</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State Manifest */}
            {filteredUsers.length === 0 && (
                <div className="text-center py-24 bg-white/40 backdrop-blur-xl rounded-[3rem] border-4 border-dashed border-slate-100 animate-slide-up">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-100 shadow-inner">
                        <Search size={40} className="text-slate-200" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Identity Mismatch</h3>
                    <p className="text-slate-500 mt-2 font-medium max-w-sm mx-auto">No personnel matching these credentials were found in the current manifest.</p>
                    <button onClick={() => { setSearchQuery(''); setSelectedTeam(null); }} className="mt-8 btn btn-outline px-10 rounded-2xl text-[10px] uppercase font-black tracking-widest">Clear Manifest Filters</button>
                </div>
            )}

            {/* Premium Onboarding Modal */}
            <Modal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                title={editingUser ? "Modify Personnel Identity" : "Onboard New Personnel"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Legal Name</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-300"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. MARCUS AURELIUS"
                                required
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Secure Contact Email</label>
                            <input
                                type="email"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-300"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="marcus@shiftmaster.pro"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">System Clearance</label>
                            <select
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
                                value={role}
                                onChange={(e) => setRole(e.target.value as any)}
                            >
                                <option value="Employee">Employee (L1)</option>
                                <option value="Manager">Manager (L2)</option>
                                <option value="Admin">Admin (L3)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Assigned Deployment Unit</label>
                            <select
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
                                value={teamId}
                                onChange={(e) => setTeamId(e.target.value)}
                            >
                                <option value="">Auxiliary Pool</option>
                                {teams.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-8 flex gap-4">
                        <button
                            type="button"
                            onClick={() => setIsUserModalOpen(false)}
                            className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                        >
                            Abort Onboarding
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
                        >
                            {editingUser ? 'Commit Profile Updates' : 'Authorize Onboarding'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
