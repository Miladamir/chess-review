// src/hooks/useChessGame.ts
'use client';

import { useState, useCallback } from 'react';
import { Chess, Move } from 'chess.js';

export interface UseChessGameReturn {
    game: Chess;
    fen: string;
    history: string[];
    turn: 'w' | 'b';
    makeMove: (from: string, to: string, promotion?: string) => boolean;
    reset: () => void;
    undo: () => void;
}

export function useChessGame(initialFen?: string): UseChessGameReturn {
    // Initialize game state
    const [game, setGame] = useState<Chess>(new Chess(initialFen));

    // Memoized function to handle moves
    const makeMove = useCallback((from: string, to: string, promotion: string = 'q'): boolean => {
        try {
            // Attempt to make the move
            const move: Move | null = game.move({ from, to, promotion });

            if (move === null) {
                return false; // Illegal move
            }

            // Update state by creating a new instance (immutability)
            setGame(new Chess(game.fen()));
            return true;
        } catch (error) {
            // Handle errors gracefully
            console.error('Invalid move:', error);
            return false;
        }
    }, [game]);

    const reset = useCallback(() => {
        setGame(new Chess());
    }, []);

    const undo = useCallback(() => {
        game.undo();
        setGame(new Chess(game.fen()));
    }, [game]);

    return {
        game,
        fen: game.fen(),
        history: game.history(),
        turn: game.turn(),
        makeMove,
        reset,
        undo,
    };
}