// src/components/EnginePanel.tsx
'use client';

import { useEffect } from 'react';
import { useEngineStore } from '@/store/engineStore';
import { useChessStore } from '@/store/chessStore';
import { MoveAnalysis } from '@/utils/analysis';
import { getMoveExplanation } from '@/utils/explanation';

export default function EnginePanel() {
    const { fen, currentMoveIndex, movesList, analysis } = useChessStore();
    const { isReady, currentLine, initEngine, analyzeFen } = useEngineStore();

    // Get analysis for the currently viewed move
    const currentAnalysis: MoveAnalysis | undefined =
        currentMoveIndex > 0 ? analysis[currentMoveIndex - 1] : undefined;

    const currentPlayedMove = currentMoveIndex > 0 ? movesList[currentMoveIndex - 1] : "";

    const explanation = currentAnalysis
        ? getMoveExplanation(currentAnalysis, currentPlayedMove)
        : "";

    // Initialize engine once
    useEffect(() => {
        initEngine();
    }, [initEngine]);

    // Trigger analysis when FEN changes (Live mode)
    useEffect(() => {
        // Only run live analysis if we are at the END of the game
        if (isReady && fen && currentMoveIndex === movesList.length) {
            analyzeFen(fen);
        }
    }, [fen, isReady, analyzeFen, currentMoveIndex, movesList.length]);

    const formatScore = (score: number) => {
        const pawns = score / 100;
        const prefix = pawns >= 0 ? '+' : '';
        return `${prefix}${pawns.toFixed(2)}`;
    };

    const getEvalDisplay = () => {
        // Priority: Stored Analysis -> Live Engine -> Empty
        if (currentAnalysis) {
            if (currentAnalysis.mate) return `M${currentAnalysis.mate}`;
            return formatScore(currentAnalysis.scoreAfter || 0);
        }
        if (currentLine) {
            if (currentLine.mate) return `M${currentLine.mate}`;
            return formatScore(currentLine.score);
        }
        return "0.0";
    };

    const getPvLine = () => {
        if (currentAnalysis?.bestMove) {
            return `Best: ${currentAnalysis.bestMove}`;
        }
        if (currentLine?.pv) {
            return currentLine.pv;
        }
        return "—";
    };

    return (
        <div className="space-y-2">
            {/* Primary Engine Line */}
            <div className="engine-line primary">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-sm text-gray-200 truncate">
                        {currentPlayedMove || "Position"} {currentAnalysis?.classification ? `(${currentAnalysis.classification})` : ''}
                    </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-amber-500">{getEvalDisplay()}</span>
                    <span className="text-gray-500">Depth: {currentAnalysis ? '16' : currentLine?.depth || 0}</span>
                </div>
            </div>

            {/* Explanation Text */}
            {currentAnalysis && (
                <div className="text-xs text-gray-400 p-2 bg-[var(--bg-primary)] rounded border border-[var(--border-subtle)]">
                    {explanation}
                </div>
            )}
        </div>
    );
}