// src/components/LoadGameModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useChessStore } from '@/store/chessStore';
import { useSession } from 'next-auth/react';
import { useToastStore } from '@/store/toastStore';

interface SavedGame {
    id: string;
    white: string;
    black: string;
    createdAt: string;
}

export default function LoadGameModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [games, setGames] = useState<SavedGame[]>([]);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const setGameFromPgn = useChessStore((state) => state.setGameFromPgn);
    const addToast = useToastStore((state) => state.addToast);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetch('/api/games')
                .then(res => res.json())
                .then(data => {
                    setGames(data);
                    setLoading(false);
                });
        }
    }, [isOpen]);

    const handleLoad = async (id: string) => {
        try {
            const res = await fetch(`/api/games/${id}`);
            if (!res.ok) throw new Error();
            const game = await res.json();

            setGameFromPgn(game.pgn, session?.user?.username);
            useChessStore.setState({ analysis: game.analysis });
            addToast('Game loaded!', 'success');
            onClose();
        } catch (e) {
            addToast('Failed to load game from database', 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md mx-4 flex flex-col overflow-hidden">

                <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-900/50">
                    <h2 className="text-lg font-semibold text-white">Load Game</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-xl transition-colors">×</button>
                </div>

                <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar bg-slate-800">
                    {loading ? (
                        <div className="text-center py-8 text-slate-400">
                            <div className="animate-spin h-6 w-6 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                            Loading...
                        </div>
                    ) : games.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">No saved games found.</div>
                    ) : (
                        <ul className="space-y-2">
                            {games.map((game) => (
                                <li key={game.id}
                                    className="p-3 bg-slate-900 rounded-lg border border-slate-700 hover:border-cyan-500 cursor-pointer flex justify-between items-center transition-all group"
                                    onClick={() => handleLoad(game.id)}
                                >
                                    <div>
                                        <span className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                                            {game.white} vs {game.black}
                                        </span>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {new Date(game.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="text-cyan-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        Load →
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}