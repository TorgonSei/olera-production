"use client";

import React from "react";
import { cn } from "@/lib/cn";

/* ─── Token map ─────────────────────────────────────────────────────────────
   Mirrors equatorial.js semantic roles.
   Usage: import { COLORS } from "@/components/brand/Mark"
──────────────────────────────────────────────────────────────────────────── */
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
  strong:   { count: 3, color: COLORS.sage  },
  possible: { count: 2, color: COLORS.amber },
  stretch:  { count: 1, color: COLORS.terra },
  poor:     { count: 0, color: COLORS.moss  },
} as const;

export type FitLevel = keyof typeof FIT_LEVELS;

/* ─── Olera 3A Mark ───────────────────────────────────────────────────────── */
interface MarkProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * Three horizontal bars, right-flush, widths 100/66/33.
 * The primary brand mark.
 */
export function Olera3A({ size = 24, color = COLORS.char, className }: MarkProps) {
  const h = size / 5;
  const gap = h * 0.6;
  const totalH = h * 3 + gap * 2;
  const y1 = 0;
  const y2 = h + gap;
  const y3 = (h + gap) * 2;

  return (
    <svg
      width={size}
      height={totalH}
      viewBox={`0 0 ${size} ${totalH}`}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x={0}            y={y1} width={size}           height={h} rx={h / 2} fill={color} />
      <rect x={size * 0.34}  y={y2} width={size * 0.66}    height={h} rx={h / 2} fill={color} />
      <rect x={size * 0.67}  y={y3} width={size * 0.33}    height={h} rx={h / 2} fill={color} />
    </svg>
  );
}

/* ─── Graduated Mark (opacity stepped) ───────────────────────────────────── */
export function Olera3AGraduated({ size = 24, color = COLORS.char, className }: MarkProps) {
  const h = size / 5;
  const gap = h * 0.6;
  const totalH = h * 3 + gap * 2;
  const y1 = 0;
  const y2 = h + gap;
  const y3 = (h + gap) * 2;

  return (
    <svg
      width={size}
      height={totalH}
      viewBox={`0 0 ${size} ${totalH}`}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x={0}           y={y1} width={size}        height={h} rx={h / 2} fill={color} fillOpacity={1}   />
      <rect x={size * 0.34} y={y2} width={size * 0.66} height={h} rx={h / 2} fill={color} fillOpacity={0.6} />
      <rect x={size * 0.67} y={y3} width={size * 0.33} height={h} rx={h / 2} fill={color} fillOpacity={0.35}/>
    </svg>
  );
}

/* ─── Wordmark ────────────────────────────────────────────────────────────── */
interface WordmarkProps {
  height?: number;
  color?: string;
  className?: string;
}

/**
 * Lowercase "olera" — the notched 'o' is approximated with a path clip.
 * For exact brand fidelity, swap in the exported SVG from the brand files.
 */
export function OleraWordmark({ height = 20, color = COLORS.char, className }: WordmarkProps) {
  const aspect = 3.8;
  const width = height * aspect;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 76 20"
      fill="none"
      aria-label="Olera"
      className={className}
    >
      {/* Notched 'o' — outer circle with 22° aperture cut at upper-right */}
      <path
        d="M10 1.5 A8.5 8.5 0 1 1 10 18.5 A8.5 8.5 0 0 1 10 1.5 Z
           M10 1.5 L17.5 5.5"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Simpler wordmark using text — replace with exact SVG paths in production */}
      <text
        x="22"
        y="15.5"
        fontFamily="'Hanken Grotesk', system-ui, sans-serif"
        fontWeight="600"
        fontSize="15"
        fill={color}
        letterSpacing="-0.02em"
      >
        lera
      </text>
    </svg>
  );
}

/* ─── Lockup: horizontal (mark left, wordmark right) ─────────────────────── */
interface LockupProps {
  size?: number;
  color?: string;
  className?: string;
  reversed?: boolean; // light mark on dark bg
}

export function OleraLockupH({ size = 32, color, className, reversed }: LockupProps) {
  const c = color ?? (reversed ? COLORS.cream : COLORS.char);
  const gap = size * 0.4;

  return (
    <div className={cn("flex items-center", className)} style={{ gap }}>
      <Olera3A size={size} color={c} />
      <OleraWordmark height={size * 0.55} color={c} />
    </div>
  );
}

export function OleraLockupV({ size = 32, color, className, reversed }: LockupProps) {
  const c = color ?? (reversed ? COLORS.cream : COLORS.char);

  return (
    <div className={cn("flex flex-col items-end", className)}>
      <Olera3A size={size} color={c} />
      <OleraWordmark height={size * 0.5} color={c} className="mt-2" />
    </div>
  );
}

/* ─── App icon (rounded square) ──────────────────────────────────────────── */
interface AppIconProps {
  size?: number;
  className?: string;
}

export function OleraAppIcon({ size = 48, className }: AppIconProps) {
  const r = size * 0.22;
  const pad = size * 0.2;
  const innerSize = size - pad * 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-label="Olera"
      className={className}
    >
      <rect width={size} height={size} rx={r} fill={COLORS.forest} />
      <g transform={`translate(${pad}, ${pad + (innerSize - (innerSize * 0.72)) / 2})`}>
        <Olera3AGraduated size={innerSize} color={COLORS.cream} />
      </g>
    </svg>
  );
}

