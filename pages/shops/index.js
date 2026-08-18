import { useState } from "react";
import Panel from "@/components/Panel";
import { TOWN_SIZES } from "@/lib/data/shopData";
import { generateTown, rerollShop } from "@/lib/shopGenerator";

export default function ShopsPage() {
  const [sizeKey, setSizeKey] = useState("town");
  const [town, setTown] = useState(null);

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
        <h1 className="font-display text-3xl mb-2">Shop Generator</h1>
        <p className="text-muted max-w-2xl">
          Pick a settlement size and get a ready-to-use set of shops with
          stock, prices, and a few unmarked locations to drop your players
          into.
        </p>
      </div>

      <Panel title="Settlement" eyebrow="Step 1" className="mb-8">
        <div className="flex flex-wrap gap-3 mb-5">
          {Object.entries(TOWN_SIZES).map(([key, def]) => (
            <button
              key={key}
              onClick={() => setSizeKey(key)}
              className={`px-4 py-2 rounded-sm font-display text-sm tracking-wide border transition-colors ${
                sizeKey === key
                  ? "bg-crimson border-crimson text-white"
                  : "bg-panel2 border-line text-muted hover:text-parchment hover:border-crimson"
              }`}
            >
              {def.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted mb-5">
          {TOWN_SIZES[sizeKey].description}
        </p>
        <button
          onClick={handleGenerate}
          className="px-5 py-2.5 bg-crimson hover:bg-crimsonBright transition-colors rounded-sm font-display tracking-wide text-white"
        >
          Generate {TOWN_SIZES[sizeKey].label}
        </button>
      </Panel>

      {town && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">{town.sizeLabel} — Shops</h2>
            <span className="text-muted text-sm">{town.shops.length} locations</span>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {town.shops.map((shop) => (
              <Panel
                key={shop.id}
                eyebrow={shop.typeLabel}
                title={shop.name}
                right={
                  <button
                    onClick={() => handleReroll(shop)}
                    title={shop.hook ? "Reroll this location" : "Restock this shop"}
                    className="text-muted hover:text-crimsonBright text-sm font-display whitespace-nowrap"
                  >
                    ↻ {shop.hook ? "Reroll" : "Restock"}
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