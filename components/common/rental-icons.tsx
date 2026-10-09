export type IconProps = { className?: string };
export type IconComponent = (props: IconProps) => JSX.Element;

const common = {
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ShipIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <path d="M2 18l2 3h16l2-3-2-1H4l-2 1Z" />
      <rect x="6" y="12" width="5" height="6" />
      <rect x="13" y="9" width="4" height="9" />
      <path d="M15 9V6" />
    </svg>
  );
}

export function MarineEquipmentIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 4v2.4M12 17.6V20M4 12h2.4M17.6 12H20M6.5 6.5l1.7 1.7M15.8 15.8l1.7 1.7M6.5 17.5l1.7-1.7M15.8 8.2l1.7-1.7" />
    </svg>
  );
}

export function WellInterventionIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <path d="M2 17h20l-2 3H4l-2-3Z" />
      <path d="M12 17V4" />
      <path d="M10 4l2-2 2 2" />
      <path d="M9 7h6M9 10h6M9 13.5h6" />
    </svg>
  );
}

export function JackUpRigIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <path d="M2 20h20" />
      <path d="M6 20V9M12 20V7M18 20V9" />
      <path d="M4 9h16" />
      <path d="M12 7V3" />
      <path d="M10 4.5h4" />
    </svg>
  );
}

export function DredgerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <path d="M2 19l2 2h12l2-2-2-1H4l-2 1Z" />
      <path d="M5 18v-5h4v5" />
      <path d="M9 13l7-6 4 2" />
      <path d="M20 9l2 2-3 1.5-1-2.5Z" />
    </svg>
  );
}

export function PontoonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <rect x="3" y="13" width="18" height="3.5" rx="0.5" />
      <path d="M5.5 13v-3M9.5 13v-3M13.5 13v-3M17.5 13v-3" />
      <path d="M5.5 10h12" />
      <path d="M2 20c2-1.3 4-1.3 6 0s4 1.3 6 0 4-1.3 6 0" />
    </svg>
  );
}

export function BargeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <rect x="2.5" y="16.5" width="19" height="3" rx="0.5" />
      <rect x="8" y="10" width="8" height="6.5" />
      <path d="M2 21.5h20" />
    </svg>
  );
}

export function CraneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <path d="M3 21h14" />
      <path d="M6 21V7" />
      <path d="M6 7l12 5" />
      <path d="M18 12v5" />
      <path d="M18 17l2 1" />
      <path d="M3 7h6" />
    </svg>
  );
}

export function WorkboatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <path d="M3 18l2 3h14l2-3" />
      <path d="M9 18v-5h6v5" />
      <path d="M12 13V9" />
      <circle cx="12" cy="7.5" r="1.1" />
    </svg>
  );
}

export function TugIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <path d="M2 18l2 3h16l2-3-2-1.2H4L2 18Z" />
      <path d="M8 18v-7h8v7" />
      <path d="M13 11V8" />
      <path d="M4.5 18.5v-2.2M4.5 16.3h1.6M6.1 16.3v2.2" />
    </svg>
  );
}

export function YachtIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <path d="M3 17l3 4h11l3-4-4-1.5H7L3 17Z" />
      <path d="M8 15.5V11h7v4.5" />
      <path d="M12 11V7" />
      <path d="M12 7l3 2" />
    </svg>
  );
}

export function TriToonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <path d="M2 18.5h4M9 18.5h4M16 18.5h4" />
      <path d="M2 21c2-1.3 4-1.3 6 0s4 1.3 6 0 4-1.3 6 0" />
      <rect x="3" y="12" width="18" height="4.5" rx="0.5" />
      <path d="M8 12V9h2.5v3M13.5 12V9H16v3" />
    </svg>
  );
}

export function BunkeringTankerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <path d="M2 18l2 3h16l2-3-2-1H4l-2 1Z" />
      <rect x="5" y="11" width="14" height="5" />
      <circle cx="9" cy="8.5" r="1.4" />
      <circle cx="15" cy="8.5" r="1.4" />
      <path d="M9 9.9v1.1M15 9.9v1.1" />
    </svg>
  );
}

// Keyed by lib/data/rentals.ts RENTAL_CATEGORIES slugs — every slug there
// must have an entry here.
const RENTAL_ICON_MAP: Record<string, IconComponent> = {
  "well-intervention-vessels": WellInterventionIcon,
  "jack-up-rigs": JackUpRigIcon,
  dredgers: DredgerIcon,
  workboats: WorkboatIcon,
  tugboats: TugIcon,
  barges: BargeIcon,
  pontoons: PontoonIcon,
  "tri-toon-vessels": TriToonIcon,
  "bunkering-tankers": BunkeringTankerIcon,
};

export function rentalIcon(slug: string): IconComponent {
  return RENTAL_ICON_MAP[slug] ?? ShipIcon;
}
