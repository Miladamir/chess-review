// src/app/settings/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSettingsStore } from '@/store/settingsStore';

// Reusable Toggle Switch Component
function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${enabled ? 'bg-amber-600' : 'bg-gray-700'}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    );
}

export default function SettingsPage() {
    const { data: session } = useSession();
    const router = useRouter();

    const {
        engineDepth,
        setEngineDepth,
        showArrows,
        toggleArrows,
        autoFlipBoard,
        toggleAutoFlipBoard
    } = useSettingsStore();

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
            <Navbar />

            <main className="flex-1 pt-24 pb-12 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">

                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-1">Settings</h1>
                        <p className="text-gray-400">Customize your analysis experience</p>
                    </div>

                    <div className="space-y-6">

                        {/* Account Section */}
                        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Account
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-white">Chess.com Username</p>
                                        <p className="text-sm text-gray-400 mt-1 font-mono">
                                            {session?.user?.username || 'Not logged in'}
                                        </p>
                                    </div>
                                    {session ? (
                                        <button
                                            onClick={() => signOut({ callbackUrl: '/' })}
                                            className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => router.push('/login')}
                                            className="btn-primary text-sm py-2"
                                        >
                                            Sign In
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Engine Section */}
                        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Analysis Engine
                                </h2>
                            </div>
                            <div className="divide-y divide-[var(--border-subtle)]">
                                {/* Engine Depth */}
                                <div className="p-6 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-medium text-white">Engine Depth</p>
                                        <p className="text-sm text-gray-400 mt-1">Higher depth provides stronger analysis but takes longer to calculate.</p>
                                    </div>
                                    <select
                                        value={engineDepth}
                                        onChange={(e) => setEngineDepth(Number(e.target.value))}
                                        className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                                    >
                                        <option value={12}>12 (Fast)</option>
                                        <option value={15}>15 (Balanced)</option>
                                        <option value={18}>18 (Deep)</option>
                                        <option value={20}>20 (Maximum)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Board Preferences Section */}
                        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                    </svg>
                                    Board Preferences
                                </h2>
                            </div>
                            <div className="divide-y divide-[var(--border-subtle)]">
                                {/* Show Arrows */}
                                <div className="p-6 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-medium text-white">Show Best Move Arrows</p>
                                        <p className="text-sm text-gray-400 mt-1">Display arrows on the board indicating the best move and played move during review.</p>
                                    </div>
                                    <ToggleSwitch enabled={showArrows} onChange={toggleArrows} />
                                </div>

                                {/* Auto Flip Board */}
                                <div className="p-6 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-medium text-white">Auto-Flip Board</p>
                                        <p className="text-sm text-gray-400 mt-1">Automatically orient the board to your perspective when importing your Chess.com games.</p>
                                    </div>
                                    <ToggleSwitch enabled={autoFlipBoard} onChange={toggleAutoFlipBoard} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}