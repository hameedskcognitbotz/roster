import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastStore {
    toasts: Toast[];
    addToast: (message: string, type: ToastType) => void;
    removeToast: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (message, type) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 5000);
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function ToastContainer() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
            flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border animate-in slide-in-from-right-full duration-300
            ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                            toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                                'bg-blue-50 border-blue-200 text-blue-800'}
          `}
                >
                    {toast.type === 'success' && <CheckCircle size={20} className="text-emerald-500" />}
                    {toast.type === 'error' && <AlertCircle size={20} className="text-red-500" />}
                    {toast.type === 'info' && <Info size={20} className="text-blue-500" />}

                    <p className="text-sm font-medium">{toast.message}</p>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="p-1 hover:bg-black/5 rounded-lg transition-colors ml-4"
                    >
                        <X size={16} className="opacity-50" />
                    </button>
                </div>
            ))}
        </div>
    );
}
