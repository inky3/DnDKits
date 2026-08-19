import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Panel from "@/components/Panel";
import { HOMEBREW_CATEGORIES } from "@/lib/data/homebrewCategories";
import { listItems, addItem, removeItem } from "@/lib/storage";
import { useT } from "@/lib/i18n/useT";

function blankFields(fields) {
  const obj = {};
  fields.forEach((f) => {
    obj[f.key] = f.type === "select" ? f.options[0] : "";
  });
  return obj;
}

export default function HomebrewCategoryPage() {
  const router = useRouter();
  const { t } = useT();
  const { category, create } = router.query;
  const cat = category ? HOMEBREW_CATEGORIES[category] : null;
  const label = category ? t(`homebrew.categories.${category}.label`) : "";
  const singular = category ? t(`homebrew.categories.${category}.singular`) : "";
  const description = category ? t(`homebrew.categories.${category}.description`) : "";

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [fields, setFields] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!cat) return;
    setFields(blankFields(cat.fields));
    setShowForm(create === "1");
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    listItems("homebrew").then((items) => {
      setEntries(items.filter((e) => e.category === category));
      setLoading(false);
    });
  }, [category]);

  if (router.isReady && !cat) {
    return (
      <div>
        <p className="text-muted mb-4">{t("homebrew.unknownCategory")}</p>
        <Link href="/homebrew" className="text-crimsonBright font-display text-sm">
          {t("homebrew.backToHomebrew")}
        </Link>
      </div>
    );
  }
  if (!cat) return null;

  async function handleSave() {
    if (!name.trim()) return;
    const saved = await addItem("homebrew", { category, name, fields });
    setEntries((prev) => [...prev, saved]);
    setName("");
    setFields(blankFields(cat.fields));
    setShowForm(false);
  }

  async function handleDelete(id) {
    await removeItem("homebrew", id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (expanded === id) setExpanded(null);
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/homebrew" className="text-muted hover:text-crimsonBright text-sm font-display">
          {t("homebrew.allHomebrew")}
        </Link>
      </div>

      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="section-rule mb-4" />
          <h1 className="font-display text-3xl mb-2">
            {t("homebrew.heading")} · {label}
          </h1>
          <p className="text-muted max-w-2xl">{description}</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="px-5 py-2.5 bg-crimson hover:bg-crimsonBright transition-colors rounded-sm font-display tracking-wide text-white whitespace-nowrap"
        >
          {showForm ? t("common.cancel") : t("homebrew.create", { singular })}
        </button>
      </div>

      {showForm && (
        <Panel title={t("homebrew.newEntry", { singular })} eyebrow={t("homebrew.createEyebrow")} className="mb-8">
          <label className="block mb-4">
            <span className="block text-xs text-muted uppercase tracking-wide mb-1">
              {t("homebrew.name")}
            </span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            {cat.fields.map((f) => (
              <label
                key={f.key}
                className={f.type === "textarea" ? "block sm:col-span-2" : "block"}
              >
                <span className="block text-xs text-muted uppercase tracking-wide mb-1">
                  {f.label}
                </span>
                {f.type === "textarea" && (
                  <textarea
                    className="input min-h-[90px]"
                    value={fields[f.key] || ""}
                    onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })}
                  />
                )}
                {f.type === "select" && (
                  <select
                    className="input"
                    value={fields[f.key] || f.options[0]}
                    onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })}
                  >
                    {f.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                )}
                {(f.type === "text" || f.type === "number") && (
                  <input
                    type={f.type}
                    className="input"
                    placeholder={f.placeholder}
                    value={fields[f.key] || ""}
                    onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })}
                  />
                )}
              </label>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-crimson hover:bg-crimsonBright transition-colors rounded-sm font-display tracking-wide text-white"
          >
            {t("homebrew.save", { singular })}
          </button>
        </Panel>
      )}

      {loading && <p className="text-muted text-sm">{t("common.loading")}</p>}
      {!loading && entries.length === 0 && (
        <p className="text-muted text-sm">{t("homebrew.none", { label: label.toLowerCase() })}</p>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {entries.map((entry) => {
          const isOpen = expanded === entry.id;
          return (
            <Panel
              key={entry.id}
              eyebrow={singular}
              title={entry.name}
              right={
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-muted hover:text-crimsonBright text-xs"
                >
                  {t("common.delete")}
                </button>
              }
            >
              <div className="space-y-2">
                {cat.fields
                  .filter((f) => entry.fields?.[f.key])
                  .slice(0, isOpen ? undefined : 3)
                  .map((f) => (
                    <div key={f.key} className="text-sm">
                      <span className="text-muted">{f.label}: </span>
                      <span className="text-parchment/90 whitespace-pre-wrap">
                        {entry.fields[f.key]}
                      </span>
                    </div>
                  ))}
              </div>
              {cat.fields.filter((f) => entry.fields?.[f.key]).length > 3 && (
                <button
                  onClick={() => setExpanded(isOpen ? null : entry.id)}
                  className="mt-3 text-xs font-display text-crimsonBright"
                >
                  {isOpen ? t("homebrew.showLess") : t("homebrew.showMore")}
                </button>
              )}
            </Panel>
          );
        })}
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
    </div>
  );
}
