"use client";

interface LoadingProgressProps {
  progress: number;
  status: string;
}

export default function LoadingProgress({
  progress,
  status,
}: LoadingProgressProps) {
  const value = Math.min(100, Math.max(0, progress));
  const display = Math.floor(value).toString().padStart(3, "0");

  return (
    <div className="preloader__content relative flex h-full w-full flex-col justify-between overflow-hidden p-6 text-zinc-100 md:p-10 lg:p-12">
      {/* Subtle technical grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Top information */}
      <header className="relative z-10 flex items-start justify-between font-mono text-[9px] uppercase tracking-[0.28em] md:text-[10px]">
        <div className="flex items-center gap-3">
          <span className="inline-block h-1.5 w-1.5 bg-zinc-100" />
          <span>FABRIXPLASM</span>
        </div>

        <div className="flex items-center gap-6 text-zinc-600">
          <span className="hidden sm:block">DIGITAL → PHYSICAL</span>
          <span>SYS / 01</span>
        </div>
      </header>

      {/* Center */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* FP Mark */}
        <div className="preloader__mark relative mb-10 h-20 w-20 md:mb-14 md:h-28 md:w-28">
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Outer technical frame */}
            <rect
              x="8"
              y="8"
              width="84"
              height="84"
              stroke="currentColor"
              strokeOpacity="0.15"
              strokeWidth="1"
            />

            {/* FP monogram */}
            <path
              className="preloader__logo-path"
              d="M29 70V30H62M29 48H56M58 30H69C77 30 82 35 82 42C82 49 77 54 69 54H58V70"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />

            {/* Corner markers */}
            <path
              d="M8 20V8H20M80 8H92V20M92 80V92H80M20 92H8V80"
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.45"
            />
          </svg>

          {/* scanning line */}
          <div className="preloader__scan absolute left-2 right-2 top-0 h-px bg-zinc-100/70" />
        </div>

        {/* Percentage */}
        <div className="flex items-start font-mono">
          <span className="text-[18vw] font-medium leading-[0.75] tracking-[-0.08em] tabular-nums md:text-[12vw] lg:text-[10vw]">
            {display}
          </span>

          <span className="ml-2 mt-1 text-xl text-zinc-600 md:ml-3 md:text-3xl">
            %
          </span>
        </div>
      </div>

      {/* Bottom information */}
      <footer className="relative z-10">
        <div className="mb-4 flex items-end justify-between gap-6 font-mono text-[9px] uppercase tracking-[0.2em] md:text-[10px]">
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse bg-zinc-100" />

            <span className="truncate text-zinc-300">
              {status || "INITIALIZING EXPERIENCE"}
            </span>
          </div>

          <span className="hidden text-zinc-600 md:block">
            CNC / PLASMA / DIGITAL FABRICATION
          </span>
        </div>

        {/* Progress */}
        <div className="relative h-px w-full overflow-hidden bg-zinc-800">
          <div
            className="preloader__progress absolute inset-y-0 left-0 bg-zinc-100"
            style={{
              width: `${value}%`,
            }}
          />

          {/* moving technical marker */}
          <div
            className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-zinc-100"
            style={{
              left: `${value}%`,
            }}
          />
        </div>

        <div className="mt-3 flex justify-between font-mono text-[8px] uppercase tracking-[0.2em] text-zinc-700">
          <span>FABRICATION SYSTEM</span>
          <span>V.01</span>
        </div>
      </footer>
    </div>
  );
}