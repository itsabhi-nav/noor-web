/**
 * Noor Chair — original brand mark.
 * A side-profile chair drawn in three strokes (reclined backrest, seat, splayed
 * legs) with a brass cushion accent, set in a rounded tile.
 */
interface MarkProps {
  size?: number;
  /** 'dark' tile for light backgrounds, 'light' tile for dark backgrounds */
  tone?: 'dark' | 'light';
  className?: string;
}

export function LogoMark({ size = 38, tone = 'dark', className = '' }: MarkProps) {
  const tile = tone === 'dark' ? '#16130E' : '#F7F3EC';
  const stroke = tone === 'dark' ? '#F7F3EC' : '#16130E';
  const ground = tone === 'dark' ? '#F7F3EC' : '#16130E';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="Noor Chair logo"
      className={className}
    >
      <rect x="4" y="4" width="40" height="40" rx="11" fill={tile} />
      {/* backrest */}
      <path d="M34.5 10 L30.5 24" stroke={stroke} strokeWidth="3.4" strokeLinecap="round" />
      {/* seat */}
      <path d="M14 24 H30.5" stroke={stroke} strokeWidth="3.4" strokeLinecap="round" />
      {/* cushion accent */}
      {/* cushion accent — brass inlay */}
      <path d="M19.5 24 H25.5" stroke="#C79A5B" strokeWidth="3.4" strokeLinecap="round" />
      {/* legs */}
      <path d="M16.5 24 L15.5 38" stroke={stroke} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M27.5 24 L29.5 38" stroke={stroke} strokeWidth="3.4" strokeLinecap="round" />
      {/* ground line */}
      <path d="M12.5 41.5 H35.5" stroke={ground} strokeOpacity="0.45" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

interface LockupProps {
  tone?: 'dark' | 'light';
  compact?: boolean;
  className?: string;
}

export function LogoLockup({ tone = 'dark', compact = false, className = '' }: LockupProps) {
  const text = tone === 'dark' ? 'text-ink' : 'text-ivory';
  const sub = tone === 'dark' ? 'text-smoke' : 'text-ivory/60';
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={compact ? 32 : 38} tone={tone} className="shrink-0 transition-transform duration-300 group-hover:-rotate-6" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-semibold tracking-[0.22em] ${text} ${
            compact ? 'text-lg' : 'text-[20px] md:text-[22px]'
          }`}
        >
          NOOR
        </span>
        <span
          className={`mt-1 font-semibold uppercase ${sub} ${
            compact ? 'text-[8px] tracking-[0.34em]' : 'text-[8.5px] tracking-[0.34em] md:text-[9px]'
          }`}
        >
          Chair · Delhi
        </span>
      </span>
    </span>
  );
}

export default LogoMark;
