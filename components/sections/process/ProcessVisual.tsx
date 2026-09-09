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
          className={`process-image process-image-${idx} absolute inset-0 w-full h-full will-change-transform`}
          // Gambar pertama muncul default, sisanya disembunyikan pakai clip-path
          style={{
            clipPath: idx === 0 ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
            zIndex: idx,
          }}
        >
          {/* Inner image container untuk efek parallax horizontal */}
          <div className={`process-image-inner process-image-inner-${idx} absolute top-0 -left-[5%] w-[110%] h-full`}>
            <img
              src={step.image}
              alt={step.title}
              className="w-full h-full object-cover grayscale opacity-80 mix-blend-lighten"
            />
          </div>
        </div>
      ))}
    </div>
  );
}