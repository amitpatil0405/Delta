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
 * Renders the baseline origin marker "0" on top of the Cumulative P&L Chart.
 * Snowfall and particle effects have been completely removed.
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

  // Margin synchronized with Recharts AreaChart (top: 10, right: 25, left: margin.left(10) + YAxis(60) = 70, bottom: 25)
  const margin = { top: 10, right: 25, left: 70, bottom: 25 };
  const chartW = Math.max(10, width - margin.left - margin.right);
  const chartH = Math.max(10, height - margin.top - margin.bottom);

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

  const dPath = useMemo(() => {
    return getMonotonePath(points);
  }, [points]);

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
        <path d={dPath} fill="none" stroke="none" />

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
