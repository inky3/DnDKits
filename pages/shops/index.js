import { useState } from "react";
import Panel from "@/components/Panel";
import { TOWN_SIZES } from "@/lib/data/shopData";
import { generateTown, rerollShop } from "@/lib/shopGenerator";
import { useT } from "@/lib/i18n/useT";

export default function ShopsPage() {
  const { t } = useT();
  const [sizeKey, setSizeKey] = useState("town");
  const [town, setTown] = useState(null);

  const sizeLabel = t(`shops.townSizes.${sizeKey}.label`);

  function handleGenerate() {
    setTown(generateTown(sizeKey));
  }

  function handleReroll(shop) {
    setTown((prev) => ({
      ...prev,
      shops: prev.shops.map((s) =>
        s.id === shop.id ? rerollShop(shop, prev.size) : s
      ),
    }));
  }

  return (
    <div>
      <div className="mb-8">
        <div className="section-rule mb-4" />
        <h1 className="font-display text-3xl mb-2">{t("shops.heading")}</h1>
        <p className="text-muted max-w-2xl">{t("shops.subheading")}</p>
      </div>

      <Panel title={t("shops.settlement")} eyebrow={t("shops.step1")} className="mb-8">
        <div className="flex flex-wrap gap-3 mb-5">
          {Object.keys(TOWN_SIZES).map((key) => (
            <button
              key={key}
              onClick={() => setSizeKey(key)}
              className={`px-4 py-2 rounded-sm font-display text-sm tracking-wide border transition-colors ${
                sizeKey === key
                  ? "bg-crimson border-crimson text-white"
                  : "bg-panel2 border-line text-muted hover:text-parchment hover:border-crimson"
              }`}
            >
              {t(`shops.townSizes.${key}.label`)}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted mb-5">
          {t(`shops.townSizes.${sizeKey}.description`)}
        </p>
        <button
          onClick={handleGenerate}
          className="px-5 py-2.5 bg-crimson hover:bg-crimsonBright transition-colors rounded-sm font-display tracking-wide text-white"
        >
          {t("shops.generate", { size: sizeLabel })}
        </button>
      </Panel>

      {town && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">
              {t(`shops.townSizes.${town.size}.label`)} — {t("nav.shops")}
            </h2>
            <span className="text-muted text-sm">
              {t("shops.shopsCount", { count: town.shops.length })}
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {town.shops.map((shop) => (
              <Panel
                key={shop.id}
                eyebrow={shop.type === "random" ? shop.typeLabel : t(`shops.shopTypes.${shop.type}`)}
                title={shop.name}
                right={
                  <button
                    onClick={() => handleReroll(shop)}
                    className="text-muted hover:text-crimsonBright text-sm font-display whitespace-nowrap"
                  >
                    ↻ {shop.hook ? t("shops.reroll") : t("shops.restock")}
                  </button>
                }
              >
                {shop.tagline && (
                  <p className="text-sm text-muted italic mb-3">{shop.tagline}</p>
                )}
                {shop.hook ? (
                  <p className="text-sm text-parchment/90 leading-relaxed">
                    {shop.hook}
                  </p>
                ) : (
                  <ul className="divide-y divide-line">
                    {shop.goods.map((g, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between py-2 text-sm"
                      >
                        <span>{g.name}</span>
                        <span className="text-muted flex items-center gap-3">
                          <span>x{g.quantity}</span>
                          <span className="text-gold font-medium">
                            {g.price} {g.unit}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
