'use client';

import { useChessStore } from '@/store/chessStore';

export default function GameHeader() {
    const headers = useChessStore((state) => state.headers);

    // If no meaningful headers, return null or a placeholder
    if (Object.keys(headers).length === 0) {
        return (
            <div className="w-full bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 mb-2 text-center">
                <span className="text-sm text-slate-400">No game loaded</span>
            </div>
        );
    }

    const white = headers['White'] || 'White';
    const black = headers['Black'] || 'Black';
    const whiteElo = headers['WhiteElo'] ? `(${headers['WhiteElo']})` : '';
    const blackElo = headers['BlackElo'] ? `(${headers['BlackElo']})` : '';
    const event = headers['Event'] || 'Casual Game';
    const date = headers['Date'] ? new Date(headers['Date']).toLocaleDateString() : '';
    const eco = headers['ECO'] || '';
    const result = headers['Result'] || '*';

    // Format Result text
    let resultText = '';
    if (result === '1-0') resultText = 'White wins';
    else if (result === '0-1') resultText = 'Black wins';
    else if (result === '1/2-1/2') resultText = 'Draw';

    return (
        <div className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-2 mb-2">

            {/* Players Section */}
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-white border border-slate-300 rounded-sm"></div>
                        <span className="font-semibold text-white text-sm md:text-base">{white}</span>
                        <span className="text-xs text-slate-400">{whiteElo}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-3 h-3 bg-slate-900 border border-slate-500 rounded-sm"></div>
                        <span className="font-semibold text-white text-sm md:text-base">{black}</span>
                        <span className="text-xs text-slate-400">{blackElo}</span>
                    </div>
                </div>
            </div>

            {/* Result & Info Section */}
            <div className="flex flex-col items-center md:items-end gap-0.5 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-700 pt-2 md:pt-0 md:pl-4">
                {resultText && (
                    <span className="text-sm font-bold text-cyan-400">
                        {resultText}
                    </span>
                )}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    {event && <span>{event}</span>}
                    {event && date && <span>•</span>}
                    {date && <span>{date}</span>}
                </div>
                {eco && (
                    <span className="text-[10px] text-slate-500 font-mono mt-1">
                        {eco} {headers['Opening'] || ''}
                    </span>
                )}
            </div>
        </div>
    );
}