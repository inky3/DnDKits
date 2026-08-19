import Link from "next/link";
import { useRouter } from "next/router";
import { useT } from "@/lib/i18n/useT";
import LanguageSwitcher from "./LanguageSwitcher";

export default function NavBar() {
  const router = useRouter();
  const { t } = useT();

  const LINKS = [
    { href: "/", label: t("nav.home") },
    { href: "/shops", label: t("nav.shops") },
    { href: "/monsters", label: t("nav.monsters") },
    { href: "/character-sheet", label: t("nav.characterSheet") },
    { href: "/homebrew", label: t("nav.homebrew") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-panel border-b border-line">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="w-7 h-7 rounded-sm bg-crimson flex items-center justify-center font-display font-bold text-parchment">
              D
            </span>
            <span className="font-display text-lg tracking-wide text-parchment whitespace-nowrap">
              {t("nav.brand")}
            </span>
          </Link>
          <nav className="flex gap-1 overflow-x-auto flex-1">
            {LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? router.pathname === "/"
                  : router.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-display tracking-wide whitespace-nowrap border-b-2 transition-colors ${
                    active
                      ? "border-crimson text-parchment"
                      : "border-transparent text-muted hover:text-parchment hover:border-line"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
