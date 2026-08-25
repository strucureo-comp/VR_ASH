import { useEffect, useRef } from "react";

type Leaf = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vrot: number;
  life: number;
  hueShift: number;
};

/**
 * Herbal cursor effect: a soft botanical glow follows the pointer and small
 * leaves drift away from it as you move. Purely decorative.
 */
export function HerbalCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const leaves: Leaf[] = [];
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let gx = mx;
    let gy = my;
    let lastSpawnX = mx;
    let lastSpawnY = my;
    let active = false;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      active = true;
      const dx = mx - lastSpawnX;
      const dy = my - lastSpawnY;
      if (Math.hypot(dx, dy) > 26 && leaves.length < 60) {
        lastSpawnX = mx;
        lastSpawnY = my;
        const ang = Math.atan2(dy, dx) + Math.PI + (Math.random() - 0.5) * 1.1;
        const speed = 0.35 + Math.random() * 0.8;
        leaves.push({
          x: mx + (Math.random() - 0.5) * 10,
          y: my + (Math.random() - 0.5) * 10,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed - 0.15,
          size: 7 + Math.random() * 9,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.05,
          life: 1,
          hueShift: Math.random() * 26 - 13,
        });
      }
    };
    const onLeave = () => {
      active = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const drawLeaf = (l: Leaf) => {
      const fade = Math.max(0, Math.min(1, l.life));
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rot);
      ctx.globalAlpha = fade * 0.55;
      ctx.fillStyle = `hsl(${148 + l.hueShift} 42% 32%)`;
      ctx.beginPath();
      ctx.moveTo(0, -l.size);
      ctx.quadraticCurveTo(l.size * 0.72, -l.size * 0.15, 0, l.size);
      ctx.quadraticCurveTo(-l.size * 0.72, -l.size * 0.15, 0, -l.size);
      ctx.fill();
      ctx.globalAlpha = fade * 0.35;
      ctx.strokeStyle = "hsl(78 45% 72%)";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(0, -l.size * 0.85);
      ctx.lineTo(0, l.size * 0.85);
      ctx.stroke();
      ctx.restore();
    };

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      gx += (mx - gx) * 0.12;
      gy += (my - gy) * 0.12;

      if (active) {
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, 90);
        grad.addColorStop(0, "hsla(148 45% 38% / 0.18)");
        grad.addColorStop(0.5, "hsla(78 50% 55% / 0.10)");
        grad.addColorStop(1, "hsla(148 45% 38% / 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(gx, gy, 90, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = leaves.length - 1; i >= 0; i--) {
        const l = leaves[i]!;
        l.x += l.vx;
        l.y += l.vy;
        l.vy += 0.012;
        l.vx += Math.sin((l.y + l.rot * 40) * 0.02) * 0.012;
        l.rot += l.vrot;
        l.life -= 0.012;
        if (l.life <= 0) leaves.splice(i, 1);
        else drawLeaf(l);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] hidden lg:block"
    />
  );
}
