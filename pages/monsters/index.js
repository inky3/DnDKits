import { useMemo, useState } from "react";
import { MONSTERS, ENVIRONMENTS } from "@/lib/data/monsters";
import CreatureSheet from "@/components/CreatureSheet";

function toInstance(monster, index) {
  return {
    ...monster,
    id: `${monster.name}-${Date.now()}-${index}`,
    baseName: monster.name,
    maxHp: monster.hp,
    hp: monster.hp,
    conditions: [],
    notes: "",
  };
}

function subtitleFor(m) {
  return `${m.size} ${m.type}${m.alignment ? `, ${m.alignment}` : ""}`;
}

export default function MonstersPage() {
  const [query, setQuery] = useState("");
  const [env, setEnv] = useState("All");
  const [tracked, setTracked] = useState([]);
  // selection is either { kind: "preview", name } for a read-only bestiary
  // look-up, or { kind: "tracked", id } for a live roster entry.
  const [selection, setSelection] = useState(null);

  const filtered = useMemo(() => {
    return MONSTERS.filter((m) => {
      const matchesQuery = m.name.toLowerCase().includes(query.toLowerCase());
      const matchesEnv = env === "All" || m.environment.includes(env);
      return matchesQuery && matchesEnv;
    });
  }, [query, env]);

  // Counts per base name so repeated adds read as "Giant Frog #1", "#2"...
  const countsByName = tracked.reduce((acc, t) => {
    acc[t.baseName] = (acc[t.baseName] || 0) + 1;
    return acc;
  }, {});
  const seen = {};
  const labeled = tracked.map((t) => {
    seen[t.baseName] = (seen[t.baseName] || 0) + 1;
    return {
      ...t,
      displayName:
        countsByName[t.baseName] > 1 ? `${t.baseName} #${seen[t.baseName]}` : t.baseName,
    };
  });

  function addToTracker(monster) {
    const instance = toInstance(monster, tracked.length);
    setTracked((list) => [...list, instance]);
    setSelection({ kind: "tracked", id: instance.id });
    return instance;
  }

  function updateTracked(id, patch) {
    setTracked((list) => list.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function removeTracked(id) {
    setTracked((list) => list.filter((t) => t.id !== id));
    if (selection?.kind === "tracked" && selection.id === id) setSelection(null);
  }

  let sheetProps = null;
  if (selection?.kind === "preview") {
    const base = MONSTERS.find((m) => m.name === selection.name);
    if (base) {
      sheetProps = {
        creature: { ...base, subtitle: subtitleFor(base) },
        readOnly: true,
        onClose: () => setSelection(null),
        extra: (
          <>
            {base.traits?.length > 0 && (
              <div className="mb-5">
                <h4 className="font-display text-sm text-crimsonBright mb-2">Traits</h4>
                <ul className="text-sm space-y-1 text-parchment/90">
                  {base.traits.map((tr, i) => (
                    <li key={i}>{tr}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mb-5">
              <h4 className="font-display text-sm text-crimsonBright mb-2">Actions</h4>
              <ul className="text-sm space-y-1 text-parchment/90">
                {base.actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => addToTracker(base)}
              className="w-full px-4 py-2 rounded-sm bg-crimson hover:bg-crimsonBright transition-colors text-sm font-display tracking-wide text-white"
            >
              + Track This Monster
            </button>
          </>
        ),
      };
    }
  } else if (selection?.kind === "tracked") {
    const t = tracked.find((x) => x.id === selection.id);
    const displayName = labeled.find((x) => x.id === selection.id)?.displayName;
    if (t) {
      sheetProps = {
        creature: {
          ...t,
          name: displayName || t.name,
          subtitle: subtitleFor(t),
          eyebrow: `CR ${t.cr} · ${t.type}`,
        },
        readOnly: false,
        onClose: () => setSelection(null),
        onDelete: () => removeTracked(t.id),
        onUpdate: (patch) => updateTracked(t.id, patch),
        extra: (
          <>
            {t.traits?.length > 0 && (
              <div className="mb-5">
                <h4 className="font-display text-sm text-crimsonBright mb-2">Traits</h4>
                <ul className="text-sm space-y-1 text-parchment/90">
                  {t.traits.map((tr, i) => (
                    <li key={i}>{tr}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mb-5">
              <h4 className="font-display text-sm text-crimsonBright mb-2">Actions</h4>
              <ul className="text-sm space-y-1 text-parchment/90">
                {t.actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </>
        ),
      };
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="section-rule mb-4" />
        <h1 className="font-display text-3xl mb-2">Monster Browser</h1>
        <p className="text-muted max-w-2xl">
          Click a monster for its full stat block. Track it to run a live,
          editable copy — HP, AC, and conditions — separate from the
          reference entry, and add as many copies as you need.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search monsters..."
          className="flex-1 min-w-[220px] bg-panel border border-line rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-crimson"
        />
        <select
          value={env}
          onChange={(e) => setEnv(e.target.value)}
          className="bg-panel border border-line rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-crimson"
        >
          <option>All</option>
          {ENVIRONMENTS.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
        <button
          onClick={() => {
            if (filtered.length === 0) return;
            const pick = filtered[Math.floor(Math.random() * filtered.length)];
            setSelection({ kind: "preview", name: pick.name });
          }}
          disabled={filtered.length === 0}
          title="Pick a random monster from the current search/filter"
          className="px-4 py-2.5 rounded-sm bg-crimson hover:bg-crimsonBright disabled:opacity-40 disabled:hover:bg-crimson transition-colors text-sm font-display tracking-wide text-white whitespace-nowrap"
        >
          🎲 Random Monster
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            {filtered.length === 0 && (
              <p className="text-muted text-sm">No monsters match that search.</p>
            )}
            {filtered.map((m) => (
              <div
                key={m.name}
                onClick={() => setSelection({ kind: "preview", name: m.name })}
                className={`flex items-center gap-2 px-4 py-3 rounded-sm border cursor-pointer transition-colors ${
                  selection?.kind === "preview" && selection.name === m.name
                    ? "bg-panel2 border-crimson"
                    : "bg-panel border-line hover:border-crimson"
                }`}
              >
                <div className="flex-1">
                  <div className="font-display text-sm">{m.name}</div>
                  <div className="text-xs text-muted">
                    CR {m.cr} · {m.type}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToTracker(m);
                  }}
                  title="Quick-add to tracker"
                  className="w-8 h-8 shrink-0 flex items-center justify-center rounded-sm border border-line hover:border-crimson hover:text-crimsonBright transition-colors text-lg leading-none"
                >
                  +
                </button>
              </div>
            ))}
          </div>

          {tracked.length > 0 && (
            <div>
              <h4 className="font-display text-sm text-crimsonBright mb-2 px-1">
                Tracked
              </h4>
              <div className="flex flex-col gap-2">
                {labeled.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelection({ kind: "tracked", id: t.id })}
                    className={`flex items-center gap-2 px-4 py-3 rounded-sm border cursor-pointer transition-colors ${
                      selection?.kind === "tracked" && selection.id === t.id
                        ? "bg-panel2 border-crimson"
                        : "bg-panel border-line hover:border-crimson"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-display text-sm flex items-center gap-2">
                        {t.displayName}
                        {t.hp <= 0 && (
                          <span className="text-xs text-crimsonBright">Down</span>
                        )}
                      </div>
                      <div className="text-xs text-muted">
                        HP {t.hp}/{t.maxHp} · AC {t.ac}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTracked(t.id);
                      }}
                      title="Remove"
                      className="w-7 h-7 shrink-0 flex items-center justify-center rounded-sm border border-line text-muted hover:border-crimson hover:text-crimsonBright transition-colors text-sm"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          {sheetProps ? (
            <CreatureSheet {...sheetProps} />
          ) : (
            <div className="hidden md:block bg-panel border border-line rounded-sm shadow-card p-5">
              <h3 className="font-display text-xl text-parchment mb-2">
                No monster selected
              </h3>
              <p className="text-muted text-sm">
                Click a monster from the list to see its full stat block.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
