import { useMemo, useState } from "react";
import Panel from "@/components/Panel";
import { NPCS } from "@/lib/data/npcs";
import { generateNPC } from "@/lib/npcGenerator";
import { SPECIES, SPECIES_ORDER, ROLES, ROLE_ORDER, ATTITUDE_LADDER } from "@/lib/data/npcData";

export default function NpcsPage() {
  const [npcList, setNpcList] = useState(NPCS);
  const [selectedId, setSelectedId] = useState(NPCS[0].id);
  const [prefs, setPrefs] = useState({ species: "Any", role: "Any", attitude: "Any" });

  const selected = useMemo(
    () => npcList.find((n) => n.id === selectedId) || null,
    [npcList, selectedId]
  );

  function updateSelected(patch) {
    setNpcList((list) =>
      list.map((n) => (n.id === selectedId ? { ...n, ...patch(n) } : n))
    );
  }

  function handleGenerate() {
    const npc = generateNPC(prefs);
    setNpcList((list) => [npc, ...list]);
    setSelectedId(npc.id);
  }

  function shiftAttitude(npc, delta) {
    const idx = ATTITUDE_LADDER.indexOf(npc.attitude);
    const next = ATTITUDE_LADDER[Math.min(ATTITUDE_LADDER.length - 1, Math.max(0, idx + delta))];
    return next;
  }

  return (
    <div>
      <div className="mb-8">
        <div className="section-rule mb-4" />
        <h1 className="font-display text-3xl mb-2">NPCs</h1>
        <p className="text-muted max-w-2xl">
          Ten ready-made NPCs, or generate one on the fly by species and role.
          Selected NPCs are fully interactive — take damage in a fight, or
          work them with a persuasion roll.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-1 flex flex-col gap-5">
          <Panel title="Generate an NPC">
            <div className="flex flex-col gap-3 text-sm">
              <PrefSelect
                label="Species"
                value={prefs.species}
                onChange={(v) => setPrefs((p) => ({ ...p, species: v }))}
                options={["Any", ...SPECIES_ORDER]}
                labelFor={(key) => (key === "Any" ? "Any" : SPECIES[key].label)}
              />
              <PrefSelect
                label="Role"
                value={prefs.role}
                onChange={(v) => setPrefs((p) => ({ ...p, role: v }))}
                options={["Any", ...ROLE_ORDER]}
                labelFor={(key) => (key === "Any" ? "Any" : ROLES[key].label)}
              />
              <PrefSelect
                label="Starting Attitude"
                value={prefs.attitude}
                onChange={(v) => setPrefs((p) => ({ ...p, attitude: v }))}
                options={["Any", ...ATTITUDE_LADDER]}
                labelFor={(key) => key}
              />
              <button
                onClick={handleGenerate}
                className="mt-1 px-4 py-2 rounded-sm bg-crimson hover:bg-crimsonBright transition-colors text-sm font-display tracking-wide text-white"
              >
                Generate NPC
              </button>
            </div>
          </Panel>

          <div className="flex flex-col gap-2">
            {npcList.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedId(n.id)}
                className={`text-left px-4 py-3 rounded-sm border transition-colors ${
                  selected?.id === n.id
                    ? "bg-panel2 border-crimson"
                    : "bg-panel border-line hover:border-crimson"
                }`}
              >
                <div className="font-display text-sm flex items-center justify-between">
                  <span>{n.name}</span>
                  {n.hp <= 0 && (
                    <span className="text-xs text-crimsonBright">Down</span>
                  )}
                </div>
                <div className="text-xs text-muted">
                  {n.speciesLabel} · {n.roleLabel} · {n.attitude}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          {selected ? (
            <NpcDetail
              npc={selected}
              onDamage={(amount) =>
                updateSelected((n) => ({ hp: Math.max(0, n.hp - amount) }))
              }
              onReset={() => updateSelected((n) => ({ hp: n.maxHp }))}
              onNegotiate={(roll) => {
                const success = roll >= selected.persuasionDC;
                updateSelected((n) => ({
                  attitude: shiftAttitude(n, success ? 1 : -1),
                }));
                return success;
              }}
            />
          ) : (
            <Panel title="Select an NPC">
              <p className="text-muted text-sm">
                Choose an NPC from the list, or generate a new one.
              </p>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

function PrefSelect({ label, value, onChange, options, labelFor }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-muted uppercase tracking-wide">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-panel2 border border-line rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-crimson"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {labelFor(opt)}
          </option>
        ))}
      </select>
    </label>
  );
}

