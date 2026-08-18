import { useEffect, useState } from "react";
import Panel from "@/components/Panel";
import { listItems, addItem, removeItem } from "@/lib/storage";

const CATEGORIES = [
  { key: "monster", label: "Monster" },
  { key: "shopGood", label: "Shop Good" },
  { key: "location", label: "Location" },
];

const BLANK = { category: "monster", name: "", details: "" };

export default function HomebrewPage() {
  const [entries, setEntries] = useState([]);
  const [draft, setDraft] = useState(BLANK);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listItems("homebrew").then((items) => {
      setEntries(items);
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    if (!draft.name.trim()) return;
    const saved = await addItem("homebrew", draft);
    setEntries((prev) => [...prev, saved]);
    setDraft(BLANK);
  }

  async function handleDelete(id) {
    await removeItem("homebrew", id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const visible = entries.filter((e) => filter === "all" || e.category === filter);

  return (
    <div>
      <div className="mb-8">
        <div className="section-rule mb-4" />
        <h1 className="font-display text-3xl mb-2">Homebrew</h1>
        <p className="text-muted max-w-2xl">
          Write your own monsters, shop goods, or locations and keep them
          alongside the built-in data. Item homebrew is coming later.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Panel title="New Entry" eyebrow="Create">
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setDraft({ ...draft, category: c.key })}
                  className={`px-3 py-1.5 rounded-sm text-xs font-display tracking-wide border ${
                    draft.category === c.key
                      ? "bg-crimson border-crimson text-white"
                      : "bg-panel2 border-line text-muted hover:text-parchment"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <label className="block mb-3">
              <span className="block text-xs text-muted uppercase tracking-wide mb-1">
                Name
              </span>
              <input
                className="input"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label className="block mb-4">
              <span className="block text-xs text-muted uppercase tracking-wide mb-1">
                Details
              </span>
              <textarea
                className="input min-h-[140px]"
                placeholder={
                  draft.category === "monster"
                    ? "Stat block, traits, actions..."
                    : draft.category === "shopGood"
                    ? "Price, effect, flavor..."
                    : "Description, hook, notable NPCs..."
                }
                value={draft.details}
                onChange={(e) => setDraft({ ...draft, details: e.target.value })}
              />
            </label>
            <button
              onClick={handleSave}
              className="w-full px-5 py-2.5 bg-crimson hover:bg-crimsonBright transition-colors rounded-sm font-display tracking-wide text-white"
            >
              Save Entry
            </button>
          </Panel>
        </div>

        <div className="lg:col-span-2">
          <div className="flex gap-2 mb-4">
            <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </FilterBtn>
            {CATEGORIES.map((c) => (
              <FilterBtn
                key={c.key}
                active={filter === c.key}
                onClick={() => setFilter(c.key)}
              >
                {c.label}
              </FilterBtn>
            ))}
          </div>

          {loading && <p className="text-muted text-sm">Loading…</p>}
          {!loading && visible.length === 0 && (
            <p className="text-muted text-sm">Nothing here yet — add an entry to get started.</p>
          )}

          <div className="space-y-4">
            {visible.map((entry) => (
              <Panel
                key={entry.id}
                eyebrow={CATEGORIES.find((c) => c.key === entry.category)?.label}
                title={entry.name}
                right={
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-muted hover:text-crimsonBright text-xs"
                  >
                    Delete
                  </button>
                }
              >
                <p className="text-sm text-parchment/90 whitespace-pre-wrap">
                  {entry.details}
                </p>
              </Panel>
            ))}
          </div>
        </div>
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

function FilterBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-sm text-xs font-display tracking-wide border ${
        active
          ? "bg-crimson border-crimson text-white"
          : "bg-panel2 border-line text-muted hover:text-parchment"
      }`}
    >
      {children}
    </button>
  );
}
