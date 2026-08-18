import { useEffect, useState } from "react";
import Panel from "@/components/Panel";
import { listItems, addItem, removeItem } from "@/lib/storage";

const BLANK_CHARACTER = {
  name: "",
  charClass: "",
  level: 1,
  race: "",
  background: "",
  hp: 10,
  maxHp: 10,
  ac: 10,
  speed: 30,
  stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  gear: "",
  notes: "",
};

function mod(score) {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

export default function CharacterSheetPage() {
  const [characters, setCharacters] = useState([]);
  const [draft, setDraft] = useState(BLANK_CHARACTER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listItems("characters").then((items) => {
      setCharacters(items);
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    if (!draft.name.trim()) return;
    const saved = await addItem("characters", draft);
    setCharacters((prev) => [...prev, saved]);
    setDraft(BLANK_CHARACTER);
  }

  async function handleDelete(id) {
    await removeItem("characters", id);
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  }

  function updateStat(key, value) {
    setDraft((d) => ({ ...d, stats: { ...d.stats, [key]: Number(value) } }));
  }

  return (
    <div>
      <div className="mb-8">
        <div className="section-rule mb-4" />
        <h1 className="font-display text-3xl mb-2">Character Sheet</h1>
        <p className="text-muted max-w-2xl">
          Fill in your character below and save it — saved sheets sync to
          Firebase once configured, or stay in this browser otherwise.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Identity" eyebrow="Basics">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name">
                <input
                  className="input"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </Field>
              <Field label="Class">
                <input
                  className="input"
                  value={draft.charClass}
                  onChange={(e) => setDraft({ ...draft, charClass: e.target.value })}
                />
              </Field>
              <Field label="Race">
                <input
                  className="input"
                  value={draft.race}
                  onChange={(e) => setDraft({ ...draft, race: e.target.value })}
                />
              </Field>
              <Field label="Background">
                <input
                  className="input"
                  value={draft.background}
                  onChange={(e) => setDraft({ ...draft, background: e.target.value })}
                />
              </Field>
              <Field label="Level">
                <input
                  type="number"
                  className="input"
                  value={draft.level}
                  onChange={(e) => setDraft({ ...draft, level: Number(e.target.value) })}
                />
              </Field>
            </div>
          </Panel>

          <Panel title="Combat" eyebrow="Vitals">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="HP">
                <input
                  type="number"
                  className="input"
                  value={draft.hp}
                  onChange={(e) => setDraft({ ...draft, hp: Number(e.target.value) })}
                />
              </Field>
              <Field label="Max HP">
                <input
                  type="number"
                  className="input"
                  value={draft.maxHp}
                  onChange={(e) => setDraft({ ...draft, maxHp: Number(e.target.value) })}
                />
              </Field>
              <Field label="AC">
                <input
                  type="number"
                  className="input"
                  value={draft.ac}
                  onChange={(e) => setDraft({ ...draft, ac: Number(e.target.value) })}
                />
              </Field>
              <Field label="Speed">
                <input
                  type="number"
                  className="input"
                  value={draft.speed}
                  onChange={(e) => setDraft({ ...draft, speed: Number(e.target.value) })}
                />
              </Field>
            </div>
          </Panel>

          <Panel title="Ability Scores" eyebrow="Stats">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {Object.entries(draft.stats).map(([key, value]) => (
                <div key={key} className="bg-panel2 border border-line rounded-sm p-3 text-center">
                  <div className="text-xs text-muted uppercase mb-1">{key}</div>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => updateStat(key, e.target.value)}
                    className="w-full bg-transparent text-center font-display text-lg focus:outline-none"
                  />
                  <div className="text-xs text-gold">{mod(value)}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Gear & Notes">
            <Field label="Gear">
              <textarea
                className="input min-h-[80px]"
                value={draft.gear}
                onChange={(e) => setDraft({ ...draft, gear: e.target.value })}
              />
            </Field>
            <div className="h-4" />
            <Field label="Notes">
              <textarea
                className="input min-h-[80px]"
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              />
            </Field>
          </Panel>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-crimson hover:bg-crimsonBright transition-colors rounded-sm font-display tracking-wide text-white"
          >
            Save Character
          </button>
        </div>

        <div>
          <Panel title="Saved Characters" eyebrow={loading ? "Loading…" : `${characters.length} total`}>
            {characters.length === 0 && !loading && (
              <p className="text-muted text-sm">No characters saved yet.</p>
            )}
            <div className="space-y-3">
              {characters.map((c) => (
                <div
                  key={c.id}
                  className="border border-line rounded-sm p-3 flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="font-display text-sm">{c.name || "Unnamed"}</div>
                    <div className="text-xs text-muted">
                      Lvl {c.level} {c.race} {c.charClass}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-muted hover:text-crimsonBright text-xs"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </Panel>
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

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs text-muted uppercase tracking-wide mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}