function NpcDetail({ npc, onDamage, onReset, onNegotiate }) {
  const [dmgInput, setDmgInput] = useState(1);
  const [playerMod, setPlayerMod] = useState(0);
  const [log, setLog] = useState([]);

  const hpPct = Math.round((npc.hp / npc.maxHp) * 100);
  const attitudeIdx = ATTITUDE_LADDER.indexOf(npc.attitude);

  function addLog(entry) {
    setLog((l) => [entry, ...l].slice(0, 6));
  }

  function handleAttack() {
    const amount = Math.max(0, Number(dmgInput) || 0);
    onDamage(amount);
    addLog(`Took ${amount} damage.`);
  }

  function handleNegotiate() {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + (Number(playerMod) || 0);
    const success = onNegotiate(total);
    addLog(
      `Persuasion roll: ${d20} + ${playerMod} = ${total} vs DC ${npc.persuasionDC} — ${
        success ? "succeeded" : "failed"
      }.`
    );
  }

  return (
    <Panel
      eyebrow={`${npc.speciesLabel} · ${npc.roleLabel}`}
      title={npc.name}
      right={
        <span
          className={`text-xs font-display px-3 py-1 rounded-sm border ${
            attitudeIdx <= 1
              ? "border-crimson text-crimsonBright"
              : attitudeIdx >= 3
              ? "border-gold text-gold"
              : "border-line text-muted"
          }`}
        >
          {npc.attitude}
        </span>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
        <Stat label="AC" value={npc.ac} />
        <Stat label="Speed" value={npc.speed} />
        <Stat
          label="HP"
          value={`${npc.hp} / ${npc.maxHp}`}
        />
        <Stat label="Environment" value={npc.environment.join(", ")} />
      </div>

      <div className="w-full h-2 bg-panel2 rounded-sm overflow-hidden mb-5 border border-line">
        <div
          className={`h-full transition-all ${
            hpPct <= 25 ? "bg-crimson" : hpPct <= 60 ? "bg-gold" : "bg-crimsonBright"
          }`}
          style={{ width: `${hpPct}%` }}
        />
      </div>

      <div className="grid grid-cols-6 gap-2 mb-5 text-center">
        {Object.entries(npc.stats).map(([k, v]) => (
          <div key={k} className="bg-panel2 border border-line rounded-sm py-2">
            <div className="text-xs text-muted uppercase">{k}</div>
            <div className="font-display">{v}</div>
          </div>
        ))}
      </div>

      <div className="mb-5">
        <h4 className="font-display text-sm text-crimsonBright mb-2">Actions</h4>
        <ul className="text-sm space-y-1 text-parchment/90">
          {npc.actions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>

      <div className="mb-5 text-sm text-parchment/90 space-y-1">
        <h4 className="font-display text-sm text-crimsonBright mb-2">Personality</h4>
        <p><span className="text-muted">Trait:</span> {npc.personality.trait}</p>
        <p><span className="text-muted">Ideal:</span> {npc.personality.ideal}</p>
        <p><span className="text-muted">Bond:</span> {npc.personality.bond}</p>
        <p><span className="text-muted">Flaw:</span> {npc.personality.flaw}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div className="bg-panel2 border border-line rounded-sm p-4">
          <h4 className="font-display text-sm text-crimsonBright mb-3">Attack</h4>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              min={0}
              value={dmgInput}
              onChange={(e) => setDmgInput(e.target.value)}
              className="w-20 bg-panel border border-line rounded-sm px-2 py-1.5 text-sm focus:outline-none focus:border-crimson"
            />
            <button
              onClick={handleAttack}
              className="flex-1 px-3 py-1.5 rounded-sm bg-crimson hover:bg-crimsonBright transition-colors text-xs font-display tracking-wide text-white"
            >
              Apply Damage
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onReset}
              className="flex-1 px-3 py-1.5 rounded-sm border border-line hover:border-crimson transition-colors text-xs font-display tracking-wide text-parchment"
            >
              Reset HP
            </button>
          </div>
        </div>

        <div className="bg-panel2 border border-line rounded-sm p-4">
          <h4 className="font-display text-sm text-crimsonBright mb-3">
            Negotiate (DC {npc.persuasionDC})
          </h4>
          <div className="flex gap-2">
            <label className="flex items-center gap-2 text-xs text-muted">
              Mod
              <input
                type="number"
                value={playerMod}
                onChange={(e) => setPlayerMod(e.target.value)}
                className="w-16 bg-panel border border-line rounded-sm px-2 py-1.5 text-sm focus:outline-none focus:border-crimson"
              />
            </label>
            <button
              onClick={handleNegotiate}
              className="flex-1 px-3 py-1.5 rounded-sm bg-crimson hover:bg-crimsonBright transition-colors text-xs font-display tracking-wide text-white"
            >
              Roll Persuasion
            </button>
          </div>
        </div>
      </div>

      {log.length > 0 && (
        <div>
          <h4 className="font-display text-sm text-crimsonBright mb-2">Log</h4>
          <ul className="text-xs text-muted space-y-1">
            {log.map((entry, i) => (
              <li key={i}>{entry}</li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
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