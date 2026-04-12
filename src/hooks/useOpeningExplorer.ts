// src/hooks/useOpeningExplorer.ts
'use client';

import { useState, useEffect } from 'react';

interface OpeningMove {
    san: string;
    white: number;
    draws: number;
    black: number;
    total: number;
}

// Define the shape of the opening object
interface OpeningInfo {
    eco: string;
    name: string;
}

interface OpeningData {
    moves: OpeningMove[];
    opening: OpeningInfo | null; // FIX: Changed from string | null
    topGames?: any[];
}

export function useOpeningExplorer(fen: string | null) {
    const [data, setData] = useState<OpeningData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!fen) {
            setData(null);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/explorer?fen=${encodeURIComponent(fen)}`);
                if (!res.ok) throw new Error('Failed to fetch');

                const json = await res.json();
                setData(json);
            } catch (e) {
                setError("Could not load opening data");
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timeoutId);

    }, [fen]);

    return { data, loading, error };
}