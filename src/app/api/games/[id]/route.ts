// src/app/api/games/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const game = await prisma.game.findUnique({
            where: { id: params.id },
        });

        if (!game) {
            return NextResponse.json({ error: 'Game not found' }, { status: 404 });
        }

        // FIX: Parse analysis string back to object
        const parsedGame = {
            ...game,
            analysis: JSON.parse(game.analysis)
        };

        return NextResponse.json(parsedGame);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load game' }, { status: 500 });
    }
}