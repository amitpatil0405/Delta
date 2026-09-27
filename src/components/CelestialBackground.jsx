import React, { useMemo, useState, useEffect } from 'react';

/**
 * CelestialBackground
 * Real-Time 24-Hour Celestial Arc (Desktop Only - Strictly Isolated Component)
 *
 * Renders a real-time background Sun/Moon orbital cycle behind the Cumulative P&L Curve chart,
 * anchored to the curve's origin (Start) and endpoint (End).
 * Completely isolated layer with zero side effects on chart rendering or climber overlay.
 */
export default function CelestialBackground({
  pnlData = [],
  containerWidth = 0,
  containerHeight = 0,
  minPnlProp = null,
  maxPnlProp = null
}) {
  const [timeInfo, setTimeInfo] = useState(() => calculateCelestialState());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeInfo(calculateCelestialState());
    }, 10000); // Update every 10 seconds
    return () => clearInterval(timer);
  }, []);

  const width = containerWidth > 0 ? containerWidth : 800;
  const height = containerHeight > 0 ? containerHeight : 320;

  // Margin synchronized precisely with Recharts AreaChart & Overlay
  const margin = { top: 10, right: 25, left: 70, bottom: 55 };
  const chartW = Math.max(10, width - margin.left - margin.right);
  const chartH = Math.max(10, height - margin.top - margin.bottom);

  const minPnl = minPnlProp !== null ? minPnlProp : -20000;
  const maxPnl = maxPnlProp !== null ? maxPnlProp : 60000;

  // Calculate curve Start Point (X0, Y0) and End Point (X1, Y1)
  const coords = useMemo(() => {
    if (!pnlData || pnlData.length === 0) {
      return { x0: margin.left, y0: margin.top + chartH / 2, x1: margin.left + chartW, y1: margin.top + chartH / 2 };
    }

    const firstPt = pnlData[0];
    const lastPt = pnlData[pnlData.length - 1];

    const ratio0 = (maxPnl - minPnl) > 0 ? (firstPt.pnl - minPnl) / (maxPnl - minPnl) : 0.5;
    const ratio1 = (maxPnl - minPnl) > 0 ? (lastPt.pnl - minPnl) / (maxPnl - minPnl) : 0.5;

    const x0 = margin.left;
    const y0 = margin.top + (1 - ratio0) * chartH;

    const x1 = margin.left + chartW;
    const y1 = margin.top + (1 - ratio1) * chartH;

    return { x0, y0, x1, y1 };
  }, [pnlData, margin.left, margin.top, chartW, chartH, minPnl, maxPnl]);

  const { x0, y0, x1, y1 } = coords;
  const { isDay, progress } = timeInfo; // progress t in [0, 1]

  // Parabolic Trajectory
  // t = 0 -> (x0, y0), t = 0.5 -> (midX, apexY), t = 1 -> (x1, y1)
  // Cap apex height with top boundary padding (~48px) so Sun/Moon remains inside chart box below title
  const apexY = 48; // Top center apex point with boundary padding
  const yApexCtrl = 2 * apexY - 0.5 * y0 - 0.5 * y1;

  const t = Math.max(0, Math.min(1, progress));
  const cx = (1 - t) * x0 + t * x1;
  const cy = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * yApexCtrl + t * t * y1;

  // SVG Arc Path for subtle dotted guide line
  const arcPath = `M ${x0} ${y0} Q ${(x0 + x1) / 2} ${yApexCtrl} ${x1} ${y1}`;

  // Twinkling Stars generated for Night Cycle
  const stars = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      cx: margin.left + ((i * 31 + 17) % chartW),
      cy: margin.top + ((i * 19 + 11) % (chartH * 0.7)),
      r: (i % 3) * 0.5 + 0.8,
      opacity: 0.2 + (i % 5) * 0.15,
      dur: 2 + (i % 4) * 1.5
    }));
  }, [margin.left, margin.top, chartW, chartH]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none hidden md:block overflow-hidden">
      {/* Ambient Time-of-Day Radial Background Glow Layer with Heavy Alpha Feathering */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 pointer-events-none blur-2xl"
        style={{
          background: isDay
            ? 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(245, 158, 11, 0.07) 0%, rgba(245, 158, 11, 0.02) 50%, transparent 100%)'
            : 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(14, 165, 233, 0.07) 0%, rgba(14, 165, 233, 0.02) 50%, transparent 100%)'
        }}
      />
      <svg width={width} height={height} className="w-full h-full overflow-visible relative z-10">
        <defs>
          {/* Sun Radial Glow */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#fbbf24" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* Moon Radial Glow */}
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#0284c7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Faint Dotted Parabolic Orbital Track */}
        <path
          d={arcPath}
          fill="none"
          stroke={isDay ? "rgba(245, 158, 11, 0.12)" : "rgba(56, 189, 248, 0.12)"}
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Night Cycle Twinkling Stars */}
        {!isDay && (
          <g className="stars-layer">
            {stars.map((s) => {
              const maxOp = Math.min(0.8, s.opacity * 2.5);
              const minOp = 0.2;
              return (
                <circle
                  key={s.id}
                  cx={s.cx}
                  cy={s.cy}
                  r={s.r}
                  fill="#e0f2fe"
                  opacity={minOp}
                >
                  <animate
                    attributeName="opacity"
                    values={`${minOp};${maxOp};${minOp}`}
                    dur={`${s.dur}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              );
            })}
          </g>
        )}

        {/* Celestial Body: Sun or Moon */}
        <g transform={`translate(${cx}, ${cy})`}>
          {isDay ? (
            /* Day Cycle: Golden Glowing Sun */
            <g>
              {/* Outer Pulsing Glow Halo */}
              <circle cx="0" cy="0" r="22" fill="url(#sunGlow)" className="animate-pulse" style={{ animationDuration: '3s' }} />
              {/* Sun Core */}
              <circle cx="0" cy="0" r="8" fill="#f59e0b" stroke="#fef08a" strokeWidth="1.5" className="drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]" />
              {/* Rotating Sun Rays */}
              <g className="animate-spin" style={{ animationDuration: '20s' }}>
                {Array.from({ length: 8 }).map((_, idx) => {
                  const angle = (idx * 45 * Math.PI) / 180;
                  const x1 = Math.cos(angle) * 11;
                  const y1 = Math.sin(angle) * 11;
                  const x2 = Math.cos(angle) * 15;
                  const y2 = Math.sin(angle) * 15;
                  return (
                    <line
                      key={idx}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#fbbf24"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  );
                })}
              </g>
            </g>
          ) : (
            /* Night Cycle: Glowing Crescent Moon */
            <g>
              {/* Outer Glow Halo */}
              <circle cx="0" cy="0" r="20" fill="url(#moonGlow)" />
              {/* Crescent Moon Path */}
              <path
                d="M -3 -8 A 8 8 0 1 0 7 6 A 6.5 6.5 0 1 1 -3 -8 Z"
                fill="#bae6fd"
                stroke="#38bdf8"
                strokeWidth="1"
                className="drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]"
              />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}

/**
 * Calculates real-time 24-hour celestial state based on current time:
 * Day Cycle (07:00 AM – 06:30 PM):
 *   07:00 AM -> t = 0.0 (Curve origin - Left)
 *   12:00 PM -> t = 0.5 (Apex top-center point)
 *   06:30 PM -> t = 1.0 (Curve endpoint - Right)
 *
 * Night Cycle (06:30 PM – 07:00 AM):
 *   06:30 PM -> t = 0.0 (Curve origin - Left)
 *   12:00 AM -> t = 0.5 (Apex top-center point)
 *   07:00 AM -> t = 1.0 (Curve endpoint - Right)
 */
function calculateCelestialState() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  const dayStart = 7 * 60;          // 07:00 AM (420 mins)
  const dayApex  = 12 * 60;         // 12:00 PM (720 mins)
  const dayEnd   = 18 * 60 + 30;    // 06:30 PM (1110 mins)

  const isDay = minutes >= dayStart && minutes < dayEnd;

  let progress = 0;

  if (isDay) {
    if (minutes < dayApex) {
      progress = 0.5 * ((minutes - dayStart) / (dayApex - dayStart));
    } else {
      progress = 0.5 + 0.5 * ((minutes - dayApex) / (dayEnd - dayApex));
    }
  } else {
    // Night Cycle: 18:30 (1110m) to 07:00 (420m next day)
    // 12:00 AM (0m / 1440m) is exact apex
    if (minutes >= dayEnd) {
      // 18:30 to 24:00 (1110 to 1440) -> progress 0.0 to 0.5
      progress = 0.5 * ((minutes - dayEnd) / (1440 - dayEnd));
    } else {
      // 00:00 to 07:00 (0 to 420) -> progress 0.5 to 1.0
      progress = 0.5 + 0.5 * (minutes / dayStart);
    }
  }

  return {
    isDay,
    progress: Math.max(0, Math.min(1, progress))
  };
}
