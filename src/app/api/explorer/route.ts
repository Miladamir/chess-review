// src/app/api/explorer/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const fen = searchParams.get('fen');

    if (!fen) {
        return NextResponse.json({ error: 'FEN is required' }, { status: 400 });
    }

    const token = process.env.LICHESS_EXPLORER_TOKEN;
    if (!token) {
        return NextResponse.json(
            { error: 'Lichess token not configured on server' },
            { status: 500 }
        );
    }

    try {
        const explorerUrl = `https://explorer.lichess.ovh/masters?fen=${encodeURIComponent(fen)}`;

        const res = await fetch(explorerUrl, {
            headers: {
                'User-Agent': 'ChessReviewer/1.0 (mailto:your-real-email@example.com)', // ← use real contact
                'Authorization': `Bearer ${token}`,   // ← THIS IS THE FIX
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Lichess Explorer Error ${res.status}: ${errorText}`);
            return NextResponse.json(
                { error: `Lichess API returned ${res.status}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Explorer Proxy Error:', error);
        return NextResponse.json({ error: 'Failed to fetch opening data' }, { status: 500 });
    }
}