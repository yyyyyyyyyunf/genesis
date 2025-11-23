import React from 'react';
import { z } from 'zod';
import { StaticChartSchema } from './schema';

type StaticChartProps = z.infer<typeof StaticChartSchema>;

export const StaticChart = ({ data }: { data: StaticChartProps }) => {
  const { title, type, data: values, labels, color, height } = data;
  
  const maxValue = Math.max(...values, 1);
  const count = values.length;
  const padding = 20;
  const chartHeight = height - padding * 2;
  const width = 600; // 固定视图宽度
  const chartWidth = width - padding * 2;
  const barWidth = (chartWidth / count) * 0.6;
  const stepX = chartWidth / (count - 1 || 1);

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          {/* 网格线 */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" strokeWidth="1" />

          {type === 'bar' && values.map((val, i) => {
            const h = (val / maxValue) * chartHeight;
            const x = padding + i * (chartWidth / count) + (chartWidth / count - barWidth) / 2;
            const y = height - padding - h;
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={h}
                  fill={color}
                  rx="4"
                />
                {labels && labels[i] && (
                  <text
                    x={x + barWidth / 2}
                    y={height - padding + 15}
                    textAnchor="middle"
                    className="text-xs fill-gray-500"
                    fontSize="12"
                  >
                    {labels[i]}
                  </text>
                )}
              </g>
            );
          })}

          {type === 'line' && (
            <>
              <path
                d={`M ${values.map((val, i) => {
                  const x = padding + i * stepX;
                  const y = height - padding - (val / maxValue) * chartHeight;
                  return `${x} ${y}`;
                }).join(' L ')}`}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {values.map((val, i) => {
                const x = padding + i * stepX;
                const y = height - padding - (val / maxValue) * chartHeight;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="white" stroke={color} strokeWidth="2" />
                     {labels && labels[i] && (
                      <text
                        x={x}
                        y={height - padding + 15}
                        textAnchor="middle"
                        className="text-xs fill-gray-500"
                        fontSize="12"
                      >
                        {labels[i]}
                      </text>
                    )}
                  </g>
                );
              })}
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

