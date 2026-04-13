// src/app/api/auth/[...nextauth]/route.ts
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
                            // FIX 2: Replace with your ACTUAL email or website URL
                            // Chess.com blocks Vercel/AWS IPs if this looks like a placeholder!
                            'User-Agent': 'ChessInsight App - miladamiri201a@gmail.com'
                        }
                    });

                    // If 404 or error, user doesn't exist
                    if (!res.ok) {
                        // Log the actual status code so you can see if it's 404 (Not Found) or 403 (Blocked)
                        console.log(`Chess.com API Error: ${res.status} for user ${username}`);
                        return null;
                    }

                    const playerData = await res.json();
                    const name = playerData.name || username;

                    // 2. Create or Update user in our DB
                    const user = await prisma.user.upsert({
                        where: { username: username }, // Already lowercase
                        update: { name: name },
                        create: {
                            username: username,
                            name: name
                        },
                    });

                    return { id: user.id, name: user.name, username: user.username };
                } catch (e) {
                    console.error("Auth Error:", e);
                    return null;
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