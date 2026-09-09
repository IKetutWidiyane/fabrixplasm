import { processData } from "@/data/processData";

export default function ProcessVisual() {
  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] bg-zinc-900 overflow-hidden group cursor-pointer">
      
      {/* Label Cursor minimalis saat hover */}
      <div className="absolute top-6 right-6 z-50 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-white text-xs font-mono tracking-wider">VIEW PROCESS</span>
      </div>

      {processData.map((step, idx) => (
        <div
          key={step.id}
          // PERBAIKAN 1: Tambahkan bg-zinc-900 pada layer ini agar menutupi tumpukan di bawahnya
          className={`process-image process-image-${idx} absolute inset-0 w-full h-full will-change-transform bg-zinc-900`}
          style={{
            // PERBAIKAN 2: Inset 100% dari atas ke bawah agar selaras dengan animasi parallax di Section
            clipPath: idx === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
            zIndex: idx,
          }}
        >
          {/* Inner image container */}
          <div className={`process-image-inner process-image-inner-${idx} absolute inset-0 w-full h-full`}>
            <img
              src={step.image}
              alt={step.title}
              // PERBAIKAN 3: Hapus opacity-80 & mix-blend-lighten yang membuat gambar tembus pandang
              className="w-full h-full object-cover grayscale brightness-75"
            />
          </div>
        </div>
      ))}
    </div>
  );
}