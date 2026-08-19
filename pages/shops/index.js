import { useEffect, useState } from "react";
import Panel from "@/components/Panel";
import { TOWN_SIZES } from "@/lib/data/shopData";
import { generateTown, rerollShop, addShop, availableToAdd } from "@/lib/shopGenerator";
import { listItems, addItem, removeItem } from "@/lib/storage";
import { useT } from "@/lib/i18n/useT";

export default function ShopsPage() {
  const { t } = useT();
  const [sizeKey, setSizeKey] = useState("town");
  const [town, setTown] = useState(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const [saved, setSaved] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  useEffect(() => {
    listItems("settlements").then((items) => {
      setSaved(items);
      setLoadingSaved(false);
    });
  }, []);

  const sizeLabel = t(`shops.townSizes.${sizeKey}.label`);

  function handleGenerate() {
    setTown(generateTown(sizeKey));
    setAddMenuOpen(false);
  }

  function handleReroll(shop) {
    setTown((prev) => ({
      ...prev,
      shops: prev.shops.map((s) =>
        s.id === shop.id ? rerollShop(shop, prev.size) : s
      ),
    }));
  }

  function handleAdd(typeKey) {
    setTown((prev) => {
      const newShop = addShop(prev, typeKey);
      if (!newShop) return prev;
      return { ...prev, shops: [...prev.shops, newShop] };
    });
    setAddMenuOpen(false);
  }

  async function handleSaveSettlement() {
    if (!town) return;
    const saved = await addItem("settlements", town);
    setSaved((prev) => [...prev, saved]);
  }

  function handleLoadSettlement(entry) {
    setTown(entry);
  }

  async function handleDeleteSettlement(id) {
    await removeItem("settlements", id);
    setSaved((prev) => prev.filter((s) => s.id !== id));
  }

  const addOptions = town ? availableToAdd(town) : [];

  return (
    <div>
      <div className="mb-8">
        <div className="section-rule mb-4" />
        <h1 className="font-display text-3xl mb-2">{t("shops.heading")}</h1>
        <p className="text-muted max-w-2xl">{t("shops.subheading")}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleGenerate}
                className="px-5 py-2.5 bg-crimson hover:bg-crimsonBright transition-colors rounded-sm font-display tracking-wide text-white"
              >
                {t("shops.generate", { size: sizeLabel })}
              </button>
              {town && (
                <button
                  onClick={handleSaveSettlement}
                  className="px-5 py-2.5 border border-line hover:border-crimson transition-colors rounded-sm font-display tracking-wide text-parchment"
                >
                  {t("shops.saveSettlement")}
                </button>
              )}
            </div>
          </Panel>

          {town && (
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="font-display text-2xl">
                  {t(`shops.townSizes.${town.size}.label`)} — {t("nav.shops")}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-muted text-sm">
                    {t("shops.shopsCount", { count: town.shops.length })}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => setAddMenuOpen((o) => !o)}
                      className="w-8 h-8 flex items-center justify-center rounded-sm bg-crimson hover:bg-crimsonBright transition-colors text-white font-display text-lg leading-none"
                      title={t("shops.addShop")}
                    >
                      +
                    </button>
                    {addMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-panel border border-line rounded-sm shadow-card z-10 py-1">
                        {addOptions.map((key) => (
                          <button
                            key={key}
                            onClick={() => handleAdd(key)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-panel2 hover:text-crimsonBright transition-colors"
                          >
                            {key === "random"
                              ? t("shops.addRandomLocation")
                              : t(`shops.shopTypes.${key}`)}
                          </button>
                        ))}
                        {addOptions.length === 1 && (
                          <p className="px-4 py-2 text-xs text-muted">
                            {t("shops.allPresetsShown")}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
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

        <div>
          <Panel
            title={t("shops.savedSettlements")}
            eyebrow={loadingSaved ? t("common.loading") : t("shops.savedTotal", { count: saved.length })}
          >
            {!loadingSaved && saved.length === 0 && (
              <p className="text-muted text-sm">{t("shops.noSaved")}</p>
            )}
            <div className="space-y-3">
              {saved.map((entry) => (
                <div
                  key={entry.id}
                  className="border border-line rounded-sm p-3 flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="font-display text-sm">
                      {t(`shops.townSizes.${entry.size}.label`)}
                    </div>
                    <div className="text-xs text-muted">
                      {t("shops.shopsCount", { count: entry.shops.length })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleLoadSettlement(entry)}
                      className="text-crimsonBright text-xs font-display"
                    >
                      {t("shops.load")}
                    </button>
                    <button
                      onClick={() => handleDeleteSettlement(entry.id)}
                      className="text-muted hover:text-crimsonBright text-xs"
                    >
                      {t("common.delete")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}