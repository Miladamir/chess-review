// src/app/my-games/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useChessStore } from '@/store/chessStore';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Game {
    url: string;
    pgn: string;
    white: string;
    whiteRating: number;
    black: string;
    blackRating: number;
    time: number;
    timeClass: string;
    timeControl: string;
    result: 'win' | 'loss' | 'draw';
    eco: string;
    opening: string;
    moves: number;
}

type FilterTab = 'all' | 'win' | 'loss' | 'draw';

export default function MyGamesPage() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

    const router = useRouter();
    const { data: session } = useSession();
    const setGameFromPgn = useChessStore((state) => state.setGameFromPgn);

    useEffect(() => {
        fetch('/api/my-games')
            .then(res => res.json())
            .then(data => {
                setGames(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSelectGame = (pgn: string) => {
        setGameFromPgn(pgn, session?.user?.username);
        router.push('/review');
    };

    const filteredGames = useMemo(() => {
        return games
            .filter(game => {
                // Filter by tab
                if (activeFilter !== 'all' && game.result !== activeFilter) return false;

                // Filter by search
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    const isOpponent = game.white.toLowerCase().includes(query) || game.black.toLowerCase().includes(query);
                    const isOpening = game.opening.toLowerCase().includes(query) || game.eco.toLowerCase().includes(query);
                    return isOpponent || isOpening;
                }
                return true;
            });
    }, [games, activeFilter, searchQuery]);

    const getBadgeClass = (result: 'win' | 'loss' | 'draw') => {
        switch (result) {
            case 'win': return 'bg-green-500/15 text-green-400 border-green-500/30';
            case 'loss': return 'bg-red-500/15 text-red-400 border-red-500/30';
            case 'draw': return 'bg-gray-500/15 text-gray-300 border-gray-500/30';
        }
    };

    const formatTimeControl = (tc: string) => {
        if (!tc) return '';
        const parts = tc.split('+');
        const base = Math.round(parseInt(parts[0]) / 60);
        return `${base}+${parts[1] || 0}`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
            <Navbar />

            <main className="flex-1 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">

                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-1">My Games</h1>
                            <p className="text-gray-400">Browse and analyze your chess history</p>
                        </div>
                        <button
                            onClick={() => router.push('/review')}
                            className="btn-primary text-sm py-3 px-6 self-start sm:self-auto flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Import New Game
                        </button>
                    </div>

                    {/* Filters & Search Bar */}
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-4 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="relative flex-1">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by opponent or opening..."
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg py-2 pl-10 pr-4 text-sm text-[var(--fg-primary)] placeholder:text-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-1 bg-[var(--bg-card)] rounded-lg p-1">
                                {(['all', 'win', 'loss', 'draw'] as FilterTab[]).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveFilter(tab)}
                                        className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors capitalize ${activeFilter === tab ? 'bg-[var(--bg-elevated)] text-amber-500 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        {tab}{tab !== 'all' ? 's' : ''}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Games List */}
                    {loading ? (
                        <div className="text-center py-20 text-gray-400">
                            <div className="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            Fetching your games from Chess.com...
                        </div>
                    ) : filteredGames.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">No games found matching your criteria.</div>
                    ) : (
                        <div className="space-y-3">
                            {filteredGames.map((game, idx) => {
                                const isWhite = game.white.toLowerCase() === session?.user?.username?.toLowerCase();
                                const opponent = isWhite ? game.black : game.white;
                                const opponentRating = isWhite ? game.blackRating : game.whiteRating;

                                return (
                                    <div key={idx} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-4 md:p-5 hover:border-[var(--border-accent)] hover:-translate-y-0.5 hover:shadow-xl transition-all grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center">

                                        {/* Player Info */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-lg">
                                                ♞
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm text-white">
                                                    {opponent} <span className="text-gray-500 font-normal">({opponentRating})</span>
                                                </div>
                                                <div className="text-xs text-gray-400 md:hidden">
                                                    {game.moves} moves • {game.timeClass} • {new Date(game.time * 1000).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <span className={`ml-auto md:ml-4 px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${getBadgeClass(game.result)}`}>
                                                {game.result}
                                            </span>
                                        </div>

                                        {/* Opening (Desktop) */}
                                        <div className="hidden md:block">
                                            <div className="text-sm text-gray-300 truncate">{game.opening || 'Unknown Opening'}</div>
                                            <div className="text-xs text-gray-500 font-mono">{game.eco}</div>
                                        </div>

                                        {/* Moves & Time (Desktop) */}
                                        <div className="hidden md:block text-sm text-gray-400">
                                            <div>{game.moves} Moves</div>
                                            <div className="text-xs text-gray-500 capitalize">{game.timeClass} • {formatTimeControl(game.timeControl)}</div>
                                        </div>

                                        {/* Date (Desktop) */}
                                        <div className="hidden md:block text-sm text-gray-500">
                                            {new Date(game.time * 1000).toLocaleDateString()}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 justify-end">
                                            <button
                                                onClick={() => handleSelectGame(game.pgn)}
                                                className="btn-secondary text-xs px-3 py-2"
                                            >
                                                Analyze
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}