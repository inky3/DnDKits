import { useRouter } from "next/router";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "th", label: "ไทย" },
];

export default function LanguageSwitcher() {
  const router = useRouter();

  function switchTo(code) {
    if (code === router.locale) return;
    router.push({ pathname: router.pathname, query: router.query }, router.asPath, {
      locale: code,
    });
  }

  return (
    <div className="flex items-center gap-1 border border-line rounded-sm p-0.5 shrink-0">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => switchTo(l.code)}
          className={`px-2.5 py-1 rounded-sm text-xs font-display tracking-wide transition-colors ${
            router.locale === l.code
              ? "bg-crimson text-white"
              : "text-muted hover:text-parchment"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
