"use client";

import { useState, useEffect } from "react";
import { COMPANY_DATA } from "@/data/company";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Deteksi scroll untuk mengubah tampilan Navbar (Transparan -> Glassmorphism)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Kunci scroll saat mobile menu terbuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] ${
          isScrolled 
            ? "bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 py-4" 
            : "bg-transparent py-6 md:py-8"
        } px-6 md:px-12`}
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
                key={link} 
                href={`#${link.toLowerCase()}`} 
                className="hover:text-zinc-100 transition-colors duration-300 relative group"
              >
                {link}
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
        className={`fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto translate-y-0" 
            : "opacity-0 pointer-events-none -translate-y-8"
        }`}
      >
        <nav className="flex flex-col gap-8 text-center text-zinc-500 text-sm tracking-[0.3em]">
          {COMPANY_DATA.navLinks.map((link, idx) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-zinc-100 transition-colors duration-300"
              style={{
                transitionDelay: isMobileMenuOpen ? `${idx * 100}ms` : "0ms"
              }}
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}