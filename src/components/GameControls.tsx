// src/components/GameControls.tsx
'use client';

import { useState } from 'react';
import { useChessStore } from '@/store/chessStore';
import { useEngineStore } from '@/store/engineStore';
import { useToastStore } from '@/store/toastStore';
import ImportPgnModal from './ImportPgnModal';
import SettingsModal from './SettingsModal';

export default function GameControls() {
    const { movesList, currentMoveIndex, jumpToMove, resetGame, startFullAnalysis, isAnalyzing, analysisProgress, analysis } = useChessStore();
    const { isReady, stopAnalysis } = useEngineStore();
    const addToast = useToastStore((state) => state.addToast);
    const flipBoard = useChessStore((state) => state.flipBoard);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (movesList.length === 0) return;
        setIsSaving(true);
        try {
            const gameObj = useChessStore.getState().game;
            const pgnString = gameObj.pgn();
            const res = await fetch('/api/games', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pgn: pgnString, analysis: analysis, white: "Player 1", black: "Player 2" }),
            });
            if (!res.ok) throw new Error('Failed to save');
            addToast('Game saved successfully!', 'success');
        } catch (e) {
            addToast('Failed to save game', 'error');
        } finally { setIsSaving(false); }
    };

    const handleAnalyzeClick = () => {
        if (isAnalyzing) stopAnalysis();
        else startFullAnalysis();
    };

    return (
        <>
            <div className="flex items-center justify-between gap-2 max-w-5xl mx-auto w-full">

                {/* Left side: Secondary Actions (Compact) */}
                <div className="hidden md:flex gap-1 items-center">
                    <button onClick={handleSave} disabled={isSaving || movesList.length === 0} className="text-[10px] text-gray-500 hover:text-white px-2 py-1 rounded transition-colors disabled:opacity-50">
                        {isSaving ? '...' : '💾'}
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="text-[10px] text-gray-500 hover:text-white px-2 py-1 rounded transition-colors">
                        📄 PGN
                    </button>
                    <button onClick={() => setIsSettingsOpen(true)} className="text-[10px] text-gray-500 hover:text-white px-2 py-1 rounded transition-colors">
                        ⚙️
                    </button>
                    <button onClick={resetGame} className="text-[10px] text-gray-500 hover:text-white px-2 py-1 rounded transition-colors">
                        🔄
                    </button>
                </div>

                {/* Center: Navigation */}
                <div className="flex items-center justify-center gap-1 sm:gap-2 mx-auto">
                    <button onClick={() => jumpToMove(0)} className="btn-control p-1.5 sm:p-2" title="Go to Start">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={() => jumpToMove(currentMoveIndex - 1)} className="btn-control p-1.5 sm:p-2" title="Previous Move">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    <button onClick={handleAnalyzeClick} disabled={!isReady || movesList.length === 0} className={`btn-control p-2 sm:p-3 ${isAnalyzing ? 'active' : ''}`} title="Review">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>

                    <button onClick={() => jumpToMove(currentMoveIndex + 1)} className="btn-control p-1.5 sm:p-2" title="Next Move">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <button onClick={() => jumpToMove(movesList.length)} className="btn-control p-1.5 sm:p-2" title="Go to End">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                    </button>

                    <button onClick={flipBoard} className="btn-control p-1.5 sm:p-2 sm:ml-2" title="Flip Board">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                    </button>
                </div>

                {/* Right side: Progress bar if analyzing */}
                <div className="hidden md:block w-24">
                    {isAnalyzing && (
                        <div className="w-full">
                            <div className="w-full bg-slate-700 rounded-full h-1">
                                <div className="bg-amber-500 h-1 rounded-full transition-all duration-100" style={{ width: `${analysisProgress}%` }}></div>
                            </div>
                            <p className="text-[9px] text-center text-slate-500 mt-0.5">{analysisProgress}%</p>
                        </div>
                    )}
                </div>
            </div>

            <ImportPgnModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </>
    );
}