// src/components/ReviewHeader.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useChessStore } from '@/store/chessStore';

export default function ReviewHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const headers = useChessStore((state) => state.headers);

    const white = headers['White'] || 'White';
    const black = headers['Black'] || 'Black';
    const event = headers['Event'] || 'Analysis Board';

    return (
        <nav className="flex-shrink-0 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] z-50 relative">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L9 5h6l-3-3zM7.5 6L5 9h14l-2.5-3H7.5zM4 11v2h16v-2H4zm1 4v5h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-5H5zm-1 6v1h16v-1H4z" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold tracking-tight hidden sm:block text-[var(--fg-primary)]">ChessInsight</span>
                </Link>

                {/* Center: Game Title (Desktop) */}
                <div className="hidden md:flex items-center gap-3 text-sm absolute left-1/2 -translate-x-1/2">
                    <span className="font-semibold text-gray-300">{white}</span>
                    <span className="text-gray-600">vs</span>
                    <span className="font-semibold text-gray-300">{black}</span>
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded ml-2">{event}</span>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    <button className="btn-primary hidden sm:flex items-center gap-2 text-xs py-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Re-analyze
                    </button>

                    <button
                        className="hamburger md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] px-4 py-4">
                    <div className="text-center mb-4">
                        <div className="font-semibold">{white} vs {black}</div>
                        <div className="text-xs text-gray-500">{event}</div>
                    </div>
                    <button className="btn-primary w-full mb-3">Re-analyze</button>
                    <Link href="/" className="text-gray-300 hover:text-white transition-colors py-2 text-center block">Back to Home</Link>
                </div>
            )}
        </nav>
    );
}