/* ─── FitMeter — bars as fit score (0-100) ───────────────────────────────── */
interface FitMeterProps {
  score: number; // 0-100
  size?: number;
  className?: string;
}

export function OleraFitMeter({ score, size = 24, className }: FitMeterProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const color =
    clamped >= 75
      ? COLORS.sage
      : clamped >= 50
      ? COLORS.amber
      : clamped >= 25
      ? COLORS.terra
      : COLORS.moss;

  const h = size / 5;
  const gap = h * 0.6;
  const totalH = h * 3 + gap * 2;
  const y1 = 0;
  const y2 = h + gap;
  const y3 = (h + gap) * 2;

  // Each bar fills proportionally from right; top bar = overall, mid = 66%, bot = 33%
  const bar1 = (clamped / 100) * size;
  const bar2 = (clamped / 100) * size * 0.66;
  const bar3 = (clamped / 100) * size * 0.33;

  return (
    <svg
      width={size}
      height={totalH}
      viewBox={`0 0 ${size} ${totalH}`}
      fill="none"
      aria-label={`Fit score: ${clamped}`}
      className={className}
    >
      {/* Track (empty) */}
      <rect x={0}           y={y1} width={size}        height={h} rx={h/2} fill={COLORS.mist} />
      <rect x={size * 0.34} y={y2} width={size * 0.66} height={h} rx={h/2} fill={COLORS.mist} />
      <rect x={size * 0.67} y={y3} width={size * 0.33} height={h} rx={h/2} fill={COLORS.mist} />
      {/* Fill */}
      <rect x={size - bar1}            y={y1} width={bar1} height={h} rx={h/2} fill={color} />
      <rect x={size - bar2}            y={y2} width={bar2} height={h} rx={h/2} fill={color} />
      <rect x={size - bar3}            y={y3} width={bar3} height={h} rx={h/2} fill={color} />
    </svg>
  );
}

/* ─── FitCategory — categorical fit ──────────────────────────────────────── */
interface FitCategoryProps {
  level: FitLevel;
  size?: number;
  showLabel?: boolean;
  className?: string;
}

const FIT_LABELS: Record<FitLevel, string> = {
  strong:   "Strong fit",
  possible: "Possible fit",
  stretch:  "Stretch",
  poor:     "Low fit",
};

export function OleraFitCategory({ level, size = 20, showLabel = false, className }: FitCategoryProps) {
  const { count, color } = FIT_LEVELS[level];
  const h = size / 5;
  const gap = h * 0.6;
  const totalH = h * 3 + gap * 2;
  const y1 = 0;
  const y2 = h + gap;
  const y3 = (h + gap) * 2;

  const bars = [
    { x: 0, y: y1, w: size },
    { x: size * 0.34, y: y2, w: size * 0.66 },
    { x: size * 0.67, y: y3, w: size * 0.33 },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={size}
        height={totalH}
        viewBox={`0 0 ${size} ${totalH}`}
        fill="none"
        aria-label={FIT_LABELS[level]}
      >
        {bars.map((bar, i) => (
          <rect
            key={i}
            x={bar.x}
            y={bar.y}
            width={bar.w}
            height={h}
            rx={h / 2}
            fill={i < count ? color : COLORS.mist}
          />
        ))}
      </svg>
      {showLabel && (
        <span
          className="text-xs font-medium font-mono"
          style={{ color }}
        >
          {FIT_LABELS[level]}
        </span>
      )}
    </div>
  );
}

/* ─── FitPip — 3-pip indicator for dense rows ────────────────────────────── */
interface FitPipProps {
  level: FitLevel;
  size?: number;
  className?: string;
}

export function OleraFitPip({ level, size = 12, className }: FitPipProps) {
  const { count, color } = FIT_LEVELS[level];
  const r = size / 2;
  const spacing = size * 1.4;

  return (
    <svg
      width={spacing * 2 + size}
      height={size}
      viewBox={`0 0 ${spacing * 2 + size} ${size}`}
      fill="none"
      aria-label={`${count}/3 fit`}
      className={className}
    >
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={i * spacing + r}
          cy={r}
          r={r}
          fill={i < count ? color : COLORS.mist}
        />
      ))}
    </svg>
  );
}

/* ─── Completeness gauge ──────────────────────────────────────────────────── */
interface CompletenessProps {
  value: number; // 0-100
  size?: number;
  showLabel?: boolean;
  className?: string;
}

export function OleraCompleteness({ value, size = 48, showLabel = false, className }: CompletenessProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const cx = size / 2;
  const cy = size / 2;
  const strokeW = size / 8;
  const r = (size - strokeW) / 2;
  const circumference = 2 * Math.PI * r;
  const filled = (clamped / 100) * circumference;

  const color =
    clamped >= 80
      ? COLORS.sage
      : clamped >= 50
      ? COLORS.amber
      : COLORS.terra;

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Profile ${clamped}% complete`}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} stroke={COLORS.mist} strokeWidth={strokeW} fill="none" />
        {/* Fill */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={color}
          strokeWidth={strokeW}
          fill="none"
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        {/* Label inside */}
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.22}
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="500"
          fill={COLORS.char}
        >
          {clamped}%
        </text>
      </svg>
      {showLabel && (
        <span className="text-xs text-moss font-mono">Profile complete</span>
      )}
    </div>
  );
}
