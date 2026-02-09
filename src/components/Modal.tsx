import { useRef, useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 cursor-default">
            {/* Backdrop with enhanced blur */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                ref={modalRef}
                className="relative bg-white rounded-[2.5rem] shadow-premium-2xl w-full max-w-lg overflow-hidden animate-slide-up border border-white/20 select-none"
            >
                {/* Top Accent Beam */}
                <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-50" />

                <div className="flex items-center justify-between px-10 py-8 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-full transition-all hover:rotate-90"
                    >
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                <div className="px-10 py-10">
                    {children}
                </div>

                {/* Bottom Graphic */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-tl-[100px] pointer-events-none" />
            </div>
        </div>
    );
}
