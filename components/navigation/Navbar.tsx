import { COMPANY_DATA } from "@/data/company";

export default function Navbar() {
  return (
    <header className="flex justify-between items-start font-mono text-[10px] uppercase tracking-[0.2em] fade-in-up">
      <div className="text-textPrimary font-bold">{COMPANY_DATA.name}</div>
      <nav className="flex gap-8 text-textSecondary pointer-events-auto">
        {COMPANY_DATA.navLinks.map((link) => (
          <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-textPrimary transition-colors">
            {link}
          </a>
        ))}
      </nav>
    </header>
  );
}