export type IconProps = { className?: string };
export type IconComponent = (props: IconProps) => JSX.Element;

const common = {
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CompleteEngineIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <rect x="4" y="7" width="13" height="11" />
      <path d="M17 10h3v5h-3" />
      <path d="M7 7V4h3v3M12 7V4h3v3" />
      <path d="M4 12h13M4 15h13" />
    </svg>
  );
}

export function CylinderHeadIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <rect x="3" y="10" width="18" height="8" />
      <path d="M6 10V6h2v4M11 10V6h2v4M16 10V6h2v4" />
      <path d="M7 14h2M11 14h2M15 14h2" />
    </svg>
  );
}

export function CrankshaftIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <circle cx="4" cy="12" r="1.6" />
      <circle cx="20" cy="12" r="1.6" />
      <path d="M5.5 12h3.5l2-4h4l2 4h3.5" />
      <circle cx="12" cy="8" r="1.4" />
    </svg>
  );
}

export function TurbochargerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <circle cx="12" cy="12" r="6.5" />
      <path d="M12 7.2v1.4M16.8 12h-1.4M12 16.8v-1.4M7.2 12h1.4" />
      <path d="M9.2 9.2l1 1M14.8 9.2l-1 1M14.8 14.8l-1-1M9.2 14.8l1-1" />
      <path d="M2 12h3.5M18.5 12H22" />
    </svg>
  );
}

export function CylinderLinerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <rect x="8" y="3" width="8" height="18" rx="1" />
      <path d="M8 8h8M8 13h8M8 18h8" />
    </svg>
  );
}

export function FuelPumpIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <rect x="4" y="6" width="9" height="13" />
      <path d="M13 10h3.5l2.5 2.5V17a1.4 1.4 0 0 1-2.8 0v-1.5h-.2" />
      <path d="M7 6V4h3v2" />
    </svg>
  );
}

export function PistonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <path d="M7 4h10v7a5 5 0 0 1-10 0V4Z" />
      <path d="M7 7h10M7 9.5h10" />
      <path d="M12 16v4" />
      <circle cx="12" cy="21" r="1.1" />
    </svg>
  );
}

export function AlternatorIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <circle cx="11" cy="12" r="7" />
      <path d="M8.5 9l5 6M8.5 15l5-6" />
      <path d="M18 12h3" />
      <path d="M19.5 9.5v5" />
    </svg>
  );
}

export function ConnectingRodIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <circle cx="5" cy="7" r="2.3" />
      <circle cx="19" cy="17" r="3.2" />
      <path d="M6.8 8.6l10.6 6.8" />
    </svg>
  );
}

export function CylinderBlockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <rect x="3" y="4" width="18" height="16" />
      <path d="M3 9h18M3 14h18" />
      <path d="M8 4v16M14 4v16" />
    </svg>
  );
}

export function OilPumpIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <circle cx="10" cy="12" r="6" />
      <path d="M10 8.5v7M7 10.5l6 3M7 13.5l6-3" />
      <path d="M16 12h5" />
    </svg>
  );
}

export function WaterPumpIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <circle cx="10" cy="12" r="6" />
      <path d="M10 6v3M10 15v3M4 12h3M13 12h3" />
      <path d="M16 12h5" />
    </svg>
  );
}

export function WaterJacketIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <rect x="4" y="5" width="16" height="14" />
      <path d="M8 5v14M16 5v14" />
      <path d="M4 9c1.3 1 2.7-1 4 0s2.7-1 4 0 2.7-1 4 0 2.7-1 4 0" />
      <path d="M4 15c1.3 1 2.7-1 4 0s2.7-1 4 0 2.7-1 4 0 2.7-1 4 0" />
    </svg>
  );
}

export function GenericPartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...common} className={className}>
      <path d="M10 3h4v2.6a6 6 0 0 1 2 1.2l2.2-1.3 2 3.4-2.2 1.3a6 6 0 0 1 0 2.4l2.2 1.3-2 3.4-2.2-1.3a6 6 0 0 1-2 1.2V21h-4v-2.6a6 6 0 0 1-2-1.2l-2.2 1.3-2-3.4 2.2-1.3a6 6 0 0 1 0-2.4L3.8 9.1l2-3.4 2.2 1.3a6 6 0 0 1 2-1.2V3Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

// Keyed by lib/data/taxonomy.seed.ts PartCategory slugs — every current
// category must resolve to something here (aliases share a drawing where the
// real part shape is interchangeable, e.g. liner/cylinder-liner).
const PART_ICON_MAP: Record<string, IconComponent> = {
  "complete-engine": CompleteEngineIcon,
  "cylinder-head": CylinderHeadIcon,
  crankshaft: CrankshaftIcon,
  turbocharger: TurbochargerIcon,
  "cylinder-liner": CylinderLinerIcon,
  liner: CylinderLinerIcon,
  "fuel-pump": FuelPumpIcon,
  piston: PistonIcon,
  alternator: AlternatorIcon,
  "connecting-rod": ConnectingRodIcon,
  "cylinder-block": CylinderBlockIcon,
  "engine-block": CylinderBlockIcon,
  "oil-pump": OilPumpIcon,
  "water-pump": WaterPumpIcon,
  "water-jacket": WaterJacketIcon,
};

export function partIcon(slug: string): IconComponent {
  return PART_ICON_MAP[slug] ?? GenericPartIcon;
}
