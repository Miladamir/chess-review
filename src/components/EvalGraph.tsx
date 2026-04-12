'use client';

import { memo, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip, Dot } from 'recharts';
import { useChessStore } from '@/store/chessStore';
import { Classification } from '@/utils/analysis';

interface ChartDataPoint {
    move: number;
    score: number;
    classification: Classification | null;
}

const EvalGraphComponent = () => {
    // Select specific state slices
    const analysis = useChessStore((state) => state.analysis);
    const movesList = useChessStore((state) => state.movesList);
    const currentMoveIndex = useChessStore((state) => state.currentMoveIndex);
    const jumpToMove = useChessStore((state) => state.jumpToMove);

    const chartData = useMemo(() => {
        const data: ChartDataPoint[] = [{ move: 0, score: 0, classification: null }];
        for (let i = 0; i < movesList.length; i++) {
            const moveAnalysis = analysis[i];
            let score = 0;
            if (moveAnalysis) {
                if (moveAnalysis.mate) {
                    score = moveAnalysis.mate > 0 ? 10 : -10;
                } else if (moveAnalysis.scoreAfter !== undefined) {
                    score = moveAnalysis.scoreAfter / 100;
                }
            }
            data.push({
                move: i + 1,
                score: score,
                classification: moveAnalysis?.classification || null
            });
        }
        return data;
    }, [analysis, movesList]);

    const handleClick = (data: any) => {
        if (data && data.activePayload) {
            const moveIndex = data.activePayload[0].payload.move;
            jumpToMove(moveIndex);
        }
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const score = payload[0].value;
            const absScore = Math.abs(score);
            const turn = score >= 0 ? 'White' : 'Black';
            return (
                <div className="bg-slate-900 border border-slate-700 text-white text-xs p-2 rounded shadow-lg">
                    <p className="font-bold mb-1">Move {label}</p>
                    <p style={{ color: score >= 0 ? '#fff' : '#94a3b8' }}>
                        {turn} +{absScore.toFixed(1)}
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomDot = (props: any) => {
        const { cx, cy, payload } = props;
        if (!payload.classification) return <Dot cx={cx} cy={cy} r={0} />;
        const colorMap: Record<string, string> = {
            brilliant: '#06b6d4', great: '#06b6d4', best: '#22c55e', excellent: '#22c55e',
            good: '#3b82f6', book: '#64748b', miss: '#f97316', inaccuracy: '#eab308',
            mistake: '#f97316', blunder: '#ef4444',
        };
        const color = colorMap[payload.classification] || '#8884d8';
        if (['brilliant', 'great', 'miss', 'mistake', 'blunder', 'inaccuracy'].includes(payload.classification)) {
            return <Dot cx={cx} cy={cy} r={3} fill={color} stroke={color} strokeWidth={1} />;
        }
        return <Dot cx={cx} cy={cy} r={0} />;
    };

    // Inside src/components/EvalGraph.tsx return statement:
    if (movesList.length === 0) return null;

    return (
        <div className="w-full">
            <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        onClick={handleClick}
                        margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                    >
                        <XAxis dataKey="move" stroke="#334155" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={{ stroke: '#334155' }} />
                        <YAxis domain={[-5, 5]} stroke="#334155" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={{ stroke: '#334155' }} allowDataOverflow={true} />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={0} stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            dot={<CustomDot />}
                            activeDot={{ r: 5, fill: '#06b6d4', onClick: handleClick }}
                            connectNulls={true}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default memo(EvalGraphComponent);