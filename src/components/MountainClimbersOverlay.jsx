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

        {/* Expedition Tent at Trade 1 Origin */}
        <g transform={`translate(${basecampPoint.x}, ${basecampPoint.y})`}>
          <polygon
            points="0,-12 10,0 -10,0"
            fill="url(#tentGrad)"
            stroke="#f59e0b"
            strokeWidth="1.2"
            className="drop-shadow-[0_0_6px_rgba(249,115,22,0.5)]"
          />
          <polygon points="0,-6 4,0 -4,0" fill="#0f172a" />
          <line x1="0" y1="-12" x2="0" y2="-18" stroke="#cbd5e1" strokeWidth="1.2" />
          <polygon points="0,-18 6,-15 0,-12" fill="#10b981" />

          {/* Tent Status Badge - Right Aligned to prevent left-edge clipping */}
          <foreignObject x="14" y="-16" width="130" height="28">
            <div className="flex items-center h-full">
              <span className="bg-[#0c0c0e]/95 border border-amber-500/50 text-[8px] font-mono text-amber-400 font-extrabold px-1.5 py-0.5 rounded shadow-lg backdrop-blur-sm tracking-wider whitespace-nowrap">
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
            <g transform={`translate(${followerPos.x}, ${followerPos.y - 14})`}>
              <circle cx="0" cy="-6" r="2.5" fill="#38bdf8" />
              <line x1="0" y1="-3.5" x2="0" y2="4" stroke="#0284c7" strokeWidth="2" />
              <line x1="0" y1="4" x2="-3" y2="9" stroke="#0284c7" strokeWidth="1.5" />
              <line x1="0" y1="4" x2="3" y2="9" stroke="#0284c7" strokeWidth="1.5" />
              <line x1="-2" y1="-1" x2="-5" y2="-5" stroke="#cbd5e1" strokeWidth="1.2" />
              <foreignObject
                x={followerPos.x > containerWidth - 90 ? -75 : 8}
                y="-20"
                width="70"
                height="20"
              >
                <div className={`flex items-center ${followerPos.x > containerWidth - 90 ? 'justify-end' : 'justify-start'}`}>
                  <span className="bg-[#0c0c0e]/95 text-[7px] font-mono text-sky-400 font-extrabold px-1 py-0.5 rounded border border-sky-500/40 shadow-md whitespace-nowrap">
                    CLIMBER #2
                  </span>
                </div>
              </foreignObject>
            </g>

            {/* Lead Mountaineer */}
            <g transform={`translate(${leadPos.x}, ${leadPos.y - 16})`}>
              <circle cx="0" cy="-6" r="3" fill="#f59e0b" />
              <line x1="0" y1="-3" x2="0" y2="5" stroke="#d97706" strokeWidth="2.5" />
              <line x1="0" y1="-1" x2="-5" y2="-5" stroke="#d97706" strokeWidth="1.8" />
              <line x1="0" y1="-1" x2="5" y2="-4" stroke="#d97706" strokeWidth="1.8" />
              <line x1="0" y1="5" x2="-4" y2="11" stroke="#d97706" strokeWidth="2" />
              <line x1="0" y1="5" x2="4" y2="11" stroke="#d97706" strokeWidth="2" />
              <line x1="5" y1="-4" x2="9" y2="-8" stroke="#e2e8f0" strokeWidth="1.2" />
              <path d="M 7 -9 L 10 -8 L 8 -6" fill="#e2e8f0" />

              {/* Status Badge - Positioned cleanly on right or left if near boundary */}
              <foreignObject
                x={leadPos.x > containerWidth - 110 ? -105 : 10}
                y="-28"
                width="110"
                height="28"
              >
                <div className={`flex items-center h-full ${leadPos.x > containerWidth - 110 ? 'justify-end' : 'justify-start'}`}>
                  {isSummit ? (
                    <span className="bg-emerald-500 text-black text-[8px] font-mono font-extrabold px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-bounce whitespace-nowrap">
                      🏔️ PEAK SUMMIT!
                    </span>
                  ) : isRedZone ? (
                    <span className="bg-rose-500 text-white text-[7.5px] font-mono font-bold px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(244,63,94,0.8)] border border-rose-300/50 animate-pulse whitespace-nowrap">
                      ⚠️ RED ZONE ROPE
                    </span>
                  ) : (
                    <span className="bg-[#0c0c0e]/95 text-amber-400 border border-amber-500/50 text-[7.5px] font-mono font-extrabold px-1.5 py-0.5 rounded backdrop-blur-sm whitespace-nowrap">
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
