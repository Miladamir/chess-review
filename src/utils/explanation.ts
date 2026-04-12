// src/utils/explanation.ts
import { MoveAnalysis } from '@/store/chessStore';

export function getMoveExplanation(analysis: MoveAnalysis, playedMove: string): string {
    if (!analysis) return "";

    const { classification, bestMove, scoreBefore, scoreAfter, mate } = analysis;

    // Helper to format score difference
    const formatScore = (cp: number) => {
        if (cp === 0) return "0.0";
        const pawns = (Math.abs(cp) / 100).toFixed(1);
        return cp > 0 ? `+${pawns}` : `-${pawns}`;
    };

    // 1. Check for Mate
    if (mate) {
        if (classification === 'best') {
            return `Forces mate in ${Math.abs(mate)}!`;
        } else {
            return `Missed mate in ${Math.abs(mate)}.`;
        }
    }

    // 2. Construct text based on Classification
    switch (classification) {
        case 'best':
            return "Best move! This is the strongest continuation.";

        case 'good':
            return "A solid move. No significant advantage was lost.";

        case 'book':
            return "Book move. This is a well-known opening theory.";

        case 'inaccuracy':
            return `Inaccuracy. This move loses a small advantage. Better was ${bestMove}.`;

        case 'mistake':
            return `Mistake. This move creates problems. Better was ${bestMove}.`;

        case 'blunder':
            const evalLoss = (scoreBefore || 0) - (scoreAfter || 0);
            // If eval loss is huge, mention it
            if (evalLoss > 300) {
                return `Blunder. This loses significant material. Better was ${bestMove}.`;
            }
            return `Blunder. This turns a winning position into a losing one. Better was ${bestMove}.`;

        default:
            return "";
    }
}