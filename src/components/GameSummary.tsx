'use client';

import { memo, useMemo } from 'react';
import { useChessStore } from '@/store/chessStore';
import { calculatePlayerStats } from '@/utils/analysis';

const GameSummaryComponent = () => {
    const analysis = useChessStore((state) => state.analysis);
    const isAnalyzing = useChessStore((state) => state.isAnalyzing);
    const movesList = useChessStore((state) => state.movesList);

    const analysisArray = useMemo(() => {
        return Object.keys(analysis).map((key) => analysis[parseInt(key)]);
    }, [analysis]);

    const whiteStats = useMemo(() => calculatePlayerStats(analysisArray, 'w'), [analysisArray]);
    const blackStats = useMemo(() => calculatePlayerStats(analysisArray, 'b'), [analysisArray]);

    if (movesList.length === 0) return null;

    const StatRow = ({ label, count, color }: { label: string; count: number; color: string }) => (
        <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">{label}</span>
            <span className={`font-bold ${color}`}>{count}</span>
        </div>
    );

    const PlayerCard = ({ stats, name, color }: { stats: ReturnType<typeof calculatePlayerStats>; name: string; color: 'w' | 'b' }) => (
        <div className="flex-1 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 w-full justify-between border-b border-slate-700/50 pb-2 mb-1">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-sm ${color === 'w' ? 'bg-white border border-slate-300' : 'bg-slate-900 border border-slate-500'}`}></div>
                    <span className="font-semibold text-sm text-slate-200 truncate">{name}</span>
                </div>
                <span className="text-lg font-bold text-white">
                    {stats.accuracy !== null ? `${stats.accuracy}%` : '—'}
                </span>
            </div>
            <div className="w-full space-y-1">
                <StatRow label="Brilliant" count={stats.brilliant} color="text-cyan-400" />
                <StatRow label="Great" count={stats.great} color="text-cyan-400" />
                <StatRow label="Best" count={stats.best} color="text-green-400" />
                <StatRow label="Excellent" count={stats.excellent} color="text-green-400" />
                <StatRow label="Good" count={stats.good} color="text-blue-400" />
                <div className="border-t border-slate-700/30 my-1 pt-1">
                    <StatRow label="Inaccuracy" count={stats.inaccuracies} color="text-yellow-500" />
                    <StatRow label="Mistake" count={stats.mistakes} color="text-orange-500" />
                    <StatRow label="Blunder" count={stats.blunders} color="text-red-500" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-300 border-b border-slate-700/50 pb-2 mb-1">Game Report</h3>
            {isAnalyzing ? (
                <div className="text-center text-slate-500 text-xs py-8 flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    Calculating stats...
                </div>
            ) : (
                <div className="flex justify-between items-start gap-4">
                    <PlayerCard stats={whiteStats} name="White" color="w" />
                    <PlayerCard stats={blackStats} name="Black" color="b" />
                </div>
            )}
        </div>
    );
};

export default memo(GameSummaryComponent);