export default function ProcessProgress({ activeStep }: { activeStep: number }) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="font-mono text-zinc-500 text-sm tracking-widest">PROCESS</div>
      <div className="flex items-center gap-4">
        <span className="font-mono text-white text-lg">0{activeStep + 1}</span>
        <span className="font-mono text-zinc-600 text-lg">/ 04</span>
      </div>
      {/* Progress Bar Line */}
      <div className="w-full h-[1px] bg-zinc-800 relative mt-2">
        <div 
          className="absolute top-0 left-0 h-full bg-white transition-all duration-500 ease-out"
          style={{ width: `${((activeStep + 1) / 4) * 100}%` }}
        />
      </div>
    </div>
  );
}