"use client";

interface LoadingProgressProps {
  progress: number;
  status: string;
}

export default function LoadingProgress({
  progress,
  status,
}: LoadingProgressProps) {
  // Nilai progress tetap dihitung untuk animasi garis putus-putus pada logo
  const value = Math.min(100, Math.max(0, progress));

  return (
    <div className="preloader__content relative flex h-full w-full flex-col justify-between p-8 text-zinc-100 md:p-12 select-none">
      
      {/* Header Minimalis */}
      <header className="relative z-10 flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
        <span>FABRIXPLASM</span>
        <span>{status}</span>
      </header>

      {/* Center: Hanya Logo FP Saja */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* FP Mark - Garis akan tergambar mengikuti persentase loading */}
        {/* Ukuran sedikit diperbesar (h-24/32) karena angka persentase dihilangkan */}
        <div className="preloader__mark relative h-24 w-24 md:h-32 md:w-32 text-zinc-100">
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* FP monogram */}
            <path
              d="M29 70V30H62M29 48H56M58 30H69C77 30 82 35 82 42C82 49 77 54 69 54H58V70"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              // Trik SVG Path Length agar garis bisa di-animasikan dari 0 ke 100
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={100 - value} 
              className="transition-all duration-300 ease-out"
            />
          </svg>
        </div>
      </div>

      {/* Footer Minimalis: Hanya Progress Bar 1px */}
      <footer className="relative z-10 w-full">
        <div className="relative h-[1px] w-full overflow-hidden bg-zinc-800">
          <div
            className="absolute inset-y-0 left-0 bg-zinc-100 transition-all duration-300 ease-out"
            style={{ width: `${value}%` }}
          />
        </div>
      </footer>
      
    </div>
  );
}