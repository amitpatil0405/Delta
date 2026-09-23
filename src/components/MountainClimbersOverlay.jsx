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
  const [isResting, setIsResting] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [tentTagline, setTentTagline] = useState('Taking rest');
  const [pathLength, setPathLength] = useState(0);
  const [walkPhase, setWalkPhase] = useState(0);

  const width = containerWidth > 0 ? containerWidth : 800;
  const height = containerHeight > 0 ? containerHeight : 320;

  // Margin synchronized with Recharts AreaChart (top: 65, right: 25, left: 10 + YAxis(60), bottom: 35)
  const margin = { top: 65, right: 25, left: 70, bottom: 35 };
  const chartW = Math.max(10, width - margin.left - margin.right);
  const chartH = Math.max(10, height - margin.top - margin.bottom);
  const xAxisY = margin.top + chartH;

  const minPnl = minPnlProp !== null ? minPnlProp : -20000;
  const maxPnl = maxPnlProp !== null ? maxPnlProp : 60000;

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

  const originPoint = points[0] || { x: margin.left, y: margin.top + chartH / 2 };

  const dPath = useMemo(() => {
    return getMonotonePath(points);
  }, [points]);

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

      const isWeekend = istDate.getDay() === 0 || istDate.getDay() === 6;

      const preOpenStart  = 9 * 60;        // 09:00 AM IST
      const startAscent   = 9 * 60 + 30;   // 09:30 AM IST
      const journey5Min   = 9 * 60 + 35;   // 09:35 AM IST (5 mins after ascent)
      const reachPeak     = 12 * 60 + 30;  // 12:30 PM IST
      const leavePeak     = 12 * 60 + 35;  // 12:35 PM IST
      const reachTent     = 15 * 60 + 40;  // 03:40 PM IST
      const restTime      = 15 * 60 + 45;  // 03:45 PM IST

      let progress = 0;
      let descending = false;
      let isMoving = false;
      let resting = false;
      let tagline = null;

      const isPreMarketProp = typeof marketStatus === 'string' && (marketStatus.includes('PRE') || marketStatus.includes('Pre'));

      if (!isWeekend && ((istMinutes >= preOpenStart && istMinutes < restTime) || isPreMarketProp)) {
        if (isPreMarketProp || istMinutes < startAscent) {
          // Pre-Open session (09:00 AM - 09:30 AM IST): Both climbers visible at start point, tagline "Preparing" in yellow
          progress = 0;
          descending = false;
          isMoving = false;
          resting = false;
          tagline = 'Preparing';
        } else if (istMinutes < reachPeak) {
          // Ascent (09:30 AM - 12:30 PM IST)
          progress = (istMinutes - startAscent) / (reachPeak - startAscent);
          descending = false;
          isMoving = true;
          resting = false;

          // "Journey started" in green for 5 mins after journey start
          if (istMinutes < journey5Min) {
            tagline = 'Journey started';
          } else {
            tagline = null;
          }
        } else if (istMinutes <= leavePeak) {
          progress = 1.0;
          descending = false;
          isMoving = false;
          resting = false;
          tagline = null;
        } else if (istMinutes <= reachTent) {
          progress = 1.0 - (istMinutes - leavePeak) / (reachTent - leavePeak);
          descending = true;
          isMoving = true;
          resting = false;
          tagline = null;
        } else {
          // Between 3:40 PM and 3:45 PM: At tent
          progress = 0;
          descending = true;
          isMoving = false;
          resting = false;
          tagline = null;
        }
      } else {
        // At 3:45 PM and onwards or off-market hours: Hide climbers & show "Taking rest"
        progress = 0;
        descending = false;
        isMoving = false;
        resting = true;
        tagline = 'Taking rest';
      }

      setClimbProgress(Math.max(0, Math.min(1, progress)));
      setIsDescending(descending);
      setIsResting(resting);
      setIsWalking(isMoving);
      setTentTagline(tagline);

      if (isMoving) {
        setWalkPhase((prev) => (prev + 0.15) % (Math.PI * 2));
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

  if (pathRef.current && pathLength > 0) {
    try {
      const currentLen = pathLength * climbProgress;
      const separation = isAtEndpointCelebrating ? 14 : 45;

      let ptLead, ptFollower;

      if (!isDescending) {
        // Ascent: Leader is ahead (larger path length), Follower behind (smaller path length)
        const leadLen = Math.max(0, Math.min(pathLength, currentLen));
        const followerLen = Math.max(0, Math.min(pathLength, currentLen - separation));
        ptLead = pathRef.current.getPointAtLength(leadLen);
        ptFollower = pathRef.current.getPointAtLength(followerLen);
      } else {
        // Return Journey (Descent): Leader leads in front facing left towards Tent (smaller path length), Follower behind Leader (larger path length)
        const leadLen = Math.max(0, Math.min(pathLength, currentLen - separation));
        const followerLen = Math.max(0, Math.min(pathLength, currentLen));
        ptLead = pathRef.current.getPointAtLength(leadLen);
        ptFollower = pathRef.current.getPointAtLength(followerLen);
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

  const isRedZone = leadPos.pnl < 0;
  const isMoving = walkPhase !== 0;

  // Realistic jointed 2-segment leg walking cycle angles
  const thighAngle1 = isMoving ? Math.sin(walkPhase) * 22 : 0;
  const shinAngle1  = isMoving ? Math.max(0, Math.sin(walkPhase + 0.5) * 20) : 0;
  const thighAngle2 = isMoving ? -Math.sin(walkPhase) * 22 : 0;
  const shinAngle2  = isMoving ? Math.max(0, -Math.sin(walkPhase + 0.5) * 20) : 0;

  const armAngle1 = isMoving ? -Math.sin(walkPhase) * 25 : (isAtEndpointCelebrating ? -135 : -15);
  const armAngle2 = isMoving ? Math.sin(walkPhase) * 25 : (isAtEndpointCelebrating ? 135 : 15);

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

        {/* Basecamp Tent Graphic placed on the Left Side of Y-Axis Line */}
        <g transform={`translate(${originPoint.x - 42}, ${originPoint.y - 32})`}>
          <image
            href={tentImg}
            x="0"
            y="0"
            width="38"
            height="36"
            preserveAspectRatio="xMidYMid meet"
          />
          {/* Dynamic Tent Tagline */}
          {tentTagline === 'Preparing' && (
            <foreignObject x="-25" y="-22" width="90" height="20">
              <div className="flex items-center justify-center">
                <span className="bg-[#0c0c0e]/95 text-amber-400 border border-amber-500/60 text-[7.5px] font-mono font-extrabold px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(245,158,11,0.4)] whitespace-nowrap animate-pulse">
                  Preparing
                </span>
              </div>
            </foreignObject>
          )}
          {tentTagline === 'Journey started' && (
            <foreignObject x="-35" y="-22" width="110" height="20">
              <div className="flex items-center justify-center">
                <span className="bg-[#0c0c0e]/95 text-emerald-400 border border-emerald-500/60 text-[7.5px] font-mono font-extrabold px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(16,185,129,0.4)] whitespace-nowrap animate-pulse">
                  Journey started
                </span>
              </div>
            </foreignObject>
          )}
          {tentTagline === 'Taking rest' && (
            <foreignObject x="-25" y="-22" width="90" height="20">
              <div className="flex items-center justify-center">
                <span className="bg-[#0c0c0e]/95 text-amber-400 border border-amber-500/60 text-[7.5px] font-mono font-extrabold px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(245,158,11,0.4)] whitespace-nowrap animate-pulse">
                  Taking rest
                </span>
              </div>
            </foreignObject>
          )}
        </g>

        {/* Highest Peak Landmark Flag (ALL-TIME HIGH SUMMIT) connected directly to curve line */}
        {highestTradePoint && highestTradePoint.pnl > 0 && (
          <g transform={`translate(${highestTradePoint.x}, ${highestTradePoint.y})`}>
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

            {/* Top Badge: Horizontally adjusted so it never clips off the right screen border */}
            {(() => {
              const bannerWidth = 150;
              let bannerOffsetX = -75; // Default center
              if (highestTradePoint.x + 75 > width - 15) {
                bannerOffsetX = -135; // Shift left if near right edge
              } else if (highestTradePoint.x - 75 < 15) {
                bannerOffsetX = -10; // Shift right if near left edge
              }
              return (
                <foreignObject x={bannerOffsetX} y="-60" width={bannerWidth} height="26">
                  <div className="flex items-center justify-center">
                    <span className="bg-emerald-500 text-black border border-emerald-300 text-[8px] font-mono font-extrabold px-2.5 py-0.5 rounded shadow-[0_0_12px_rgba(16,185,129,0.9)] whitespace-nowrap">
                      🏆 ALL-TIME HIGH SUMMIT
                    </span>
                  </div>
                </foreignObject>
              );
            })()}
          </g>
        )}

        {/* Expedition Team (Follower & Lead Mountaineers) - Hidden when resting (after 3:45 PM IST / off-market) */}
        {points.length > 0 && !isResting && (
          <g className="climber-team">
            {/* Follower Mountaineer */}
            <g transform={`translate(${followerPos.x}, ${followerPos.y - 13}) scale(${isDescending ? '-1,1' : '1,1'})`}>
              {/* Head */}
              <circle cx="0" cy="-7" r="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
              {/* Torso */}
              <line x1="0" y1="-4" x2="0" y2="4" stroke="#0284c7" strokeWidth="2.5" />

              {/* Leg 1 (Jointed Thigh + Shin) */}
              <g transform={`rotate(${thighAngle1}, 0, 4)`}>
                <line x1="0" y1="4" x2="-2" y2="8" stroke="#0284c7" strokeWidth="1.8" />
                <g transform={`rotate(${shinAngle1}, -2, 8)`}>
                  <line x1="-2" y1="8" x2="-2" y2="13" stroke="#0284c7" strokeWidth="1.6" />
                </g>
              </g>

              {/* Leg 2 (Jointed Thigh + Shin) */}
              <g transform={`rotate(${thighAngle2}, 0, 4)`}>
                <line x1="0" y1="4" x2="2" y2="8" stroke="#0284c7" strokeWidth="1.8" />
                <g transform={`rotate(${shinAngle2}, 2, 8)`}>
                  <line x1="2" y1="8" x2="2" y2="13" stroke="#0284c7" strokeWidth="1.6" />
                </g>
              </g>

              {/* Arm 1 */}
              <g transform={`rotate(${armAngle1}, 0, -2)`}>
                <line x1="0" y1="-2" x2="-5" y2="3" stroke="#cbd5e1" strokeWidth="1.5" />
              </g>

              {/* Arm 2 */}
              <g transform={`rotate(${armAngle2}, 0, -2)`}>
                <line x1="0" y1="-2" x2="5" y2="3" stroke="#cbd5e1" strokeWidth="1.5" />
              </g>
            </g>

            {/* Lead Mountaineer */}
            <g transform={`translate(${leadPos.x}, ${leadPos.y - 13}) scale(${isDescending ? '-1,1' : '1,1'})`}>
              {/* Head */}
              <circle cx="0" cy="-7" r="3" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
              {/* Torso */}
              <line x1="0" y1="-4" x2="0" y2="4" stroke="#d97706" strokeWidth="2.5" />

              {/* Leg 1 (Jointed Thigh + Shin) */}
              <g transform={`rotate(${thighAngle1}, 0, 4)`}>
                <line x1="0" y1="4" x2="-2" y2="8" stroke="#d97706" strokeWidth="1.8" />
                <g transform={`rotate(${shinAngle1}, -2, 8)`}>
                  <line x1="-2" y1="8" x2="-2" y2="13" stroke="#d97706" strokeWidth="1.6" />
                </g>
              </g>

              {/* Leg 2 (Jointed Thigh + Shin) */}
              <g transform={`rotate(${thighAngle2}, 0, 4)`}>
                <line x1="0" y1="4" x2="2" y2="8" stroke="#d97706" strokeWidth="1.8" />
                <g transform={`rotate(${shinAngle2}, 2, 8)`}>
                  <line x1="2" y1="8" x2="2" y2="13" stroke="#d97706" strokeWidth="1.6" />
                </g>
              </g>

              {/* Arm 1 */}
              <g transform={`rotate(${armAngle1}, 0, -2)`}>
                <line x1="0" y1="-2" x2="-5" y2="3" stroke="#f59e0b" strokeWidth="1.5" />
              </g>

              {/* Arm 2 */}
              <g transform={`rotate(${armAngle2}, 0, -2)`}>
                <line x1="0" y1="-2" x2="5" y2="3" stroke="#f59e0b" strokeWidth="1.5" />
              </g>
            </g>

            {/* Individual Badges & Summit Celebration Text */}
            {isAtEndpointCelebrating ? (
              <foreignObject
                x={Math.max(10, Math.min(width - 200, (leadPos.x + followerPos.x) / 2 - 90))}
                y={Math.min(leadPos.y, followerPos.y) - 56}
                width="180"
                height="32"
              >
                <div className="flex items-center justify-center h-full">
                  {isEndpointATH ? (
                    <span className="bg-emerald-500 text-black text-[8.5px] font-mono font-extrabold px-3 py-1 rounded-full shadow-[0_0_18px_rgba(16,185,129,0.95)] animate-bounce whitespace-nowrap">
                      🏔️ PEAK SUMMIT CELEBRATION! 🎉
                    </span>
                  ) : (
                    <span className="bg-[#0c0c0e]/95 text-amber-300 border border-amber-500/80 text-[8px] font-mono font-extrabold px-2.5 py-1 rounded shadow-[0_0_14px_rgba(245,158,11,0.6)] animate-pulse whitespace-nowrap">
                      🙌 We will go high more next time
                    </span>
                  )}
                </div>
              </foreignObject>
            ) : (
              isWalking && (
                <>
                  {/* FOLLOWER Badge directly above Follower with clear head clearance */}
                  <foreignObject
                    x={followerPos.x - 35}
                    y={followerPos.y - 48}
                    width="70"
                    height="20"
                  >
                    <div className="flex justify-center items-center h-full">
                      <span className="bg-[#0c0c0e]/95 text-sky-400 border border-sky-500/50 text-[7.5px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                        FOLLOWER
                      </span>
                    </div>
                  </foreignObject>

                  {/* LEADER Badge directly above Leader with clear head clearance */}
                  <foreignObject
                    x={leadPos.x - 30}
                    y={leadPos.y - 48}
                    width="60"
                    height="20"
                  >
                    <div className="flex justify-center items-center h-full">
                      <span className="bg-[#0c0c0e]/95 text-amber-400 border border-amber-500/50 text-[7.5px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                        LEADER
                      </span>
                    </div>
                  </foreignObject>
                </>
              )
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
