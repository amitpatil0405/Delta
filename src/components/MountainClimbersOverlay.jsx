import React, { useMemo, useState, useEffect, useRef } from 'react';

/**
 * MountainClimbersOverlay
 * Renders an interactive Mount Everest expedition animation layer on top of the Cumulative P&L Chart.
 * Features:
 * - Real-time climbing motion animation along the P&L path during MARKET OPEN
 * - Basecamp tent at origin with session status badges (PREPARING GEAR, CLIMBING, RESTING AT TENT)
 * - Lead & follower mountaineer expedition team connected by dynamic safety lines
 * - Piton anchors & red zone rope warnings on steep drops/rises or negative P&L
 * - Ambient snowfall particle backdrop
 * - Restricted to desktop viewports (`hidden md:block`)
 */
export default function MountainClimbersOverlay({
  pnlData = [],
  containerWidth = 0,
  containerHeight = 0,
  marketStatus = 'CLOSED'
}) {
  const pathRef = useRef(null);
  const [climbProgress, setClimbProgress] = useState(0.0);
  const [pathLength, setPathLength] = useState(0);

  // Determine market session state
  const isOpen = marketStatus === 'MARKET OPEN';
  const isPreOpen = marketStatus === 'PRE-MARKET';

  const margin = { top: 10, right: 25, left: 10, bottom: 0 };
  const chartW = Math.max(10, containerWidth - margin.left - margin.right);
  const chartH = Math.max(10, containerHeight - margin.top - margin.bottom);

  // Compute scale boundaries for chart alignment matching Recharts
  const pnlVals = useMemo(() => pnlData.map((d) => d.pnl), [pnlData]);

  const { minPnl, maxPnl } = useMemo(() => {
    if (pnlVals.length === 0) return { minPnl: 0, maxPnl: 1000 };
    let min = Math.min(...pnlVals, 0);
    let max = Math.max(...pnlVals, 0);
    if (max === min) {
      max += 1000;
      min -= 1000;
    } else {
      const range = max - min;
      max += range * 0.08;
      min -= range * 0.08;
    }
    return { minPnl: min, maxPnl: max };
  }, [pnlVals]);

  // Points array for all trades
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

  // Path string for SVG guide line
  const dPath = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce(
      (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
      ''
    );
  }, [points]);

  // Snowfall particles config
  const snowflakes = useMemo(() => {
    if (!containerWidth || !containerHeight) return [];
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      cx: (i * 37) % containerWidth,
      cy: (i * 23) % containerHeight,
      r: (i % 3) + 1.2,
      opacity: 0.3 + (i % 5) * 0.12,
      dur: 4 + (i % 4) * 2,
      delay: (i % 7) * 0.5
    }));
  }, [containerWidth, containerHeight]);

  // Update total path length when path changes
  useEffect(() => {
    if (pathRef.current && dPath) {
      try {
        setPathLength(pathRef.current.getTotalLength());
      } catch (e) {
        setPathLength(0);
      }
    }
  }, [dPath, containerWidth, containerHeight]);

  // Animated climbing loop during MARKET OPEN
  useEffect(() => {
    if (!isOpen) {
      setClimbProgress(0.0);
      return;
    }

    let animFrameId;
    let startTime = performance.now();
    const cycleDuration = 18000;

    const animateClimb = (now) => {
      const elapsed = (now - startTime) % cycleDuration;
      const progress = elapsed / cycleDuration;
      setClimbProgress(progress);
      animFrameId = requestAnimationFrame(animateClimb);
    };

    animFrameId = requestAnimationFrame(animateClimb);
    return () => cancelAnimationFrame(animFrameId);
  }, [isOpen]);

  // Early return after all hooks have been declared
  if (!containerWidth || !containerHeight || pnlData.length === 0 || points.length === 0) {
    return null;
  }

  const basecampPoint = points[0] || { x: margin.left, y: margin.top + chartH };
  const highestPoint = [...points].sort((a, b) => b.pnl - a.pnl)[0];

  // Compute Lead & Follower positions based on climbProgress or static lead
  let leadPos = points[points.length - 1];
  let followerPos = points[Math.max(0, points.length - 2)];

  if (pathRef.current && pathLength > 0) {
    try {
      const currentLen = pathLength * climbProgress;
      const followerLen = Math.max(0, currentLen - 30);

      const ptLead = pathRef.current.getPointAtLength(currentLen);
      const ptFollower = pathRef.current.getPointAtLength(followerLen);

      const activeIdx = Math.min(
        points.length - 1,
        Math.floor(climbProgress * points.length)
      );

      leadPos = {
        x: ptLead.x,
        y: ptLead.y,
        pnl: points[activeIdx]?.pnl ?? 0,
        index: activeIdx
      };

      followerPos = {
        x: ptFollower.x,
        y: ptFollower.y,
        pnl: points[Math.max(0, activeIdx - 1)]?.pnl ?? 0,
        index: Math.max(0, activeIdx - 1)
      };
    } catch (e) {
      // Fallback
    }
  }

  const isRedZone = leadPos.pnl < 0;
  const isSummit = leadPos.index === highestPoint.index && leadPos.pnl > 0;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 hidden md:block overflow-hidden">
      <svg
        width={containerWidth}
        height={containerHeight}
        className="w-full h-full overflow-visible"
      >
        <defs>
          <radialGradient id="snowGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="tentGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          <filter id="ropeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#f59e0b" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Hidden path element for getPointAtLength coordinate calculations */}
        <path ref={pathRef} d={dPath} fill="none" stroke="none" />

        {/* Ambient Snowfall Layer */}
        <g className="snowfall-layer">
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
                from={-10}
                to={containerHeight + 10}
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

        {/* Basecamp Tent at Trade 1 Origin */}
        <g transform={`translate(${basecampPoint.x - 18}, ${basecampPoint.y - 24})`}>
          <polygon
            points="18,2 34,22 2,22"
            fill="url(#tentGrad)"
            stroke="#f59e0b"
            strokeWidth="1.5"
            className="drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]"
          />
          <polygon points="18,10 24,22 12,22" fill="#0f172a" />
          <line x1="18" y1="2" x2="18" y2="-8" stroke="#cbd5e1" strokeWidth="1.5" />
          <polygon points="18,-8 28,-4 18,0" fill="#10b981" />

          {/* Basecamp Label Badge */}
          <foreignObject x="-45" y="25" width="120" height="40">
            <div className="flex flex-col items-center">
              <span className="bg-[#0c0c0e]/90 border border-amber-500/40 text-[8.5px] font-mono text-amber-400 font-extrabold px-1.5 py-0.5 rounded shadow-lg backdrop-blur-sm tracking-wider whitespace-nowrap">
                EVEREST BASECAMP
              </span>
              <span className="text-[7.5px] font-mono text-gray-400 uppercase mt-0.5 whitespace-nowrap">
                {isPreOpen ? 'PREPARING GEAR...' : isOpen ? 'EXPEDITION IN PROGRESS' : 'RESTING AT TENT'}
              </span>
            </div>
          </foreignObject>
        </g>

        {/* Safety Lines & Anchors along trade path */}
        {points.length > 1 && (
          <g className="climber-ropes">
            <path
              d={dPath}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity="0.5"
            />
            {points.map((pt, i) => (
              <g key={`anchor_${i}`}>
                <circle cx={pt.x} cy={pt.y} r="2.5" fill="#f59e0b" />
                <line x1={pt.x} y1={pt.y} x2={pt.x} y2={pt.y + 6} stroke="#94a3b8" strokeWidth="1" />
              </g>
            ))}
          </g>
        )}

        {/* Expedition Team (Follower & Lead Climber) */}
        {points.length > 0 && (
          <g className="climber-team">
            {/* Connecting Safety Rope */}
            <path
              d={`M ${followerPos.x} ${followerPos.y - 12} Q ${(followerPos.x + leadPos.x) / 2} ${(followerPos.y + leadPos.y) / 2 + 10} ${leadPos.x} ${leadPos.y - 12}`}
              fill="none"
              stroke={isRedZone ? '#f43f5e' : '#10b981'}
              strokeWidth="2"
              filter="url(#ropeGlow)"
            />

            {/* Follower Mountaineer */}
            <g transform={`translate(${followerPos.x}, ${followerPos.y - 18})`}>
              <circle cx="0" cy="-6" r="3" fill="#38bdf8" />
              <line x1="0" y1="-3" x2="0" y2="6" stroke="#0284c7" strokeWidth="2.5" />
              <line x1="0" y1="6" x2="-4" y2="12" stroke="#0284c7" strokeWidth="2" />
              <line x1="0" y1="6" x2="4" y2="12" stroke="#0284c7" strokeWidth="2" />
              <line x1="-3" y1="0" x2="-7" y2="-4" stroke="#cbd5e1" strokeWidth="1.5" />
              <foreignObject x="-30" y="-32" width="60" height="20">
                <div className="text-center">
                  <span className="bg-[#0c0c0e]/80 text-[7px] font-mono text-sky-400 font-bold px-1 py-0.5 rounded border border-sky-500/30 whitespace-nowrap">
                    CLIMBER #2
                  </span>
                </div>
              </foreignObject>
            </g>

            {/* Lead Mountaineer */}
            <g transform={`translate(${leadPos.x}, ${leadPos.y - 20})`}>
              <circle cx="0" cy="-7" r="3.5" fill="#f59e0b" />
              <line x1="0" y1="-3.5" x2="0" y2="7" stroke="#d97706" strokeWidth="3" />
              <line x1="0" y1="-1" x2="-6" y2="-6" stroke="#d97706" strokeWidth="2" />
              <line x1="0" y1="-1" x2="6" y2="-5" stroke="#d97706" strokeWidth="2" />
              <line x1="0" y1="7" x2="-5" y2="14" stroke="#d97706" strokeWidth="2.5" />
              <line x1="0" y1="7" x2="5" y2="14" stroke="#d97706" strokeWidth="2.5" />
              <line x1="6" y1="-5" x2="11" y2="-9" stroke="#e2e8f0" strokeWidth="1.5" />
              <path d="M 9 -10 L 12 -9 L 10 -7" fill="#e2e8f0" />

              {/* Status Badge */}
              <foreignObject x="-50" y="-48" width="100" height="30">
                <div className="flex flex-col items-center">
                  {isSummit ? (
                    <span className="bg-emerald-500 text-black text-[8px] font-mono font-extrabold px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-bounce whitespace-nowrap">
                      🏔️ PEAK SUMMIT!
                    </span>
                  ) : isRedZone ? (
                    <span className="bg-rose-500 text-white text-[7.5px] font-mono font-bold px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(244,63,94,0.7)] animate-pulse whitespace-nowrap">
                      ⚠️ RED ZONE ROPE
                    </span>
                  ) : (
                    <span className="bg-[#0c0c0e]/90 text-amber-400 border border-amber-500/40 text-[7.5px] font-mono font-extrabold px-1.5 py-0.5 rounded backdrop-blur-sm whitespace-nowrap">
                      {isOpen ? 'CLIMBING...' : 'LEAD EXPEDITION'}
                    </span>
                  )}
                </div>
              </foreignObject>
            </g>
          </g>
        )}

        {/* Highest Peak Summit Flag Landmark */}
        {highestPoint && highestPoint.pnl > 0 && (
          <g transform={`translate(${highestPoint.x}, ${highestPoint.y - 12})`}>
            <line x1="0" y1="0" x2="0" y2="-22" stroke="#f59e0b" strokeWidth="1.5" />
            <polygon
              points="0,-22 18,-16 0,-10"
              fill="#10b981"
              stroke="#047857"
              strokeWidth="1"
              className="drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]"
            />
            <text x="2" y="-14" fill="#ffffff" fontSize="6" fontWeight="bold" fontFamily="monospace">
              MAX
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
