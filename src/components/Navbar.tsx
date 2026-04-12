// src/components/Navbar.tsx
'use client';

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.pageYOffset > 20) setScrolled(true);
            else setScrolled(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Keyboard shortcut for Search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(prev => !prev);
            }
            if (e.key === 'Escape') setIsSearchOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <nav id="navbar" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'nav-scrolled' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">

                        {/* Left: Logo */}
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg group-hover:shadow-amber-500/30 transition-shadow">
                                    {/* Using your logo image inside the gold box, or just the SVG if preferred */}
                                    <div className="relative w-6 h-6">
                                        <Image src="/images/logo.png" alt="Logo" fill className="object-contain" />
                                    </div>
                                </div>
                                <span className="text-xl font-bold tracking-tight hidden sm:block text-[var(--fg-primary)]">ChessInsight</span>
                            </Link>

                            {/* Desktop Nav Links */}
                            <div className="hidden lg:flex items-center gap-8 ml-6">
                                <Link href="/review" className="nav-link text-sm">Analysis</Link>
                                <Link href="/my-games" className="nav-link text-sm">My Games</Link>
                                <Link href="#" className="nav-link text-sm">Openings</Link>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-3">

                            {/* Search Button (Desktop) */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-md transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <span>Search...</span>
                                <kbd className="hidden sm:block text-xs bg-black/20 px-1.5 py-0.5 rounded text-gray-500">⌘K</kbd>
                            </button>

                            {session ? (
                                /* Logged In State */
                                <div className="dropdown-trigger relative hidden md:block cursor-pointer">
                                    <div className="flex items-center gap-3 p-1 rounded-lg hover:bg-white/5 transition-colors">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-green-400 flex items-center justify-center text-xs font-bold text-black shadow-md">
                                            {session.user?.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>

                                    <div className="dropdown-menu p-2">
                                        <div className="px-3 py-2 border-b border-gray-700 mb-2">
                                            <div className="font-semibold">{session.user?.username}</div>
                                            <div className="text-xs text-gray-400">Pro Plan</div>
                                        </div>
                                        <Link href="/review" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-md w-full text-left">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            Profile
                                        </Link>
                                        <Link href="/review" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-md w-full text-left">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            Settings
                                        </Link>
                                        <div className="border-t border-gray-700 mt-2 pt-2">
                                            <button onClick={() => signOut()} className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md w-full text-left">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                Log Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Logged Out State */
                                <>
                                    <Link href="/login" className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition-colors mr-2">Sign In</Link>
                                    <Link href="/login" className="btn-primary hidden md:block">Sign Up</Link>
                                </>
                            )}

                            {/* Mobile Menu Toggle */}
                            <button className="hamburger lg:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                                <span></span><span></span><span></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`mobile-menu lg:hidden ${isOpen ? 'open' : ''}`}>
                    <div className="px-4 py-6 space-y-6">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input type="text" placeholder="Search games, openings..." className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500" />
                        </div>
                        <nav className="flex flex-col gap-4 text-lg font-medium">
                            <Link href="/review" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">Analysis</Link>
                            <Link href="/my-games" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">My Games</Link>
                            <Link href="#" className="text-gray-300 hover:text-white">Openings</Link>
                        </nav>
                        <div className="border-t border-gray-800 pt-6 flex flex-col gap-3">
                            {session ? (
                                <>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center font-bold text-black">
                                            {session.user?.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{session.user?.username}</div>
                                            <div className="text-xs text-gray-500">Pro Plan</div>
                                        </div>
                                    </div>
                                    <Link href="#" className="text-gray-400 hover:text-white">Profile</Link>
                                    <Link href="#" className="text-gray-400 hover:text-white">Settings</Link>
                                    <button onClick={() => signOut()} className="text-red-400 hover:text-red-300 text-left">Log Out</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="text-gray-400 hover:text-white py-2">Sign In</Link>
                                    <Link href="/login" className="btn-primary text-center">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Search Modal */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 backdrop-blur-sm pt-[20vh]" onClick={() => setIsSearchOpen(false)}>
                    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl w-full max-w-[560px] shadow-2xl mx-4" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input type="text" placeholder="Type a command or search..." className="bg-transparent flex-1 text-lg focus:outline-none text-gray-200 placeholder-gray-500" autoFocus />
                            <kbd className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded border border-gray-600">ESC</kbd>
                        </div>
                        <div className="p-2 max-h-96 overflow-y-auto">
                            <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide">Quick Actions</div>
                            <div className="hover:bg-white/5 rounded-lg p-3 cursor-pointer flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-500/20 text-blue-400 p-1.5 rounded"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></div>
                                    <span className="text-sm text-gray-200">Import New Game</span>
                                </div>
                                <span className="text-xs text-gray-600 group-hover:text-gray-400">Jump to</span>
                            </div>
                            <div className="hover:bg-white/5 rounded-lg p-3 cursor-pointer flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-teal-500/20 text-teal-400 p-1.5 rounded"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
                                    <span className="text-sm text-gray-200">View Statistics</span>
                                </div>
                                <span className="text-xs text-gray-600 group-hover:text-gray-400">Jump to</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}