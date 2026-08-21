import React from 'react';

/**
 * The shift arc — Daylight's one motif (plan Addendum 3, item DL4).
 *
 * It draws a working day as an arc of light: clock-in at dawn on the left, the peak of the day
 * at noon, clock-out at dusk on the right. This is the ONLY place in the product where the
 * dawn/noon/dusk gradient is allowed to appear apart from the logo mark (AC-DL3), and the only
 * page it may appear on is the landing page (AC-DL2). The plan is deliberate about that: the
 * arc means something here, and repeated decoration is how a motif goes stale.
 *
 * Geometry is computed rather than hand-drawn so the ticks actually sit on the curve. The arc
 * is a half-ellipse centred at (CX, CY) with radii (RX, RY), swept from 180° to 0°.
 *
 * Motion: the arc draws itself once on load and then stops. Nothing breathes, pulses or loops
 * — under `prefers-reduced-motion` it renders already-drawn with no animation at all (AC-DL5).
 * The animation is CSS-only so there is no JS timer and no work on the main thread.
 */

const CX = 320;
const CY = 180;
const RX = 280;
const RY = 140;

/** Point on the arc at angle θ (degrees, 180° = dawn/left, 0° = dusk/right). */
const pointAt = (deg: number) => {
  const r = (deg * Math.PI) / 180;
  return { x: CX + RX * Math.cos(r), y: CY - RY * Math.sin(r) };
};

/** Hour ticks along the curve. --dl-soft is 3.3:1 — legal for ticks, never for text. */
const TICKS = Array.from({ length: 17 }, (_, i) => {
  const deg = 180 - i * (180 / 16);
  const outer = pointAt(deg);
  // Nudge each tick toward the centre so it reads as a mark on the arc, not a spoke.
  const inner = {
    x: CX + (RX - 10) * Math.cos((deg * Math.PI) / 180),
    y: CY - (RY - 10) * Math.sin((deg * Math.PI) / 180),
  };
  return { outer, inner, major: i % 4 === 0 };
});

const DAWN = pointAt(180);
const NOON = pointAt(90);
const DUSK = pointAt(0);

const ARC_PATH = `M ${DAWN.x} ${DAWN.y} A ${RX} ${RY} 0 0 1 ${DUSK.x} ${DUSK.y}`;

interface ShiftArcProps {
  className?: string;
  /** Shown beneath the endpoints. Monospaced and tabular so the figures align. */
  checkIn?: string;
  checkOut?: string;
}

export const ShiftArc: React.FC<ShiftArcProps> = ({
  className = '',
  checkIn = '09:00',
  checkOut = '17:30',
}) => (
  <div className={`dl-arc w-full max-w-3xl mx-auto ${className}`}>
    <svg
      viewBox="0 0 640 220"
      className="w-full h-auto"
      role="img"
      aria-label={`A working day drawn as an arc of light, from check-in at ${checkIn} through midday to check-out at ${checkOut}.`}
    >
      <defs>
        {/* The day. Referenced by AC-DL3's grep — this id must not appear anywhere else. */}
        <linearGradient id="dl-day-arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--dl-dawn)" />
          <stop offset="50%" stopColor="var(--dl-noon)" />
          <stop offset="100%" stopColor="var(--dl-dusk)" />
        </linearGradient>
      </defs>

      {/* Hour ticks sit under the arc so the stroke reads as continuous. */}
      <g stroke="var(--dl-soft)" strokeLinecap="round">
        {TICKS.map((t, i) => (
          <line
            key={i}
            x1={t.inner.x}
            y1={t.inner.y}
            x2={t.outer.x}
            y2={t.outer.y}
            strokeWidth={t.major ? 1.5 : 0.75}
            opacity={t.major ? 0.75 : 0.4}
          />
        ))}
      </g>

      {/* The ground line the day rises from. */}
      <line
        x1={DAWN.x - 16}
        y1={CY}
        x2={DUSK.x + 16}
        y2={CY}
        stroke="var(--dl-hair)"
        strokeWidth="1"
      />

      <path
        className="dl-arc__stroke"
        d={ARC_PATH}
        fill="none"
        stroke="url(#dl-day-arc)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Endpoints — the two moments the product actually records. */}
      <circle cx={DAWN.x} cy={DAWN.y} r="6" fill="var(--dl-dawn)" />
      <circle cx={DUSK.x} cy={DUSK.y} r="6" fill="var(--dl-dusk)" />
      <circle cx={NOON.x} cy={NOON.y} r="3.5" fill="var(--dl-noon)" opacity="0.9" />

      <g className="font-dl-mono" fill="var(--dl-muted)" fontSize="13" style={{ fontVariantNumeric: 'tabular-nums' }}>
        <text x={DAWN.x} y={CY + 24} textAnchor="middle">{checkIn}</text>
        <text x={DUSK.x} y={CY + 24} textAnchor="middle">{checkOut}</text>
      </g>
      <g className="font-dl-mono" fill="var(--dl-muted)" fontSize="10" letterSpacing="0.08em">
        <text x={DAWN.x} y={CY + 40} textAnchor="middle">IN</text>
        <text x={DUSK.x} y={CY + 40} textAnchor="middle">OUT</text>
      </g>
    </svg>
  </div>
);

export default ShiftArc;
