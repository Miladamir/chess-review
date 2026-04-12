'use client';

import { useSettingsStore } from '@/store/settingsStore';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { engineDepth, setEngineDepth, showArrows, toggleArrows } = useSettingsStore();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-900/50">
                    <h2 className="text-lg font-semibold text-white">Settings</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-xl transition-colors">×</button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 bg-slate-800">

                    {/* Engine Depth Setting */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-300">Engine Depth</label>
                        <p className="text-xs text-slate-500">Higher depth = stronger analysis but slower speed.</p>
                        <select
                            value={engineDepth}
                            onChange={(e) => setEngineDepth(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value={12}>12 (Fast)</option>
                            <option value={15}>15 (Balanced)</option>
                            <option value={18}>18 (Deep)</option>
                            <option value={20}>20 (Maximum)</option>
                        </select>
                    </div>

                    {/* Arrow Visibility */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-slate-300">Show Best Move Arrows</label>
                            <p className="text-xs text-slate-500">Display arrows for suggested moves.</p>
                        </div>
                        <button
                            onClick={toggleArrows}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showArrows ? 'bg-cyan-600' : 'bg-slate-600'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showArrows ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700 bg-slate-800/50 text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-sm font-semibold text-white transition-colors">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}