import { processData } from "@/data/processData";

export default function ProcessSteps({ activeStep }: { activeStep: number }) {
  return (
    <div className="relative h-48 w-full mt-12 overflow-hidden">
      {processData.map((step, idx) => {
        const isActive = activeStep === idx;
        const isPast = activeStep > idx;

        return (
          <div
            key={step.id}
            className={`absolute top-0 left-0 w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isActive
                ? "opacity-100 translate-y-0"
                : isPast
                ? "opacity-0 -translate-y-8"
                : "opacity-0 translate-y-8"
            }`}
          >
            <span className="font-mono text-zinc-500 text-xs tracking-widest mb-4 block">
              {step.id} — {step.phase}
            </span>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-6">
              {step.title}
            </h3>
            <p className="text-zinc-400 text-lg md:text-xl max-w-sm leading-relaxed">
              {step.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}