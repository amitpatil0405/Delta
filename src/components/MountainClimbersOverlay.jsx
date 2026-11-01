import React, { useMemo, useState, useEffect, useRef } from 'react';
import { line as d3Line, curveMonotoneX as d3CurveMonotoneX } from 'd3-shape';
import tentImg from '../assets/tent.png';

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
 * Renders an interactive Mount Everest expedition animation layer on top of the Cumulative P&L Chart.
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
  const pathRef = useRef(null);
  const [climbProgress, setClimbProgress] = useState(0.0);
  const [isDescending, setIsDescending] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [isHoliday, setIsHoliday] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [tentTagline, setTentTagline] = useState(null);
  const [pathLength, setPathLength] = useState(0);
  const [walkPhase, setWalkPhase] = useState(0);

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

  // Scoped Large-Screen Media Query: Apply coordinate/position adjustments strictly on large desktop displays (min-width: 1200px)
  const [isLargeDesktop, setIsLargeDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(min-width: 1200px)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(min-width: 1200px)');
    const handleMediaChange = (e) => {
      setIsLargeDesktop(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

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

  useEffect(() => {
    if (pathRef.current && dPath) {
      try {
        setPathLength(pathRef.current.getTotalLength());
      } catch (e) {
        setPathLength(0);
      }
    }
  }, [dPath, width, height]);

  // IST Market Hours Schedule Animation Loop
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

      const dayOfWeek = istDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Extract status text from marketStatus prop or object
      let statusStr = '';
      if (typeof marketStatus === 'string') {
        statusStr = marketStatus.toUpperCase();
      } else if (marketStatus && typeof marketStatus.status === 'string') {
        statusStr = marketStatus.status.toUpperCase();
      } else if (marketStatus && typeof marketStatus.message === 'string') {
        statusStr = marketStatus.message.toUpperCase();
      }

      const isScheduledHoliday = statusStr.includes('HOLIDAY') || (statusStr.includes('CLOSED') && !statusStr.includes('MARKET CLOSED'));

      const preOpenStart  = 9 * 60;        // 09:00 AM IST
      const startAscent   = 9 * 60 + 15;   // 09:15 AM IST
      const journeyTagEnd = 9 * 60 + 20;   // 09:20 AM IST (5 mins after departure)
      const reachPeak     = 12 * 60 + 30;  // 12:30 PM IST
      const leavePeak     = 12 * 60 + 35;  // 12:35 PM IST
      const reachTent     = 15 * 60 + 40;  // 03:40 PM IST
      const restTime      = 15 * 60 + 45;  // 03:45 PM IST

      let progress = 0;
      let descending = false;
      let isMoving = false;
      let resting = false;
      let holiday = false;
      let tagline = null;

      if (isScheduledHoliday && !isWeekend && (istMinutes < preOpenStart || istMinutes >= restTime)) {
        // Scheduled Holiday: Show "Holiday today" near tent
        progress = 0;
        descending = false;
        isMoving = false;
        resting = true;
        holiday = true;
        tagline = 'Holiday today';
      } else if (!isWeekend && istMinutes >= preOpenStart && istMinutes < restTime) {
        if (istMinutes < startAscent || statusStr.includes('PRE-OPEN')) {
          // 09:00 AM - 09:15 AM IST: Tagline "Preparing" in yellow above tent, climbers visible at start
          progress = 0;
          descending = false;
          isMoving = false;
          resting = false;
          tagline = 'Preparing';
        } else if (istMinutes < reachPeak) {
          // 09:15 AM - 12:30 PM IST: Ascent Left to Right
          progress = (istMinutes - startAscent) / (reachPeak - startAscent);
          descending = false;
          isMoving = true;
          resting = false;
          tagline = istMinutes <= journeyTagEnd ? 'Journey started' : null;
        } else if (istMinutes <= leavePeak) {
          // 12:30 PM - 12:35 PM IST: Reach end point, pause & celebrate
          progress = 1.0;
          descending = false;
          isMoving = false;
          resting = false;
          tagline = null;
        } else if (istMinutes <= reachTent) {
          // 12:35 PM - 03:40 PM IST: Return journey Right to Left back to Tent
          progress = 1.0 - (istMinutes - leavePeak) / (reachTent - leavePeak);
          descending = true;
          isMoving = true;
          resting = false;
          tagline = null;
        } else {
          // 03:40 PM - 03:45 PM IST: Arrived at Tent
          progress = 0;
          descending = true;
          isMoving = false;
          resting = false;
          tagline = null;
        }
      } else {
        // Post-3:40 PM / 3:45 PM+ or Weekend: Disappear back into tent, tagline "Taking rest"
        progress = 0;
        descending = false;
        isMoving = false;
        resting = true;
        holiday = false;
        tagline = 'Taking rest';
      }

      setClimbProgress(Math.max(0, Math.min(1, progress)));
      setIsDescending(descending);
      setIsResting(resting);
      setIsHoliday(holiday);
      setIsWalking(isMoving);
      setTentTagline(tagline);

      if (isMoving) {
        setWalkPhase((prev) => (prev + 0.07) % (Math.PI * 2));
      } else {
        setWalkPhase(0);
      }

      animFrameId = requestAnimationFrame(updateScheduleAndWalk);
    };

    animFrameId = requestAnimationFrame(updateScheduleAndWalk);
    return () => cancelAnimationFrame(animFrameId);
  }, [marketStatus]);

  if (pnlData.length === 0 || points.length === 0) {
    return null;
  }

  // Identify highest point across all closed trades (ATH Peak)
  const tradedPoints = points.filter(p => !p.isOrigin);
  const highestTradePoint = tradedPoints.reduce(
    (max, pt) => (pt.pnl > max.pnl ? pt : max),
    tradedPoints[0] || { pnl: 0 }
  );

  const endpointTradePoint = points[points.length - 1];

  const isEndpointATH = highestTradePoint && endpointTradePoint && highestTradePoint.index === endpointTradePoint.index;
  const isAtEndpointCelebrating = climbProgress >= 0.98;

  let leadPos = points[0];
  let followerPos = points[0];
  let isLeaderMoving = false;
  let isFollowerMoving = false;

  if (pathRef.current && pathLength > 0) {
    try {
      const currentLen = pathLength * climbProgress;
      let ptLead, ptFollower;

      if (!isDescending) {
        // Morning Ascent (Left to Right): Leader ahead, Follower behind
        const separation = isAtEndpointCelebrating ? 14 : 45;
        const leadLen = Math.max(0, Math.min(pathLength, currentLen));
        const followerLen = Math.max(0, Math.min(pathLength, currentLen - separation));
        ptLead = pathRef.current.getPointAtLength(leadLen);
        ptFollower = pathRef.current.getPointAtLength(followerLen);

        isLeaderMoving = isWalking && currentLen > 0 && leadLen < pathLength;
        isFollowerMoving = isWalking && currentLen >= separation && followerLen < pathLength;
      } else {
        // Return Journey (Right to Left): Leader leaves endpoint first moving back towards Tent.
        // Dynamic separation shrinks smoothly as progress -> 0 so BOTH Leader AND Follower arrive at Tent (location 0) at 3:40 PM!
        const dynamicSeparation = Math.min(45, pathLength * climbProgress);
        const leadLen = Math.max(0, Math.min(pathLength, currentLen));
        const followerLen = Math.max(0, Math.min(pathLength, currentLen + dynamicSeparation));
        ptLead = pathRef.current.getPointAtLength(leadLen);
        ptFollower = pathRef.current.getPointAtLength(followerLen);

        isLeaderMoving = isWalking && currentLen < pathLength && leadLen > 0;
        isFollowerMoving = isWalking && currentLen <= pathLength - dynamicSeparation && followerLen > 0;
      }

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

  // Realistic jointed 2-segment leg walking cycle angles for Leader
  const leaderThigh1 = isLeaderMoving ? Math.sin(walkPhase) * 22 : 0;
  const leaderShin1  = isLeaderMoving ? Math.max(0, Math.sin(walkPhase + 0.5) * 20) : 0;
  const leaderThigh2 = isLeaderMoving ? -Math.sin(walkPhase) * 22 : 0;
  const leaderShin2  = isLeaderMoving ? Math.max(0, -Math.sin(walkPhase + 0.5) * 20) : 0;
  const leaderArm1   = isLeaderMoving ? -Math.sin(walkPhase) * 25 : (isAtEndpointCelebrating ? -135 : -15);
  const leaderArm2   = isLeaderMoving ? Math.sin(walkPhase) * 25 : (isAtEndpointCelebrating ? 135 : 15);

  // Realistic jointed 2-segment leg walking cycle angles for Follower
  const followerThigh1 = isFollowerMoving ? Math.sin(walkPhase) * 22 : 0;
  const followerShin1  = isFollowerMoving ? Math.max(0, Math.sin(walkPhase + 0.5) * 20) : 0;
  const followerThigh2 = isFollowerMoving ? -Math.sin(walkPhase) * 22 : 0;
  const followerShin2  = isFollowerMoving ? Math.max(0, -Math.sin(walkPhase + 0.5) * 20) : 0;
  const followerArm1   = isFollowerMoving ? -Math.sin(walkPhase) * 25 : (isAtEndpointCelebrating ? -135 : -15);
  const followerArm2   = isFollowerMoving ? Math.sin(walkPhase) * 25 : (isAtEndpointCelebrating ? 135 : 15);

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

        <path ref={pathRef} d={dPath} fill="none" stroke="none" />

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

        {/* Basecamp Tent Graphic placed at Exact 0 P&L Y-Axis Line (Scoped Large-Screen Media Query) */}
        <g
          className="tent-marker"
          transform={`translate(${isLargeDesktop ? margin.left - 42 : margin.left - 42}, ${isLargeDesktop ? zeroY - 32 : zeroY - 32})`}
        >
          <image
            href={tentImg}
            x="0"
            y="0"
            width={isLargeDesktop ? 38 : 38}
            height={isLargeDesktop ? 36 : 36}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>

        {/* Highest Peak Landmark Flag (ALL-TIME HIGH SUMMIT) connected directly to curve line (Scoped Large-Screen Media Query) */}
        {highestTradePoint && highestTradePoint.pnl > 0 && (
          <g
            className="ath-flag-marker"
            transform={`translate(${isLargeDesktop ? highestTradePoint.x : highestTradePoint.x}, ${isLargeDesktop ? highestTradePoint.y : highestTradePoint.y})`}
          >
            {/* Anchor dot directly on curve line */}
            <circle cx="0" cy="0" r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.2" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.9)]" />

            {/* Flagpole connected directly to anchor dot */}
            <line x1="0" y1="0" x2="0" y2="-32" stroke="#f59e0b" strokeWidth="2" />

            {/* Flag Banner */}
            <polygon
              points="0,-32 24,-24 0,-16"
              fill="#10b981"
              stroke="#047857"
              strokeWidth="1"
              className="drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
            />
            <text x="2" y="-21" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="monospace">
              ATH
            </text>
          </g>
        )}

        {/* Layer 3: Position Banner Badges & Summit Celebration Text (Rendered TOP-MOST above Flag and Climbers) */}
        {points.length > 0 && !isResting && (
          <g className="climber-badges">
            {isAtEndpointCelebrating ? (
              <foreignObject
                x={Math.max(10, Math.min(leadPos.x, followerPos.x) - 195)}
                y={Math.min(leadPos.y, followerPos.y) - 60}
                width="190"
                height="32"
              >
                <div className="flex items-center justify-end h-full">
                  {isEndpointATH ? (
                    <span className="bg-emerald-500 text-black text-[8.5px] font-mono font-extrabold px-3 py-1 rounded-full shadow-[0_0_18px_rgba(16,185,129,0.95)] animate-bounce whitespace-nowrap">
                      🏔️ PEAK SUMMIT CELEBRATION! 🎉
                    </span>
                  ) : (
                    <span className="bg-[#0c0c0e]/95 text-amber-300 border border-amber-500/80 text-[8px] font-mono font-extrabold px-2.5 py-1 rounded shadow-[0_0_14px_rgba(245,158,11,0.6)] animate-pulse whitespace-nowrap">
                      🙌 We will touch high again
                    </span>
                  )}
                </div>
              </foreignObject>
            ) : (
              <>
                {/* FOLLOWER Badge elevated well above Follower head when Follower is walking */}
                {isFollowerMoving && (
                  <foreignObject
                    x={followerPos.x - 35}
                    y={followerPos.y - 58}
                    width="70"
                    height="20"
                  >
                    <div className="flex justify-center items-center h-full">
                      <span className="bg-[#0c0c0e]/95 text-sky-400 border border-sky-500/50 text-[7.5px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                        FOLLOWER
                      </span>
                    </div>
                  </foreignObject>
                )}

                {/* LEADER Badge elevated well above Leader head when Leader is walking */}
                {isLeaderMoving && (
                  <foreignObject
                    x={leadPos.x - 30}
                    y={leadPos.y - 58}
                    width="60"
                    height="20"
                  >
                    <div className="flex justify-center items-center h-full">
                      <span className="bg-[#0c0c0e]/95 text-amber-400 border border-amber-500/50 text-[7.5px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                        LEADER
                      </span>
                    </div>
                  </foreignObject>
                )}
              </>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}

export default React.memo(MountainClimbersOverlay);
