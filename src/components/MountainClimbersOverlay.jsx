import React, { useMemo, useState, useEffect, useRef } from 'react';
import { line as d3Line, curveMonotoneX as d3CurveMonotoneX } from 'd3-shape';
import tentImg from '../assets/tent.png';

/**
 * Helper to generate exact monotone cubic spline SVG path using d3-shape's curveMonotoneX
 * matching Recharts area curve calculation precisely.
 */
function getMonotonePath(tradePoints, basecampPoint) {
  if (!tradePoints || tradePoints.length === 0) return '';
  const lineGenerator = d3Line()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(d3CurveMonotoneX);

  const rechartsCurveD = lineGenerator(tradePoints) || '';
  if (!basecampPoint) return rechartsCurveD;

  const firstTrade = tradePoints[0];
  const cIndex = rechartsCurveD.indexOf('C');
  if (cIndex !== -1) {
    return `M ${basecampPoint.x.toFixed(2)} ${basecampPoint.y.toFixed(2)} L ${firstTrade.x.toFixed(2)} ${firstTrade.y.toFixed(2)} ${rechartsCurveD.substring(cIndex)}`;
  }
  return `M ${basecampPoint.x.toFixed(2)} ${basecampPoint.y.toFixed(2)} L ${rechartsCurveD.substring(1)}`;
}

/**
 * MountainClimbersOverlay
 * Renders an interactive Mount Everest expedition animation layer on top of the Cumulative P&L Chart.
 */
