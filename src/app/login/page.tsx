'use client';

import { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await signIn('credentials', {
            username,
            redirect: false
        });

        setLoading(false);

        if (res?.error) {
            setError("User not found on Chess.com. Please check your username.");
        } else {
            router.push('/review');
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col relative overflow-hidden bg-[var(--bg-primary)]"
            style={{ backgroundImage: 'radial-gradient(ellipse at top left, rgba(212, 160, 18, 0.05) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(13, 148, 136, 0.05) 0%, transparent 50%)' }}
        >
            {/* Background Decoration - Pawn */}
            <div className="absolute top-[10%] left-[10%] w-[200px] h-[200px] opacity-[0.03] text-gray-500 pointer-events-none z-0">
                <svg viewBox="0 0 45 45" fill="currentColor" className="w-full h-full">
                    <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" />
                </svg>
            </div>

            {/* Background Decoration - King */}
            <div className="absolute bottom-[15%] right-[15%] w-[300px] h-[300px] opacity-[0.03] text-gray-500 pointer-events-none z-0">
                <svg viewBox="0 0 45 45" fill="currentColor" className="w-full h-full">
                    <path d="M22 10c10.5 1 16.5 8 16 29H7c-.5-21 5.5-28 16-29z" />
                </svg>
            </div>

            {/* Main Container */}
            <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 relative z-10">

                {/* Login Card */}
                <div className="w-full max-w-[420px] p-8 sm:p-10 bg-[rgba(24,28,35,0.8)] backdrop-blur-xl border border-[var(--border-subtle)] rounded-2xl shadow-2xl">

                    {/* Header */}
                    <div className="text-center mb-8">
                        {/* Logo */}
                        <div className="flex justify-center mb-6">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L9 5h6l-3-3zM7.5 6L5 9h14l-2.5-3H7.5zM4 11v2h16v-2H4zm1 4v5h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-5H5zm-1 6v1h16v-1H4z" />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold mb-2 text-[var(--fg-primary)]">Connect Your Account</h1>
                        <p className="text-gray-400 text-sm">Enter your Chess.com username to sync your games and start analyzing.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {/* Input Group */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">Chess.com Username</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg py-4 pl-12 pr-4 text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)] focus:outline-none focus:border-[var(--accent-gold)] focus:ring-2 focus:ring-[var(--accent-gold)]/20 transition-all"
                                    placeholder="e.g. MagnusCarlsen"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                We'll fetch your public profile and recent games automatically.
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-700 text-black font-semibold py-3.5 rounded-lg shadow-[0_4px_20px_rgba(212,160,18,0.25)] hover:shadow-[0_8px_30px_rgba(212,160,18,0.35)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : "Continue"}
                        </button>

                    </form>

                    {/* Footer / Terms */}
                    <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] text-center">
                        <p className="text-xs text-gray-500">
                            By continuing, you agree to our <a href="#" className="text-gray-400 hover:text-white underline">Terms of Service</a> and <a href="#" className="text-gray-400 hover:text-white underline">Privacy Policy</a>.
                        </p>
                    </div>

                </div>

                {/* Additional Help Link */}
                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-2 justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>

            </main>

            {/* Minimal Footer */}
            <footer className="py-6 text-center text-xs text-gray-600 border-t border-[var(--border-subtle)]/50">
                2025 ChessForge. All rights reserved.
            </footer>
        </div>
    );
}