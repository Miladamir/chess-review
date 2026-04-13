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

                const username = credentials.username.trim().toLowerCase(); 

                try {
                    const res = await fetch(`https://api.chess.com/pub/player/${username}`, {
                        headers: {
                            // CRITICAL: Must follow this exact format for Chess.com to whitelist it
                            'User-Agent': 'ChessInsight (Contact: your-real-email@gmail.com)', 
                            'Accept': 'application/json', // Tell them we want JSON
                        },
                        cache: 'no-store' // Prevent Vercel from caching the 403 error
                    });

                    // If not OK, log the ACTUAL status code so we know why it failed
                    if (!res.ok) {
                        const errorText = await res.text();
                        console.error(`Chess.com API Error [${res.status}]: ${errorText}`);
                        
                        // You can optionally throw a specific error here that the frontend can read
                        if (res.status === 404) throw new Error("User not found");
                        if (res.status === 403 || res.status === 429) throw new Error("Chess.com is blocking the server. Try again later.");
                        
                        return null;
                    }

                    const playerData = await res.json();
                    const name = playerData.name || username;

                    const user = await prisma.user.upsert({
                        where: { username: username },
                        update: { name: name },
                        create: {
                            username: username,
                            name: name
                        },
                    });

                    return { id: user.id, name: user.name, username: user.username };
                } catch (e: any) {
                    console.error("Auth Error:", e.message);
                    // Pass the specific error message to the frontend if available
                    throw new Error(e.message || "Authentication failed");
                }
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
