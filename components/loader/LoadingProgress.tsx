"use client";

interface LoadingProgressProps {
  progress: number;
  status: string;
}

/**
 * UI de progression — branding FABRIXPLASM :
 * wordmark monospace, barre fine orange (accent #FF6A00), compteur tabulaire.
 */
export default function LoadingProgress({ progress, status }: LoadingProgressProps) {
  const display = `${Math.min(100, Math.floor(progress))}`.padStart(3, "0");

  return (
    <div className="preloader__content flex flex-col items-center gap-8 select-none">
      {/* Wordmark */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="font-mono text-[10px] text-[#8D8A82] tracking-[0.5em] uppercase">
          CNC FABRICATION
        </span>
        <span className="font-mono text-2xl text-[#E8E5DE] tracking-[0.35em] uppercase">
          FABRIX<span className="text-[#FF6A00]">PLASM</span>
        </span>
        <span className="font-mono text-[9px] text-[#8D8A82] tracking-[0.4em] uppercase mt-0.5">
          DIGITAL → PHYSICAL
        </span>
      </div>

      {/* Barre de progression (style machine) */}
      <div className="w-72 h-[2px] bg-zinc-800/80 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-[#FF6A00] transition-[width] duration-200 ease-out"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>

      {/* Pourcentage + statut */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="font-mono text-5xl leading-none text-[#E8E5DE] tabular-nums">
          {display}
          <span className="text-2xl text-[#8D8A82]">%</span>
        </span>
        <span className="font-mono text-[10px] text-[#8D8A82] tracking-[0.35em] uppercase">
          {status}
        </span>
      </div>
    </div>
  );
}