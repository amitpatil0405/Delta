import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useInView } from 'framer-motion';
import { ShieldCheck, Target, Compass, Cpu } from 'lucide-react';
import myPic from '../assets/my_pic.jpg';
import founderBack from '../assets/founder_back.png';

const BIO_PARAGRAPHS = [
  {
    type: 'plain',
    text: "Backed by a Bachelor's degree in Computer Science engineering and deep-rooted expertise in financial markets, Amit leads DeltaFox with an engineering-driven, systematic approach."
  },
  {
    type: 'plain',
    text: "By blending technical precision with quantitative trading, the platform brings complete transparency by showcasing data and real-time portfolio details directly on the website."
  },
  {
    type: 'plain',
    text: "Specializing in advanced options trading strategies particularly non-directional frameworks, credit spreads, and volatility based execution. The focus remains on building resilient portfolios where data and math take absolute precedence over emotion."
  },
  {
    type: 'compound',
    parts: [
      { text: "In addition to systematic trading, DeltaFox offers specialized training programs designed to educate aspiring traders. " },
      { text: "[Enrollment is subject to strict terms and conditions, risk disclosures, and eligibility criteria.]", isHighlight: true },
      { text: " The core philosophy revolves around uncompromised capital preservation, strict rule execution, and navigating changing market regimes with complete discipline." }
    ]
  }
];

function TypewriterBio() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.2, once: false });
  const [typedChars, setTypedChars] = useState(0);

  // Calculate total character count across all paragraphs
  const totalChars = useMemo(() => {
    let count = 0;
    BIO_PARAGRAPHS.forEach(p => {
      if (p.type === 'plain') {
        count += p.text.length;
      } else {
        p.parts.forEach(pt => { count += pt.text.length; });
      }
    });
    return count;
  }, []);

  useEffect(() => {
    let timer;
    if (isInView) {
      setTypedChars(0);
      const intervalMs = 32; // ~32ms per character for readable, deliberate pace
      timer = setInterval(() => {
        setTypedChars(prev => {
          if (prev < totalChars) {
            return prev + 1;
          }
          clearInterval(timer);
          return totalChars;
        });
      }, intervalMs);
    } else {
      setTypedChars(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isInView, totalChars]);

  const isTypingFinished = typedChars >= totalChars;

  // Render paragraphs up to typedChars limit
  let charTracker = 0;

  return (
    <div ref={containerRef} className="space-y-4 text-sm sm:text-base text-gray-200 leading-relaxed font-sans min-h-[280px]">
      {BIO_PARAGRAPHS.map((p, pIdx) => {
        if (p.type === 'plain') {
          const startIdx = charTracker;
          const endIdx = startIdx + p.text.length;
          charTracker = endIdx;

          if (typedChars <= startIdx) {
            return null;
          }

          const visibleLength = Math.max(0, Math.min(p.text.length, typedChars - startIdx));
          const visibleText = p.text.slice(0, visibleLength);
          const isCurrentTypingP = typedChars > startIdx && typedChars <= endIdx;

          return (
            <p key={pIdx}>
              {visibleText}
              {isCurrentTypingP && !isTypingFinished && (
                <span className="inline-block w-2 h-4 ml-0.5 bg-amber-400 animate-pulse align-middle" />
              )}
            </p>
          );
        } else {
          // Compound paragraph
          const pStartIdx = charTracker;
          let pLength = 0;
          p.parts.forEach(pt => { pLength += pt.text.length; });
          const pEndIdx = pStartIdx + pLength;
          charTracker = pEndIdx;

          if (typedChars <= pStartIdx) {
            return null;
          }

          let localTracker = pStartIdx;
          const isCurrentTypingP = typedChars > pStartIdx && typedChars <= pEndIdx;

          return (
            <p key={pIdx}>
              {p.parts.map((pt, ptIdx) => {
                const partStart = localTracker;
                const partEnd = partStart + pt.text.length;
                localTracker = partEnd;

                if (typedChars <= partStart) return null;

                const visLen = Math.max(0, Math.min(pt.text.length, typedChars - partStart));
                const visText = pt.text.slice(0, visLen);

                if (pt.isHighlight) {
                  return (
                    <span key={ptIdx} className="text-amber-400 font-mono text-xs font-semibold">
                      {visText}
                    </span>
                  );
                }

                return <React.Fragment key={ptIdx}>{visText}</React.Fragment>;
              })}
              {isCurrentTypingP && !isTypingFinished && (
                <span className="inline-block w-2 h-4 ml-0.5 bg-amber-400 animate-pulse align-middle" />
              )}
            </p>
          );
        }
      })}
    </div>
  );
}

export default function AboutFounderSection() {
  return (
    <section id="about" className="pt-8 sm:pt-10 pb-16 scroll-mt-16 sm:scroll-mt-20 bg-transparent bg-subpage-grid border-t border-white/5 relative overflow-hidden">

      {/* Ambient Radial Glow Lighting */}
      <div className="ambient-glow-amber top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">

        {/* About DeltaFox Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
            <Compass className="w-4 h-4" />
            <span>Institutional Identity</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            ABOUT DELTAFOX
          </h2>
          <p className="text-xl font-mono text-amber-400 font-semibold">
            Where Data Meets Discipline.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed font-sans max-w-2xl mx-auto pt-2">
            DeltaFox was built with a singular vision: to bring institutional-grade discipline, systematic risk management, and mathematical clarity to options trading. We believe consistent wealth generation in the markets is not a result of emotional gambling or guesswork, but of structured frameworks, volatility awareness, and rigorous capital preservation.
          </p>
        </div>

        {/* Founder Presentation Card with Background Image */}
        <div className="rounded-3xl p-8 sm:p-12 border border-amber-500/30 relative overflow-hidden bg-[#0a0a0c]">

          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url(${founderBack})` }}
          />

          {/* Dark Tint Overlay with high contrast */}
          <div className="absolute inset-0 bg-black/88 sm:bg-black/88 backdrop-blur-[2px] pointer-events-none z-[1]" />

          <div className="relative z-10">
            <div className="text-center mb-10">
              <span className="text-base sm:text-lg font-mono text-amber-400 uppercase tracking-widest font-extrabold">
                MEET THE FOUNDER
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

              {/* Founder Photo Presentation */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative w-64 h-80 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_35px_rgba(217,119,6,0.25)] group mb-4">
                  <img
                    src={myPic}
                    alt="MR. AMIT PATIL - Founder of DeltaFox"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-2xl font-extrabold text-white font-mono tracking-wide">
                    MR. AMIT PATIL
                  </h3>
                  <p className="text-xs font-mono text-amber-400 font-semibold tracking-wider uppercase">
                    Founder, Derivatives Trader & Quantitative Strategist
                  </p>
                </div>
              </div>

              {/* Founder Story & Bio */}
              <div className="lg:col-span-7 space-y-6">

                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Bachelor Of Engineering ( Computer-Science ) & Quantitative Intelligence</span>
                </div>

                <TypewriterBio />

                {/* Core Values */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 font-mono text-xs">
                  <div className="flex items-start space-x-3">
                    <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block uppercase">CAPITAL PRESERVATION</span>
                      <span className="text-gray-400 text-[11px] font-sans">Strict position sizing rules and strict drawdown management.</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Target className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block uppercase">SYSTEMATIC EXECUTION</span>
                      <span className="text-gray-400 text-[11px] font-sans">Mathematical probabilities and non-directional volatility edges.</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
