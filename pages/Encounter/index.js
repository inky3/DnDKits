import { useEffect, useState } from "react";
import Panel from "@/components/Panel";
import { MONSTERS } from "@/lib/data/monsters";
import { listItems } from "@/lib/storage";
import { useT } from "@/lib/i18n/useT";

function dexMod(dex) {
  const n = Number(dex);
  if (Number.isNaN(n)) return 0;
  return Math.floor((n - 10) / 2);
}

function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

function newId() {
  return `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const BLANK_MANUAL = { name: "", isPlayer: true, mod: 0, hp: 10, maxHp: 10, ac: 10 };

export default function EncounterPage() {
  const { t } = useT();
  const [combatants, setCombatants] = useState([]);
  const [round, setRound] = useState(1);
  const [turnIndex, setTurnIndex] = useState(0);
  const [manual, setManual] = useState(BLANK_MANUAL);

  const [homebrewMonsters, setHomebrewMonsters] = useState([]);
  const [pickSource, setPickSource] = useState("bestiary"); // bestiary | homebrew
  const [pickName, setPickName] = useState("");

  useEffect(() => {
    listItems("homebrew").then((items) => {
      setHomebrewMonsters(items.filter((e) => e.category === "monster"));
    });
  }, []);

  const sorted = [...combatants].sort((a, b) => (b.initiative ?? -999) - (a.initiative ?? -999));

  function addCombatant(entry) {
    setCombatants((prev) => [...prev, { id: newId(), ...entry }]);
  }

  function handleAddManual() {
    if (!manual.name.trim()) return;
    addCombatant({
      name: manual.name,
      isPlayer: manual.isPlayer,
      mod: Number(manual.mod),
      hp: Number(manual.hp),
      maxHp: Number(manual.maxHp),
      ac: Number(manual.ac),
      initiative: null,
    });
    setManual(BLANK_MANUAL);
  }

  function handleAddFromPicker() {
    if (!pickName) return;
    if (pickSource === "bestiary") {
      const m = MONSTERS.find((mm) => mm.name === pickName);
      if (!m) return;
      addCombatant({
        name: m.name,
        isPlayer: false,
        mod: dexMod(m.stats.dex),
        hp: m.hp,
        maxHp: m.hp,
        ac: m.ac,
        initiative: null,
      });
    } else {
      const m = homebrewMonsters.find((mm) => mm.name === pickName);
      if (!m) return;
      addCombatant({
        name: m.name,
        isPlayer: false,
        mod: dexMod(m.fields?.dex),
        hp: Number(m.fields?.hp) || 10,
        maxHp: Number(m.fields?.hp) || 10,
        ac: Number(m.fields?.ac) || 10,
        initiative: null,
      });
    }
    setPickName("");
  }

  function rollOne(id) {
    setCombatants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, initiative: rollD20() + (c.mod || 0) } : c))
    );
  }

  function rollAll() {
    setCombatants((prev) => prev.map((c) => ({ ...c, initiative: rollD20() + (c.mod || 0) })));
    setRound(1);
    setTurnIndex(0);
  }

  function adjustHp(id, delta) {
    setCombatants((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, hp: Math.max(0, Math.min(c.maxHp, c.hp + delta)) } : c
      )
    );
  }

  function removeCombatant(id) {
    setCombatants((prev) => prev.filter((c) => c.id !== id));
  }

  function nextTurn() {
    if (sorted.length === 0) return;
    setTurnIndex((i) => {
      const next = i + 1;
      if (next >= sorted.length) {
        setRound((r) => r + 1);
        return 0;
      }
      return next;
    });
  }

  function resetEncounter() {
    setCombatants([]);
    setRound(1);
    setTurnIndex(0);
  }

  return (
    <div>
      <div className="mb-8">
        <div className="section-rule mb-4" />
        <h1 className="font-display text-3xl mb-2">{t("encounter.heading")}</h1>
        <p className="text-muted max-w-2xl">{t("encounter.subheading")}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Panel title={t("encounter.addManual")} eyebrow={t("encounter.addCombatant")}>
            <label className="block mb-3">
              <span className="block text-xs text-muted uppercase tracking-wide mb-1">
                {t("encounter.name")}
              </span>
              <input
                className="input"
                value={manual.name}
                onChange={(e) => setManual({ ...manual, name: e.target.value })}
              />
            </label>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setManual({ ...manual, isPlayer: true })}
                className={`flex-1 px-3 py-1.5 rounded-sm text-xs font-display border ${
                  manual.isPlayer
                    ? "bg-crimson border-crimson text-white"
                    : "bg-panel2 border-line text-muted"
                }`}
              >
                {t("encounter.player")}
              </button>
              <button
                onClick={() => setManual({ ...manual, isPlayer: false })}
                className={`flex-1 px-3 py-1.5 rounded-sm text-xs font-display border ${
                  !manual.isPlayer
                    ? "bg-crimson border-crimson text-white"
                    : "bg-panel2 border-line text-muted"
                }`}
              >
                {t("encounter.monster")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Field label={t("encounter.initMod")}>
                <input
                  type="number"
                  className="input"
                  value={manual.mod}
                  onChange={(e) => setManual({ ...manual, mod: e.target.value })}
                />
              </Field>
              <Field label={t("encounter.ac")}>
                <input
                  type="number"
                  className="input"
                  value={manual.ac}
                  onChange={(e) => setManual({ ...manual, ac: e.target.value })}
                />
              </Field>
              <Field label={t("encounter.hp")}>
                <input
                  type="number"
                  className="input"
                  value={manual.hp}
                  onChange={(e) => setManual({ ...manual, hp: e.target.value, maxHp: e.target.value })}
                />
              </Field>
            </div>
            <button
              onClick={handleAddManual}
              className="w-full px-4 py-2 bg-crimson hover:bg-crimsonBright transition-colors rounded-sm font-display text-sm text-white"
            >
              {t("encounter.addCombatant")}
            </button>
          </Panel>

          <Panel title={t("encounter.addFromList")} eyebrow={t("encounter.quickAdd")}>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => { setPickSource("bestiary"); setPickName(""); }}
                className={`flex-1 px-3 py-1.5 rounded-sm text-xs font-display border ${
                  pickSource === "bestiary"
                    ? "bg-crimson border-crimson text-white"
                    : "bg-panel2 border-line text-muted"
                }`}
              >
                {t("nav.monsters")}
              </button>
              <button
                onClick={() => { setPickSource("homebrew"); setPickName(""); }}
                className={`flex-1 px-3 py-1.5 rounded-sm text-xs font-display border ${
                  pickSource === "homebrew"
                    ? "bg-crimson border-crimson text-white"
                    : "bg-panel2 border-line text-muted"
                }`}
              >
                {t("nav.homebrew")}
              </button>
            </div>
            <select
              className="input mb-3"
              value={pickName}
              onChange={(e) => setPickName(e.target.value)}
            >
              <option value="">{t("encounter.choose")}</option>
              {(pickSource === "bestiary" ? MONSTERS : homebrewMonsters).map((m) => (
                <option key={m.id || m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
            {pickSource === "homebrew" && homebrewMonsters.length === 0 && (
              <p className="text-xs text-muted mb-3">{t("encounter.noHomebrewMonsters")}</p>
            )}
            <button
              onClick={handleAddFromPicker}
              disabled={!pickName}
              className="w-full px-4 py-2 border border-line hover:border-crimson transition-colors rounded-sm font-display text-sm text-parchment disabled:opacity-40"
            >
              {t("encounter.addCombatant")}
            </button>
          </Panel>
        </div>

        <div className="lg:col-span-2">
          <Panel
            title={t("encounter.turnOrder")}
            eyebrow={t("encounter.round", { round })}
            right={
              <div className="flex gap-2">
                <button
                  onClick={rollAll}
                  className="px-3 py-1.5 rounded-sm text-xs font-display border border-line hover:border-crimson text-parchment"
                >
                  {t("encounter.rollAll")}
                </button>
                <button
                  onClick={nextTurn}
                  className="px-3 py-1.5 rounded-sm text-xs font-display bg-crimson hover:bg-crimsonBright text-white"
                >
                  {t("encounter.nextTurn")}
                </button>
                <button
                  onClick={resetEncounter}
                  className="px-3 py-1.5 rounded-sm text-xs font-display text-muted hover:text-crimsonBright"
                >
                  {t("encounter.reset")}
                </button>
              </div>
            }
          >
            {sorted.length === 0 && (
              <p className="text-muted text-sm">{t("encounter.none")}</p>
            )}
            <div className="space-y-2">
              {sorted.map((c, i) => {
                const isCurrent = i === turnIndex;
                return (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between gap-3 p-3 rounded-sm border ${
                      isCurrent ? "border-crimson bg-panel2" : "border-line"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => rollOne(c.id)}
                        className="w-10 h-10 shrink-0 flex items-center justify-center rounded-sm bg-panel2 border border-line font-display text-sm hover:border-crimson"
                        title={t("encounter.rollInitiative")}
                      >
                        {c.initiative ?? "–"}
                      </button>
                      <div className="min-w-0">
                        <div className="font-display text-sm truncate">
                          {c.name}{" "}
                          <span className="text-xs text-muted font-body">
                            {c.isPlayer ? t("encounter.player") : t("encounter.monster")}
                          </span>
                        </div>
                        <div className="text-xs text-muted">
                          AC {c.ac} · {t("encounter.hp")} {c.hp}/{c.maxHp}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => adjustHp(c.id, -1)}
                        className="w-7 h-7 rounded-sm border border-line hover:border-crimson text-sm"
                      >
                        −
                      </button>
                      <button
                        onClick={() => adjustHp(c.id, 1)}
                        className="w-7 h-7 rounded-sm border border-line hover:border-crimson text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeCombatant(c.id)}
                        className="ml-2 text-muted hover:text-crimsonBright text-xs"
                      >
                        {t("common.delete")}
                      </button>
                    </div>
                  </div>
                );
              })}
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
      <span className="block text-xs text-muted uppercase tracking-wide mb-1">{label}</span>
      {children}
    </label>
  );
}