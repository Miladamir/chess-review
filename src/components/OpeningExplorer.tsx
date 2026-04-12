'use client';

import { useChessStore } from '@/store/chessStore';
import { useOpeningExplorer } from '@/hooks/useOpeningExplorer';

export default function OpeningExplorer() {
    const fen = useChessStore((state) => state.fen);
    const playMove = useChessStore((state) => state.playMove);
    const { data, loading, error } = useOpeningExplorer(fen);

    const handleMoveClick = (san: string) => {
        playMove(san);
    };

    if (loading) {
        return (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-slate-300">Opening Explorer</h3>
                </div>
                <div className="text-xs text-slate-500 text-center py-4 animate-pulse">
                    Consulting Masters Database...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-slate-300">Opening Explorer</h3>
                </div>
                <div className="text-xs text-red-400 text-center py-4">{error}</div>
            </div>
        );
    }

    if (!data || data.moves.length === 0) {
        return (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-slate-300">Opening Explorer</h3>
                </div>
                <div className="text-xs text-slate-500 text-center py-4">
                    Out of book or no games found.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-slate-300">Opening Explorer</h3>
                {data.opening && (
                    <div className="flex items-center gap-1">
                        <span className="bg-cyan-900/50 text-cyan-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            {data.opening.eco}
                        </span>
                        <span className="text-xs text-slate-400 truncate max-w-[120px]" title={data.opening.name}>
                            {data.opening.name}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1">
                {data.moves.map((move, idx) => {
                    const total = move.white + move.draws + move.black;
                    const whitePct = Math.round((move.white / total) * 100);
                    const drawPct = Math.round((move.draws / total) * 100);
                    const blackPct = Math.round((move.black / total) * 100);

                    return (
                        <button
                            key={idx}
                            onClick={() => handleMoveClick(move.san)}
                            className="flex items-center text-xs group relative py-1 px-1 hover:bg-slate-700/50 rounded transition-colors w-full text-left"
                        >
                            {/* Move Name */}
                            <span className="font-mono font-bold text-slate-200 w-10 z-10 relative group-hover:text-cyan-400 transition-colors">
                                {move.san}
                            </span>

                            {/* Results Bar (Background) */}
                            <div className="flex-1 h-5 flex mx-2 rounded overflow-hidden relative opacity-60 group-hover:opacity-100 transition-opacity">
                                {/* White Win Section */}
                                <div
                                    className="h-full bg-white"
                                    style={{ width: `${whitePct}%` }}
                                />
                                {/* Draw Section */}
                                <div
                                    className="h-full bg-slate-500"
                                    style={{ width: `${drawPct}%` }}
                                />
                                {/* Black Win Section */}
                                <div
                                    className="h-full bg-slate-900 border-l border-slate-600"
                                    style={{ width: `${blackPct}%` }}
                                />
                            </div>

                            {/* Text Overlays for Percentages */}
                            <div className="absolute inset-0 flex pointer-events-none">
                                <div className="w-10" /> {/* Offset for move name */}
                                <div className="flex-1 flex items-center justify-center font-semibold text-slate-900 mix-blend-difference">
                                    {/* Only show text if bar is wide enough, otherwise it gets messy. 
                                        For simplicity, we show percentages on the right side. */}
                                </div>
                            </div>

                            {/* Stats on Right */}
                            <div className="flex gap-1 text-[10px] font-medium w-24 justify-end">
                                <span className="text-white w-6 text-right">{whitePct}%</span>
                                <span className="text-slate-400 w-6 text-right">{drawPct}%</span>
                                <span className="text-slate-200 w-6 text-right">{blackPct}%</span>
                            </div>

                            {/* Total Games Count */}
                            <span className="w-12 text-right text-slate-500 ml-2 font-mono text-[10px]">
                                {total > 1000 ? `${(total / 1000).toFixed(0)}k` : total}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex justify-end gap-3 mt-2 text-[10px] text-slate-500 border-t border-slate-700/50 pt-2">
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-white rounded-sm"></div> White</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-500 rounded-sm"></div> Draw</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-900 border border-slate-600 rounded-sm"></div> Black</div>
            </div>
        </div>
    );
}