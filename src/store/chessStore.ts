// src/store/chessStore.ts
import { create } from 'zustand';
import { Chess, Move } from 'chess.js';
import { useEngineStore } from './engineStore';
import { MoveAnalysis, Classification } from '@/utils/analysis';
import { useSettingsStore } from './settingsStore';

interface ChessState {
    game: Chess;
    movesList: string[];
    currentMoveIndex: number;
    fen: string;
    turn: 'w' | 'b';
    analysis: Record<number, MoveAnalysis>;
    isAnalyzing: boolean;
    analysisProgress: number;
    headers: Record<string, string>;
    orientation: 'w' | 'b';

    makeMove: (from: string, to: string, promotion?: string) => boolean;
    playMove: (san: string) => boolean;
    resetGame: () => void;
    jumpToMove: (index: number) => void;
    goBack: () => void;
    goForward: () => void;
    setGameFromPgn: (pgn: string, playerUsername?: string) => boolean;
    flipBoard: () => void;
    setOrientation: (color: 'w' | 'b') => void;
    startFullAnalysis: () => Promise<void>;
}

export const useChessStore = create<ChessState>((set, get) => ({
    game: new Chess(),
    movesList: [],
    currentMoveIndex: 0,
    fen: new Chess().fen(),
    turn: 'w',
    analysis: {},
    isAnalyzing: false,
    analysisProgress: 0,
    headers: {},
    orientation: 'w',

    makeMove: (from, to, promotion = 'q') => {
        const game = get().game;
        try {
            const move = game.move({ from, to, promotion });
            if (move === null) return false;
            const newHistory = game.history();
            set({
                game,
                fen: game.fen(),
                turn: game.turn(),
                movesList: newHistory,
                currentMoveIndex: newHistory.length,
            });
            return true;
        } catch (e) {
            return false;
        }
    },

    playMove: (san: string) => {
        const game = get().game;
        try {
            const move = game.move(san);
            if (move === null) return false;

            const newHistory = game.history();
            set({
                game,
                fen: game.fen(),
                turn: game.turn(),
                movesList: newHistory,
                currentMoveIndex: newHistory.length,
            });
            return true;
        } catch (e) {
            return false;
        }
    },

    resetGame: () => {
        const newGame = new Chess();
        set({
            game: newGame,
            fen: newGame.fen(),
            turn: 'w',
            movesList: [],
            currentMoveIndex: 0,
            analysis: {},
            headers: {},
            orientation: 'w',
        });
    },

    jumpToMove: (targetIndex: number) => {
        const movesList = get().movesList;
        if (targetIndex < 0 || targetIndex > movesList.length) return;
        const tempGame = new Chess();
        for (let i = 0; i < targetIndex; i++) {
            tempGame.move(movesList[i]);
        }
        set({
            game: tempGame,
            fen: tempGame.fen(),
            turn: tempGame.turn(),
            currentMoveIndex: targetIndex,
        });
    },

    goBack: () => {
        const index = get().currentMoveIndex;
        if (index > 0) get().jumpToMove(index - 1);
    },

    goForward: () => {
        const index = get().currentMoveIndex;
        if (index < get().movesList.length) get().jumpToMove(index + 1);
    },

    // Inside src/store/chessStore.ts -> setGameFromPgn

    // Inside src/store/chessStore.ts -> setGameFromPgn

    setGameFromPgn: (pgn: string, playerUsername?: string) => {
        try {
            const tempGame = new Chess();
            tempGame.loadPgn(pgn);
            const history = tempGame.history();
            const rawHeaders = tempGame.header();

            // Filter out empty headers
            const headers: Record<string, string> = {};
            Object.keys(rawHeaders).forEach(key => {
                if (rawHeaders[key]) headers[key] = rawHeaders[key];
            });

            // Auto-detect orientation (Respect Settings)
            let detectedOrientation: 'w' | 'b' = 'w';
            const autoFlip = useSettingsStore.getState().autoFlipBoard; // <-- Check setting

            if (autoFlip && playerUsername) {
                const whitePlayer = headers['White']?.toLowerCase();
                const blackPlayer = headers['Black']?.toLowerCase();
                if (blackPlayer === playerUsername.toLowerCase()) {
                    detectedOrientation = 'b';
                }
            }

            set({
                game: tempGame,
                fen: tempGame.fen(),
                turn: tempGame.turn(),
                movesList: history,
                currentMoveIndex: history.length,
                analysis: {},
                headers: headers,
                orientation: detectedOrientation,
            });
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    },

    flipBoard: () => {
        const current = get().orientation;
        set({ orientation: current === 'w' ? 'b' : 'w' });
    },

    setOrientation: (color: 'w' | 'b') => {
        set({ orientation: color });
    },

    startFullAnalysis: async () => {
        const movesList = get().movesList;
        const analyzePosition = useEngineStore.getState().analyzePositionForReview;

        useEngineStore.setState({ isAnalyzingGame: true });
        const setAnalyzing = (val: boolean, progress: number) => set({ isAnalyzing: val, analysisProgress: progress });

        setAnalyzing(true, 0);
        set({ analysis: {} });

        const tempGame = new Chess();
        let isOutOfBook = false;

        const checkBookMove = async (fen: string, playedSan: string): Promise<boolean> => {
            try {
                const res = await fetch(`/api/explorer?fen=${encodeURIComponent(fen)}`);
                if (!res.ok) return false;
                const data = await res.json();
                if (!data.moves || data.moves.length === 0) return false;
                const moveExists = data.moves.some((m: any) => m.san === playedSan && m.total > 0);
                return moveExists;
            } catch (e) { return false; }
        };

        const getMaterialChange = (moveObj: Move) => {
            let change = 0;
            if (moveObj.captured) {
                const values: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };
                change += values[moveObj.captured] || 0;
            }
            if (moveObj.promotion) change += 8;
            return change;
        };

        for (let i = 0; i < movesList.length; i++) {
            if (!useEngineStore.getState().isAnalyzingGame) break;

            setAnalyzing(true, Math.round(((i + 1) / movesList.length) * 100));

            const fenBefore = tempGame.fen();
            let classification: Classification = null;
            let bestMoveUci = "";
            let scoreBefore = 0;
            let scoreAfter = 0;
            let mate = undefined;

            // 1. Book Check
            if (!isOutOfBook) {
                const isBook = await checkBookMove(fenBefore, movesList[i]);
                if (isBook) {
                    classification = 'book';
                    tempGame.move(movesList[i]);
                    set((state) => ({ analysis: { ...state.analysis, [i]: { classification: 'book' } } }));
                    continue;
                } else {
                    isOutOfBook = true;
                }
            }

            // 2. Analyze Before
            const analysisBefore = await analyzePosition(fenBefore);
            scoreBefore = analysisBefore.score;
            const mateBefore = analysisBefore.mate;
            bestMoveUci = analysisBefore.bestMove;

            // Derive SAN for the best move
            let bestMoveSan = "";
            if (bestMoveUci) {
                try {
                    const moveObj = tempGame.move(bestMoveUci);
                    if (moveObj) bestMoveSan = moveObj.san;
                    tempGame.undo();
                } catch (e) { }
            }

            // 3. Make the actual move
            const moveObj = tempGame.move(movesList[i]);
            if (!moveObj) continue;

            // 4. OPTIMIZATION: Check if we can skip "After" analysis
            const materialChange = getMaterialChange(moveObj);
            const playedSan = movesList[i];

            if (bestMoveSan === playedSan) {
                // PERFECT MOVE DETECTED
                // We assume the evaluation remains ideal (scoreAfter = -scoreBefore relative to mover)
                // This saves 50% of engine time for good moves.
                classification = 'best';
                scoreAfter = -scoreBefore; // It's the best, so eval relative to opponent is negation

                // Check for brilliant/great logic using heuristics
                const isSacrifice = materialChange < 0;
                if (isSacrifice && scoreBefore > -50 && scoreBefore < 50) {
                    classification = 'brilliant';
                } else if (mateBefore && mateBefore > 0) {
                    classification = 'best'; // Mating move
                }

            } else {
                // NOT THE BEST MOVE
                // We must analyze AFTER to see how bad it is.

                const fenAfter = tempGame.fen();
                const analysisAfter = await analyzePosition(fenAfter);
                scoreAfter = -analysisAfter.score; // Relative
                mate = analysisAfter.mate ? -analysisAfter.mate : undefined;

                const evalDrop = scoreBefore - scoreAfter;

                // Classify based on drop
                if (mateBefore && mateBefore < 5) {
                    classification = 'miss';
                } else if (scoreBefore > 300 && evalDrop > 100) {
                    classification = 'miss';
                } else if (scoreBefore > 100 && evalDrop > 50) {
                    classification = 'mistake';
                } else {
                    if (evalDrop > 100) classification = 'blunder';
                    else if (evalDrop > 50) classification = 'mistake';
                    else if (evalDrop > 20) classification = 'inaccuracy';
                    else classification = 'excellent';
                }
            }

            set((state) => ({
                analysis: {
                    ...state.analysis,
                    [i]: {
                        classification,
                        bestMove: bestMoveUci,
                        scoreBefore,
                        scoreAfter,
                        mate
                    },
                },
            }));
        }

        useEngineStore.setState({ isAnalyzingGame: false });
        setAnalyzing(false, 100);
        get().jumpToMove(0);
    },
}));