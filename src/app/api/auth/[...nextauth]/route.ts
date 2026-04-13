import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Chess.com Username",
            credentials: {
                username: { label: "Chess.com Username", type: "text", placeholder: "MagnusCarlsen" },
            },
            async authorize(credentials) {
                if (!credentials?.username) return null;

                // FIX 1: Force lowercase BEFORE sending to the API
                const username = credentials.username.trim().toLowerCase();

                try {
                    // 1. Verify user exists on Chess.com
                    const res = await fetch(`https://api.chess.com/pub/player/${username}`, {
                        headers: {
                            // FIX 2: Chess.com requires this exact format to whitelist server-side requests
                            'User-Agent': 'ChessInsight (Contact: miladamiri201a@gmail.com)', 
                            'Accept': 'application/json',
                        },
                        cache: 'no-store' // Prevent Vercel from caching 403 error responses
                    });

                    // If not OK, log the ACTUAL status code so we know why it failed
                    if (!res.ok) {
                        const errorText = await res.text();
                        console.error(`Chess.com Auth API Error [${res.status}]: ${errorText}`);
                        
                        if (res.status === 404) throw new Error("User not found on Chess.com.");
                        if (res.status === 403 || res.status === 429) throw new Error("Chess.com is currently blocking the server. Please try again later.");
                        
                        throw new Error("Failed to connect to Chess.com API.");
                    }

                    const playerData = await res.json();
                    const name = playerData.name || username;

                    // 2. Create or Update user in our DB
                    const user = await prisma.user.upsert({
                        where: { username: username }, // Normalize to lowercase
                        update: { name: name },
                        create: {
                            username: username,
                            name: name
                        },
                    });

                    return { id: user.id, name: user.name, username: user.username };
                } catch (e: any) {
                    console.error("Auth Error:", e.message);
                    // Pass the specific error message to the frontend so the user isn't blind
                    throw new Error(e.message || "Authentication failed");
                }
            }
        })
    ],
    session: { strategy: "jwt" },
    pages: { signIn: "/login" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
            }
            return session;
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
