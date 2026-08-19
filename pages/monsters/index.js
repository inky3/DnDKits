import { useMemo, useState } from "react";
import Panel from "@/components/Panel";
import { MONSTERS, ENVIRONMENTS } from "@/lib/data/monsters";
import { useT } from "@/lib/i18n/useT";

export default function MonstersPage() {
  const { t } = useT();
  const [query, setQuery] = useState("");
  const [env, setEnv] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return MONSTERS.filter((m) => {
      const matchesQuery = m.name.toLowerCase().includes(query.toLowerCase());
      const matchesEnv = env === "All" || m.environment.includes(env);
      return matchesQuery && matchesEnv;
    });
  }, [query, env]);

  return (
    <div>
      <div className="mb-8">
        <div className="section-rule mb-4" />
        <h1 className="font-display text-3xl mb-2">{t("monsters.heading")}</h1>
        <p className="text-muted max-w-2xl">{t("monsters.subheading")}</p>
      </div>

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
                    {selected.traits.map((t2, i) => (
                      <li key={i}>{t2}</li>
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
    </div>
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
