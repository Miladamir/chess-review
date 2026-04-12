// src/app/api/games/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const session = await getCurrentUser();

    try {
        const body = await request.json();
        const { pgn, analysis, white, black } = body;

        if (!pgn) {
            return NextResponse.json({ error: 'PGN is required' }, { status: 400 });
        }

        // FIX: Convert analysis object to JSON string for SQLite
        const analysisString = JSON.stringify(analysis || {});

        const game = await prisma.game.create({
            data: {
                pgn,
                analysis: analysisString,
                white: white || 'White',
                black: black || 'Black',
                userId: session?.user?.id || null, // Link to user if logged in
            },
        });

        return NextResponse.json(game);
    } catch (error) {
        console.error('Save Error:', error);
        return NextResponse.json({ error: 'Failed to save game' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const games = await prisma.game.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20,
        });

        // FIX: Parse the analysis string back into an object for the frontend
        const parsedGames = games.map(game => ({
            ...game,
            analysis: JSON.parse(game.analysis)
        }));

        return NextResponse.json(parsedGames);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}