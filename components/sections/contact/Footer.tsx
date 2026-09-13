"use client";

import { COMPANY_DATA } from "@/data/company";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full bg-[#030303] text-zinc-400 font-mono text-xs border-t border-zinc-900/80 px-6 md:px-12 lg:px-24 py-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* BRAND & TAGLINE (Col 5) */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="text-zinc-100 font-bold text-sm tracking-[0.3em] uppercase">
            {COMPANY_DATA.name}
          </div>
          <p className="text-zinc-500 tracking-wider text-[11px] max-w-sm uppercase leading-relaxed">
            {COMPANY_DATA.tagline}
          </p>
          <div className="mt-2 text-zinc-600 text-[10px] tracking-widest uppercase">
            {`STANDARD SPEC: ${COMPANY_DATA.material} // ${COMPANY_DATA.tolerance}`}
          </div>
        </div>

        {/* LOCATION & TIMEZONE (Col 3) */}
        <div className="md:col-span-3 flex flex-col gap-2">
          <span className="text-zinc-600 text-[10px] tracking-widest uppercase">STUDIO LOCATION</span>
          <span className="text-zinc-200">{COMPANY_DATA.location}</span>
          <span className="text-zinc-500 text-[11px]">{COMPANY_DATA.timezone}</span>
          <span className="text-zinc-600 text-[10px] mt-2">DIRECT LINE: {COMPANY_DATA.email}</span>
        </div>

        {/* NAVIGATION & SOCIAL (Col 4) */}
        <div className="md:col-span-4 flex flex-col sm:flex-row justify-between gap-8">
          {/* Quick Nav */}
          <div className="flex flex-col gap-2.5">
            <span className="text-zinc-600 text-[10px] tracking-widest uppercase">INDEX</span>
            {COMPANY_DATA.navLinks.map((link) => (
              <a
                key={link.label}
                href={link.target}
                className="text-zinc-400 hover:text-[#FF6A00] transition-colors tracking-widest text-[11px]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-2.5">
            <span className="text-zinc-600 text-[10px] tracking-widest uppercase">NETWORKS</span>
            {COMPANY_DATA.socials.map((soc) => (
              <a
                key={soc.label}
                href={soc.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-zinc-400 hover:text-zinc-100 transition-colors tracking-widest text-[11px]"
              >
                {soc.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM LEGAL ROW */}
      <div className="mt-16 pt-8 border-t border-zinc-900/60 flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-600 tracking-widest uppercase gap-4">
        <span>© {new Date().getFullYear()} FABRIXPLASM. ALL RIGHTS RESERVED.</span>
        <span>ENGINEERED WITH RIGOR. PHYSICAL PRECISION.</span>
      </div>
    </footer>
  );
}
