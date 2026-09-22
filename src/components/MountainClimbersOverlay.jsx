import React, { useMemo, useState, useEffect, useRef } from 'react';

/**
 * MountainClimbersOverlay
 * Renders an interactive Mount Everest expedition animation layer on top of the Cumulative P&L Chart.
 * Features:
 * - Real-time IST schedule single journey (9:30 AM -> 12:30 PM ascent to peak, 12:30 PM -> 12:35 PM stay/celebrate at peak, 12:35 PM -> 3:40 PM descent back to tent)
 * - Foot and arm walking movements for Lead & Follower mountaineers
 * - Top margin increased (top: 45) so high point flags/taglines render completely within view
 * - ATH (All-Time High) check: Celebrates with "PEAK SUMMIT!" if peak is ATH, or displays "We will go high more next time" if peak is below ATH
 * - Basecamp tent at origin with session status badges
 * - Ambient snowfall backdrop
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
  const [isDescending, setIsDescending] = useState(false);
  const [pathLength, setPathLength] = useState(0);
  const [walkPhase, setWalkPhase] = useState(0);

  // Fallback dimensions if containerWidth/Height are initially 0
  const width = containerWidth > 0 ? containerWidth : 800;
  const height = containerHeight > 0 ? containerHeight : 280;

  // Determine market session state
  const isOpen = marketStatus === 'MARKET OPEN';
  const isPreOpen = marketStatus === 'PRE-MARKET';

  // Left margin includes Recharts YAxis width (60px) + chart margin (10px) = 70px
  const margin = { top: 45, right: 25, left: 70, bottom: 0 };
  const chartW = Math.max(10, width - margin.left - margin.right);
  const chartH = Math.max(10, height - margin.top - margin.bottom);

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
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      cx: (i * 37) % width,
      cy: (i * 23) % height,
      r: (i % 3) + 1.2,
      opacity: 0.3 + (i % 5) * 0.12,
      dur: 4 + (i % 4) * 2,
      delay: (i % 7) * 0.5
    }));
  }, [width, height]);

  // Update total path length when path changes
  useEffect(() => {
    if (pathRef.current && dPath) {
      try {
        setPathLength(pathRef.current.getTotalLength());
      } catch (e) {
        setPathLength(0);
      }
    }
  }, [dPath, width, height]);

  // Walking legs and arms animation loop + IST schedule calculation
  useEffect(() => {
    let animFrameId;

    const updateScheduleAndWalk = () => {
      // Calculate current IST time in minutes from midnight
      const now = new Date();
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const istDate = new Date(utcTime + 3600000 * 5.5);

      const hour = istDate.getHours();
      const min = istDate.getMinutes();
      const sec = istDate.getSeconds();
      const istMinutes = hour * 60 + min + sec / 60;

      // Check if weekend (0 = Sunday, 6 = Saturday)
      const isWeekend = istDate.getDay() === 0 || istDate.getDay() === 6;

      // Define schedule milestones (in minutes from midnight IST)
      const startAscent = 9 * 60 + 30;  // 9:30 AM = 570 min
      const reachPeak   = 12 * 60 + 30; // 12:30 PM = 750 min
      const leavePeak   = 12 * 60 + 35; // 12:35 PM = 755 min
      const reachTent   = 15 * 60 + 40; // 3:40 PM = 940 min

      let progress = 0;
      let descending = false;
      let isMoving = false;

      if (!isWeekend && istMinutes >= startAscent && istMinutes <= reachTent) {
        if (istMinutes < reachPeak) {
          // 9:30 AM to 12:30 PM: Ascent (0% -> 100%)
          progress = (istMinutes - startAscent) / (reachPeak - startAscent);
          descending = false;
          isMoving = true;
        } else if (istMinutes <= leavePeak) {
          // 12:30 PM to 12:35 PM: Celebrate at Peak (100%)
          progress = 1.0;
          descending = false;
          isMoving = false;
        } else if (istMinutes <= reachTent) {
          // 12:35 PM to 3:40 PM: Descent (100% -> 0%)
          progress = 1.0 - (istMinutes - leavePeak) / (reachTent - leavePeak);
          descending = true;
          isMoving = true;
        }
      } else {
        // Outside 9:30 AM - 3:40 PM or Weekend / Closed: Rest at tent
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

  // Early return after all hooks have been declared
  if (pnlData.length === 0 || points.length === 0) {
    return null;
  }

  const basecampPoint = points[0] || { x: margin.left, y: margin.top + chartH };

  // Find highest point in P&L curve
  const highestPoint = [...points].sort((a, b) => b.pnl - a.pnl)[0];

  // Highest trade P&L value across entire historical data
  const overallMaxTradePnl = Math.max(...pnlVals, 0);

  // Check if highest point is ATH (All-Time High)
  const isATH = highestPoint && highestPoint.pnl >= overallMaxTradePnl && highestPoint.pnl > 0;

  // Compute Lead & Follower positions based on climbProgress along path
  let leadPos = points[0];
  let followerPos = points[0];

  if (pathRef.current && pathLength > 0) {
    try {
      const currentLen = pathLength * climbProgress;
      // Safety distance offset for follower (~70px separation along path)
      const followerOffset = isDescending ? 70 : -70;
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
      // Fallback to basecamp
    }
  }

  const isRedZone = leadPos.pnl < 0;

  // Walking foot and arm angle calculations
  const legAngle1 = Math.sin(walkPhase) * 15;
  const legAngle2 = -Math.sin(walkPhase) * 15;
  const armAngle1 = -Math.sin(walkPhase) * 20;
  const armAngle2 = Math.sin(walkPhase) * 20;

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
                to={height + 10}
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
        </g>

        {/* Tent Status Badge - Positioned right below the tent & trade markers */}
        <foreignObject
          x={Math.max(5, Math.min(width - 150, basecampPoint.x - 35))}
          y={Math.min(height - 24, basecampPoint.y + 10)}
          width="150"
          height="24"
        >
          <div className="flex items-center justify-center h-full">
            <span className="bg-[#0c0c0e]/95 border border-amber-500/50 text-[7.5px] font-mono text-amber-400 font-extrabold px-1.5 py-0.5 rounded shadow-lg backdrop-blur-sm tracking-wider whitespace-nowrap">
              {isPreOpen ? 'PREPARING GEARS..' : isOpen ? 'EXPEDITION IN PROGRESS' : 'RESTING AT TENT'}
            </span>
          </div>
        </foreignObject>

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

        {/* Expedition Team (Follower & Lead Climber with Foot Movement) */}
        {points.length > 0 && (
          <g className="climber-team">
            {/* Connecting Safety Rope with subtle downward sag */}
            <path
              d={`M ${followerPos.x} ${followerPos.y - 5} Q ${(followerPos.x + leadPos.x) / 2} ${(followerPos.y + leadPos.y) / 2 + 4} ${leadPos.x} ${leadPos.y - 6}`}
              fill="none"
              stroke={isRedZone ? '#f43f5e' : '#10b981'}
              strokeWidth="1.8"
              filter="url(#ropeGlow)"
            />

            {/* Follower Mountaineer - Feet anchored precisely on line (translate y = y - 9) */}
            <g transform={`translate(${followerPos.x}, ${followerPos.y - 9}) scale(${isDescending ? '-1,1' : '1,1'})`}>
              {/* Head */}
              <circle cx="0" cy="-6" r="2.5" fill="#38bdf8" />
              {/* Body */}
              <line x1="0" y1="-3.5" x2="0" y2="4" stroke="#0284c7" strokeWidth="2" />
              {/* Left Leg with foot motion */}
              <g transform={`rotate(${legAngle1}, 0, 4)`}>
                <line x1="0" y1="4" x2="-3" y2="9" stroke="#0284c7" strokeWidth="1.5" />
              </g>
              {/* Right Leg with foot motion */}
              <g transform={`rotate(${legAngle2}, 0, 4)`}>
                <line x1="0" y1="4" x2="3" y2="9" stroke="#0284c7" strokeWidth="1.5" />
              </g>
              {/* Left Arm with walking motion */}
              <g transform={`rotate(${armAngle1}, 0, -1)`}>
                <line x1="0" y1="-1" x2="-4" y2="3" stroke="#cbd5e1" strokeWidth="1.2" />
              </g>
              {/* Right Arm holding ice axe */}
              <g transform={`rotate(${armAngle2}, 0, -1)`}>
                <line x1="0" y1="-1" x2="4" y2="3" stroke="#cbd5e1" strokeWidth="1.2" />
              </g>
            </g>

            {/* Follower Status Badge - Centered well above Follower so head is clear */}
            <foreignObject
              x={Math.max(10, Math.min(width - 110, followerPos.x - 50))}
              y={followerPos.y - 42}
              width="100"
              height="20"
            >
              <div className="flex items-center justify-center h-full">
                <span className="bg-[#0c0c0e]/95 text-[7.5px] font-mono text-sky-400 font-extrabold px-1.5 py-0.5 rounded border border-sky-500/40 shadow-md whitespace-nowrap">
                  FOLLOWER
                </span>
              </div>
            </foreignObject>

            {/* Lead Mountaineer - Feet anchored precisely on line (translate y = y - 9) matching follower structure */}
            <g transform={`translate(${leadPos.x}, ${leadPos.y - 9}) scale(${isDescending ? '-1,1' : '1,1'})`}>
              {/* Head */}
              <circle cx="0" cy="-6" r="2.5" fill="#f59e0b" />
              {/* Body */}
              <line x1="0" y1="-3.5" x2="0" y2="4" stroke="#d97706" strokeWidth="2" />
              {/* Left Leg with foot motion matching follower */}
              <g transform={`rotate(${legAngle1}, 0, 4)`}>
                <line x1="0" y1="4" x2="-3" y2="9" stroke="#d97706" strokeWidth="1.5" />
              </g>
              {/* Right Leg with foot motion matching follower */}
              <g transform={`rotate(${legAngle2}, 0, 4)`}>
                <line x1="0" y1="4" x2="3" y2="9" stroke="#d97706" strokeWidth="1.5" />
              </g>
              {/* Left Arm with walking motion matching follower */}
              <g transform={`rotate(${armAngle1}, 0, -1)`}>
                <line x1="0" y1="-1" x2="-4" y2="3" stroke="#f59e0b" strokeWidth="1.2" />
              </g>
              {/* Right Arm with walking motion matching follower */}
              <g transform={`rotate(${armAngle2}, 0, -1)`}>
                <line x1="0" y1="-1" x2="4" y2="3" stroke="#f59e0b" strokeWidth="1.2" />
              </g>
            </g>

            {/* Lead Status Badge - Centered well above Leader (GREEN tagline) so head is clear */}
            <foreignObject
              x={Math.max(10, Math.min(width - 110, leadPos.x - 50))}
              y={leadPos.y - 45}
              width="100"
              height="24"
            >
              <div className="flex items-center justify-center h-full">
                {climbProgress > 0.95 && isATH ? (
                  <span className="bg-emerald-500 text-black text-[8px] font-mono font-extrabold px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-bounce whitespace-nowrap">
                    🏔️ PEAK SUMMIT!
                  </span>
                ) : (
                  <span className="bg-[#0c0c0e]/95 text-emerald-400 border border-emerald-500/50 text-[7.5px] font-mono text-amber-400 font-extrabold px-1.5 py-0.5 rounded backdrop-blur-sm whitespace-nowrap">
                    LEADER
                  </span>
                )}
              </div>
            </foreignObject>
          </g>
        )}

        {/* Highest Peak Landmark Flag with Tagline */}
        {highestPoint && highestPoint.pnl > 0 && (
          <g transform={`translate(${highestPoint.x}, ${highestPoint.y - 12})`}>
            {/* Flagpole */}
            <line x1="0" y1="0" x2="0" y2="-28" stroke="#f59e0b" strokeWidth="1.5" />

            {/* Flag Polygon */}
            <polygon
              points="0,-28 22,-21 0,-14"
              fill={isATH ? '#10b981' : '#f59e0b'}
              stroke={isATH ? '#047857' : '#d97706'}
              strokeWidth="1"
              className="drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]"
            />
            <text x="2" y="-18" fill="#ffffff" fontSize="6.5" fontWeight="bold" fontFamily="monospace">
              {isATH ? 'MAX' : 'PEAK'}
            </text>

            {/* Tagline Badge at Summit */}
            <foreignObject x="-90" y="-48" width="180" height="22">
              <div className="flex items-center justify-center">
                {isATH ? (
                  <span className="bg-emerald-500 text-black border border-emerald-400 text-[8px] font-mono font-extrabold px-2 py-0.5 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.9)] animate-pulse whitespace-nowrap">
                    🏆 ALL-TIME HIGH SUMMIT
                  </span>
                ) : (
                  <span className="bg-[#0c0c0e]/95 text-amber-400 border border-amber-500/60 text-[7.5px] font-mono font-extrabold px-2 py-0.5 rounded-md shadow-lg backdrop-blur-md whitespace-nowrap">
                    We will go high more next time
                  </span>
                )}
              </div>
            </foreignObject>
          </g>
        )}
      </svg>
    </div>
  );
}
