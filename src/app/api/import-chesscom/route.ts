// src/app/api/import-chesscom/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const gameId = searchParams.get('gameId');
    const gameType = searchParams.get('type') || 'live';

    if (!gameId) {
        return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
    }

    // Headers to mimic a real browser (Critical for Chess.com anti-bot)
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Referer': 'https://www.chess.com/',
        'Accept': '*/*',
    };

    let pgnText: string | null = null;

    // STRATEGY 1: Try Official JSON API (Cleanest)
    try {
        console.log(`Attempt 1: Fetching API for ID ${gameId}...`);
        const apiUrl = `https://api.chess.com/pub/game/${gameId}`;

        const res = await fetch(apiUrl, { headers, cache: 'no-store' });

        if (res.ok) {
            const data = await res.json();
            if (data.pgn) {
                pgnText = data.pgn;
                console.log("Success via API.");
            }
        }
    } catch (e) {
        console.log("API attempt failed, trying fallback...");
    }

    // STRATEGY 2: Fallback to Web PGN Download (If API fails)
    if (!pgnText) {
        try {
            console.log(`Attempt 2: Fetching PGN directly for ID ${gameId}...`);
            // This URL is what the browser uses when you click "Download PGN"
            const directUrl = `https://www.chess.com/game/${gameType}/${gameId}/pgn`;

            const res = await fetch(directUrl, { headers, cache: 'no-store' });

            if (res.ok) {
                pgnText = await res.text();
                console.log("Success via Direct PGN.");
            } else {
                console.log(`Direct PGN failed with status: ${res.status}`);
            }
        } catch (e) {
            console.error("Fallback fetch error:", e);
        }
    }

    // Result Handling
    if (!pgnText) {
        return NextResponse.json(
            { error: 'Game not found. It might be private, too recent, or the ID is invalid.' },
            { status: 404 }
        );
    }

    // Validate PGN content isn't an error message
    if (pgnText.includes("Page Not Found") || pgnText.length < 50) {
        return NextResponse.json(
            { error: 'Invalid PGN data retrieved.' },
            { status: 500 }
        );
    }

    return NextResponse.json({ pgn: pgnText });
}