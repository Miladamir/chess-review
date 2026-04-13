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

                    {/* Board Area */}
                    <div className="board-wrapper relative">
                        {/* Eval Bar (Vertical, Desktop only) */}
                        <div className="eval-bar-vertical hidden lg:block">
                            <EvalBar type="vertical" />
                        </div>

                        <div className="board-inner">
                            {/* Chessboard Container */}
                            <div className="flex-1 w-full min-h-0 relative">
                                <ChessBoard />

                                {/* Mobile Player Overlays (Small pills, NO gradients) */}
                                <div className="absolute top-2 left-2 z-10 pointer-events-none lg:hidden">
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md border border-white/10">
                                        <div className="w-4 h-4 rounded-full bg-gray-800 text-[8px] flex items-center justify-center">♚</div>
                                        <span className="text-[11px] font-semibold text-gray-200">{headers['Black'] || 'Black'}</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-2 left-2 z-10 pointer-events-none lg:hidden">
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md border border-white/10">
                                        <div className="w-4 h-4 rounded-full bg-gray-300 text-black text-[8px] flex items-center justify-center font-bold">♔</div>
                                        <span className="text-[11px] font-semibold text-gray-200">{headers['White'] || 'White'}</span>
                                    </div>
                                </div>

                                {/* Eval Score Pill (Mobile) */}
                                <div className="absolute top-2 right-2 z-10 pointer-events-none lg:hidden">
                                    <EvalBar type="score" />
                                </div>
                            </div>

                            {/* Eval Bar (Horizontal, Mobile only) */}
                            <div className="w-full lg:hidden flex-shrink-0 px-1">
                                <EvalBar type="horizontal" />
                            </div>
                        </div>
                    </div>

                    {/* Controls Bar - Sticks right under the board! */}
                    <div className="controls-bar">
                        <GameControls />
                    </div>
                </div>

                {/* Right: Sidebar Panel */}
                <div className="sidebar-panel">

                    {/* Tab Headers — Sticky on mobile */}
                    <div className="sidebar-tabs-header border-b border-[#2a2f38] flex-shrink-0 bg-[#12151a]">
                        <div className="flex">
                            <button onClick={() => setActiveTab('review')} className={`flex-1 py-3 px-4 text-xs font-semibold ${activeTab === 'review' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500 hover:text-gray-300 border-b-2 border-transparent'}`}>Review</button>
                            <button onClick={() => setActiveTab('opening')} className={`flex-1 py-3 px-4 text-xs font-semibold ${activeTab === 'opening' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500 hover:text-gray-300 border-b-2 border-transparent'}`}>Opening</button>
                            <button onClick={() => setActiveTab('insights')} className={`flex-1 py-3 px-4 text-xs font-semibold ${activeTab === 'insights' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500 hover:text-gray-300 border-b-2 border-transparent'}`}>Insights</button>
                        </div>
                    </div>

                    {/* Engine Info (Review Tab only) */}
                    {activeTab === 'review' && (
                        <div className="p-3 border-b border-[#2a2f38] bg-[#12151a] flex-shrink-0">
                            <EnginePanel />
                        </div>
                    )}

                    {/* Eval Graph (Review Tab, desktop only) */}
                    {activeTab === 'review' && (
                        <div className="p-3 border-b border-[#2a2f38] bg-[#12151a] flex-shrink-0 hidden md:block">
                            <EvalGraph />
                        </div>
                    )}

                    {/* Sidebar Scrollable Content */}
                    <div className="custom-scrollbar md:flex-1 md:overflow-y-auto md:min-h-0">
                        {activeTab === 'review' && <MoveList />}
                        {activeTab === 'opening' && <div className="p-3"><OpeningExplorer /></div>}
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