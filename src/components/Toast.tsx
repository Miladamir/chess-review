'use client';

import { useToastStore } from '@/store/toastStore';

export default function Toast() {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    onClick={() => removeToast(toast.id)}
                    className={`pointer-events-auto w-full flex items-center justify-between p-4 rounded-lg shadow-lg cursor-pointer transition-all transform animate-slide-in border backdrop-blur-sm ${toast.type === 'error'
                            ? 'bg-red-900/80 border-red-500 text-red-100'
                            : toast.type === 'success'
                                ? 'bg-green-900/80 border-green-500 text-green-100'
                                : 'bg-slate-800/80 border-slate-600 text-slate-200'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        {toast.type === 'error' && <span className="text-red-400">⚠️</span>}
                        {toast.type === 'success' && <span className="text-green-400">✓</span>}
                        {toast.type === 'info' && <span className="text-blue-400">ℹ</span>}
                        <p className="text-sm font-medium">{toast.message}</p>
                    </div>
                    <button className="text-xs opacity-50 hover:opacity-100 ml-4">✕</button>
                </div>
            ))}
        </div>
    );
}