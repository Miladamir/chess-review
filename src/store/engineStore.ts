import { create } from 'zustand';
import { useSettingsStore } from './settingsStore'; // Import settings

interface EngineState {
    isReady: boolean;
    currentLine: { depth: number; score: number; pv: string; mate?: number } | null;
    isAnalyzingGame: boolean;
    initEngine: () => void;
    analyzeFen: (fen: string) => void;
    stopAnalysis: () => void;
    // Update return type to include bestMoveSan
    analyzePositionForReview: (fen: string) => Promise<{ score: number; mate?: number; bestMove: string; bestMoveSan?: string }>;
}

let engineWorker: Worker | null = null;
let currentTurn: 'w' | 'b' = 'w';
let analysisResolver: ((value: any) => void) | null = null;

export const useEngineStore = create<EngineState>((set, get) => ({
    isReady: false,
    currentLine: null,
    isAnalyzingGame: false,

    initEngine: () => {
        if (engineWorker) return;

        engineWorker = new Worker('/stockfish/stockfish.js');

        engineWorker.onmessage = (e) => {
            const message = e.data;

            if (message === 'uciok') {
                set({ isReady: true });
            }

            if (message.startsWith('bestmove')) {
                if (analysisResolver) {
                    const bestMove = message.split(' ')[1];
                    // Resolve with cached data from 'info' messages
                    const analysis = (window as any).tempAnalysis || { score: 0, bestMove: bestMove };
                    analysis.bestMove = bestMove;

                    // Clear temp for next cycle
                    (window as any).tempAnalysis = null;

                    analysisResolver(analysis);
                    analysisResolver = null;
                }
            }

            if (message.startsWith('info depth')) {
                const depthMatch = message.match(/depth (\d+)/);
                const pvMatch = message.match(/pv (.+)/);
                const mateMatch = message.match(/score mate (-?\d+)/);
                const scoreMatch = message.match(/score cp (-?\d+)/);

                const depth = depthMatch ? parseInt(depthMatch[1]) : 0;
                // Only update UI if NOT analyzing a game (live mode)
                if (depth > 14 && !get().isAnalyzingGame) {
                    // Live updates for UI
                }

                // Always cache the latest deep info for the resolver
                if (depth >= 14) {
                    let score = 0;
                    let mate = undefined;

                    if (mateMatch) {
                        mate = parseInt(mateMatch[1]);
                        score = mate > 0 ? 10000 : -10000;
                    } else if (scoreMatch) {
                        score = parseInt(scoreMatch[1]);
                    }

                    // Normalize for storage
                    // Note: We store relative to side to move in cache, 
                    // but handle normalization in UI/Review logic.
                    const cached = (window as any).tempAnalysis || {};

                    // Store raw values
                    (window as any).tempAnalysis = {
                        ...cached,
                        score,
                        mate,
                        pv: pvMatch ? pvMatch[1] : null
                    };
                }
            }
        };

        engineWorker.onerror = (e) => {
            console.error('Engine Worker Error:', e.message);
        };

        engineWorker.postMessage('uci');
    },

    analyzeFen: (fen: string) => {
        if (!engineWorker || !get().isReady) return;
        engineWorker.postMessage('stop');
        const turn = fen.split(' ')[1];
        currentTurn = turn === 'b' ? 'b' : 'w';
        engineWorker.postMessage(`position fen ${fen}`);

        // Use setting depth
        const depth = useSettingsStore.getState().engineDepth;
        engineWorker.postMessage(`go depth ${depth}`);
    },

    stopAnalysis: () => {
        if (!engineWorker) return;
        engineWorker.postMessage('stop');
        set({ isAnalyzingGame: false });
        analysisResolver = null; // Clear pending resolver
    },

    analyzePositionForReview: (fen) => {
        return new Promise((resolve) => {
            if (!engineWorker) return resolve({ score: 0, bestMove: '' });

            const turn = fen.split(' ')[1];
            currentTurn = turn === 'b' ? 'b' : 'w';

            analysisResolver = resolve;

            engineWorker.postMessage('stop');
            engineWorker.postMessage(`position fen ${fen}`);

            // Use setting depth
            const depth = useSettingsStore.getState().engineDepth;
            engineWorker.postMessage(`go depth ${depth}`);
        });
    },
}));