import { useEffect, useState } from "react";
import Panel from "@/components/Panel";
import { TOWN_SIZES } from "@/lib/data/shopData";
import { generateTown, rerollShop, addShop, availableToAdd } from "@/lib/shopGenerator";
import { listItems, addItem, removeItem } from "@/lib/storage";
import { useT } from "@/lib/i18n/useT";

const BLANK_GOOD = { name: "", quantity: 1, price: 0, unit: "gp" };

function blankForm() {
  return {
    mode: "create",
    id: null,
    name: "",
    typeLabel: "",
    tagline: "",
    style: "goods", // "goods" | "hook"
    hook: "",
    goods: [{ ...BLANK_GOOD }],
  };
}

function formFromShop(shop) {
  return {
    mode: "edit",
    id: shop.id,
    name: shop.name || "",
    typeLabel: shop.typeLabel || "",
    tagline: shop.tagline || "",
    style: shop.hook ? "hook" : "goods",
    hook: shop.hook || "",
    goods:
      shop.goods && shop.goods.length > 0
        ? shop.goods.map((g) => ({ ...g }))
        : [{ ...BLANK_GOOD }],
  };
}

export default function ShopsPage() {
  const { t } = useT();
  const [sizeKey, setSizeKey] = useState("town");
  const [town, setTown] = useState(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [shopForm, setShopForm] = useState(null);

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
    setShopForm(null);
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

  function openCreateForm() {
    setShopForm(blankForm());
    setAddMenuOpen(false);
  }

  function openEditForm(shop) {
    setShopForm(formFromShop(shop));
  }

  function closeForm() {
    setShopForm(null);
  }

  function updateForm(patch) {
    setShopForm((f) => ({ ...f, ...patch }));
  }

  function updateGood(index, patch) {
    setShopForm((f) => ({
      ...f,
      goods: f.goods.map((g, i) => (i === index ? { ...g, ...patch } : g)),
    }));
  }

  function addGoodRow() {
    setShopForm((f) => ({ ...f, goods: [...f.goods, { ...BLANK_GOOD }] }));
  }

  function removeGoodRow(index) {
    setShopForm((f) => ({ ...f, goods: f.goods.filter((_, i) => i !== index) }));
  }

  function saveShopForm() {
    if (!shopForm) return;
    const name = shopForm.name.trim() || t("shops.customShop");
    const typeLabel = shopForm.typeLabel.trim() || t("shops.customShop");
    const built = {
      id: shopForm.id || `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: "custom",
      typeLabel,
      name,
      tagline: shopForm.tagline.trim() || undefined,
    };
    if (shopForm.style === "hook") {
      built.hook = shopForm.hook.trim();
    } else {
      built.goods = shopForm.goods
        .filter((g) => g.name.trim())
        .map((g) => ({
          name: g.name.trim(),
          quantity: Number(g.quantity) || 1,
          price: Number(g.price) || 0,
          unit: g.unit || "gp",
        }));
    }

    setTown((prev) => {
      if (shopForm.mode === "create") {
        return { ...prev, shops: [...prev.shops, built] };
      }
      return { ...prev, shops: prev.shops.map((s) => (s.id === built.id ? built : s)) };
    });
    setShopForm(null);
  }

  async function handleSaveSettlement() {
    if (!town) return;
    const saved = await addItem("settlements", town);
    setSaved((prev) => [...prev, saved]);
  }

  function handleLoadSettlement(entry) {
    setTown(entry);
    setShopForm(null);
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
                        <button
                          onClick={openCreateForm}
                          className="w-full text-left px-4 py-2 text-sm border-t border-line hover:bg-panel2 hover:text-crimsonBright transition-colors font-display"
                        >
                          {t("shops.addCustomShop")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {shopForm && (
                <ShopFormPanel
                  t={t}
                  form={shopForm}
                  onChange={updateForm}
                  onChangeGood={updateGood}
                  onAddGood={addGoodRow}
                  onRemoveGood={removeGoodRow}
                  onSave={saveShopForm}
                  onCancel={closeForm}
                />
              )}

              <div className="grid md:grid-cols-2 gap-5">
                {town.shops.map((shop) => (
                  <Panel
                    key={shop.id}
                    eyebrow={
                      shop.type === "random" || shop.type === "custom"
                        ? shop.typeLabel
                        : t(`shops.shopTypes.${shop.type}`)
                    }
                    title={shop.name}
                    right={
                      <div className="flex items-center gap-3">
                        {shop.type !== "custom" && (
                          <button
                            onClick={() => handleReroll(shop)}
                            className="text-muted hover:text-crimsonBright text-sm font-display whitespace-nowrap"
                          >
                            ↻ {shop.hook ? t("shops.reroll") : t("shops.restock")}
                          </button>
                        )}
                        <button
                          onClick={() => openEditForm(shop)}
                          className="text-muted hover:text-crimsonBright text-sm font-display whitespace-nowrap"
                        >
                          {t("shops.editShop")}
                        </button>
                      </div>
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

function ShopFormPanel({ t, form, onChange, onChangeGood, onAddGood, onRemoveGood, onSave, onCancel }) {
  return (
    <Panel
      title={form.mode === "create" ? t("shops.newCustomShop") : t("shops.editCustomShop")}
      eyebrow={t("shops.customShop")}
      className="mb-5"
    >
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <label className="block">
          <span className="block text-xs text-muted uppercase tracking-wide mb-1">
            {t("shops.shopName")}
          </span>
          <input
            className="input"
            value={form.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="block text-xs text-muted uppercase tracking-wide mb-1">
            {t("shops.shopTypeLabel")}
          </span>
          <input
            className="input"
            placeholder={t("shops.shopTypeLabelPlaceholder")}
            value={form.typeLabel}
            onChange={(e) => onChange({ typeLabel: e.target.value })}
          />
        </label>
      </div>

      <label className="block mb-4">
        <span className="block text-xs text-muted uppercase tracking-wide mb-1">
          {t("shops.shopTagline")}
        </span>
        <input
          className="input"
          value={form.tagline}
          onChange={(e) => onChange({ tagline: e.target.value })}
        />
      </label>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => onChange({ style: "goods" })}
          className={`flex-1 px-3 py-1.5 rounded-sm text-xs font-display border ${
            form.style === "goods"
              ? "bg-crimson border-crimson text-white"
              : "bg-panel2 border-line text-muted"
          }`}
        >
          {t("shops.shopStyleGoods")}
        </button>
        <button
          onClick={() => onChange({ style: "hook" })}
          className={`flex-1 px-3 py-1.5 rounded-sm text-xs font-display border ${
            form.style === "hook"
              ? "bg-crimson border-crimson text-white"
              : "bg-panel2 border-line text-muted"
          }`}
        >
          {t("shops.shopStyleHook")}
        </button>
      </div>

      {form.style === "hook" ? (
        <label className="block mb-5">
          <span className="block text-xs text-muted uppercase tracking-wide mb-1">
            {t("shops.hookText")}
          </span>
          <textarea
            className="input"
            rows={3}
            value={form.hook}
            onChange={(e) => onChange({ hook: e.target.value })}
          />
        </label>
      ) : (
        <div className="mb-5">
          <span className="block text-xs text-muted uppercase tracking-wide mb-2">
            {t("shops.goods")}
          </span>
          <div className="space-y-2 mb-3">
            {form.goods.map((g, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input
                  className="input col-span-5"
                  placeholder={t("shops.goodName")}
                  value={g.name}
                  onChange={(e) => onChangeGood(i, { name: e.target.value })}
                />
                <input
                  type="number"
                  min={1}
                  className="input col-span-2"
                  placeholder={t("shops.goodQty")}
                  value={g.quantity}
                  onChange={(e) => onChangeGood(i, { quantity: e.target.value })}
                />
                <input
                  type="number"
                  min={0}
                  className="input col-span-2"
                  placeholder={t("shops.goodPrice")}
                  value={g.price}
                  onChange={(e) => onChangeGood(i, { price: e.target.value })}
                />
                <select
                  className="input col-span-2"
                  value={g.unit}
                  onChange={(e) => onChangeGood(i, { unit: e.target.value })}
                >
                  <option value="cp">cp</option>
                  <option value="sp">sp</option>
                  <option value="gp">gp</option>
                  <option value="pp">pp</option>
                </select>
                <button
                  onClick={() => onRemoveGood(i)}
                  title={t("shops.removeGood")}
                  className="col-span-1 text-muted hover:text-crimsonBright text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={onAddGood}
            className="px-3 py-1.5 rounded-sm border border-line hover:border-crimson text-xs font-display tracking-wide"
          >
            {t("shops.addGood")}
          </button>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onSave}
          className="px-5 py-2.5 bg-crimson hover:bg-crimsonBright transition-colors rounded-sm font-display tracking-wide text-white"
        >
          {t("shops.saveShop")}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 border border-line hover:border-crimson transition-colors rounded-sm font-display tracking-wide text-parchment"
        >
          {t("common.cancel")}
        </button>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          background: #1e2126;
          border: 1px solid #3a3d44;
          border-radius: 2px;
          padding: 0.6rem 0.75rem;
          font-size: 0.875rem;
          color: #f4ede1;
        }
        .input:focus {
          outline: none;
          border-color: #c53131;
        }
      `}</style>
    </Panel>
  );
}
