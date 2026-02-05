import { useState } from 'react';
import { useStore } from '../store';
import { format, parseISO } from 'date-fns';
import { Clock, CheckCircle, XCircle, AlertCircle, Plus, Calendar as CalendarIcon, ArrowRight, ShieldCheck } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';

export function TimeOff() {
    const { currentUser, users, timeOffRequests, addTimeOffRequest, updateTimeOffStatus } = useStore();
    const { addToast } = useToast();
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    // Form state
    const [type, setType] = useState<'Vacation' | 'Sick' | 'Personal' | 'Other'>('Vacation');
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        const newRequest = {
            id: Math.random().toString(36).substring(2, 9),
            userId: currentUser.id,
            startDate,
            endDate,
            type,
            status: 'Pending' as const,
            reason,
        };

        addTimeOffRequest(newRequest);
        addToast('Manifest request transmitted successfully!', 'success');
        setIsRequestModalOpen(false);
        setReason('');
    };

    const isAdminOrManager = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Approved': return <CheckCircle size={14} />;
            case 'Rejected': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Approved': return "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-500/10";
            case 'Rejected': return "bg-rose-50 text-rose-700 border-rose-100 shadow-rose-500/10";
            default: return "bg-amber-50 text-amber-700 border-amber-100 shadow-amber-500/10";
        }
    };

    const filteredRequests = isAdminOrManager
        ? timeOffRequests
        : timeOffRequests.filter(r => r.userId === currentUser?.id);

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-slide-up">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Time Off <span className="text-indigo-600">Protocol</span></h2>
                    </div>
                    <p className="text-slate-500 font-medium text-lg ml-5">Managing leave requests and operational availability.</p>
                </div>
                {!isAdminOrManager && (
                    <button
                        onClick={() => setIsRequestModalOpen(true)}
                        className="btn btn-accent px-8 py-4 rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all text-xs uppercase tracking-widest font-black"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Request Absence
                    </button>
                )}
            </div>

            {/* Requests Manifest */}
            <div className="card border-slate-200/60 shadow-2xl shadow-slate-200/30 overflow-hidden bg-white animate-slide-up delay-100">
                <div className="overflow-x-auto scrollbar-premium">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Personnel</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Absence Type</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Interval</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Protocol Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredRequests.map((request) => {
                                const user = users.find(u => u.id === request.userId);
                                return (
                                    <tr key={request.id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img src={user?.avatarUrl} className="w-12 h-12 rounded-xl object-cover ring-4 ring-white shadow-sm" alt="" />
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{user?.name}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user?.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-indigo-400" />
                                                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{request.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-900">{format(parseISO(request.startDate), 'MMM d, yyyy')}</p>
                                                </div>
                                                <ArrowRight size={14} className="text-slate-300" />
                                                <div className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-900">{format(parseISO(request.endDate), 'MMM d, yyyy')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusStyles(request.status)}`}>
                                                {getStatusIcon(request.status)}
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {isAdminOrManager && request.status === 'Pending' ? (
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                    <button
                                                        onClick={() => {
                                                            updateTimeOffStatus(request.id, 'Approved');
                                                            addToast('Operational clearance granted', 'success');
                                                        }}
                                                        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-emerald-500 hover:bg-emerald-50 hover:border-emerald-100 transition-all shadow-sm"
                                                        title="Approve Protocol"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            updateTimeOffStatus(request.id, 'Rejected');
                                                            addToast('Operational clearance denied', 'error');
                                                        }}
                                                        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm"
                                                        title="Reject Protocol"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            ) : request.reason ? (
                                                <div className="flex justify-end items-center gap-2 text-slate-400 group-hover:text-indigo-600 transition-colors">
                                                    <p className="text-[10px] font-black uppercase tracking-widest italic truncate max-w-[140px] opacity-0 group-hover:opacity-100 transition-opacity">"{request.reason}"</p>
                                                    <AlertCircle size={18} className="shrink-0" />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 ml-auto bg-slate-50 rounded-xl flex items-center justify-center text-slate-200">
                                                    <ShieldCheck size={18} />
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                                            <CalendarIcon size={32} className="text-slate-200" />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">No Manifest Entries Found</h3>
                                        <p className="text-slate-400 mt-2 font-medium max-w-sm mx-auto">All systems are operational with full personnel availability.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Request Modal */}
            <Modal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                title="Protocol Exit Request"
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Absence Classification</label>
                            <div className="grid grid-cols-2 gap-3">
                                {(['Vacation', 'Sick', 'Personal', 'Other'] as const).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setType(t)}
                                        className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${type === t
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-white hover:border-indigo-200 hover:text-indigo-600'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Initiation Interval</label>
                                <div className="relative">
                                    <CalendarIcon size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min={format(new Date(), 'yyyy-MM-dd')}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Termination Interval</label>
                                <div className="relative">
                                    <CalendarIcon size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Absence Rationale</label>
                            <textarea
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all min-h-[120px] placeholder:text-slate-300"
                                placeholder="Explain the necessity of this operational exit..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={() => setIsRequestModalOpen(false)}
                            className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                        >
                            Abort Protocol
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
                        >
                            Transmit Request
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
