import Link from "next/link";
import Panel from "@/components/Panel";
import { HOMEBREW_CATEGORY_ORDER } from "@/lib/data/homebrewCategories";
import { useT } from "@/lib/i18n/useT";

export default function HomebrewHub() {
  const { t } = useT();

  return (
    <div>
      <div className="mb-8">
        <div className="section-rule mb-4" />
        <h1 className="font-display text-3xl mb-2">{t("homebrew.heading")}</h1>
        <p className="text-muted max-w-2xl">{t("homebrew.subheading")}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {HOMEBREW_CATEGORY_ORDER.map((key) => {
          const label = t(`homebrew.categories.${key}.label`);
          const singular = t(`homebrew.categories.${key}.singular`);
          const description = t(`homebrew.categories.${key}.description`);
          return (
            <Panel key={key} eyebrow={t("homebrew.eyebrow")} title={label}>
              <p className="text-sm text-muted mb-5">{description}</p>
              <div className="flex gap-3">
                <Link
                  href={`/homebrew/${key}`}
                  className="px-4 py-2 rounded-sm border border-line text-sm font-display tracking-wide text-parchment hover:border-crimson transition-colors"
                >
                  {t("homebrew.viewMine", { label })}
                </Link>
                <Link
                  href={`/homebrew/${key}?create=1`}
                  className="px-4 py-2 rounded-sm bg-crimson hover:bg-crimsonBright transition-colors text-sm font-display tracking-wide text-white"
                >
                  {t("homebrew.create", { singular })}
                </Link>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
