import Link from "next/link";
import Panel from "@/components/Panel";
import { HOMEBREW_CATEGORIES, HOMEBREW_CATEGORY_ORDER } from "@/lib/data/homebrewCategories";

export default function HomebrewHub() {
  return (
    <div>
      <div className="mb-8">
        <div className="section-rule mb-4" />
        <h1 className="font-display text-3xl mb-2">Homebrew</h1>
        <p className="text-muted max-w-2xl">
          Create and manage your own backgrounds, feats, magic items,
          monsters, species, spells, and subclasses — saved to your
          collection, in the same categories D&D Beyond uses.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {HOMEBREW_CATEGORY_ORDER.map((key) => {
          const cat = HOMEBREW_CATEGORIES[key];
          return (
            <Panel key={key} eyebrow="Homebrew" title={cat.label}>
              <p className="text-sm text-muted mb-5">{cat.description}</p>
              <div className="flex gap-3">
                <Link
                  href={`/homebrew/${key}`}
                  className="px-4 py-2 rounded-sm border border-line text-sm font-display tracking-wide text-parchment hover:border-crimson transition-colors"
                >
                  View My {cat.label}
                </Link>
                <Link
                  href={`/homebrew/${key}?create=1`}
                  className="px-4 py-2 rounded-sm bg-crimson hover:bg-crimsonBright transition-colors text-sm font-display tracking-wide text-white"
                >
                  Create {cat.singular}
                </Link>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}