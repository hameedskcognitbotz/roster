import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useToast } from '../components/Toast';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, users } = useStore();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const user = users.find(u => u.email === email);
            if (user) {
                login(email);
                addToast(`Welcome back, ${user.name}!`, 'success');
                navigate('/');
            } else {
                addToast('Invalid credentials. Try sarah@example.com', 'error');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20 mb-6 transform rotate-12">
                        <ShieldCheck size={32} className="text-white transform -rotate-12" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">ShiftMaster</h1>
                    <p className="text-slate-400 font-medium">Precision Scheduling for Modern Teams</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Secret Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn btn-accent py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 group transition-all"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Authenticate
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">Demo Credentials</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => setEmail('sarah@example.com')}
                                className="px-3 py-1.5 rounded-lg bg-white/5 text-[10px] font-black text-slate-400 hover:bg-white/10 transition-colors uppercase"
                            >
                                Manager
                            </button>
                            <button
                                onClick={() => setEmail('john@example.com')}
                                className="px-3 py-1.5 rounded-lg bg-white/5 text-[10px] font-black text-slate-400 hover:bg-white/10 transition-colors uppercase"
                            >
                                Employee
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                    &copy; 2026 ShiftMaster Systems Inc. v0.8.4
                </p>
            </div>
        </div>
    );
}
