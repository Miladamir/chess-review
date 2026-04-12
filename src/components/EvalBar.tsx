// src/components/EvalBar.tsx
'use client';

import { useEngineStore } from '@/store/engineStore';
import { useChessStore } from '@/store/chessStore';

export default function EvalBar({ type }: { type: 'vertical' | 'horizontal' | 'score' }) {
    const currentLine = useEngineStore((state) => state.currentLine);
    const { analysis, currentMoveIndex } = useChessStore();

    const getDisplayData = () => {
        if (currentMoveIndex > 0 && analysis[currentMoveIndex - 1]) {
            const moveAnalysis = analysis[currentMoveIndex - 1];
            const isWhiteMove = currentMoveIndex % 2 === 1;
            let score = moveAnalysis.scoreAfter || 0;
            let mate = moveAnalysis.mate;

            if (!isWhiteMove) {
                score = -score;
                if (mate) mate = -mate;
            }
            return { score, mate };
        }

        if (currentLine) {
            return { score: currentLine.score, mate: currentLine.mate };
        }

        return { score: 0, mate: undefined };
    };

    const { score, mate } = getDisplayData();

    const calculatePercentage = () => {
        if (mate) return mate > 0 ? 100 : 0;
        const normalizedScore = score / 10;
        let percentage = 50 + (normalizedScore * 5);
        return Math.max(5, Math.min(95, percentage));
    };

    const percentage = calculatePercentage();

    const getScoreText = () => {
        if (mate) return `M${mate}`;
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
                    className="h-full bg-gray-100 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        );
    }

    // Vertical Layout
    return (
        <div className="relative h-full w-full bg-slate-900 rounded-sm overflow-hidden shadow-inner flex flex-col justify-center ring-1 ring-slate-900/50">
            <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-300 ease-in-out rounded-t-sm"
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