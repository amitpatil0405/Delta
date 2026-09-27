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
        </defs>

        {/* Invisible Parabolic Orbital Track (Dotted path line completely removed) */}
        <path
          d={arcPath}
          fill="none"
          stroke="none"
        />

        {/* Night Cycle Twinkling Stars (Smooth Reveal 7:00 PM onwards & Fade Out at Dawn) */}
        {!isDay && (
          <g className="stars-layer transition-opacity duration-1000" style={{ opacity: timeInfo.nightFade }}>
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

        {/* Celestial Body: Sun or Moon (100% Transparent Container with Standard Drop-Shadow Glow) */}
        <g transform={`translate(${cx}, ${cy})`}>
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
