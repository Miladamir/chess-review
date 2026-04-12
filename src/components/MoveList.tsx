// src/components/MoveList.tsx
'use client';

import { useChessStore } from '@/store/chessStore';
import Image from 'next/image';

const classificationConfig: Record<string, { src: string; color: string; cssClass: string }> = {
    brilliant: { src: '/images/brilliant.png', color: 'text-amber-400', cssClass: 'quality-brilliant' },
    great: { src: '/images/great.png', color: 'text-teal-400', cssClass: 'quality-great' },
    best: { src: '/images/best.png', color: 'text-green-400', cssClass: 'quality-best' },
    excellent: { src: '/images/excellent.png', color: 'text-green-400', cssClass: 'quality-excellent' },
    good: { src: '/images/good.png', color: 'text-blue-400', cssClass: 'quality-good' },
    book: { src: '/images/book.png', color: 'text-gray-400', cssClass: 'quality-book' },
    miss: { src: '/images/miss.png', color: 'text-orange-400', cssClass: 'quality-miss' },
    inaccuracy: { src: '/images/inaccuracy.png', color: 'text-yellow-500', cssClass: 'quality-inaccuracy' },
    mistake: { src: '/images/mistake.png', color: 'text-orange-500', cssClass: 'quality-mistake' },
    blunder: { src: '/images/blunder.png', color: 'text-red-500', cssClass: 'quality-blunder' },
};

export default function MoveList() {
    const { movesList, currentMoveIndex, jumpToMove, analysis } = useChessStore();

    const getMovePairs = () => {
        const pairs = [];
        for (let i = 0; i < movesList.length; i += 2) {
            pairs.push({
                moveNumber: Math.floor(i / 2) + 1,
                whiteMove: movesList[i],
                blackMove: movesList[i + 1] || null,
                whiteIndex: i,
                blackIndex: i + 1,
            });
        }
        return pairs;
    };

    const movePairs = getMovePairs();

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 min-h-0 font-mono text-sm">
            {movePairs.map((pair) => (
                <div key={pair.moveNumber} className="flex items-center gap-1 px-1">
                    <span className="w-8 text-gray-600 text-xs">{pair.moveNumber}.</span>

                    {/* White Move */}
                    <button
                        onClick={() => jumpToMove(pair.whiteIndex + 1)}
                        className={`move-chip flex-1 text-gray-300 text-left flex items-center justify-between
                            ${currentMoveIndex === pair.whiteIndex + 1 ? 'active' : ''} 
                            ${analysis[pair.whiteIndex] ? classificationConfig[analysis[pair.whiteIndex].classification!]?.cssClass || '' : ''}`}
                    >
                        <span>{pair.whiteMove}</span>
                        {analysis[pair.whiteIndex] && <Badge type={analysis[pair.whiteIndex].classification || ''} />}
                    </button>

                    {/* Black Move */}
                    {pair.blackMove && (
                        <button
                            onClick={() => jumpToMove(pair.blackIndex + 1)}
                            className={`move-chip flex-1 text-gray-300 text-left flex items-center justify-between
                                ${currentMoveIndex === pair.blackIndex + 1 ? 'active' : ''} 
                                ${analysis[pair.blackIndex] ? classificationConfig[analysis[pair.blackIndex].classification!]?.cssClass || '' : ''}`}
                        >
                            <span>{pair.blackMove}</span>
                            {analysis[pair.blackIndex] && <Badge type={analysis[pair.blackIndex].classification || ''} />}
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

function Badge({ type }: { type: string }) {
    const config = classificationConfig[type];
    if (!config) return null;
    return (
        <span className={`eval-badge flex items-center ${config.color}`}>
            <span className="relative w-3.5 h-3.5">
                <Image src={config.src} alt={type} fill className="object-contain" unoptimized />
            </span>
        </span>
    );
}