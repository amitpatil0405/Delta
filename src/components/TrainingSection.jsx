import React, { useState } from 'react';
import { BookOpen, GraduationCap, CheckCircle, ShieldCheck, TrendingUp, Layers, Mail, Radio, QrCode, Smartphone, CreditCard } from 'lucide-react';
import paymentQrImg from '../assets/payment_qr.jpg';

export default function TrainingSection() {
  const [selectedModule, setSelectedModule] = useState(0);

  const modules = [
    {
      id: 'm1',
      title: '01. Options Trading Foundations (Basics)',
      subtitle: 'Understanding calls, puts, strike prices, moneyness, and options contracts fundamentals.',
      level: 'FOUNDATION',
      duration: 'Comprehensive Level 1',
      lessons: [
        'Call & Put Options Definition and Payoff Structures',
        'In-The-Money (ITM), At-The-Money (ATM), and Out-Of-The-Money (OTM) Moneyness',
        'Option Premium Components: Intrinsic Value vs Extrinsic (Time) Value',
        'Contract Specifications, Lot Sizes, Expiry Dates & Settlement Mechanics',
        'Buying Options vs Selling (Writing) Options Risk Profiles'
      ],
      description: 'Master the core mechanics and foundational concepts of options contracts. Learn how derivative prices behave before executing directional or non-directional trades in live market environments.'
    },
    {
      id: 'm2',
      title: '02. Option Greeks & Volatility Surface',
      subtitle: 'In-depth breakdown of Delta, Gamma, Theta, Vega, Rho, and Implied Volatility (IV).',
      level: 'INTERMEDIATE',
      duration: 'Comprehensive Level 2',
      lessons: [
        'Delta: Directional Sensitivity, Probability Metric & Hedge Ratios',
        'Gamma: Acceleration Risk, Near-Expiry Volatility & Gamma Squeeze Mechanics',
        'Theta: Time Decay Dynamics, Decay Curves & Expiry Selection Edge',
        'Vega & Implied Volatility (IV): IV Rank, IV Percentile & Volatility Crush Events',
        'Rho & Interest Rate Sensitivity in Long-Term Options'
      ],
      description: 'Deconstruct the underlying mathematical pricing model of options. Understand how volatility skew, implied volatility (IV), and time decay affect position profitability across changing market volatility regimes.'
    },
    {
      id: 'm3',
      title: '03. Systematic Options Trading Strategies',
      subtitle: 'Step-by-step frameworks for income, directional, neutral, and volatile market strategies.',
      level: 'ADVANCED',
      duration: 'Comprehensive Level 3',
      lessons: [
        'Income Strategies: Short Strangles, Iron Condors & Credit Spreads',
        'Hedging & Portfolio Protection: Bull Put Spreads, Bear Call Spreads & Collar Strategies',
        'Volatile Market Strategies: Long Straddles, Long Strangles & Ratio Spreads',
        'Covered Calls & Cash-Secured Puts for Stock Yield Generation',
        'Dynamic Position Adjustments: Rolling, Widening, Delta Hedging & Inverting Positions'
      ],
      description: 'Build a repeatable playbook of systematic options strategies. Learn exact entry protocols, strike selection algorithms, profit targets, and defensive adjustment triggers for all market conditions.'
    },
    {
      id: 'm4',
      title: '04. Live Market Execution & Institutional Risk Management',
      subtitle: 'Real-time market order flow, position sizing, drawdown protection, and portfolio compounding.',
      level: 'INSTITUTIONAL',
      duration: 'Comprehensive Level 4',
      lessons: [
        'Live Market Analysis & Real-Time Open Interest (OI) / PCR Interpretation',
        'Strict Capital Allocation: Maximum 1-3% Portfolio Risk Protocols',
        'Order Execution Mechanics: Limit Orders, Slippage Reduction & Bid-Ask Spread Management',
        'Drawdown Control, Stress Testing & Max Pain Level Tracking',
        'Trading Journal Discipline, Performance Analytics & Systematic Capital Scaling'
      ],
      description: 'Transition from theoretical knowledge to live market execution. Receive hands-on live market training with real-time derivative data, market sentiment tracking, and disciplined risk-first capital allocation.'
    }
  ];

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#contact';
    }
  };

  return (
    <section id="training" className="relative pt-8 sm:pt-10 pb-16 scroll-mt-20 bg-[#050505] bg-subpage-grid border-t border-white/5 overflow-hidden">

      {/* Ambient Radial Glow Lighting */}
      <div className="ambient-glow-amber top-10 left-10" />
      <div className="ambient-glow-emerald bottom-10 right-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>DeltaFox Options Training Program</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            OPTIONS TRADING CURRICULUM
          </h2>
          <p className="mt-4 text-base text-gray-400 font-medium">
            From basic options concepts to advanced live market strategy execution, DeltaFox provides structured, live market training focused on systematic probability and disciplined risk management.
          </p>
        </div>

        {/* Banner Callout: Live Market Training Provided */}
        <div className="mb-12 glass-card rounded-2xl p-6 sm:p-8 border border-amber-500/40 bg-gradient-to-r from-neutral-950 via-amber-950/20 to-neutral-950 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[0_0_35px_rgba(217,119,6,0.15)]">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  Live Market Training Included
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                We Provide Hands-On Training with Live Market Orders & Real-Time Data
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                Learn options trading directly in live market conditions with practical strike selection, risk adjustments, and real-time open interest dynamics.
              </p>
            </div>
          </div>
        </div>

        {/* Module Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Module List Column */}
          <div className="lg:col-span-5 space-y-4">
            {modules.map((mod, index) => {
              const active = selectedModule === index;
              return (
                <div
                  key={mod.id}
                  onClick={() => setSelectedModule(index)}
                  className={`cursor-pointer rounded-2xl p-5 transition-all duration-300 border ${
                    active
                      ? 'bg-neutral-900/90 border-amber-500/50 shadow-[0_0_25px_rgba(217,119,6,0.15)]'
                      : 'bg-neutral-950/60 border-white/5 hover:border-white/20 hover:bg-neutral-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded ${
                      active ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-gray-400'
                    }`}>
                      {mod.level}
                    </span>
                    <span className="text-xs font-mono text-gray-400">{mod.duration}</span>
                  </div>
                  <h3 className={`text-base font-bold font-mono transition-colors ${
                    active ? 'text-amber-400' : 'text-white'
                  }`}>
                    {mod.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {mod.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Module Detail & Curriculum Display */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-amber-500/30 bg-neutral-950/80 backdrop-blur-md h-full flex flex-col justify-between">

              <div>
                <div className="flex items-center space-x-3 text-xs font-mono text-amber-400 mb-3">
                  <BookOpen className="w-4 h-4" />
                  <span>DETAILED CURRICULUM TOPICS</span>
                </div>

                <h3 className="text-2xl font-extrabold text-white font-mono mb-3">
                  {modules[selectedModule].title}
                </h3>

                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  {modules[selectedModule].description}
                </p>

                <div className="border-t border-white/10 pt-6 mb-6">
                  <h4 className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-4">
                    Detailed Learning Topics Covered:
                  </h4>
                  <div className="space-y-3">
                    {modules[selectedModule].lessons.map((lesson, idx) => (
                      <div key={idx} className="flex items-start space-x-3 text-sm text-gray-200">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{lesson}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mentorship Badge */}
              <div className="pt-6 border-t border-white/10 flex items-center space-x-2 text-xs font-mono text-gray-400">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Live Market Mentorship & Practical Setup</span>
              </div>

            </div>
          </div>

        </div>

        {/* Program Fee & Direct Payment QR Code Card */}
        <div className="mt-16 glass-card rounded-3xl p-6 sm:p-10 border border-amber-500/40 bg-gradient-to-br from-neutral-950 via-[#0c0c0e] to-neutral-950 shadow-[0_0_50px_rgba(217,119,6,0.15)] relative overflow-hidden">

          {/* Ambient Backlight Glow for the Payment Card */}
          <div className="absolute top-1/2 right-10 -translate-y-1/2 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">

            {/* Info & Call to Action Column */}
            <div className="lg:col-span-7 space-y-6">

              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase">
                <QrCode className="w-4 h-4" />
                <span>Instant Enrollment Payment</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                  JOIN DELTAFOX OPTIONS MASTERY
                </h3>
                <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                  Enroll directly in our live market options trading program. Scan the official payment QR code using any UPI App (PhonePe, Google Pay, Paytm, BHIM) to complete enrollment.
                </p>
              </div>

              {/* Price Details Breakdown */}
              <div className="p-5 rounded-2xl bg-neutral-900/80 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left w-full sm:w-auto">
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block text-center sm:text-left">
                    Comprehensive Program Fee
                  </span>
                  <div className="mt-1">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-amber-400 block">
                      ₹19,999
                    </span>
                    <span className="text-xs font-normal text-gray-300 font-mono block mt-0.5">
                      (Basic to Advanced)
                    </span>
                  </div>
                </div>

                <button
                  onClick={scrollToContact}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)] shrink-0 flex items-center justify-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Join Training Program</span>
                </button>
              </div>

              {/* Payment Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center space-x-2.5 text-xs text-gray-300 font-mono">
                  <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Supports PhonePe, GPay, Paytm & UPI</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs text-gray-300 font-mono">
                  <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Account: AMIT MAHADEV PATIL</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs text-gray-300 font-mono">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Includes Live Market Mentorship</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs text-gray-300 font-mono">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant Access to Training Materials</span>
                </div>
              </div>

            </div>

            {/* Payment QR Code Box Column */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              {/* Vivid Neon Green Backlight Glow */}
              <div className="absolute inset-0 bg-emerald-500/25 rounded-full blur-[60px] pointer-events-none" />

              <div className="relative group p-5 rounded-2xl bg-neutral-900/90 border border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.3)] text-center max-w-[300px] w-full">

                {/* Header Instruction */}
                <p className="text-[11px] font-mono font-semibold text-emerald-400 leading-snug mb-3">
                  Scan below QR from PhonePe, Google Pay, Paytm or BHIM to make transaction and book your seat
                </p>

                {/* QR Code Container (Borderless Image) */}
                <div className="p-1.5 bg-black rounded-xl overflow-hidden mb-3 shadow-2xl">
                  <img
                    src={paymentQrImg}
                    alt="Payment QR Code - Amit Mahadev Patil"
                    className="w-full h-auto object-contain rounded-lg border-0 shadow-none block"
                  />
                </div>

                {/* Account Details Footer */}
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-white tracking-wider">
                    AMIT MAHADEV PATIL
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 font-bold">
                    Amount: ₹19,999
                  </div>
                  <div className="text-[10px] font-mono text-gray-300">
                    (Basic to Advanced)
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 leading-tight">
                    After completing payment, share confirmation via the contact form or email to activate your training seat.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Portfolio Growth Blueprint Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-white/10 bg-neutral-900/50">
            <div className="p-3 w-fit rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-mono mb-2">Probability & Statistical Edge</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Understand market probabilities, implied volatility skew, and theta decay to construct high-probability option trades with statistical edge.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 bg-neutral-900/50">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-mono mb-2">Live Market Execution</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Experience hands-on live market analysis, order execution, position sizing, and real-time adjustments during actual trading hours.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 bg-neutral-900/50">
            <div className="p-3 w-fit rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-mono mb-2">Institutional Risk Management</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Protect trading capital using strict position sizing rules, dynamic delta hedging, and systematic drawdown limits across financial cycles.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
