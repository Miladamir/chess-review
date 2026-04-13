import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const session = await getCurrentUser();

    if (!session || !session.user?.username) {
        return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    const username = session.user.username;

    try {
        // 1. Get Archives List
        const archivesRes = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`, {
            headers: { 
                'User-Agent': 'ChessInsight (Contact: your-real-email@gmail.com)',
                'Accept': 'application/json'
            },
            cache: 'no-store'
        });
        
        if (!archivesRes.ok) {
            console.error(`Archives API Error [${archivesRes.status}]`);
            throw new Error('Failed to fetch archives');
        }

        const archivesData = await archivesRes.json();
        const archives: string[] = archivesData.archives || [];

        if (archives.length === 0) return NextResponse.json([]);

        // 2. Fetch the last 3 months of games concurrently
        const recentArchives = archives.slice(-3);
        
        const gamesPromises = recentArchives.map((url: string) => 
            fetch(url, { 
                headers: { 
                    'User-Agent': 'ChessInsight (Contact: miladamiri201a@gmail.com)',
                    'Accept': 'application/json'
                },
                cache: 'no-store'
            })
                .then(res => res.json())
                .then(data => data.games || [])
                .catch(() => []) // Gracefully handle a failed month fetch
        );

        const gamesArrays = await Promise.all(gamesPromises);
        const allGames: any[] = gamesArrays.flat();

        // 3. Format for frontend
        const formatted = allGames.map(g => {
            const pgnLines: string[] = (g.pgn || '').split('\n');
            let opening = '';
            let eco = '';
            
            pgnLines.forEach((line: string) => {
                if (line.startsWith('[Opening ')) opening = line.replace(/[\[\]"]/g, '').split(' ').slice(1).join(' ') || '';
                if (line.startsWith('[ECO ')) eco = line.replace(/[\[\]"]/g, '').split(' ')[1] || '';
            });

            const moveText = pgnLines.filter((l: string) => !l.startsWith('[')).join(' ');
            const moveCountMatch = moveText.match(/\d+\.\s/g);
            const moves = moveCountMatch ? moveCountMatch.length : 0;

            const isWhite = g.white.username.toLowerCase() === username.toLowerCase();
            const playerResult = isWhite ? g.white.result : g.black.result;
            
            let resultType: 'win' | 'loss' | 'draw' = 'draw';
            if (playerResult === 'win') {
                resultType = 'win';
            } else if (['repetition', 'agreed', 'stalemate', 'insufficient'].includes(playerResult)) {
                resultType = 'draw';
            } else if (['checkmated', 'timeout', 'resigned', 'abandoned'].includes(playerResult)) {
                resultType = 'loss';
            }

            return {
                url: g.url,
                pgn: g.pgn,
                white: g.white.username,
                whiteRating: g.white.rating,
                black: g.black.username,
                blackRating: g.black.rating,
                time: g.end_time,
                timeClass: g.time_class,
                timeControl: g.time_control,
                result: resultType,
                eco,
                opening,
                moves
            };
        }).sort((a, b) => b.time - a.time);

        return NextResponse.json(formatted);

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}
