import React, { useMemo, useState, useEffect, useRef } from 'react';
import { line as d3Line, curveMonotoneX as d3CurveMonotoneX } from 'd3-shape';
/**
 * Helper to generate exact monotone cubic spline SVG path using d3-shape's curveMonotoneX
 * matching Recharts area curve calculation precisely.
 */
function getMonotonePath(points) {
  if (!points || points.length === 0) return '';
  const lineGenerator = d3Line()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(d3CurveMonotoneX);

  return lineGenerator(points) || '';
}

/**
 * MountainClimbersOverlay
 * Renders ambient snowfall and origin marker on top of the Cumulative P&L Chart.
 */
function MountainClimbersOverlay({
  pnlData = [],
  containerWidth = 0,
  containerHeight = 0,
  marketStatus = null,
  minPnlProp = null,
  maxPnlProp = null,
  isChartHovered = false,
  hoveredX = null
}) {
  const width = containerWidth > 0 ? containerWidth : 800;
  const height = containerHeight > 0 ? containerHeight : 320;

  // Margin synchronized with Recharts AreaChart (top: 10, right: 25, left: 10 + YAxis(60), bottom: 55)
  const margin = { top: 10, right: 25, left: 70, bottom: 55 };
  const chartW = Math.max(10, width - margin.left - margin.right);
  const chartH = Math.max(10, height - margin.top - margin.bottom);
  const xAxisY = margin.top + chartH;

  const minPnl = minPnlProp !== null ? minPnlProp : -20000;
  const maxPnl = maxPnlProp !== null ? maxPnlProp : 60000;

  // Calculate exact Y coordinate for P&L = 0 level
  const zeroRatio = (maxPnl - minPnl) > 0 ? (0 - minPnl) / (maxPnl - minPnl) : 0;
  const zeroY = margin.top + (1 - zeroRatio) * chartH;

  // Calculate dynamic snowfall opacity based on current IST time:
  // Daytime (07:00 AM - 06:00 PM): 1.0
  // Sunset (06:00 PM - 07:00 PM): Smoothly fades out 1.0 -> 0.0
  // Night (07:00 PM - 06:00 AM): 0.0 (Stopped/hidden)
  // Sunrise (06:00 AM - 07:00 AM): Smoothly fades in 0.0 -> 1.0
  const snowOpacity = useMemo(() => {
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const istDate = new Date(utcTime + 3600000 * 5.5);
    const mins = istDate.getHours() * 60 + istDate.getMinutes();

    const dayStart = 7 * 60;      // 07:00 AM
    const duskStart = 18 * 60;    // 06:00 PM
    const nightStart = 19 * 60;   // 07:00 PM
    const dawnStart = 6 * 60;     // 06:00 AM

    if (mins >= dayStart && mins < duskStart) {
      return 1.0;
    } else if (mins >= duskStart && mins < nightStart) {
      return 1 - (mins - duskStart) / (nightStart - duskStart);
    } else if (mins >= dawnStart && mins < dayStart) {
      return (mins - dawnStart) / (dayStart - dawnStart);
    } else {
      return 0.0;
    }
  }, []);

  const snowflakes = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      cx: margin.left + ((i * 37) % chartW),
      cy: margin.top + ((i * 23) % chartH),
      r: (i % 3) + 1.2,
      opacity: (0.3 + (i % 5) * 0.12) * snowOpacity,
      dur: 4 + (i % 4) * 2,
      delay: (i % 7) * 0.5
    }));
  }, [margin.left, margin.top, chartW, chartH, snowOpacity]);

  if (pnlData.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10 hidden md:block overflow-hidden">
      <svg
        width={width}
        height={height}
        className="w-full h-full overflow-visible"
      >
        <defs>
          <radialGradient id="snowGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <clipPath id="snowClip">
            <rect x="0" y="0" width={width} height={xAxisY} />
          </clipPath>
        </defs>

        {/* Ambient Snowfall Layer strictly above X-axis */}
        <g className="snowfall-layer" clipPath="url(#snowClip)">
          {snowflakes.map((s) => (
            <circle
              key={s.id}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="url(#snowGlow)"
              opacity={s.opacity}
            >
              <animate
                attributeName="cy"
                from={margin.top - 10}
                to={xAxisY}
                dur={`${s.dur}s`}
                begin={`${s.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cx"
                values={`${s.cx};${s.cx + 12};${s.cx - 12};${s.cx}`}
                dur={`${s.dur * 1.5}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* Origin "0" Marker placed at Exact 0 P&L Starting Position */}
        <g transform={`translate(0, ${zeroY})`}>
          {/* Clean "0" text marker perfectly aligned with Y-axis tick values (x=62, textAnchor="end") */}
          <text
            x="62"
            y="0"
            textAnchor="end"
            dominantBaseline="central"
            fill="#888"
            fontSize="11"
          >
            0
          </text>
          {/* Origin start node dot at the starting point of the P&L curve */}
          <circle
            cx={margin.left}
            cy="0"
            r="4.5"
            fill="#10b981"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

export default React.memo(MountainClimbersOverlay);
