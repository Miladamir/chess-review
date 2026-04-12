// src/components/ChessBoard.tsx
'use client';

import { memo, useEffect, useState, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { useChessStore } from '@/store/chessStore';
import { useSettingsStore } from '@/store/settingsStore';

const ChessBoardComponent = () => {
    const fen = useChessStore((state) => state.fen);
    const turn = useChessStore((state) => state.turn);
    const makeMove = useChessStore((state) => state.makeMove);
    const movesList = useChessStore((state) => state.movesList);
    const currentMoveIndex = useChessStore((state) => state.currentMoveIndex);
    const analysis = useChessStore((state) => state.analysis);
    const orientation = useChessStore((state) => state.orientation);
    const showArrows = useSettingsStore((state) => state.showArrows);

    const containerRef = useRef<HTMLDivElement>(null);
    const [boardSize, setBoardSize] = useState(400);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                const newSize = Math.min(width, height);
                setBoardSize(newSize);
            }
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        return makeMove(sourceSquare, targetSquare);
    }

    const getArrows = (): [Square, Square, string?][] => {
        if (!showArrows || currentMoveIndex === 0) return [];
        const moveAnalysis = analysis[currentMoveIndex - 1];
        if (!moveAnalysis) return [];

        const arrows: [Square, Square, string?][] = [];
        const tempGame = new Chess();
        for (let i = 0; i < currentMoveIndex; i++) {
            tempGame.move(movesList[i]);
        }
        const history = tempGame.history({ verbose: true });
        const lastMove = history[history.length - 1];
        if (!lastMove) return [];

        const playedFrom = lastMove.from as Square;
        const playedTo = lastMove.to as Square;

        if (['best', 'brilliant', 'great', 'book', 'excellent'].includes(moveAnalysis.classification || '')) {
            arrows.push([playedFrom, playedTo, '#22c55e']);
        } else {
            if (moveAnalysis.classification === 'inaccuracy') arrows.push([playedFrom, playedTo, '#eab308']);
            else if (moveAnalysis.classification === 'mistake') arrows.push([playedFrom, playedTo, '#f97316']);
            else if (moveAnalysis.classification === 'blunder') arrows.push([playedFrom, playedTo, '#ef4444']);
            else arrows.push([playedFrom, playedTo, '#3b82f6']);

            if (moveAnalysis.bestMove) {
                const bestFrom = moveAnalysis.bestMove.substring(0, 2) as Square;
                const bestTo = moveAnalysis.bestMove.substring(2, 4) as Square;
                if (bestFrom !== playedFrom || bestTo !== playedTo) {
                    arrows.push([bestFrom, bestTo, '#3b82f6']);
                }
            }
        }
        return arrows;
    };

    const getSquareStyles = () => {
        const styles: Record<string, React.CSSProperties> = {};
        if (currentMoveIndex > 0 && movesList[currentMoveIndex - 1]) {
            const tempGame = new Chess();
            for (let i = 0; i < currentMoveIndex; i++) tempGame.move(movesList[i]);
            const history = tempGame.history({ verbose: true });
            const lastMove = history[history.length - 1];

            if (lastMove) {
                const highlightColor = 'rgba(6, 182, 212, 0.5)';
                styles[lastMove.from] = { backgroundColor: highlightColor };
                styles[lastMove.to] = { backgroundColor: highlightColor };
                // Removed background image logic from here
            }
        }
        return styles;
    };

    // Create a map of squares that need an overlay image
    const getClassificationOverlays = () => {
        const overlays: Record<string, string> = {};
        if (currentMoveIndex > 0 && movesList[currentMoveIndex - 1]) {
            const tempGame = new Chess();
            for (let i = 0; i < currentMoveIndex; i++) tempGame.move(movesList[i]);
            const history = tempGame.history({ verbose: true });
            const lastMove = history[history.length - 1];

            if (lastMove) {
                const moveAnalysis = analysis[currentMoveIndex - 1];
                const imgPath = moveAnalysis?.classification ? ({
                    brilliant: '/images/brilliant.png', great: '/images/great.png', best: '/images/best.png',
                    excellent: '/images/excellent.png', good: '/images/good.png', book: '/images/book.png',
                    miss: '/images/miss.png', inaccuracy: '/images/inaccuracy.png', mistake: '/images/mistake.png',
                    blunder: '/images/blunder.png',
                }[moveAnalysis.classification!]) : null;

                if (imgPath) {
                    overlays[lastMove.to] = imgPath;
                }
            }
        }
        return overlays;
    };

    const overlays = getClassificationOverlays();

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center relative">
            <Chessboard
                position={fen}
                onPieceDrop={onDrop}
                boardOrientation={orientation === 'w' ? 'white' : 'black'}
                customBoardStyle={{ borderRadius: '4px' }}
                customDarkSquareStyle={{ backgroundColor: '#769656' }}
                customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
                boardWidth={boardSize}
                customArrows={getArrows()}
                customSquareStyles={getSquareStyles()}
                // Custom Square renderer to inject the image ON TOP of the piece
                customSquare={({ children, square, style }) => (
                    <div style={style} className="relative">
                        {children}
                        {overlays[square] && (
                            <div className="absolute top-0 right-0 w-[60%] h-[60%] pointer-events-none z-10">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={overlays[square]}
                                    alt=""
                                    className="w-full h-full object-contain drop-shadow-sm"
                                />
                            </div>
                        )}
                    </div>
                )}
            />
        </div>
    );
};

export default memo(ChessBoardComponent);