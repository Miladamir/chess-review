'use client';

import { useState } from 'react';
import { useChessStore } from '@/store/chessStore';
import { useSession } from 'next-auth/react';
import { useToastStore } from '@/store/toastStore';

export default function ImportUrl() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const setGameFromPgn = useChessStore((state) => state.setGameFromPgn);
    const addToast = useToastStore((state) => state.addToast);

    const handleImport = async () => {
        const gameIdMatch = url.match(/\/game\/(live|computer)\/(\d+)/);

        if (!gameIdMatch) {
            addToast('Invalid URL. Use format: chess.com/game/live/ID', 'error');
            return;
        }

        const gameType = gameIdMatch[1];
        const gameId = gameIdMatch[2];
        setLoading(true);

        try {
            const response = await fetch(`/api/import-chesscom?gameId=${gameId}&type=${gameType}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to fetch');

            const success = setGameFromPgn(data.pgn, session?.user?.username);
            if (!success) throw new Error('Invalid PGN format');

            addToast('Game imported successfully!', 'success');
            setUrl('');
        } catch (err: any) {
            addToast(err.message || 'Import failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <span>🔗</span> Import from Chess.com
            </h3>

            <div className="flex flex-col gap-2">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.chess.com/game/live/..."
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />

                <button
                    onClick={handleImport}
                    disabled={loading}
                    className="w-full mt-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-sm font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            Importing...
                        </>
                    ) : 'Load Game'}
                </button>
            </div>
        </div>
    );
}