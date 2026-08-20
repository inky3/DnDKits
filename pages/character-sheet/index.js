import { useEffect, useState } from "react";
import Panel from "@/components/Panel";
import { listItems, addItem, updateItem, removeItem } from "@/lib/storage";
import { useT } from "@/lib/i18n/useT";
import { DND_CLASSES, DND_CLASS_ORDER } from "@/lib/data/dndClasses";
import { FROSTSCAR_ARCHETYPES, FROSTSCAR_ARCHETYPE_ORDER } from "@/lib/data/frostscarPremades";

function mod(score) {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

function fmtMod(n) {
  return n >= 0 ? `+${n}` : `${n}`;
}

function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

const BLANK_DND = {
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
  savingThrows: [],
  gear: "",
  notes: "",
};

const BLANK_FROSTSCAR = {
  name: "",
  archetype: "",
  hp: 10,
  maxHp: 10,
  stats: { str: 0, dex: 0, wis: 0, int: 0, cha: 0 },
  armor: 10,
  warmth: { current: 30, max: 50 },
  sanity: { current: 30, max: 50 },
  luck: { current: 0, max: 10 },
  gold: 0,
  rations: 0,
  notes: "",
};

export default function CharacterSheetPage() {
  const { t } = useT();
  const [system, setSystem] = useState("dnd"); // dnd | frostscar

  return (
    <div>
      <div className="mb-8">
        <div className="section-rule mb-4" />
        <h1 className="font-display text-3xl mb-2">{t("characterSheet.heading")}</h1>
        <p className="text-muted max-w-2xl">{t("characterSheet.subheading")}</p>
      </div>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setSystem("dnd")}
          className={`px-4 py-2 rounded-sm font-display text-sm tracking-wide border transition-colors ${
            system === "dnd"
              ? "bg-crimson border-crimson text-white"
              : "bg-panel2 border-line text-muted hover:text-parchment"
          }`}
        >
          {t("characterSheet.systemDnd")}
        </button>
        <button
          onClick={() => setSystem("frostscar")}
          className={`px-4 py-2 rounded-sm font-display text-sm tracking-wide border transition-colors ${
            system === "frostscar"
              ? "bg-crimson border-crimson text-white"
              : "bg-panel2 border-line text-muted hover:text-parchment"
          }`}
        >
          {t("characterSheet.systemFrostscar")}
        </button>
      </div>

      {system === "dnd" ? <DndSheet t={t} /> : <FrostscarSheet t={t} />}
    </div>
  );
}

// ---------- Roll button + inline result ----------
function RollButton({ label, value, onRoll }) {
  const [result, setResult] = useState(null);

  function handleClick() {
    const die = rollD20();
    const total = die + value;
    setResult({ die, total });
    onRoll?.({ label, die, mod: value, total });
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleClick}
        title={`${label}: d20 ${fmtMod(value)}`}
        className="w-7 h-7 shrink-0 flex items-center justify-center rounded-sm border border-line hover:border-crimson hover:text-crimsonBright transition-colors text-xs"
      >
        🎲
      </button>
      {result && (
        <span className="text-xs text-gold font-display whitespace-nowrap">
          {result.total}
        </span>
      )}
    </div>
  );
}

