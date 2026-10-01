import React, { useMemo, useState, useEffect } from 'react';

/**
 * CelestialBackground
 * Real-Time 24-Hour Atmospheric Background (Desktop Only - Strictly Isolated Component)
 *
 * Renders a real-time background atmospheric sky glow and star field behind the Cumulative P&L Curve chart.
 * Sun and Moon celestial bodies have been removed as requested.
 * Completely isolated layer with zero side effects on chart rendering or climber overlay.
 */
function CelestialBackground({
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

  const { isDay, progress } = timeInfo; // progress t in [0, 1]

  // Calculate dynamic colors based on trajectory progress t (0.0 to 1.0)
  // distFromApex: 0 at apex (t = 0.5), 1 at horizon (t = 0 or t = 1)
  const distFromApex = Math.abs(progress - 0.5) * 2; // [0, 1]

  // Dynamic Day Color Interpolation
  const dayColors = useMemo(() => {
    const r1 = Math.round(253 * (1 - distFromApex) + 255 * distFromApex);
    const g1 = Math.round(187 * (1 - distFromApex) + 126 * distFromApex);
    const b1 = Math.round(45 * (1 - distFromApex) + 95 * distFromApex);

    return {
      rawR: r1, rawG: g1, rawB: b1
    };
  }, [distFromApex]);

  // Dynamic Night Color Interpolation
  const nightColors = useMemo(() => {
    const r1 = Math.round(255 * (1 - distFromApex) + 0 * distFromApex);
    const g1 = Math.round(253 * (1 - distFromApex) + 242 * distFromApex);
    const b1 = Math.round(228 * (1 - distFromApex) + 254 * distFromApex);

    return {
      rawR: r1, rawG: g1, rawB: b1
    };
  }, [distFromApex]);

  // Organic Pseudo-Random Twinkling Stars generated for Night Cycle across sky area
  const stars = useMemo(() => {
    const organicCoords = [
      { x: 0.04, y: 0.12, r: 1.2, dur: 2.1, delay: 0.2 },
      { x: 0.08, y: 0.35, r: 0.9, dur: 3.4, delay: 1.1 },
      { x: 0.12, y: 0.18, r: 2.1, dur: 2.8, delay: 0.5 },
      { x: 0.16, y: 0.48, r: 1.0, dur: 1.9, delay: 2.2 },
      { x: 0.21, y: 0.10, r: 1.6, dur: 3.1, delay: 0.8 },
      { x: 0.25, y: 0.28, r: 2.3, dur: 2.5, delay: 1.7 },
      { x: 0.29, y: 0.52, r: 0.8, dur: 3.8, delay: 0.3 },
      { x: 0.33, y: 0.15, r: 1.4, dur: 2.2, delay: 2.5 },
      { x: 0.37, y: 0.42, r: 1.9, dur: 3.5, delay: 1.4 },
      { x: 0.41, y: 0.08, r: 1.1, dur: 2.7, delay: 0.6 },
      { x: 0.45, y: 0.25, r: 2.4, dur: 3.0, delay: 1.9 },
      { x: 0.48, y: 0.55, r: 1.0, dur: 2.3, delay: 0.1 },
      { x: 0.52, y: 0.12, r: 1.8, dur: 3.6, delay: 2.8 },
      { x: 0.56, y: 0.38, r: 0.9, dur: 2.0, delay: 0.9 },
      { x: 0.60, y: 0.20, r: 2.2, dur: 3.3, delay: 1.3 },
      { x: 0.64, y: 0.50, r: 1.3, dur: 2.6, delay: 2.0 },
      { x: 0.68, y: 0.14, r: 1.7, dur: 3.9, delay: 0.4 },
      { x: 0.72, y: 0.32, r: 1.0, dur: 2.1, delay: 1.6 },
      { x: 0.76, y: 0.09, r: 2.5, dur: 3.2, delay: 2.4 },
      { x: 0.80, y: 0.45, r: 0.9, dur: 2.4, delay: 0.7 },
      { x: 0.84, y: 0.22, r: 1.5, dur: 3.7, delay: 1.2 },
      { x: 0.88, y: 0.58, r: 2.0, dur: 2.9, delay: 2.9 },
      { x: 0.92, y: 0.16, r: 1.1, dur: 3.0, delay: 0.5 },
      { x: 0.96, y: 0.36, r: 1.8, dur: 2.2, delay: 1.8 },
      { x: 0.06, y: 0.54, r: 1.4, dur: 3.3, delay: 2.1 },
      { x: 0.18, y: 0.30, r: 2.0, dur: 2.6, delay: 0.4 },
      { x: 0.31, y: 0.38, r: 1.2, dur: 3.1, delay: 1.5 },
      { x: 0.43, y: 0.46, r: 2.2, dur: 2.8, delay: 2.7 },
      { x: 0.55, y: 0.06, r: 1.0, dur: 3.4, delay: 0.2 },
      { x: 0.66, y: 0.28, r: 1.9, dur: 2.3, delay: 1.0 },
      { x: 0.78, y: 0.52, r: 1.3, dur: 3.7, delay: 2.3 },
      { x: 0.86, y: 0.08, r: 2.1, dur: 2.0, delay: 0.8 },
      { x: 0.94, y: 0.44, r: 0.8, dur: 3.5, delay: 1.7 },
      { x: 0.14, y: 0.06, r: 1.7, dur: 2.9, delay: 2.6 },
      { x: 0.27, y: 0.44, r: 1.1, dur: 3.2, delay: 1.0 },
      { x: 0.70, y: 0.48, r: 1.6, dur: 2.5, delay: 0.3 }
    ];

    return organicCoords.map((c, i) => {
      const xRatio = c.x;
      const ptIdxFloat = xRatio * (pnlData.length > 1 ? pnlData.length - 1 : 1);
      const idx0 = Math.floor(ptIdxFloat);
      const idx1 = Math.min(pnlData.length - 1, idx0 + 1);
      const frac = ptIdxFloat - idx0;

      const pnl0 = pnlData[idx0]?.pnl ?? 0;
      const pnl1 = pnlData[idx1]?.pnl ?? pnl0;
      const interpPnl = pnl0 + (pnl1 - pnl0) * frac;

      const pnlRatio = (maxPnl - minPnl) > 0 ? (interpPnl - minPnl) / (maxPnl - minPnl) : 0.5;
      const curveYAtX = margin.top + (1 - pnlRatio) * chartH;

      const maxSkyH = Math.max(20, curveYAtX - margin.top - 12);
      const starY = margin.top + Math.min(c.y * chartH, maxSkyH * 0.95);

      return {
        id: i,
        cx: margin.left + c.x * chartW,
        cy: Math.min(starY, curveYAtX - 12),
        r: c.r,
        opacity: 0.25 + (i % 4) * 0.12,
        dur: c.dur,
        delay: c.delay
      };
    });
  }, [pnlData, maxPnl, minPnl, margin.left, margin.top, chartW, chartH]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none hidden md:block overflow-hidden" style={{ contain: 'strict', pointerEvents: 'none' }}>
      {/* Dynamic Top Atmospheric Sky Glow Layer */}
      <div
        className="absolute inset-0 transition-all duration-1000 pointer-events-none"
        style={{
          background: isDay
            ? `radial-gradient(ellipse 80% 55% at 50% 0%, rgba(${dayColors.rawR}, ${dayColors.rawG}, ${dayColors.rawB}, 0.12) 0%, rgba(${dayColors.rawR}, ${dayColors.rawG}, ${dayColors.rawB}, 0.03) 50%, transparent 100%)`
            : `radial-gradient(ellipse 80% 55% at 50% 0%, rgba(${nightColors.rawR}, ${nightColors.rawG}, ${nightColors.rawB}, 0.12) 0%, rgba(${nightColors.rawR}, ${nightColors.rawG}, ${nightColors.rawB}, 0.03) 50%, transparent 100%)`
        }}
      />
      <svg width={width} height={height} className="w-full h-full overflow-visible relative z-10">
        <defs>
          <clipPath id="yAxisClip">
            <rect x={margin.left} y="0" width={chartW + 12} height={height} />
          </clipPath>
        </defs>

        {/* Night Cycle Twinkling Stars (Clipped within chart region) */}
        {!isDay && (
          <g clipPath="url(#yAxisClip)" className="stars-layer transition-opacity duration-1000" style={{ opacity: timeInfo.nightFade }}>
            {stars.map((s) => {
              const maxOp = Math.min(0.8, s.opacity * 2.5) * timeInfo.nightFade;
              const minOp = 0.2 * timeInfo.nightFade;
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
      </svg>
    </div>
  );
}

/**
 * Calculates real-time 24-hour celestial state based on current time
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
    if (minutes >= dayEnd) {
      progress = 0.5 * ((minutes - dayEnd) / (1440 - dayEnd));
    } else {
      progress = 0.5 + 0.5 * (minutes / dayStart);
    }
  }

  let nightFade = 0;
  if (!isDay) {
    const duskStart = 18 * 60;     // 18:00 (6:00 PM)
    const duskEnd   = 19 * 60;     // 19:00 (7:00 PM)
    const dawnStart = 6 * 60;      // 06:00 AM
    const dawnEnd   = 7 * 60;      // 07:00 AM

    if (minutes >= duskStart && minutes < duskEnd) {
      nightFade = (minutes - duskStart) / (duskEnd - duskStart);
    } else if (minutes >= dawnStart && minutes < dawnEnd) {
      nightFade = 1 - (minutes - dawnStart) / (dawnEnd - dawnStart);
    } else {
      nightFade = 1.0;
    }
  }

  return {
    isDay,
    progress: Math.max(0, Math.min(1, progress)),
    nightFade: Math.max(0, Math.min(1, nightFade))
  };
}

export default React.memo(CelestialBackground);
