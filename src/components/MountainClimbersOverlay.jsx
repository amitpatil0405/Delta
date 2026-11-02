import React, { useMemo } from 'react';
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
 * Renders an ambient snowfall layer and baseline origin marker on top of the Cumulative P&L Chart.
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

  // Points mapped exactly to Recharts coordinates
  const points = useMemo(() => {
    if (pnlData.length === 0) return [];
    return pnlData.map((d, i) => {
      const step = pnlData.length > 1 ? chartW / (pnlData.length - 1) : chartW / 2;
      const x = margin.left + i * step;
      const ratio = (maxPnl - minPnl) > 0 ? (d.pnl - minPnl) / (maxPnl - minPnl) : 0.5;
      const y = margin.top + (1 - ratio) * chartH;
      return { ...d, x, y, index: i };
    });
  }, [pnlData, chartW, chartH, minPnl, maxPnl]);

  const originPoint = points[0] || { x: margin.left, y: zeroY };

  const dPath = useMemo(() => {
    return getMonotonePath(points);
  }, [points]);

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

  if (pnlData.length === 0 || points.length === 0) {
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

        <path d={dPath} fill="none" stroke="none" />

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

        {/* Clean text label showing "0" at the start of chart at P&L = 0 level */}
        <g className="origin-marker">
          <text
            x="62"
            y={zeroY + 4}
            textAnchor="end"
            fill="#888"
            fontSize="11"
            fontFamily="monospace"
          >
            0
          </text>
        </g>
      </svg>
    </div>
  );
}

export default React.memo(MountainClimbersOverlay);