export default function MountainClimbersOverlay({
  pnlData = [],
  containerWidth = 0,
  containerHeight = 0,
  marketStatus = 'CLOSED',
  minPnlProp = null,
  maxPnlProp = null
}) {
  const pathRef = useRef(null);
  const [climbProgress, setClimbProgress] = useState(0.0);
  const [isDescending, setIsDescending] = useState(false);
  const [pathLength, setPathLength] = useState(0);
  const [walkPhase, setWalkPhase] = useState(0);

  const width = containerWidth > 0 ? containerWidth : 800;
  const height = containerHeight > 0 ? containerHeight : 280;

  const margin = { top: 45, right: 25, left: 70, bottom: 30 };
  const chartW = Math.max(10, width - margin.left - margin.right);
  const chartH = Math.max(10, height - margin.top - margin.bottom);
  const xAxisY = margin.top + chartH;

  const pnlVals = useMemo(() => pnlData.map((d) => d.pnl), [pnlData]);

  const minPnl = minPnlProp !== null ? minPnlProp : -20000;
  const maxPnl = maxPnlProp !== null ? maxPnlProp : 60000;

  const y0 = useMemo(() => {
    const ratio0 = (maxPnl - minPnl) > 0 ? (0 - minPnl) / (maxPnl - minPnl) : 0.5;
    return margin.top + (1 - ratio0) * chartH;
  }, [minPnl, maxPnl, chartH, margin.top]);

  const basecampPoint = useMemo(() => ({
    x: margin.left - 18,
    y: y0,
    pnl: 0,
    index: -1
  }), [margin.left, y0]);

  const tradePoints = useMemo(() => {
    if (pnlData.length === 0) return [];
    return pnlData.map((d, i) => {
      const step = pnlData.length > 1 ? chartW / (pnlData.length - 1) : chartW / 2;
      const x = margin.left + i * step;
      const ratio = (maxPnl - minPnl) > 0 ? (d.pnl - minPnl) / (maxPnl - minPnl) : 0.5;
      const y = margin.top + (1 - ratio) * chartH;
      return { ...d, x, y, index: i };
    });
  }, [pnlData, chartW, chartH, minPnl, maxPnl]);

  const points = useMemo(() => {
    if (tradePoints.length === 0) return [];
    return [basecampPoint, ...tradePoints];
  }, [basecampPoint, tradePoints]);

  const dPath = useMemo(() => {
    return getMonotonePath(tradePoints, basecampPoint);
  }, [tradePoints, basecampPoint]);

  const snowflakes = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      cx: margin.left + ((i * 37) % chartW),
      cy: margin.top + ((i * 23) % chartH),
      r: (i % 3) + 1.2,
      opacity: 0.3 + (i % 5) * 0.12,
      dur: 4 + (i % 4) * 2,
      delay: (i % 7) * 0.5
    }));
  }, [margin.left, margin.top, chartW, chartH]);

  useEffect(() => {
    if (pathRef.current && dPath) {
      try {
        setPathLength(pathRef.current.getTotalLength());
      } catch (e) {
        setPathLength(0);
      }
    }
  }, [dPath, width, height]);

  useEffect(() => {
    let animFrameId;

    const updateScheduleAndWalk = () => {
      const now = new Date();
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const istDate = new Date(utcTime + 3600000 * 5.5);

      const hour = istDate.getHours();
      const min = istDate.getMinutes();
      const sec = istDate.getSeconds();
      const istMinutes = hour * 60 + min + sec / 60;

      const isWeekend = istDate.getDay() === 0 || istDate.getDay() === 6;

      const startAscent = 9 * 60 + 30;  // 9:30 AM
      const reachPeak   = 12 * 60 + 30; // 12:30 PM
      const leavePeak   = 12 * 60 + 35; // 12:35 PM
      const reachTent   = 15 * 60 + 40; // 3:40 PM

      let progress = 0;
      let descending = false;
      let isMoving = false;

      if (!isWeekend && istMinutes >= startAscent && istMinutes <= reachTent) {
        if (istMinutes < reachPeak) {
          progress = (istMinutes - startAscent) / (reachPeak - startAscent);
          descending = false;
          isMoving = true;
        } else if (istMinutes <= leavePeak) {
          progress = 1.0;
          descending = false;
          isMoving = false;
        } else if (istMinutes <= reachTent) {
          progress = 1.0 - (istMinutes - leavePeak) / (reachTent - leavePeak);
          descending = true;
          isMoving = true;
        }
      } else {
        progress = 0;
        descending = false;
        isMoving = false;
      }

      setClimbProgress(Math.max(0, Math.min(1, progress)));
      setIsDescending(descending);

      if (isMoving) {
        setWalkPhase((prev) => (prev + 0.15) % (Math.PI * 2));
      } else {
        setWalkPhase(0);
      }

      animFrameId = requestAnimationFrame(updateScheduleAndWalk);
    };

    animFrameId = requestAnimationFrame(updateScheduleAndWalk);
    return () => cancelAnimationFrame(animFrameId);
  }, []);

  if (pnlData.length === 0 || points.length === 0) {
    return null;
  }

  // Identify highest point across all trades (ATH Peak)
  const highestTradePoint = tradePoints.reduce(
    (max, pt) => (pt.pnl > max.pnl ? pt : max),
    tradePoints[0] || { pnl: 0 }
  );

  const latestTradePoint = tradePoints[tradePoints.length - 1];

  const isEndpointATH = highestTradePoint && latestTradePoint && highestTradePoint.index === latestTradePoint.index;
  const isAtEndpointCelebrating = climbProgress >= 0.98;

  let leadPos = points[0];
  let followerPos = points[0];

  if (pathRef.current && pathLength > 0) {
    try {
      const currentLen = pathLength * climbProgress;
      const separation = isAtEndpointCelebrating ? 14 : 50;
      const followerOffset = isDescending ? separation : -separation;
      const followerLen = Math.max(0, Math.min(pathLength, currentLen + followerOffset));

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

  const isMoving = walkPhase !== 0;
  const legAngle1 = isMoving ? Math.sin(walkPhase) * 15 : 0;
  const legAngle2 = isMoving ? -Math.sin(walkPhase) * 15 : 0;
  const armAngle1 = isMoving ? -Math.sin(walkPhase) * 20 : (isAtEndpointCelebrating ? -130 : 0);
  const armAngle2 = isMoving ? Math.sin(walkPhase) * 20 : (isAtEndpointCelebrating ? 130 : 0);

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

          <filter id="ropeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#f59e0b" floodOpacity="0.6" />
          </filter>

          <clipPath id="snowClip">
            <rect x="0" y="0" width={width} height={xAxisY} />
          </clipPath>
        </defs>

        <path ref={pathRef} d={dPath} fill="none" stroke="none" />

        {/* Ambient Snowfall Layer */}
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

        {/* Basecamp Tent Image at origin (PnL = 0, X axis start) */}
        <g transform={`translate(${basecampPoint.x - 18}, ${basecampPoint.y - 32})`}>
          <image
            href={tentImg}
            x="0"
            y="0"
            width="36"
            height="34"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>

        {/* Safety Anchors on exact cumulative P&L trade curve points */}
        {points.length > 1 && (
          <g className="climber-anchors">
            {tradePoints.map((pt, i) => (
              <g key={`anchor_${i}`}>
                <circle cx={pt.x} cy={pt.y} r="3" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" opacity="0.9" />
              </g>
            ))}
          </g>
        )}

        {/* Highest Peak Landmark Flag (ALL-TIME HIGH SUMMIT) */}
        {highestTradePoint && highestTradePoint.pnl > 0 && (
          <g transform={`translate(${highestTradePoint.x}, ${highestTradePoint.y - 8})`}>
            <line x1="0" y1="0" x2="0" y2="-24" stroke="#f59e0b" strokeWidth="1.5" />

            <polygon
              points="0,-24 20,-18 0,-12"
              fill="#10b981"
              stroke="#047857"
              strokeWidth="1"
              className="drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]"
            />
            <text x="2" y="-15" fill="#ffffff" fontSize="6" fontWeight="bold" fontFamily="monospace">
              ATH
            </text>

            <foreignObject x="-75" y="-46" width="150" height="22">
              <div className="flex items-center justify-center">
                <span className="bg-emerald-500 text-black border border-emerald-300 text-[7.5px] font-mono font-extrabold px-2 py-0.5 rounded shadow-[0_0_12px_rgba(16,185,129,0.9)] whitespace-nowrap">
                  🏆 ALL-TIME HIGH SUMMIT
                </span>
              </div>
            </foreignObject>
          </g>
        )}

        {/* Expedition Team (Follower & Lead Climber) */}
        {points.length > 0 && (
          <g className="climber-team">
            <path
              d={`M ${followerPos.x} ${followerPos.y - 5} Q ${(followerPos.x + leadPos.x) / 2} ${(followerPos.y + leadPos.y) / 2 + 3} ${leadPos.x} ${leadPos.y - 6}`}
              fill="none"
              stroke={isRedZone ? '#f43f5e' : '#10b981'}
              strokeWidth="1.8"
              filter="url(#ropeGlow)"
            />

            {/* Follower Mountaineer */}
            <g transform={`translate(${followerPos.x}, ${followerPos.y - 9}) scale(${isDescending ? '-1,1' : '1,1'})`}>
              <circle cx="0" cy="-6" r="2.5" fill="#38bdf8" />
              <line x1="0" y1="-3.5" x2="0" y2="4" stroke="#0284c7" strokeWidth="2" />
              <g transform={`rotate(${legAngle1}, 0, 4)`}>
                <line x1="0" y1="4" x2="-3" y2="9" stroke="#0284c7" strokeWidth="1.5" />
              </g>
              <g transform={`rotate(${legAngle2}, 0, 4)`}>
                <line x1="0" y1="4" x2="3" y2="9" stroke="#0284c7" strokeWidth="1.5" />
              </g>
              <g transform={`rotate(${armAngle1}, 0, -1)`}>
                <line x1="0" y1="-1" x2="-4" y2="3" stroke="#cbd5e1" strokeWidth="1.2" />
              </g>
              <g transform={`rotate(${armAngle2}, 0, -1)`}>
                <line x1="0" y1="-1" x2="4" y2="3" stroke="#cbd5e1" strokeWidth="1.2" />
              </g>
            </g>

            {/* Lead Mountaineer */}
            <g transform={`translate(${leadPos.x}, ${leadPos.y - 9}) scale(${isDescending ? '-1,1' : '1,1'})`}>
              <circle cx="0" cy="-6" r="2.5" fill="#f59e0b" />
              <line x1="0" y1="-3.5" x2="0" y2="4" stroke="#d97706" strokeWidth="2" />
              <g transform={`rotate(${legAngle1}, 0, 4)`}>
                <line x1="0" y1="4" x2="-3" y2="9" stroke="#d97706" strokeWidth="1.5" />
              </g>
              <g transform={`rotate(${legAngle2}, 0, 4)`}>
                <line x1="0" y1="4" x2="3" y2="9" stroke="#d97706" strokeWidth="1.5" />
              </g>
              <g transform={`rotate(${armAngle1}, 0, -1)`}>
                <line x1="0" y1="-1" x2="-4" y2="3" stroke="#f59e0b" strokeWidth="1.2" />
              </g>
              <g transform={`rotate(${armAngle2}, 0, -1)`}>
                <line x1="0" y1="-1" x2="4" y2="3" stroke="#f59e0b" strokeWidth="1.2" />
              </g>
            </g>

            <foreignObject
              x={Math.max(10, Math.min(width - 180, (leadPos.x + followerPos.x) / 2 - 80))}
              y={Math.min(leadPos.y, followerPos.y) - 42}
              width="160"
              height="26"
            >
              <div className="flex items-center justify-center h-full">
                {isAtEndpointCelebrating ? (
                  isEndpointATH ? (
                    <span className="bg-emerald-500 text-black text-[8px] font-mono font-extrabold px-2.5 py-0.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.9)] animate-bounce whitespace-nowrap">
                      🏔️ PEAK SUMMIT CELEBRATION! 🎉
                    </span>
                  ) : (
                    <span className="bg-[#0c0c0e]/95 text-amber-300 border border-amber-500/80 text-[7.5px] font-mono font-extrabold px-2 py-0.5 rounded shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-pulse whitespace-nowrap">
                      🙌 We will go high more next time
                    </span>
                  )
                ) : (
                  <div className="flex items-center space-x-1">
                    <span className="bg-[#0c0c0e]/95 text-sky-400 border border-sky-500/40 text-[7px] font-mono font-bold px-1 py-0.5 rounded">
                      FOLLOWER
                    </span>
                    <span className="bg-[#0c0c0e]/95 text-emerald-400 border border-emerald-500/40 text-[7px] font-mono font-bold px-1 py-0.5 rounded">
                      LEADER
                    </span>
                  </div>
                )}
              </div>
            </foreignObject>
          </g>
        )}
      </svg>
    </div>
  );
}
