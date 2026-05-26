"use client";

import React from "react";
import { cn } from "@/lib/cn";

/* ─── Equatorial palette tokens ──────────────────────────────────────────── */
export const COLORS = {
  cream:  "#f4f1e8",
  mist:   "#e3e3d8",
  forest: "#1a2620",
  deep:   "#28342e",
  char:   "#1c1a16",
  moss:   "#54625a",
  amber:  "#c4823a",
  terra:  "#a85a3a",
  sage:   "#6e7a5f",
  sand:   "#d6c79a",
} as const;

/* ─── Fit levels ──────────────────────────────────────────────────────────── */
export const FIT_LEVELS = {
  strong:   { count: 3, color: "#6e7a5f", label: "Strong fit"   },
  possible: { count: 2, color: "#c4823a", label: "Possible fit" },
  stretch:  { count: 1, color: "#a85a3a", label: "Stretch fit"  },
  poor:     { count: 0, color: "#54625a", label: "Low fit"      },
} as const;

export type FitLevel = keyof typeof FIT_LEVELS;

/* ─── Exact geometry from brand file ─────────────────────────────────────────
   100×100 viewBox. BAR_H=10, BAR_R=5.
   Bars at y=27/45/63, widths 100/66/33, ALL right-flush (x = 100 − w).
──────────────────────────────────────────────────────────────────────────── */
const BARS = [
  { y: 27, w: 100 },  // 100% — the full signal
  { y: 45, w: 66  },  //  66% — narrowing
  { y: 63, w: 33  },  //  33% — resolved
] as const;
const BAR_H = 10;
const BAR_R = 5;

interface MarkProps {
  size?: number;
  color?: string;
  className?: string;
}

/* ─── Olera3A — solid primary mark ──────────────────────────────────────── */
export function Olera3A({ size = 80, color = COLORS.char, className }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: "block", overflow: "visible" }}
      role="img"
      aria-label="Olera"
      className={className}
    >
      {BARS.map((b, i) => (
        <rect
          key={i}
          x={100 - b.w}
          y={b.y}
          width={b.w}
          height={BAR_H}
          rx={BAR_R}
          fill={color}
        />
      ))}
    </svg>
  );
}

/* ─── Graduated mark — top lightest → bottom solid (0.32 / 0.62 / 1) ───── */
export function Olera3AGraduated({ size = 80, color = COLORS.char, className }: MarkProps) {
  const ops = [0.32, 0.62, 1] as const;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: "block" }}
      aria-hidden="true"
      className={className}
    >
      {BARS.map((b, i) => (
        <rect
          key={i}
          x={100 - b.w}
          y={b.y}
          width={b.w}
          height={BAR_H}
          rx={BAR_R}
          fill={color}
          opacity={ops[i]}
        />
      ))}
    </svg>
  );
}

/* ─── Wordmark — notched 'o' + "lera" in Hanken Grotesk ─────────────────── */
interface WordmarkProps {
  size?: number;
  color?: string;
  weight?: number;
  className?: string;
}