function RollLog({ t, log }) {
  if (log.length === 0) return null;
  return (
    <div className="mt-5">
      <h4 className="font-display text-sm text-crimsonBright mb-2">{t("characterSheet.rollLog")}</h4>
      <ul className="text-xs text-muted space-y-1">
        {log.map((r, i) => (
          <li key={i}>
            {r.label}: d20 ({r.die}) {fmtMod(r.mod)} = <span className="text-gold">{r.total}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- D&D ----------
function DndSheet({ t }) {
  const [draft, setDraft] = useState(BLANK_DND);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [log, setLog] = useState([]);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    listItems("characters").then((items) => {
      setCharacters(items);
      setLoading(false);
    });
  }, []);

  function loadClass(key) {
    const c = DND_CLASSES[key];
    setDraft((d) => ({
      ...d,
      id: undefined,
      charClass: c.label,
      hp: c.hp,
      maxHp: c.hp,
      ac: c.ac,
      speed: c.speed,
      stats: { ...c.stats },
      savingThrows: c.savingThrows,
    }));
    setLog([]);
  }

  function loadCharacter(c) {
    setDraft({ ...BLANK_DND, ...c, stats: { ...BLANK_DND.stats, ...c.stats } });
    setLog([]);
  }

  function startNew() {
    setDraft(BLANK_DND);
    setLog([]);
  }

  function updateStat(key, value) {
    setDraft((d) => ({ ...d, stats: { ...d.stats, [key]: Number(value) } }));
  }

  function toggleSave(key) {
    setDraft((d) => ({
      ...d,
      savingThrows: d.savingThrows.includes(key)
        ? d.savingThrows.filter((k) => k !== key)
        : [...d.savingThrows, key],
    }));
  }

  function addLog(entry) {
    setLog((l) => [entry, ...l].slice(0, 8));
  }

  async function handleSave() {
    if (!draft.name.trim()) return;
    if (draft.id) {
      const { id, ...data } = draft;
      const saved = await updateItem("characters", id, data);
      setCharacters((prev) => prev.map((c) => (c.id === id ? saved : c)));
      setDraft(saved);
    } else {
      const saved = await addItem("characters", draft);
      setCharacters((prev) => [...prev, saved]);
      setDraft(saved);
    }
    setSavedMsg(true);
  }

  async function handleDelete(id) {
    await removeItem("characters", id);
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    if (draft.id === id) startNew();
  }

  const profBonus = 2; // level 1

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Panel title={t("characterSheet.chooseClass")} eyebrow={t("characterSheet.basics")}>
          <div className="flex flex-wrap gap-2">
            {DND_CLASS_ORDER.map((key) => (
              <button
                key={key}
                onClick={() => loadClass(key)}
                className={`px-3 py-1.5 rounded-sm text-xs font-display border transition-colors ${
                  draft.charClass === DND_CLASSES[key].label
                    ? "bg-crimson border-crimson text-white"
                    : "bg-panel2 border-line text-muted hover:text-parchment hover:border-crimson"
                }`}
              >
                {DND_CLASSES[key].label}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title={t("characterSheet.identity")} eyebrow={t("characterSheet.basics")}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t("characterSheet.name")}>
              <input
                className="input"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </Field>
            <Field label={t("characterSheet.class")}>
              <input
                className="input"
                value={draft.charClass}
                onChange={(e) => setDraft({ ...draft, charClass: e.target.value })}
              />
            </Field>
            <Field label={t("characterSheet.race")}>
              <input
                className="input"
                value={draft.race}
                onChange={(e) => setDraft({ ...draft, race: e.target.value })}
              />
            </Field>
            <Field label={t("characterSheet.background")}>
              <input
                className="input"
                value={draft.background}
                onChange={(e) => setDraft({ ...draft, background: e.target.value })}
              />
            </Field>
            <Field label={t("characterSheet.level")}>
              <input
                type="number"
                className="input"
                value={draft.level}
                onChange={(e) => setDraft({ ...draft, level: Number(e.target.value) })}
              />
            </Field>
          </div>
        </Panel>

        <Panel title={t("characterSheet.combat")} eyebrow={t("characterSheet.vitals")}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field label={t("characterSheet.hp")}>
              <input
                type="number"
                className="input"
                value={draft.hp}
                onChange={(e) => setDraft({ ...draft, hp: Number(e.target.value) })}
              />
            </Field>
            <Field label={t("characterSheet.maxHp")}>
              <input
                type="number"
                className="input"
                value={draft.maxHp}
                onChange={(e) => setDraft({ ...draft, maxHp: Number(e.target.value) })}
              />
            </Field>
            <Field label={t("characterSheet.ac")}>
              <input
                type="number"
                className="input"
                value={draft.ac}
                onChange={(e) => setDraft({ ...draft, ac: Number(e.target.value) })}
              />
            </Field>
            <Field label={t("characterSheet.speed")}>
              <input
                type="number"
                className="input"
                value={draft.speed}
                onChange={(e) => setDraft({ ...draft, speed: Number(e.target.value) })}
              />
            </Field>
          </div>
        </Panel>

        <Panel title={t("characterSheet.abilityScores")} eyebrow={t("characterSheet.stats")}>
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
                <div className="text-xs text-gold mb-2">{mod(value)}</div>
                <div className="flex justify-center">
                  <RollButton label={key.toUpperCase()} value={Math.floor((value - 10) / 2)} onRoll={addLog} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title={t("characterSheet.savingThrows")} eyebrow={`+${profBonus} ${t("characterSheet.proficient")}`}>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {Object.entries(draft.stats).map(([key, value]) => {
              const proficient = draft.savingThrows.includes(key);
              const saveMod = Math.floor((value - 10) / 2) + (proficient ? profBonus : 0);
              return (
                <div key={key} className="bg-panel2 border border-line rounded-sm p-3 text-center">
                  <button
                    onClick={() => toggleSave(key)}
                    className={`text-xs uppercase mb-1 font-display ${
                      proficient ? "text-crimsonBright" : "text-muted"
                    }`}
                    title={t("characterSheet.proficient")}
                  >
                    {key}
                  </button>
                  <div className="text-xs text-gold mb-2">{fmtMod(saveMod)}</div>
                  <div className="flex justify-center">
                    <RollButton label={`${key.toUpperCase()} save`} value={saveMod} onRoll={addLog} />
                  </div>
                </div>
              );
            })}
          </div>
          <RollLog t={t} log={log} />
        </Panel>

        <Panel title={t("characterSheet.gearAndNotes")}>
          <Field label={t("characterSheet.gear")}>
            <textarea
              className="input min-h-[80px]"
              value={draft.gear}
              onChange={(e) => setDraft({ ...draft, gear: e.target.value })}
            />
          </Field>
          <div className="h-4" />
          <Field label={t("characterSheet.notes")}>
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
          {t("characterSheet.saveCharacter")}
        </button>
      </div>

      <div>
        <Panel
          title={t("characterSheet.savedCharacters")}
          eyebrow={loading ? t("common.loading") : t("characterSheet.total", { count: characters.length })}
        >
          {characters.length === 0 && !loading && (
            <p className="text-muted text-sm">{t("characterSheet.none")}</p>
          )}
          <div className="space-y-3">
            {characters.map((c) => (
              <div key={c.id} className="border border-line rounded-sm p-3 flex items-start justify-between gap-2">
                <div>
                  <div className="font-display text-sm">{c.name || t("characterSheet.unnamed")}</div>
                  <div className="text-xs text-muted">
                    {t("characterSheet.levelLine", { level: c.level, race: c.race, class: c.charClass })}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-muted hover:text-crimsonBright text-xs"
                >
                  {t("common.delete")}
                </button>
              </div>
            ))}
          </div>
        </Panel>
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

// ---------- Frostscar ----------
function FrostscarSheet({ t }) {
  const [draft, setDraft] = useState(BLANK_FROSTSCAR);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [log, setLog] = useState([]);

  useEffect(() => {
    listItems("frostscarCharacters").then((items) => {
      setCharacters(items);
      setLoading(false);
    });
  }, []);

  function loadArchetype(key) {
    const a = FROSTSCAR_ARCHETYPES[key];
    setDraft((d) => ({
      ...d,
      archetype: a.label,
      hp: a.hp,
      maxHp: a.hp,
      stats: { ...a.stats },
      armor: a.armor,
      warmth: { ...a.warmth },
      sanity: { ...a.sanity },
      luck: { ...a.luck },
      gold: a.gold,
      rations: a.rations,
    }));
    setLog([]);
  }

  function updateStat(key, value) {
    setDraft((d) => ({ ...d, stats: { ...d.stats, [key]: Number(value) } }));
  }

  function updateGauge(field, part, value) {
    setDraft((d) => ({ ...d, [field]: { ...d[field], [part]: Number(value) } }));
  }

  function addLog(entry) {
    setLog((l) => [entry, ...l].slice(0, 8));
  }

  async function handleSave() {
    if (!draft.name.trim()) return;
    const saved = await addItem("frostscarCharacters", draft);
    setCharacters((prev) => [...prev, saved]);
    setDraft(BLANK_FROSTSCAR);
    setLog([]);
  }

  async function handleDelete(id) {
    await removeItem("frostscarCharacters", id);
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Panel title={t("characterSheet.chooseArchetype")} eyebrow={t("characterSheet.basics")}>
          <div className="flex flex-wrap gap-2">
            {FROSTSCAR_ARCHETYPE_ORDER.map((key) => (
              <button
                key={key}
                onClick={() => loadArchetype(key)}
                className={`px-3 py-1.5 rounded-sm text-xs font-display border transition-colors ${
                  draft.archetype === FROSTSCAR_ARCHETYPES[key].label
                    ? "bg-crimson border-crimson text-white"
                    : "bg-panel2 border-line text-muted hover:text-parchment hover:border-crimson"
                }`}
              >
                {FROSTSCAR_ARCHETYPES[key].label}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title={t("characterSheet.identity")} eyebrow={t("characterSheet.basics")}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t("characterSheet.name")}>
              <input
                className="input"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </Field>
            <Field label={t("characterSheet.chooseArchetype")}>
              <input
                className="input"
                value={draft.archetype}
                onChange={(e) => setDraft({ ...draft, archetype: e.target.value })}
              />
            </Field>
          </div>
        </Panel>

        <Panel title={t("characterSheet.combat")} eyebrow={t("characterSheet.vitals")}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <Field label={t("characterSheet.hp")}>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="input"
                  value={draft.hp}
                  onChange={(e) => setDraft({ ...draft, hp: Number(e.target.value) })}
                />
                <RollButton label="HP" value={draft.hp} onRoll={addLog} />
              </div>
            </Field>
            <Field label={t("characterSheet.maxHp")}>
              <input
                type="number"
                className="input"
                value={draft.maxHp}
                onChange={(e) => setDraft({ ...draft, maxHp: Number(e.target.value) })}
              />
            </Field>
            <Field label={t("characterSheet.armor")}>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="input"
                  value={draft.armor}
                  onChange={(e) => setDraft({ ...draft, armor: Number(e.target.value) })}
                />
                <RollButton label={t("characterSheet.armor")} value={draft.armor} onRoll={addLog} />
              </div>
            </Field>
            <Field label={t("characterSheet.gold")}>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="input"
                  value={draft.gold}
                  onChange={(e) => setDraft({ ...draft, gold: Number(e.target.value) })}
                />
                <RollButton label={t("characterSheet.gold")} value={draft.gold} onRoll={addLog} />
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GaugeField
              label={t("characterSheet.warmth")}
              gauge={draft.warmth}
              onChange={(part, v) => updateGauge("warmth", part, v)}
              onRoll={addLog}
              rollLabel={t("characterSheet.warmth")}
            />
            <GaugeField
              label={t("characterSheet.sanity")}
              gauge={draft.sanity}
              onChange={(part, v) => updateGauge("sanity", part, v)}
              onRoll={addLog}
              rollLabel={t("characterSheet.sanity")}
            />
            <GaugeField
              label={t("characterSheet.luck")}
              gauge={draft.luck}
              onChange={(part, v) => updateGauge("luck", part, v)}
              onRoll={addLog}
              rollLabel={t("characterSheet.luck")}
            />
          </div>

          <div className="mt-4">
            <Field label={t("characterSheet.rations")}>
              <div className="flex items-center gap-2 max-w-[160px]">
                <input
                  type="number"
                  className="input"
                  value={draft.rations}
                  onChange={(e) => setDraft({ ...draft, rations: Number(e.target.value) })}
                />
                <RollButton label={t("characterSheet.rations")} value={draft.rations} onRoll={addLog} />
              </div>
            </Field>
          </div>
        </Panel>

        <Panel title={t("characterSheet.abilityScores")} eyebrow={t("characterSheet.stats")}>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {Object.entries(draft.stats).map(([key, value]) => (
              <div key={key} className="bg-panel2 border border-line rounded-sm p-3 text-center">
                <div className="text-xs text-muted uppercase mb-1">{key}</div>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => updateStat(key, e.target.value)}
                  className="w-full bg-transparent text-center font-display text-lg focus:outline-none"
                />
                <div className="flex justify-center mt-2">
                  <RollButton label={key.toUpperCase()} value={value} onRoll={addLog} />
                </div>
              </div>
            ))}
          </div>
          <RollLog t={t} log={log} />
        </Panel>

        <Panel title={t("characterSheet.notes")}>
          <textarea
            className="input min-h-[80px]"
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          />
        </Panel>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-crimson hover:bg-crimsonBright transition-colors rounded-sm font-display tracking-wide text-white"
        >
          {t("characterSheet.saveCharacter")}
        </button>
      </div>

      <div>
        <Panel
          title={t("characterSheet.savedCharacters")}
          eyebrow={loading ? t("common.loading") : t("characterSheet.total", { count: characters.length })}
        >
          {characters.length === 0 && !loading && (
            <p className="text-muted text-sm">{t("characterSheet.none")}</p>
          )}
          <div className="space-y-3">
            {characters.map((c) => (
              <div key={c.id} className="border border-line rounded-sm p-3 flex items-start justify-between gap-2">
                <div>
                  <div className="font-display text-sm">{c.name || t("characterSheet.unnamed")}</div>
                  <div className="text-xs text-muted">
                    {c.archetype} · {t("characterSheet.hp")} {c.hp}/{c.maxHp} · {t("characterSheet.armor")} {c.armor}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-muted hover:text-crimsonBright text-xs"
                >
                  {t("common.delete")}
                </button>
              </div>
            ))}
          </div>
        </Panel>
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

function GaugeField({ label, gauge, onChange, onRoll, rollLabel }) {
  return (
    <div>
      <span className="block text-xs text-muted uppercase tracking-wide mb-1">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="input"
          value={gauge.current}
          onChange={(e) => onChange("current", e.target.value)}
        />
        <span className="text-muted text-sm">/</span>
        <input
          type="number"
          className="input"
          value={gauge.max}
          onChange={(e) => onChange("max", e.target.value)}
        />
        <RollButton label={rollLabel} value={gauge.current} onRoll={onRoll} />
      </div>
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