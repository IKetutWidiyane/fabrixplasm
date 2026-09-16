"use client";

import { useState, useEffect, useRef } from "react";
import { COMPANY_DATA } from "@/data/company";
import { lenisStore } from "@/lib/lenis";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // State untuk show/hide navbar
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Gunakan ref untuk melacak posisi scroll terakhir tanpa memicu re-render
  const lastScrollY = useRef(0);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const currentScrollY = window.scrollY;
        const nextScrolled = currentScrollY > 50;
        const nextVisible = !(currentScrollY > lastScrollY.current && currentScrollY > 80);

        setIsScrolled((prev) => (prev !== nextScrolled ? nextScrolled : prev));
        setIsVisible((prev) => (prev !== nextVisible ? nextVisible : prev));

        lastScrollY.current = currentScrollY;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Kunci scroll saat mobile menu terbuka.
  // Selain overflow:hidden, Lenis juga di-stop agar swipe di layar sentuh
  // tidak menggeser halaman di belakang menu (mis. pada HP).
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.body.style.overscrollBehavior = "none";
      lenisStore.instance?.stop();
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.overscrollBehavior = "";
      lenisStore.instance?.start();
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[80] transition-all duration-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] px-6 md:px-12
          ${/* Efek Muncul/Tenggelam */ ""}
          ${isVisible || isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"}
          ${/* Efek Glassmorphism saat discroll */ ""}
          ${isScrolled 
            ? "bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 py-4" 
            : "bg-transparent py-6 md:py-8"
          }
        `}
      >
        <div className="flex justify-between items-center w-full">
          {/* Logo / Nama Brand */}
          <div className="text-zinc-100 font-bold tracking-[0.3em] z-[60] relative cursor-pointer">
            <a href="#">{COMPANY_DATA.name}</a>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-10 text-zinc-500 pointer-events-auto">
            {COMPANY_DATA.navLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.target} 
                className="hover:text-zinc-100 transition-colors duration-300 relative group"
              >
                {link.label}
                {/* Efek Hover Garis Bawah Merambat */}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-zinc-100 transition-all duration-500 ease-out group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden text-zinc-400 hover:text-zinc-100 transition-colors z-[60] relative pointer-events-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? "CLOSE" : "MENU"}
          </button>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`fixed inset-0 z-[70] bg-zinc-950/95 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto translate-y-0" 
            : "opacity-0 pointer-events-none -translate-y-8"
        }`}
      >
        <nav className="flex flex-col gap-8 text-center text-zinc-500 text-sm tracking-[0.3em]">
          {COMPANY_DATA.navLinks.map((link, idx) => (
            <a
              key={link.label}
              href={link.target}
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-zinc-100 transition-colors duration-300"
              style={{
                transitionDelay: isMobileMenuOpen ? `${idx * 100}ms` : "0ms"
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}