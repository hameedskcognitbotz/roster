import { useState } from 'react';
import { useStore } from '../store';
import { User, Shield, Monitor, Save, Cloud, Bell, Globe, Sparkles, Fingerprint, Palette, Lock } from 'lucide-react';
import { useToast } from '../components/Toast';

export function Settings() {
    const { currentUser, updateUserInfo } = useStore();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'system'>('profile');

    // Profile Form State
    const [name, setName] = useState(currentUser?.name || '');
    const [email, setEmail] = useState(currentUser?.email || '');

    const handleSave = () => {
        if (!currentUser) return;

        updateUserInfo({
            ...currentUser,
            name,
            email
        });

        addToast('System configuration synchronized', 'success');
    };

    const tabs = [
        { id: 'profile', label: 'Identity Matrix', icon: User, desc: 'Personnel credentials & bio' },
        { id: 'security', label: 'Security Protocols', icon: Shield, desc: 'Encryption & access control' },
        { id: 'system', label: 'System Interface', icon: Monitor, desc: 'Interface & notification logic' },
    ];

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-slide-up">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">System <span className="text-indigo-600">Preferences</span></h2>
                    </div>
                    <p className="text-slate-500 font-medium text-lg ml-5">Configure your operational environment and security matrix.</p>
                </div>
                <div className="flex items-center gap-3 bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100">
                    <Cloud size={18} className="text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Cloud Sync: Synchronized</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Tabs Sidebar */}
                <div className="w-full lg:w-80 space-y-3 animate-slide-up delay-100">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            //@ts-ignore
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full group text-left px-6 py-5 rounded-[2rem] transition-all duration-300 relative overflow-hidden ${activeTab === tab.id
                                ? 'bg-white shadow-premium border border-slate-100 text-indigo-600'
                                : 'text-slate-400 hover:bg-slate-50 border border-transparent'
                                }`}
                        >
                            {activeTab === tab.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-2 bg-indigo-600" />
                            )}
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 rotate-6' : 'bg-slate-50 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                                    <tab.icon size={22} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest">{tab.label}</p>
                                    <p className={`text-[10px] font-bold mt-0.5 ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-400'}`}>{tab.desc}</p>
                                </div>
                            </div>
                        </button>
                    ))}

                    <div className="pt-8 px-6">
                        <div className="p-6 bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[2rem] text-white overflow-hidden relative group">
                            <Sparkles className="absolute -right-2 -top-2 text-white/10 group-hover:rotate-12 transition-transform" size={80} />
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">System Version</p>
                            <p className="text-xl font-black">v4.0.2-pro</p>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">Enterprise License</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 animate-slide-up delay-200">
                    <div className="card p-10 relative overflow-hidden bg-white">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-bl-full pointer-events-none" />

                        <div className="relative z-10">
                            {activeTab === 'profile' && (
                                <div className="space-y-10 animate-fade-in">
                                    <div className="flex items-center gap-8 pb-10 border-b border-slate-100">
                                        <div className="relative group/avatar">
                                            <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-[2.5rem] blur opacity-0 group-hover/avatar:opacity-20 transition-opacity" />
                                            <img
                                                src={currentUser?.avatarUrl}
                                                className="relative w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white shadow-2xl ring-4 ring-slate-50 group-hover/avatar:ring-indigo-50 transition-all"
                                                alt=""
                                            />
                                            <button className="absolute -bottom-3 -right-3 w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all">
                                                <Palette size={20} />
                                            </button>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Personnel Metadata</h3>
                                            <p className="text-slate-400 font-medium">Update your digital identity within the ShiftMaster grid.</p>
                                            <div className="mt-4 flex gap-2">
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-lg border border-indigo-100 uppercase tracking-widest leading-none flex items-center">Verified Provider</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Personnel Full Name</label>
                                            <div className="relative">
                                                <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                                                <input
                                                    type="text"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Communication Channel</label>
                                            <div className="relative">
                                                <Globe size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                                                <input
                                                    type="email"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Secure Contact #</label>
                                            <input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner" placeholder="+1 (555) 000-0000" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Personnel Bio / Designation</label>
                                            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner" placeholder="E.g. Senior Logistics Coordinator" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-10 animate-fade-in">
                                    <div className="pb-8 border-b border-slate-100">
                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Access Control</h3>
                                        <p className="text-slate-400 font-medium">Rotate encryption keys and manage biometric safeguards.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Encryption Key (Current)</label>
                                                <input type="password" placeholder="••••••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner" />
                                            </div>
                                            <div />
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">New Hash Sequence</label>
                                                <input type="password" placeholder="Min 12 complex chars" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Confirm Hash Sequence</label>
                                                <input type="password" placeholder="••••••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner" />
                                            </div>
                                        </div>

                                        <div className="pt-10 border-t border-slate-50">
                                            <div className="flex items-center justify-between p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group">
                                                <Fingerprint className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-110 transition-transform" size={140} />
                                                <div className="flex items-center gap-6 relative z-10">
                                                    <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/10">
                                                        <Fingerprint size={28} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xl font-black uppercase tracking-tight">Biometric Validation</p>
                                                        <p className="text-slate-400 text-xs font-medium">Multi-factor biometric handshake required for access.</p>
                                                    </div>
                                                </div>
                                                <button className="relative z-10 px-8 py-3 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl active:scale-95">ACTIVATE</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'system' && (
                                <div className="space-y-10 animate-fade-in">
                                    <div className="pb-8 border-b border-slate-100">
                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Logic & Visuals</h3>
                                        <p className="text-slate-400 font-medium">Adjust the neural interface and notification dispatchers.</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                            {[
                                                { label: 'Cloud Shift Dispatch', icon: Bell },
                                                { label: 'Heads-up Display HUD', icon: Monitor },
                                                { label: 'Weekly Protocol Digest', icon: Save },
                                                { label: 'System Telemetry', icon: Globe }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                                            <item.icon size={16} />
                                                        </div>
                                                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">{item.label}</span>
                                                    </div>
                                                    <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${i < 2 ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-slate-200'}`}>
                                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${i < 2 ? 'right-1' : 'left-1'}`} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-10 border-t border-slate-50">
                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Interface Aesthetic</h3>
                                            <div className="grid grid-cols-3 gap-6">
                                                <div className="group cursor-pointer">
                                                    <div className="aspect-[4/3] bg-white rounded-2xl border-2 border-indigo-600 flex flex-col p-4 gap-2 shadow-xl ring-4 ring-indigo-50">
                                                        <div className="w-full h-3 bg-slate-100 rounded-full" />
                                                        <div className="w-1/2 h-2 bg-slate-50 rounded-full" />
                                                        <div className="mt-auto flex gap-2">
                                                            <div className="w-6 h-6 bg-slate-100 rounded-lg" />
                                                            <div className="w-6 h-6 bg-indigo-100 rounded-lg" />
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] text-center font-black text-indigo-600 uppercase tracking-widest mt-3">High Contrast Path</p>
                                                </div>
                                                <div className="group cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
                                                    <div className="aspect-[4/3] bg-slate-900 rounded-2xl border-2 border-transparent flex flex-col p-4 gap-2 shadow-xl hover:border-slate-300">
                                                        <div className="w-full h-3 bg-white/10 rounded-full" />
                                                        <div className="w-1/3 h-2 bg-white/5 rounded-full" />
                                                        <div className="mt-auto flex gap-2">
                                                            <div className="w-6 h-6 bg-white/10 rounded-lg" />
                                                            <div className="w-6 h-6 bg-white/20 rounded-lg" />
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] text-center font-black text-slate-400 uppercase tracking-widest mt-3">Void Protocol</p>
                                                </div>
                                                <div className="group cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
                                                    <div className="aspect-[4/3] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center hover:border-indigo-400 hover:bg-white transition-all">
                                                        <Lock size={20} className="text-slate-300" />
                                                    </div>
                                                    <p className="text-[10px] text-center font-black text-slate-300 uppercase tracking-widest mt-3">Adaptive HUD</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-12 pt-10 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3 text-slate-400 italic">
                                    <Shield size={16} />
                                    <span className="text-[10px] font-medium tracking-wide">Last integrity check: {new Date().toLocaleTimeString()}</span>
                                </div>
                                <div className="flex gap-4">
                                    <button className="px-8 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Reset Matrix</button>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-all"
                                    >
                                        <Save size={18} />
                                        Commit Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
