import { useMemo, useState } from "react";
import Panel from "@/components/Panel";
import { MONSTERS, ENVIRONMENTS } from "@/lib/data/monsters";
import { CR_TIERS } from "@/lib/data/monsterGenTables";
import { generateRandomMonster } from "@/lib/data/monsterGenerator";
import { addItem } from "@/lib/storage";
import { useT } from "@/lib/i18n/useT";

export default function MonstersPage() {
  const { t } = useT();
  const [mode, setMode] = useState("browse"); // browse | generate
  const [query, setQuery] = useState("");
  const [env, setEnv] = useState("All");
  const [selected, setSelected] = useState(null);

  const [tierKey, setTierKey] = useState("trivial");
  const [generated, setGenerated] = useState(null);
  const [savedMsg, setSavedMsg] = useState(false);

  const filtered = useMemo(() => {
    return MONSTERS.filter((m) => {
      const matchesQuery = m.name.toLowerCase().includes(query.toLowerCase());
      const matchesEnv = env === "All" || m.environment.includes(env);
      return matchesQuery && matchesEnv;
    });
  }, [query, env]);

  function handleGenerate() {
    setGenerated(generateRandomMonster(tierKey));
    setSavedMsg(false);
  }

  function updateGenerated(patch) {
    setGenerated((g) => ({ ...g, ...patch }));
    setSavedMsg(false);
  }

  function updateGeneratedStat(key, value) {
    setGenerated((g) => ({ ...g, stats: { ...g.stats, [key]: value } }));
    setSavedMsg(false);
  }

  async function handleSaveToHomebrew() {
    if (!generated) return;
    await addItem("homebrew", {
      category: "monster",
      name: generated.name,
      fields: {
        cr: generated.cr,
        type: generated.type,
        size: generated.size,
        ac: generated.ac,
        hp: generated.hp,
        speed: generated.speed,
        str: generated.stats.str,
        dex: generated.stats.dex,
        con: generated.stats.con,
        int: generated.stats.int,
        wis: generated.stats.wis,
        cha: generated.stats.cha,
        traits: generated.traits.join(", "),
        actions: generated.actions.join("; "),
      },
    });
    setSavedMsg(true);
  }

  return (
    <div>
      <div className="mb-8">
        <div className="section-rule mb-4" />
        <h1 className="font-display text-3xl mb-2">{t("monsters.heading")}</h1>
        <p className="text-muted max-w-2xl">{t("monsters.subheading")}</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("browse")}
          className={`px-4 py-2 rounded-sm font-display text-sm tracking-wide border transition-colors ${
            mode === "browse"
              ? "bg-crimson border-crimson text-white"
              : "bg-panel2 border-line text-muted hover:text-parchment"
          }`}
        >
          {t("monsters.browseTab")}
        </button>
        <button
          onClick={() => setMode("generate")}
          className={`px-4 py-2 rounded-sm font-display text-sm tracking-wide border transition-colors ${
            mode === "generate"
              ? "bg-crimson border-crimson text-white"
              : "bg-panel2 border-line text-muted hover:text-parchment"
          }`}
        >
          {t("monsters.generateTab")}
        </button>
      </div>

      {mode === "browse" && (
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("monsters.searchPlaceholder")}
            className="flex-1 min-w-[220px] bg-panel border border-line rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-crimson"
          />
          <select
            value={env}
            onChange={(e) => setEnv(e.target.value)}
            className="bg-panel border border-line rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-crimson"
          >
            <option value="All">{t("monsters.all")}</option>
            {ENVIRONMENTS.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </div>
      )}

      {mode === "generate" && (
        <Panel title={t("monsters.generateTab")} eyebrow={t("monsters.chooseTier")} className="mb-6">
          <div className="flex flex-wrap gap-3 mb-5">
            {Object.keys(CR_TIERS).map((key) => (
              <button
                key={key}
                onClick={() => setTierKey(key)}
                className={`px-4 py-2 rounded-sm font-display text-sm tracking-wide border transition-colors ${
                  tierKey === key
                    ? "bg-crimson border-crimson text-white"
                    : "bg-panel2 border-line text-muted hover:text-parchment hover:border-crimson"
                }`}
              >
                {t(`monsters.tiers.${key}`)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-crimson hover:bg-crimsonBright transition-colors rounded-sm font-display tracking-wide text-white"
            >
              {generated ? t("monsters.regenerate") : t("monsters.generateButton")}
            </button>
            {generated && (
              <button
                onClick={handleSaveToHomebrew}
                className="px-5 py-2.5 border border-line hover:border-crimson transition-colors rounded-sm font-display tracking-wide text-parchment"
              >
                {t("monsters.saveToHomebrew")}
              </button>
            )}
            {savedMsg && (
              <span className="text-sm text-gold">{t("monsters.savedConfirm")}</span>
            )}
          </div>
        </Panel>
      )}

      {mode === "browse" ? (
        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-1 flex flex-col gap-2">
            {filtered.length === 0 && (
              <p className="text-muted text-sm">{t("monsters.noMatches")}</p>
            )}
            {filtered.map((m) => (
              <button
                key={m.name}
                onClick={() => setSelected(m)}
                className={`text-left px-4 py-3 rounded-sm border transition-colors ${
                  selected?.name === m.name
                    ? "bg-panel2 border-crimson"
                    : "bg-panel border-line hover:border-crimson"
                }`}
              >
                <div className="font-display text-sm">{m.name}</div>
                <div className="text-xs text-muted">
                  CR {m.cr} · {m.type}
                </div>
              </button>
            ))}
          </div>

          <div className="md:col-span-2">
            {selected ? (
              <Panel eyebrow={`CR ${selected.cr} · ${selected.type}`} title={selected.name}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-sm">
                  <Stat label={t("monsters.ac")} value={selected.ac} />
                  <Stat label={t("monsters.hp")} value={selected.hp} />
                  <Stat label={t("monsters.speed")} value={selected.speed} />
                  <Stat label={t("monsters.size")} value={selected.size} />
                  <Stat label={t("monsters.environment")} value={selected.environment.join(", ")} />
                </div>

                <div className="grid grid-cols-6 gap-2 mb-5 text-center">
                  {Object.entries(selected.stats).map(([k, v]) => (
                    <div key={k} className="bg-panel2 border border-line rounded-sm py-2">
                      <div className="text-xs text-muted uppercase">{k}</div>
                      <div className="font-display">{v}</div>
                    </div>
                  ))}
                </div>

                {selected.traits.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-display text-sm text-crimsonBright mb-2">
                      {t("monsters.traits")}
                    </h4>
                    <ul className="text-sm space-y-1 text-parchment/90">
                      {selected.traits.map((tr, i) => (
                        <li key={i}>{tr}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-display text-sm text-crimsonBright mb-2">
                    {t("monsters.actions")}
                  </h4>
                  <ul className="text-sm space-y-1 text-parchment/90">
                    {selected.actions.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              </Panel>
            ) : (
              <Panel title={t("monsters.selectPrompt")}>
                <p className="text-muted text-sm">{t("monsters.selectPromptBody")}</p>
              </Panel>
            )}
          </div>
        </div>
      ) : generated ? (
        <GeneratedMonsterForm
          t={t}
          monster={generated}
          onChange={updateGenerated}
          onChangeStat={updateGeneratedStat}
        />
      ) : (
        <Panel title={t("monsters.generatePrompt")}>
          <p className="text-muted text-sm">{t("monsters.generatePromptBody")}</p>
        </Panel>
      )}
    </div>
  );
}

function GeneratedMonsterForm({ t, monster, onChange, onChangeStat }) {
  return (
    <Panel eyebrow={t("monsters.editHeading")} title={monster.name}>
      <p className="text-xs text-muted mb-4">{t("monsters.editHint")}</p>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <FormField label={t("monsters.name")}>
          <input
            className="input"
            value={monster.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </FormField>
        <FormField label={t("monsters.type")}>
          <input
            className="input"
            value={monster.type}
            onChange={(e) => onChange({ type: e.target.value })}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <FormField label={t("monsters.cr")}>
          <input className="input" value={monster.cr} onChange={(e) => onChange({ cr: e.target.value })} />
        </FormField>
        <FormField label={t("monsters.size")}>
          <input className="input" value={monster.size} onChange={(e) => onChange({ size: e.target.value })} />
        </FormField>
        <FormField label={t("monsters.ac")}>
          <input
            type="number"
            className="input"
            value={monster.ac}
            onChange={(e) => onChange({ ac: Number(e.target.value) || 0 })}
          />
        </FormField>
        <FormField label={t("monsters.hp")}>
          <input
            type="number"
            className="input"
            value={monster.hp}
            onChange={(e) => onChange({ hp: Number(e.target.value) || 0 })}
          />
        </FormField>
      </div>

      <FormField label={t("monsters.speed")} className="mb-5">
        <input className="input" value={monster.speed} onChange={(e) => onChange({ speed: e.target.value })} />
      </FormField>

      <div className="grid grid-cols-6 gap-2 mb-5 text-center">
        {Object.entries(monster.stats).map(([k, v]) => (
          <div key={k}>
            <div className="text-xs text-muted uppercase mb-1">{k}</div>
            <input
              type="number"
              className="input text-center"
              value={v}
              onChange={(e) => onChangeStat(k, Number(e.target.value) || 0)}
            />
          </div>
        ))}
      </div>

      <FormField label={`${t("monsters.traits")} — ${t("monsters.traitsHint")}`} className="mb-5">
        <textarea
          className="input"
          rows={3}
          value={monster.traits.join("\n")}
          onChange={(e) => onChange({ traits: e.target.value.split("\n").filter((l) => l.trim()) })}
        />
      </FormField>

      <FormField label={`${t("monsters.actions")} — ${t("monsters.actionsHint")}`}>
        <textarea
          className="input"
          rows={4}
          value={monster.actions.join("\n")}
          onChange={(e) => onChange({ actions: e.target.value.split("\n").filter((l) => l.trim()) })}
        />
      </FormField>

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

function FormField({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs text-muted uppercase tracking-wide mb-1">{label}</span>
      {children}
    </label>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-xs text-muted uppercase tracking-wide">{label}</div>
      <div className="text-parchment">{value}</div>
    </div>
  );
}
