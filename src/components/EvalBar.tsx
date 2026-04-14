// src/components/EvalBar.tsx
'use client';

import { useEngineStore } from '@/store/engineStore';
import { useChessStore } from '@/store/chessStore';

export default function EvalBar({ type }: { type: 'vertical' | 'horizontal' | 'score' }) {
    const currentLine = useEngineStore((state) => state.currentLine);
    const { analysis, currentMoveIndex, fen } = useChessStore();

    const getDisplayData = () => {
        // CASE A: Reviewing a played move
        if (currentMoveIndex > 0 && analysis[currentMoveIndex - 1]) {
            const moveAnalysis = analysis[currentMoveIndex - 1];
            // scoreAfter is now ALWAYS from White's perspective
            return { score: moveAnalysis.scoreAfter || 0, mate: moveAnalysis.mate };
        }

        // CASE B: Live engine analysis
        if (currentLine) {
            const isWhiteTurn = fen.split(' ')[1] === 'w';
            let score = currentLine.score;
            let mate = currentLine.mate;

            // Normalize live engine to White's perspective
            if (!isWhiteTurn) {
                score = -score;
                if (mate) mate = -mate;
            }
            return { score, mate };
        }

        // CASE C: Starting position
        return { score: 0, mate: undefined };
    };

    const { score, mate } = getDisplayData();

    // SIGMOID CURVE: This prevents the bar from flying to 0% or 100% instantly.
    // It reacts smoothly to small advantages but requires huge advantages to fill completely.
    const calculatePercentage = () => {
        if (mate) {
            return mate > 0 ? 98 : 2; // Mate limits, leave a tiny sliver so it's not jarring
        }

        // Sigmoid formula: 50 + 50 * (2 / (1 + e^(-0.00368 * score)) - 1)
        // Tuned so that +1 pawn (~60%), +3 pawns (~80%), +5 pawns (~90%)
        const percentage = 50 + 50 * (2 / (1 + Math.exp(-0.00368 * score)) - 1);

        return Math.max(2, Math.min(98, percentage));
    };

    const percentage = calculatePercentage();

    const getScoreText = () => {
        if (mate) return `M${Math.abs(mate)}`;
        const pawns = (Math.abs(score) / 100).toFixed(1);
        return score >= 0 ? `+${pawns}` : `-${pawns}`;
    };

    if (type === 'score') {
        return (
            <div className="text-xs font-mono text-amber-400 bg-gray-800 px-2 py-0.5 rounded">
                {getScoreText()}
            </div>
        );
    }

    if (type === 'horizontal') {
        return (
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden my-1.5">
                <div
                    className="h-full bg-gray-100 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        );
    }

    // Vertical Layout (Desktop)
    return (
        <div className="relative h-full w-full bg-slate-900 rounded-sm overflow-hidden shadow-inner flex flex-col justify-center ring-1 ring-slate-900/50">
            <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out rounded-t-sm"
                style={{ height: `${percentage}%`, background: 'linear-gradient(to top, #e2e8f0, #ffffff)' }}
            >
                {percentage > 50 && (
                    <div className="absolute top-2 left-0 right-0 flex justify-center">
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-800 select-none">
                            {score >= 0 ? getScoreText() : ""}
                        </span>
                    </div>
                )}
            </div>

            {percentage < 50 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center z-10">
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-200 select-none">
                        {score < 0 ? getScoreText() : ""}
                    </span>
                </div>
            )}

            <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-600 opacity-50 z-10"></div>
        </div>
    );
}