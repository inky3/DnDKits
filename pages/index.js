import Link from "next/link";
import Panel from "@/components/Panel";
import { useT } from "@/lib/i18n/useT";

export default function Home() {
  const { t } = useT();

  const TOOLS = [
    { href: "/shops", key: "shops" },
    { href: "/monsters", key: "monsters" },
    { href: "/character-sheet", key: "characterSheet" },
    { href: "/homebrew", key: "homebrew" },
  ];

  return (
    <div>
      <div className="mb-10">
        <div className="section-rule mb-4" />
        <h1 className="font-display text-4xl text-parchment mb-2">
          {t("home.heading")}
        </h1>
        <p className="text-muted max-w-2xl">{t("home.subheading")}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Panel
              eyebrow={t("home.eyebrow")}
              title={t(`home.tools.${tool.key}.label`)}
              className="h-full hover:border-crimson transition-colors cursor-pointer"
            >
              <p className="text-muted text-sm">{t(`home.tools.${tool.key}.desc`)}</p>
            </Panel>
          </Link>
        ))}
      </div>
    </div>
  );
}
