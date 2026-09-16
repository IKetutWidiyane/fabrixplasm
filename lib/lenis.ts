import type Lenis from "lenis";

/**
 * Singleton holder untuk instance Lenis.
 * Dibagikan agar komponen lain (mis. Navbar) bisa memanggil stop()/start()
 * saat perlu mengunci scroll (contoh: menu mobile terbuka).
 */
export const lenisStore: { instance: Lenis | null } = { instance: null };
