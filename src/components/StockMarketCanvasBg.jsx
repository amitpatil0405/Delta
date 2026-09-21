import React, { useEffect, useRef } from 'react';

export default function StockMarketCanvasBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Candlesticks setup
    const numCandles = 28;
    const candles = Array.from({ length: numCandles }, (_, i) => {
      const open = 0.3 + Math.random() * 0.4;
      const close = open + (Math.random() - 0.48) * 0.25;
      const high = Math.max(open, close) + Math.random() * 0.1;
      const low = Math.min(open, close) - Math.random() * 0.1;
      return {
        xRatio: (i + 0.5) / numCandles,
        open,
        close,
        high,
        low,
        speed: 0.0003 + Math.random() * 0.0004,
        phase: Math.random() * Math.PI * 2,
      };
    });

    // Floating market tickers / greeks
    const tickers = [
      { text: 'NIFTY 50', x: 0.15, y: 0.25, vx: 0.00015, vy: -0.0001 },
      { text: 'BANKNIFTY', x: 0.75, y: 0.20, vx: -0.00012, vy: 0.0001 },
      { text: 'Δ 0.48  Θ -14.2', x: 0.82, y: 0.70, vx: -0.0001, vy: -0.00015 },
      { text: 'IV SURFACE 12.8%', x: 0.10, y: 0.75, vx: 0.00018, vy: 0.0001 },
      { text: 'VWAP 23,820', x: 0.50, y: 0.85, vx: 0.0001, vy: -0.00012 },
      { text: 'SENSEX 76,200', x: 0.45, y: 0.15, vx: -0.00014, vy: 0.0001 },
    ];

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle background grid
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw animated Candlesticks
      const candleWidth = Math.max(4, Math.min(12, width / (numCandles * 2.2)));
      candles.forEach((c) => {
        const x = c.xRatio * width;
        const currentPulse = Math.sin(time * c.speed * 100 + c.phase) * 0.05;
        const o = (c.open + currentPulse) * height;
        const cl = (c.close + currentPulse) * height;
        const h = (c.high + currentPulse) * height;
        const l = (c.low + currentPulse) * height;

        const isGreen = c.close >= c.open;
        const color = isGreen ? 'rgba(16, 185, 129, 0.13)' : 'rgba(244, 63, 94, 0.13)';
        const border = isGreen ? 'rgba(16, 185, 129, 0.28)' : 'rgba(244, 63, 94, 0.28)';

        // Wick
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, h);
        ctx.lineTo(x, l);
        ctx.stroke();

        // Body
        ctx.fillStyle = color;
        ctx.fillRect(x - candleWidth / 2, Math.min(o, cl), candleWidth, Math.max(2, Math.abs(cl - o)));
        ctx.strokeStyle = border;
        ctx.strokeRect(x - candleWidth / 2, Math.min(o, cl), candleWidth, Math.max(2, Math.abs(cl - o)));
      });

      // 3. Draw animated glowing index trendline
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.22)';
      ctx.lineWidth = 2;
      const points = 60;
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * width;
        const baseSin = Math.sin(i * 0.15 + time * 0.8) * 35;
        const secondSin = Math.cos(i * 0.08 - time * 0.5) * 20;
        const y = height * 0.52 + baseSin + secondSin;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Trendline gradient glow fill beneath
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, height * 0.4, 0, height);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.06)');
      grad.addColorStop(1, 'rgba(245, 158, 11, 0.00)');
      ctx.fillStyle = grad;
      ctx.fill();

      // 4. Draw floating market tickers / greeks
      ctx.font = '10px "JetBrains Mono", monospace';
      tickers.forEach((t) => {
        t.x += t.vx;
        t.y += t.vy;

        if (t.x < 0.05 || t.x > 0.9) t.vx *= -1;
        if (t.y < 0.08 || t.y > 0.9) t.vy *= -1;

        const tx = t.x * width;
        const ty = t.y * height;

        ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.fillText(t.text, tx, ty);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 rounded-3xl"
    />
  );
}
