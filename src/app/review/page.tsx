// src/app/review/page.tsx
"use client";

import { useState } from "react";
import ChessBoard from "@/components/ChessBoard";
import GameControls from "@/components/GameControls";
import MoveList from "@/components/MoveList";
import ImportUrl from "@/components/ImportUrl";
import EnginePanel from "@/components/EnginePanel";
import EvalBar from "@/components/EvalBar";
import EvalGraph from "@/components/EvalGraph";
import OpeningExplorer from "@/components/OpeningExplorer";
import LoadGameModal from "@/components/LoadGameModal";
import ReviewHeader from "@/components/ReviewHeader";
import GameSummary from "@/components/GameSummary";
import { useChessStore } from "@/store/chessStore";

export default function ReviewPage() {
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'review' | 'opening' | 'insights'>('review');
    const headers = useChessStore((state) => state.headers);

    return (
        <div className="app-container">
            <ReviewHeader />

            <div className="main-content">
                {/* Left: Board Section */}
                <div className="board-section">

                    {/* Mobile Player Header */}
                    <div className="md:hidden flex items-center justify-between px-4 py-2 bg-[#12151a] border-b border-[#2a2f38] z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs">♔</div>
                            <div className="text-sm font-semibold">{headers['White'] || 'White'}</div>
                        </div>
                        <EvalBar type="score" />
                        <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold">{headers['Black'] || 'Black'}</div>
                            <div className="w-7 h-7 rounded-full bg-gray-900 border border-gray-600 flex items-center justify-center text-xs">♚</div>
                        </div>
                    </div>

                    {/* Board Area - Fills available space */}
                    <div className="board-wrapper">
                        {/* Eval Bar (Vertical Desktop) */}
                        <div className="eval-bar-vertical">
                            <EvalBar type="vertical" />
                        </div>

                        <div className="board-inner">
                            {/* Chessboard takes remaining space */}
                            {/* After */}
                            <div className="w-full h-full relative">
                                <ChessBoard />
                            </div>
                            {/* Eval Bar (Horizontal Mobile) */}
                            <div className="w-full md:hidden flex-shrink-0">
                                <EvalBar type="horizontal" />
                            </div>
                        </div>
                    </div>

                    {/* Controls Bar - Pinned at bottom */}
                    <div className="controls-bar">
                        <GameControls />
                    </div>
                </div>

                {/* Right: Sidebar Panel - Internal scroll only */}
                <div className="sidebar-panel">
                    {/* Header Tabs */}
                    <div className="border-b border-[#2a2f38] flex-shrink-0 bg-[#12151a]">
                        <div className="flex">
                            <button onClick={() => setActiveTab('review')} className={`flex-1 py-3 px-4 text-xs font-semibold ${activeTab === 'review' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500 hover:text-gray-300 border-b-2 border-transparent'}`}>Review</button>
                            <button onClick={() => setActiveTab('opening')} className={`flex-1 py-3 px-4 text-xs font-semibold ${activeTab === 'opening' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500 hover:text-gray-300 border-b-2 border-transparent'}`}>Opening</button>
                            <button onClick={() => setActiveTab('insights')} className={`flex-1 py-3 px-4 text-xs font-semibold ${activeTab === 'insights' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500 hover:text-gray-300 border-b-2 border-transparent'}`}>Insights</button>
                        </div>
                    </div>

                    {/* Engine Info (Review Tab Only) */}
                    {activeTab === 'review' && (
                        <div className="p-3 border-b border-[#2a2f38] bg-[#12151a] flex-shrink-0">
                            <EnginePanel />
                        </div>
                    )}

                    {/* Eval Graph - Placed in sidebar to save vertical space on main board */}
                    {activeTab === 'review' && (
                        <div className="p-3 border-b border-[#2a2f38] bg-[#12151a] flex-shrink-0 hidden md:block">
                            <EvalGraph />
                        </div>
                    )}

                    {/* Sidebar Content - Scrollable area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
                        {activeTab === 'review' && <MoveList />}
                        {activeTab === 'opening' && (
                            <div className="p-3">
                                <OpeningExplorer />
                            </div>
                        )}
                        {activeTab === 'insights' && (
                            <div className="p-3 space-y-4">
                                <GameSummary />
                                <ImportUrl />
                            </div>
                        )}
                    </div>

                    {/* Footer Stats */}
                    <div className="p-3 border-t border-[#2a2f38] bg-[#12151a] text-xs text-gray-500 flex justify-between items-center flex-shrink-0">
                        <span>Accuracy: W <span className="text-green-400 font-semibold">--</span> | B <span className="text-red-400 font-semibold">--</span></span>
                        <span className="font-mono bg-black/20 px-2 py-0.5 rounded">Stockfish 16</span>
                    </div>
                </div>
            </div>

            <LoadGameModal isOpen={isLoadModalOpen} onClose={() => setIsLoadModalOpen(false)} />
        </div>
    );
}