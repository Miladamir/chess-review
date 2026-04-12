'use client';

import { useState } from 'react';
import { useChessStore } from '@/store/chessStore';
import { useSession } from 'next-auth/react';

interface ImportPgnModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ImportPgnModal({ isOpen, onClose }: ImportPgnModalProps) {
    const [pgn, setPgn] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();
    const setGameFromPgn = useChessStore((state) => state.setGameFromPgn);

    const handleImport = () => {
        if (!pgn.trim()) {
            setError("PGN cannot be empty.");
            return;
        }

        const success = setGameFromPgn(pgn, session?.user?.username);

        if (success) {
            setPgn('');
            setError(null);
            onClose();
        } else {
            setError("Invalid PGN format. Please check your input.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-900/50">
                    <h2 className="text-lg font-semibold text-white">Import PGN</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-xl transition-colors">×</button>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 bg-slate-800">
                    <textarea
                        value={pgn}
                        onChange={(e) => setPgn(e.target.value)}
                        placeholder="Paste PGN here..."
                        className="w-full h-64 bg-slate-900 border border-slate-700 rounded-md p-3 text-sm text-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none placeholder-slate-500"
                    />
                    {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-4 border-t border-slate-700 bg-slate-800/50">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-sm text-slate-300 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleImport} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-sm font-semibold text-white transition-colors">
                        Import Game
                    </button>
                </div>
            </div>
        </div>
    );
}