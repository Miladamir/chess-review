// src/app/page.tsx
"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export default function Home() {
  // Setup for the Hero Board Visual (Ruy Lopez position)
  const game = new Chess("r1bqkbnr/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4");

  // Scroll Reveal Logic
  useEffect(() => {
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-28 pb-12 sm:pt-32 overflow-hidden flex flex-col justify-center">
        {/* Hero Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Text Content */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6 anim-fade-up">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-sm text-amber-400 font-medium">Powered by Stockfish 16</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 anim-fade-up delay-100">
              Understand Every Move.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                Master Your Game.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto anim-fade-up delay-200">
              Professional-grade chess analysis. Identify blunders, discover brilliant moves, and accelerate your
              improvement.
            </p>

            {/* Input Area */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto anim-fade-up delay-300">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Paste game URL or PGN..."
                  className="input-hero w-full pr-12"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
              </div>
              <Link href="/review" className="btn-primary text-base py-4 px-8 text-center">
                Analyze
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-gray-500 mt-8 anim-fade-up delay-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Free analysis</span>
              </div>
            </div>
          </div>

          {/* Hero Board Visual */}
          <div className="relative max-w-5xl mx-auto anim-scale-up delay-400">
            {/* Glow Behind Board */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-teal-500/10 rounded-2xl blur-3xl opacity-50" />

            <div className="card p-2 sm:p-4 relative overflow-hidden">
              <div className="grid lg:grid-cols-3 gap-4">
                {/* Board Area */}
                <div className="lg:col-span-2 relative">
                  {/* Player Top */}
                  <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
                      MC
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-300">MagnusCarlsen</div>
                    </div>
                    <div className="bg-gray-800 px-2 py-1 rounded text-xs font-mono text-gray-400">2847</div>
                  </div>

                  {/* Board Placeholder / Real Board */}
                  <div className="aspect-square w-full rounded-lg overflow-hidden relative">
                    <Chessboard
                      position={game.fen()}
                      customBoardStyle={{ borderRadius: '4px' }}
                      customDarkSquareStyle={{ backgroundColor: '#769656' }}
                      customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
                      arePiecesDraggable={false}
                    />
                    {/* Overlay for demo purposes, matching the sample's aesthetic but keeping the board visible */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 backdrop-blur-sm transition-all group cursor-pointer">
                      <Link href="/review" className="text-center p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-lg bg-gray-800/80 border border-gray-700 flex items-center justify-center mx-auto mb-3">
                          <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9 5h6l-3-4zM6 8v2h12V8H6zm1 4v8h2v-4h2v4h2v-4h2v4h2v-8H7z" /></svg>
                        </div>
                        <span className="text-sm text-white font-mono block">Click to Analyze</span>
                      </Link>
                    </div>
                  </div>

                  {/* Player Bottom */}
                  <div className="flex items-center gap-3 px-2 py-2 mt-1">
                    <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
                      H
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-300">Hikaru</div>
                    </div>
                    <div className="bg-gray-800 px-2 py-1 rounded text-xs font-mono text-gray-400">2790</div>
                  </div>
                </div>

                {/* Analysis Sidebar */}
                <div className="border-t lg:border-t-0 lg:border-l border-gray-700/50 lg:pl-4 pt-4 lg:pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Moves</span>
                    <span className="text-xs font-mono text-amber-500">+1.2</span>
                  </div>
                  <div className="space-y-1 font-mono text-sm h-64 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex justify-between p-2 rounded bg-white/5 text-gray-400">
                      <span>1.</span>
                      <span className="text-gray-200">e4</span>
                      <span>e5</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-white/5 text-gray-400">
                      <span>2.</span>
                      <span className="text-gray-200">Nf3</span>
                      <span>Nc6</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-amber-500/10 border-l-2 border-amber-500">
                      <span>3.</span>
                      <span className="text-amber-400">Bb5!</span>
                      <span className="text-gray-400">a6</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-red-500/10 border-l-2 border-red-500">
                      <span>4.</span>
                      <span className="text-gray-200">Ba4</span>
                      <span className="text-red-400">Nf6?</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-white/5 text-gray-400">
                      <span>5.</span>
                      <span className="text-gray-200">O-O</span>
                      <span>Be7</span>
                    </div>
                  </div>
                  <div className="mt-4 bg-gray-800/50 rounded p-3 border border-gray-700/50">
                    <div className="text-xs text-gray-500 mb-1">Best Line</div>
                    <div className="text-xs font-mono text-gray-300 leading-relaxed">
                      5. O-O Be7 6. Re1 b5 7. Bb3 d6
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 reveal-on-scroll">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Professional Tools</h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Everything you need to improve your chess.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="card p-6 reveal-on-scroll">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Blunder Detection</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Instantly identify game-changing mistakes and understand why.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-6 reveal-on-scroll">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Brilliant Moves</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Discover your best moves with clear classification.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-6 reveal-on-scroll">
              <div className="w-12 h-12 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Evaluation Graph</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Visualize game flow and momentum shifts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 reveal-on-scroll">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-gray-400 text-base sm:text-lg">Start free, upgrade for more power.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="card p-6 reveal-on-scroll">
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">Free</div>
              <div className="text-4xl font-bold mb-4">$0</div>
              <p className="text-gray-400 text-sm mb-6">For casual players</p>
              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex items-center gap-3">
                  <span className="text-teal-500">&#10003;</span> 5 analyses/day
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-teal-500">&#10003;</span> Depth 20
                </li>
              </ul>
              <button className="btn-secondary w-full text-sm">Get Started</button>
            </div>

            {/* Pro */}
            <div
              className="card p-6 border-amber-500/30 relative reveal-on-scroll"
              style={{ background: "linear-gradient(180deg, rgba(212, 160, 18, 0.05) 0%, rgba(18, 21, 26, 0.6) 100%)" }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-black text-xs font-semibold rounded-full">
                Popular
              </div>
              <div className="text-sm text-amber-500 uppercase tracking-wider mb-2">Pro</div>
              <div className="text-4xl font-bold mb-4">
                $9<span className="text-lg text-gray-500 font-normal">/mo</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">For serious improvers</p>
              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex items-center gap-3">
                  <span className="text-amber-500">&#10003;</span> Unlimited analyses
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-amber-500">&#10003;</span> Depth 25+
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-amber-500">&#10003;</span> Opening Explorer
                </li>
              </ul>
              <button className="btn-primary w-full text-sm">Upgrade</button>
            </div>

            {/* Team */}
            <div className="card p-6 reveal-on-scroll">
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">Team</div>
              <div className="text-4xl font-bold mb-4">Custom</div>
              <p className="text-gray-400 text-sm mb-6">For clubs and coaches</p>
              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex items-center gap-3">
                  <span className="text-teal-500">&#10003;</span> Everything in Pro
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-teal-500">&#10003;</span> Team Management
                </li>
              </ul>
              <button className="btn-secondary w-full text-sm">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}