export function OleraWordmark({ size = 56, color = COLORS.char, weight = 500, className }: WordmarkProps) {
  const oSize   = size * 0.66;
  const stroke  = oSize * 0.165;
  const r       = (oSize - stroke) / 2;
  const cx      = oSize / 2;
  const cy      = oSize / 2;

  // 22° aperture at upper-right — angles relative to standard SVG coords
  // deg2rad: rotate so 0° = top, then go clockwise
  const deg2rad = (d: number) => (-90 + d) * (Math.PI / 180);
  const a1 = deg2rad(38);
  const a2 = deg2rad(60);
  const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
  const p2 = [cx + r * Math.cos(a2), cy + r * Math.sin(a2)];

  // Large arc from p1 → p2, going the long way (sweep-flag=0, large-arc=1)
  const d = `M ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} A ${r} ${r} 0 1 0 ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;

  return (
    <div
      style={{ display: "inline-flex", alignItems: "baseline", lineHeight: 1, color }}
      className={className}
    >
      {/* Notched 'o' as SVG */}
      <svg
        width={oSize}
        height={size}
        viewBox={`0 0 ${oSize} ${size}`}
        style={{ display: "block", flexShrink: 0 }}
        aria-hidden="true"
      >
        <g transform={`translate(0, ${(size - oSize) * 0.92})`}>
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="butt"
          />
        </g>
      </svg>
      {/* "lera" text */}
      <span
        style={{
          fontFamily: '"Hanken Grotesk", -apple-system, system-ui, sans-serif',
          fontWeight: weight,
          fontSize:   size,
          color,
          letterSpacing: "-0.015em",
          marginLeft: size * 0.005,
          lineHeight: 1,
        }}
      >
        lera
      </span>
    </div>
  );
}

/* ─── Horizontal lockup — mark + wordmark ───────────────────────────────── */
interface LockupHProps {
  size?: number;
  color?: string;
  reversed?: boolean;
  className?: string;
}

export function OleraLockupH({ size = 56, color, reversed, className }: LockupHProps) {
  const c = color ?? (reversed ? COLORS.cream : COLORS.char);
  const gap = Math.round(size * 0.25);
  const wordSize = Math.round(size * 0.78);

  return (
    <div
      style={{ display: "inline-flex", alignItems: "center", gap, lineHeight: 1 }}
      className={className}
    >
      <Olera3A size={size} color={c} />
      <span
        style={{
          fontFamily: '"Hanken Grotesk", -apple-system, system-ui, sans-serif',
          fontWeight: 500,
          fontSize:   wordSize,
          color:      c,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        olera
      </span>
    </div>
  );
}

/* ─── Vertical lockup — mark above wordmark, centred ────────────────────── */
export function OleraLockupV({ size = 80, color, reversed, className }: LockupHProps) {
  const c = color ?? (reversed ? COLORS.cream : COLORS.char);
  const wordSize = Math.round(size * 0.45);

  return (
    <div
      style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 14, lineHeight: 1 }}
      className={className}
    >
      <Olera3A size={size} color={c} />
      <span
        style={{
          fontFamily: '"Hanken Grotesk", -apple-system, system-ui, sans-serif',
          fontWeight: 500,
          fontSize:   wordSize,
          color:      c,
          letterSpacing: "-0.01em",
          lineHeight: 1,
        }}
      >
        olera
      </span>
    </div>
  );
}

/* ─── App icon — rounded square with mark ───────────────────────────────── */
interface AppIconProps {
  size?: number;
  ground?: string;
  color?: string;
  className?: string;
}

export function OleraAppIcon({ size = 120, ground = COLORS.forest, color = COLORS.cream, className }: AppIconProps) {
  const r = Math.round(size * 0.22);
  return (
    <div
      style={{
        width: size, height: size,
        background: ground,
        borderRadius: r,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)",
      }}
      className={className}
    >
      <Olera3A size={size * 0.5} color={color} />
    </div>
  );
}

/* ─── FitCategory — 3A bars as categorical fit indicator ────────────────── */
interface FitCategoryProps {
  level: FitLevel;
  size?: number;
  showLabel?: boolean;
  layout?: "graduated" | "uniform";
  className?: string;
}

export function OleraFitCategory({
  level,
  size = 120,
  showLabel = false,
  layout = "graduated",
  className,
}: FitCategoryProps) {
  const { count, color, label } = FIT_LEVELS[level];
  const ground = "rgba(28,26,22,0.12)";

  const bars = layout === "uniform"
    ? [{ y: 27, w: 100 }, { y: 45, w: 100 }, { y: 63, w: 100 }]
    : BARS.map((b) => ({ ...b }));

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{ display: "block" }}
        aria-label={label}
      >
        {bars.map((b, i) => (
          <rect
            key={i}
            x={100 - b.w}
            y={b.y}
            width={b.w}
            height={BAR_H}
            rx={BAR_R}
            fill={i < count ? color : ground}
          />
        ))}
      </svg>
      {showLabel && (
        <span
          className="text-xs font-mono font-medium whitespace-nowrap"
          style={{ color }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/* ─── FitPip — tiny 3-pip for dense rows ────────────────────────────────── */
interface FitPipProps {
  level: FitLevel;
  size?: number;
  className?: string;
}

export function OleraFitPip({ level, size = 28, className }: FitPipProps) {
  const { count, color } = FIT_LEVELS[level];
  const ground = "rgba(28,26,22,0.18)";
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 50 30"
      style={{ display: "inline-block", verticalAlign: "middle" }}
      aria-label={`${count}/3 fit`}
      className={className}
    >
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={i * 18}
          y="10"
          width="14"
          height="10"
          rx="5"
          fill={i < count ? color : ground}
        />
      ))}
    </svg>
  );
}

/* ─── Completeness — 3A bars with N filled (0-3 count OR 0-100 value) ───── */
interface CompletenessProps {
  value?: number;   // 0-100 percentage (converted to 0-3 bars)
  count?: number;   // 0-3 bars directly
  color?: string;
  size?: number;
  showLabel?: boolean;
  className?: string;
}

export function OleraCompleteness({
  value,
  count,
  color = COLORS.amber,
  size = 28,
  showLabel = false,
  className,
}: CompletenessProps) {
  // Accept either count (0-3) or value (0-100)
  const filled = count !== undefined
    ? count
    : value !== undefined
    ? Math.round((value / 100) * 3)
    : 0;

  const ground = "rgba(28,26,22,0.12)";

  return (
    <div className={cn("inline-flex flex-col items-center gap-1", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{ display: "inline-block" }}
        aria-label={`${value !== undefined ? value : Math.round((filled / 3) * 100)}% complete`}
      >
        {BARS.map((b, i) => (
          <rect
            key={i}
            x={100 - b.w}
            y={b.y}
            width={b.w}
            height={BAR_H}
            rx={BAR_R}
            fill={i < filled ? color : ground}
          />
        ))}
      </svg>
      {showLabel && (
        <span className="text-xs text-moss font-mono">
          {value !== undefined ? `${value}%` : `${Math.round((filled / 3) * 100)}%`} complete
        </span>
      )}
    </div>
  );
}
