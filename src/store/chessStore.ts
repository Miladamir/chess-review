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
            set({ game, fen: game.fen(), turn: game.turn(), movesList: newHistory, currentMoveIndex: newHistory.length });
            return true;
        } catch (e) { return false; }
    },

    playMove: (san: string) => {
        const game = get().game;
        try {
            const move = game.move(san);
            if (move === null) return false;
            const newHistory = game.history();
            set({ game, fen: game.fen(), turn: game.turn(), movesList: newHistory, currentMoveIndex: newHistory.length });
            return true;
        } catch (e) { return false; }
    },

    resetGame: () => {
        const newGame = new Chess();
        set({ game: newGame, fen: newGame.fen(), turn: 'w', movesList: [], currentMoveIndex: 0, analysis: {}, headers: {}, orientation: 'w' });
    },

    jumpToMove: (targetIndex: number) => {
        const movesList = get().movesList;
        if (targetIndex < 0 || targetIndex > movesList.length) return;
        const tempGame = new Chess();
        for (let i = 0; i < targetIndex; i++) tempGame.move(movesList[i]);
        set({ game: tempGame, fen: tempGame.fen(), turn: tempGame.turn(), currentMoveIndex: targetIndex });
    },

    goBack: () => { const index = get().currentMoveIndex; if (index > 0) get().jumpToMove(index - 1); },
    goForward: () => { const index = get().currentMoveIndex; if (index < get().movesList.length) get().jumpToMove(index + 1); },

    setGameFromPgn: (pgn: string, playerUsername?: string) => {
        try {
            const tempGame = new Chess();
            tempGame.loadPgn(pgn);
            const history = tempGame.history();
            const rawHeaders = tempGame.header();
            const headers: Record<string, string> = {};
            Object.keys(rawHeaders).forEach(key => { if (rawHeaders[key]) headers[key] = rawHeaders[key]; });
            let detectedOrientation: 'w' | 'b' = 'w';
            const autoFlip = useSettingsStore.getState().autoFlipBoard;
            if (autoFlip && playerUsername) {
                if (headers['Black']?.toLowerCase() === playerUsername.toLowerCase()) detectedOrientation = 'b';
            }
            set({ game: tempGame, fen: tempGame.fen(), turn: tempGame.turn(), movesList: history, currentMoveIndex: history.length, analysis: {}, headers, orientation: detectedOrientation });
            return true;
        } catch (e) { console.error(e); return false; }
    },

    flipBoard: () => { set({ orientation: get().orientation === 'w' ? 'b' : 'w' }); },
    setOrientation: (color: 'w' | 'b') => { set({ orientation: color }); },

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
                return data.moves.some((m: any) => {
                    const totalGames = (m.white || 0) + (m.draws || 0) + (m.black || 0);
                    return m.san === playedSan && totalGames > 0;
                });
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

        let cachedNextBefore: { rawScore: number; bestMove: string | null; mate?: number } | null = null;

        for (let i = 0; i < movesList.length; i++) {
            if (!useEngineStore.getState().isAnalyzingGame) break;
            setAnalyzing(true, Math.round(((i + 1) / movesList.length) * 100));

            const fenBefore = tempGame.fen();
            const isWhiteTurnBefore = fenBefore.includes(' w ');

            let classification: Classification = null;
            let bestMoveUci = "";
            let rawScoreBefore = 0;
            let scoreBeforeWhite = 0;
            let scoreAfterWhite = 0;
            let mateBeforeWhite = undefined;
            let mateAfterWhite = undefined;

            // 1. Book Check
            if (!isOutOfBook && i < 16) {
                const isBook = await checkBookMove(fenBefore, movesList[i]);
                if (isBook) {
                    classification = 'book';
                    tempGame.move(movesList[i]);
                    set((state) => ({ analysis: { ...state.analysis, [i]: { classification: 'book', bestMove: '', scoreBefore: 0, scoreAfter: 0, mate: undefined } } }));
                    cachedNextBefore = null; 
                    continue;
                } else { isOutOfBook = true; }
            }

            // 2. Get BEFORE analysis
            if (cachedNextBefore && cachedNextBefore.bestMove) {
                rawScoreBefore = cachedNextBefore.rawScore;
                bestMoveUci = cachedNextBefore.bestMove;
                mateBeforeWhite = isWhiteTurnBefore ? cachedNextBefore.mate : (cachedNextBefore.mate ? -cachedNextBefore.mate : undefined);
            } else {
                const analysisBefore = await analyzePosition(fenBefore);
                rawScoreBefore = analysisBefore.score;
                bestMoveUci = analysisBefore.bestMove;
                mateBeforeWhite = isWhiteTurnBefore ? analysisBefore.mate : (analysisBefore.mate ? -analysisBefore.mate : undefined);
            }

            // CRITICAL FIX: Stockfish returns "(none)" for checkmate positions. 
            // We must sanitize this to an empty string so it doesn't break the UI arrows.
            if (bestMoveUci === "(none)") bestMoveUci = "";

            scoreBeforeWhite = isWhiteTurnBefore ? rawScoreBefore : -rawScoreBefore;

            let bestMoveSan = "";
            if (bestMoveUci) {
                try {
                    const from = bestMoveUci.substring(0, 2);
                    const to = bestMoveUci.substring(2, 4);
                    const promotion = bestMoveUci.length === 5 ? bestMoveUci[4] : undefined;
                    
                    const moveObj = tempGame.move({ from, to, promotion });
                    if (moveObj) bestMoveSan = moveObj.san;
                    tempGame.undo();
                } catch (e) { 
                    bestMoveSan = ""; 
                }
            }

            // 3. Make the actual move
            const moveObj = tempGame.move(movesList[i]);
            if (!moveObj) continue;

            // 4. Evaluate AFTER state
            const materialChange = getMaterialChange(moveObj);
            const playedSan = movesList[i];
            let currentAfterAnalysis: { rawScore: number; bestMove: string | null; mate?: number } | null = null;

            if (bestMoveSan === playedSan) {
                classification = 'best';
                scoreAfterWhite = scoreBeforeWhite;
                mateAfterWhite = mateBeforeWhite;

                currentAfterAnalysis = { rawScore: -rawScoreBefore, bestMove: null, mate: mateBeforeWhite ? -mateBeforeWhite : undefined };

                const isSacrifice = materialChange < 0;
                if (isSacrifice && scoreBeforeWhite > -50 && scoreBeforeWhite < 50) classification = 'brilliant';
                else if (mateBeforeWhite && mateBeforeWhite > 0) classification = 'best';

            } else {
                const fenAfter = tempGame.fen();
                const isWhiteTurnAfter = fenAfter.includes(' w ');
                const analysisAfter = await analyzePosition(fenAfter);

                scoreAfterWhite = isWhiteTurnAfter ? analysisAfter.score : -analysisAfter.score;
                mateAfterWhite = isWhiteTurnAfter ? analysisAfter.mate : (analysisAfter.mate ? -analysisAfter.mate : undefined);

                currentAfterAnalysis = { rawScore: analysisAfter.score, bestMove: analysisAfter.bestMove, mate: analysisAfter.mate };

                let evalDrop = scoreBeforeWhite - scoreAfterWhite;
                if (!isWhiteTurnBefore) evalDrop = -evalDrop;

                const playerHadMate = isWhiteTurnBefore ? (mateBeforeWhite && mateBeforeWhite > 0) : (mateBeforeWhite && mateBeforeWhite < 0);

                if (playerHadMate) {
                    const playerStillHasMate = isWhiteTurnBefore ? (mateAfterWhite && mateAfterWhite > 0) : (mateAfterWhite && mateAfterWhite < 0);
                    if (!playerStillHasMate) classification = 'miss';
                    else classification = 'best';
                } else if (evalDrop > 300) classification = 'blunder';
                else if (evalDrop > 100) classification = 'mistake';
                else if (evalDrop > 30) classification = 'inaccuracy';
                else classification = 'excellent';
            }

            cachedNextBefore = currentAfterAnalysis;

            set((state) => ({
                analysis: {
                    ...state.analysis,
                    [i]: {
                        classification,
                        bestMove: bestMoveUci,
                        scoreBefore: scoreBeforeWhite,
                        scoreAfter: scoreAfterWhite,
                        mate: mateAfterWhite
                    },
                },
            }));
        }

        useEngineStore.setState({ isAnalyzingGame: false });
        setAnalyzing(false, 100);
        get().jumpToMove(0);
    },
}));