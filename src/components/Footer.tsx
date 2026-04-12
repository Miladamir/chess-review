// src/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative bg-[#0a0c0f] mt-12">
            {/* Top Gradient Divider */}
            <div className="gradient-divider"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Top Section: Brand + Newsletter */}
                <div className="grid lg:grid-cols-2 gap-12 pb-12 border-b border-gray-800/50">

                    {/* Brand Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
                                <svg className="w-7 h-7 text-black" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L9 5h6l-3-3zM7.5 6L5 9h14l-2.5-3H7.5zM4 11v2h16v-2H4zm1 4v5h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-5H5zm-1 6v1h16v-1H4z" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold text-[var(--fg-primary)]">ChessInsight</span>
                        </div>
                        <p className="text-gray-400 max-w-sm leading-relaxed">
                            The most powerful chess analysis platform on the web. Understand your games, fix your mistakes, and master chess.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="social-icon-btn" aria-label="Twitter">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                            </a>
                            <a href="#" className="social-icon-btn" aria-label="Discord">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" /></svg>
                            </a>
                            <a href="#" className="social-icon-btn" aria-label="GitHub">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:text-right lg:flex lg:flex-col lg:items-end lg:justify-center">
                        <h3 className="text-lg font-semibold mb-2 text-[var(--fg-primary)]">Stay Updated</h3>
                        <p className="text-gray-400 text-sm mb-4 lg:max-w-xs">Get the latest features and chess insights directly to your inbox.</p>
                        <form className="flex gap-2 w-full max-w-md lg:ml-auto">
                            <input type="email" placeholder="Enter your email" className="flex-1 bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-amber-500 transition-colors text-white" />
                            <button type="button" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-5 py-3 rounded-lg text-sm transition-colors whitespace-nowrap">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Section: Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
                    {/* Product */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-4">Product</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/review" className="footer-link">Features</Link></li>
                            <li><Link href="#" className="footer-link">Pricing</Link></li>
                            <li><Link href="#" className="footer-link">API</Link></li>
                        </ul>
                    </div>
                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-4">Resources</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="footer-link">Blog</Link></li>
                            <li><Link href="/review" className="footer-link">Opening Explorer</Link></li>
                            <li><Link href="#" className="footer-link">Documentation</Link></li>
                        </ul>
                    </div>
                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-4">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="footer-link">About Us</Link></li>
                            <li><Link href="#" className="footer-link">Support</Link></li>
                            <li><Link href="#" className="footer-link">Contact</Link></li>
                        </ul>
                    </div>
                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="footer-link">Privacy Policy</Link></li>
                            <li><Link href="#" className="footer-link">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                    <p>2025 ChessInsight. All rights reserved.</p>
                    <p>Crafted with precision for chess players worldwide.</p>
                </div>
            </div>
        </footer>
    );
}