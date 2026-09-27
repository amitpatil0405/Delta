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
  // Randomize Moon Type on render: 'half' (Crescent) or 'full'
  const [moonType] = useState(() => (Math.random() > 0.5 ? 'half' : 'full'));

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

  // Sunrise/Sunset & Moonrise/Moonset Edge Fade-In/Out (0% to 5% & 95% to 100%)
  // Horizon Dip Y-offset (+18px -> 0px) for smooth emergence behind horizon/node
  let edgeOpacity = 1.0;
  let yHorizonOffset = 0;

  if (t < 0.05) {
    const fadeRatio = t / 0.05; // [0, 1]
    edgeOpacity = fadeRatio;
    yHorizonOffset = (1 - fadeRatio) * 18;
  } else if (t > 0.95) {
    const fadeRatio = (1 - t) / 0.05; // [1, 0]
    edgeOpacity = fadeRatio;
    yHorizonOffset = (1 - fadeRatio) * 18;
  }

  // SVG Arc Path for subtle dotted guide line
  const arcPath = `M ${x0} ${y0} Q ${(x0 + x1) / 2} ${yApexCtrl} ${x1} ${y1}`;

  // Calculate dynamic colors based on trajectory progress t (0.0 to 1.0)
  // distFromApex: 0 at apex (t = 0.5), 1 at horizon (t = 0 or t = 1)
  const distFromApex = Math.abs(t - 0.5) * 2; // [0, 1]

  // Dynamic Day Color Interpolation:
  // Horizon (t=0/1, ~7:00 AM / 6:30 PM): Warm Orange-to-Pink gradient (#FF7E5F / #FEB47B => RGB: 255,126,95 / 254,180,123)
  // Apex (t=0.5, ~12:00 PM): Bright Yellow-to-Golden hue (#FDBB2D / #FFE066 => RGB: 253,187,45 / 255,224,102)
  const dayColors = useMemo(() => {
    // Core color: Apex #FDBB2D (253,187,45) -> Horizon #FF7E5F (255,126,95)
    const r1 = Math.round(253 * (1 - distFromApex) + 255 * distFromApex);
    const g1 = Math.round(187 * (1 - distFromApex) + 126 * distFromApex);
    const b1 = Math.round(45 * (1 - distFromApex) + 95 * distFromApex);

    // Glow color: Apex #FFE066 (255,224,102) -> Horizon #FEB47B (254,180,123)
    const r2 = Math.round(255 * (1 - distFromApex) + 254 * distFromApex);
    const g2 = Math.round(224 * (1 - distFromApex) + 180 * distFromApex);
    const b2 = Math.round(102 * (1 - distFromApex) + 123 * distFromApex);

    return {
      core: `rgb(${r1}, ${g1}, ${b1})`,
      glow: `rgb(${r2}, ${g2}, ${b2})`,
      stroke: `rgba(${r1}, ${g1}, ${b1}, 0.25)`,
      rawR: r1, rawG: g1, rawB: b1
    };
  }, [distFromApex]);

  // Dynamic Night Color Interpolation:
  // Horizon (t=0/1, ~6:30 PM / 7:00 AM): Distinct Neon Blue tint (#00F2FE / #4FACFE => RGB: 0,242,254 / 79,172,254)
  // Apex (t=0.5, ~12:00 AM): Brilliant White-to-Cream color (#FFFDE4 / #F8F9FA => RGB: 255,253,228 / 248,249,250)
  const nightColors = useMemo(() => {
    // Core color: Apex #FFFDE4 (255,253,228) -> Horizon #00F2FE (0,242,254)
    const r1 = Math.round(255 * (1 - distFromApex) + 0 * distFromApex);
    const g1 = Math.round(253 * (1 - distFromApex) + 242 * distFromApex);
    const b1 = Math.round(228 * (1 - distFromApex) + 254 * distFromApex);

    // Glow color: Apex #F8F9FA (248,249,250) -> Horizon #4FACFE (79,172,254)
    const r2 = Math.round(248 * (1 - distFromApex) + 79 * distFromApex);
    const g2 = Math.round(249 * (1 - distFromApex) + 172 * distFromApex);
    const b2 = Math.round(250 * (1 - distFromApex) + 254 * distFromApex);

    return {
      core: `rgb(${r1}, ${g1}, ${b1})`,
      glow: `rgb(${r2}, ${g2}, ${b2})`,
      stroke: `rgba(${r1}, ${g1}, ${b1}, 0.25)`,
      rawR: r1, rawG: g1, rawB: b1
    };
  }, [distFromApex]);

  // Organic Pseudo-Random Twinkling Stars generated for Night Cycle across sky area
  const stars = useMemo(() => {
    // 36 organic X,Y percentage coordinates spread naturally across sky area (X: 2%–98%, Y: 5%–58%)
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
      // Calculate dynamic curve Y position at star's X location so Y is strictly above curve
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

      // Scale Y relative to distance above curve line (target sky area)
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
  }, [margin.left, margin.top, chartW, chartH]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none hidden md:block overflow-hidden">
      {/* Dynamic Top Atmospheric Sky Glow Layer with Heavy Alpha Feathering */}
      <div
        className="absolute inset-0 transition-all duration-1000 pointer-events-none blur-2xl"
        style={{
          background: isDay
            ? `radial-gradient(ellipse 80% 55% at 50% 0%, rgba(${dayColors.rawR}, ${dayColors.rawG}, ${dayColors.rawB}, 0.12) 0%, rgba(${dayColors.rawR}, ${dayColors.rawG}, ${dayColors.rawB}, 0.03) 50%, transparent 100%)`
            : `radial-gradient(ellipse 80% 55% at 50% 0%, rgba(${nightColors.rawR}, ${nightColors.rawG}, ${nightColors.rawB}, 0.12) 0%, rgba(${nightColors.rawR}, ${nightColors.rawG}, ${nightColors.rawB}, 0.03) 50%, transparent 100%)`
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

          {/* Sky Clip Mask: Clips any element below the P&L curve line horizon so Sun/Moon never bleeds through area fill */}
          <clipPath id="skyClip">
            <path d={`M ${x0} ${y0} Q ${(x0 + x1) / 2} ${yApexCtrl} ${x1} ${y1} L ${x1 + 100} 0 L ${x0 - 100} 0 Z`} />
          </clipPath>
        </defs>

        {/* Invisible Parabolic Orbital Track (Dotted path line completely removed) */}
        <path
          d={arcPath}
          fill="none"
          stroke="none"
        />

        {/* Night Cycle Twinkling Stars (Clipped above P&L curve line with Sky Clip Mask) */}
        {!isDay && (
          <g clipPath="url(#skyClip)" className="stars-layer transition-opacity duration-1000" style={{ opacity: timeInfo.nightFade }}>
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

        {/* Celestial Body: Sun or Moon (Clipped above P&L curve line with Sky Clip Mask) */}
        <g clipPath="url(#skyClip)">
          <g transform={`translate(${cx}, ${cy + yHorizonOffset})`} style={{ opacity: edgeOpacity }}>
          {isDay ? (
            /* Day Cycle: Clean Transparent Sun Vector with Drop-Shadow Glow */
            <g style={{ filter: 'drop-shadow(0px 0px 18px rgba(251, 191, 36, 0.6))' }}>
              {/* Sun Core */}
              <circle cx="0" cy="0" r="8" fill={dayColors.core} stroke={dayColors.glow} strokeWidth="1.5" />
              {/* Rotating Sun Rays */}
              <g className="animate-spin" style={{ animationDuration: '20s' }}>
                {Array.from({ length: 8 }).map((_, idx) => {
                  const angle = (idx * 45 * Math.PI) / 180;
                  const rx1 = Math.cos(angle) * 11;
                  const ry1 = Math.sin(angle) * 11;
                  const rx2 = Math.cos(angle) * 15;
                  const ry2 = Math.sin(angle) * 15;
                  return (
                    <line
                      key={idx}
                      x1={rx1}
                      y1={ry1}
                      x2={rx2}
                      y2={ry2}
                      stroke={dayColors.glow}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  );
                })}
              </g>
            </g>
          ) : (
            /* Night Cycle: Clean Transparent Moon Vector with Drop-Shadow Glow */
            <g style={{ filter: 'drop-shadow(0px 0px 18px rgba(56, 189, 248, 0.6))' }}>
              {moonType === 'full' ? (
                /* Full Moon: Clean Full Circle with texture details */
                <g>
                  <circle
                    cx="0"
                    cy="0"
                    r="8"
                    fill={nightColors.core}
                    stroke={nightColors.glow}
                    strokeWidth="1"
                  />
                  {/* Subtle Moon Craters */}
                  <circle cx="-2.5" cy="-2" r="1.8" fill="rgba(0,0,0,0.12)" />
                  <circle cx="2" cy="2" r="2.2" fill="rgba(0,0,0,0.10)" />
                  <circle cx="3" cy="-3" r="1.2" fill="rgba(0,0,0,0.08)" />
                </g>
              ) : (
                /* Half-Moon: Strictly Crescent Geometry (Unlit half 100% invisible, stroke="none") */
                <path
                  d="M -3 -8 A 8 8 0 1 0 7 6 A 6.5 6.5 0 1 1 -3 -8 Z"
                  fill={nightColors.core}
                  stroke="none"
                />
              )}
            </g>
          )}
          </g>
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

  // Calculate Night Fade factor (0.0 during Day, smoothly fades in between 18:00–19:00 and fades out between 06:00–07:00)
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
