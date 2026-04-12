// src/utils/analysis.ts

// Updated Type definitions to include new categories
export type Classification = 'brilliant' | 'great' | 'best' | 'excellent' | 'good' | 'book' | 'miss' | 'inaccuracy' | 'mistake' | 'blunder' | null;

export interface MoveAnalysis {
    classification: Classification;
    scoreBefore?: number;
    scoreAfter?: number;
    bestMove?: string;
    mate?: number;
    materialDiff?: number; // Used for Brilliant detection
}

export interface PlayerStats {
    accuracy: number | null;
    brilliant: number;
    great: number;
    best: number;
    excellent: number;
    good: number;
    inaccuracies: number;
    mistakes: number;
    blunders: number;
    bookMoves: number;
    miss: number;
    totalMoves: number;
}

// Accuracy formula (Approximation)
export function calculatePlayerStats(moves: MoveAnalysis[], player: 'w' | 'b'): PlayerStats {
    const stats: PlayerStats = {
        accuracy: null,
        brilliant: 0,
        great: 0,
        best: 0,
        excellent: 0,
        good: 0,
        inaccuracies: 0,
        mistakes: 0,
        blunders: 0,
        bookMoves: 0,
        miss: 0,
        totalMoves: 0,
    };

    let totalCPL = 0;
    let moveCount = 0;

    moves.forEach((move, index) => {
        const isWhiteMove = index % 2 === 0;
        if ((player === 'w' && isWhiteMove) || (player === 'b' && !isWhiteMove)) {
            stats.totalMoves++;

            // Count new classifications
            if (move.classification === 'brilliant') stats.brilliant++;
            else if (move.classification === 'great') stats.great++;
            else if (move.classification === 'best') stats.best++;
            else if (move.classification === 'excellent') stats.excellent++;
            else if (move.classification === 'good') stats.good++;
            else if (move.classification === 'miss') stats.miss++;
            else if (move.classification === 'inaccuracy') stats.inaccuracies++;
            else if (move.classification === 'mistake') stats.mistakes++;
            else if (move.classification === 'blunder') stats.blunders++;
            else if (move.classification === 'book') stats.bookMoves++;

            // CPL Calculation
            const cpl = (move.scoreBefore || 0) - (move.scoreAfter || 0);
            if (cpl > 0) totalCPL += cpl;
            moveCount++;
        }
    });

    if (moveCount > 0) {
        const acpl = totalCPL / moveCount;
        const accuracy = 103.1668 * Math.exp(-0.04381 * acpl) - 3.1669;
        stats.accuracy = Math.max(0, Math.min(100, Math.round(accuracy)));
    }

    return stats;
}