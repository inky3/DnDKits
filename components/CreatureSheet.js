import { useState } from "react";

const COMMON_CONDITIONS = [
  "Blinded", "Charmed", "Deafened", "Frightened", "Grappled",
  "Incapacitated", "Invisible", "Paralyzed", "Petrified",
  "Poisoned", "Prone", "Restrained", "Stunned", "Unconscious",
];

function mod(score) {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

// Renders a creature's stat block. On mobile it opens as a bottom sheet
// (drawer) that slides up over the page; on desktop it renders inline as
// a normal panel. Both are the same content — `<Body>` below — so nothing
// drifts between the two layouts.
//
// `readOnly` shows a plain reference stat block (no HP/AC editing,
// conditions, or notes) — used for browsing the bestiary before anything
// is tracked. Without it, the sheet is fully live/editable.
export default function CreatureSheet({ creature, onClose, onDelete, onUpdate, extra, readOnly = false }) {
  if (!creature) return null;

  return (
    <>
      {/* Mobile: backdrop + slide-up drawer */}
      <div
        className="fixed inset-0 bg-black/60 z-40 md:hidden animate-fadeIn"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden max-h-[85vh] overflow-y-auto rounded-t-xl border-t border-line bg-panel shadow-card animate-slideUp">
        <div className="sticky top-0 bg-panel border-b border-line px-4 pt-3 pb-2">
          <div className="w-10 h-1 bg-line rounded-full mx-auto mb-3" />
          <SheetHeader creature={creature} onClose={onClose} onDelete={onDelete} />
        </div>
        <div className="p-4">
          <Body creature={creature} onUpdate={onUpdate} extra={extra} readOnly={readOnly} />
        </div>
      </div>

      {/* Desktop: inline panel */}
      <div className="hidden md:block bg-panel border border-line rounded-sm shadow-card">
        <div className="px-5 pt-4 pb-3 border-b border-line">
          <SheetHeader creature={creature} onClose={onClose} onDelete={onDelete} />
        </div>
        <div className="p-5">
          <Body creature={creature} onUpdate={onUpdate} extra={extra} readOnly={readOnly} />
        </div>
      </div>
    </>
  );
}

function SheetHeader({ creature, onClose, onDelete }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        {creature.eyebrow && (
          <div className="text-xs tracking-widest text-crimsonBright font-display mb-1">
            {creature.eyebrow}
          </div>
        )}
        <h3 className="font-display text-xl text-parchment">{creature.name}</h3>
        {creature.subtitle && (
          <div className="text-xs italic text-muted mt-0.5">{creature.subtitle}</div>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {onDelete && (
          <button
            onClick={onDelete}
            title="Remove from list"
            className="w-8 h-8 flex items-center justify-center rounded-sm border border-line text-muted hover:border-crimson hover:text-crimsonBright transition-colors"
          >
            🗑
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            title="Close"
            className="w-8 h-8 flex items-center justify-center rounded-sm border border-line text-muted hover:border-crimson hover:text-crimsonBright transition-colors md:hidden"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

function Body({ creature, onUpdate, extra, readOnly }) {
  const conditions = creature.conditions || [];
  const [conditionPick, setConditionPick] = useState("Prone");
  const [customCondition, setCustomCondition] = useState("");
  const hpPct = Math.max(0, Math.round((creature.hp / creature.maxHp) * 100));

  function addCondition(name) {
    const clean = name.trim();
    if (!clean || conditions.includes(clean)) return;
    onUpdate({ conditions: [...conditions, clean] });
  }

  function removeCondition(name) {
    onUpdate({ conditions: conditions.filter((c) => c !== name) });
  }

  function adjustHp(delta) {
    onUpdate({ hp: Math.max(0, Math.min(creature.maxHp, creature.hp + delta)) });
  }

  return (
    <div>
      {!readOnly && creature.hp <= 0 && (
        <div className="mb-4 px-3 py-2 rounded-sm bg-crimsonDark/30 border border-crimson text-sm text-crimsonBright font-display tracking-wide">
          Down — 0 HP
        </div>
      )}

      {/* Core stats. When live/tracked, AC/HP are typed values a DM can
          override mid-fight; in read-only preview they're plain text,
          matching a normal stat block. */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
        {readOnly ? (
          <Stat label="AC" value={creature.ac} />
        ) : (
          <EditableStat label="AC" value={creature.ac} onChange={(v) => onUpdate({ ac: v })} />
        )}

        {readOnly ? (
          <Stat
            label="HP"
            value={creature.hpDice ? `${creature.hp} (${creature.hpDice})` : creature.hp}
          />
        ) : (
          <div>
            <div className="text-xs text-muted uppercase tracking-wide mb-1">HP</div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => adjustHp(-1)}
                className="w-6 h-6 rounded-sm border border-line hover:border-crimson text-xs"
              >
                −
              </button>
              <input
                type="number"
                value={creature.hp}
                onChange={(e) =>
                  onUpdate({
                    hp: Math.max(0, Math.min(creature.maxHp, Number(e.target.value) || 0)),
                  })
                }
                className="w-14 bg-panel2 border border-line rounded-sm px-1 py-1 text-sm text-center focus:outline-none focus:border-crimson"
              />
              <span className="text-muted text-xs">/ {creature.maxHp}</span>
              <button
                onClick={() => adjustHp(1)}
                className="w-6 h-6 rounded-sm border border-line hover:border-crimson text-xs"
              >
                +
              </button>
            </div>
          </div>
        )}

        {creature.speed && <Stat label="Speed" value={creature.speed} />}
        {creature.size && <Stat label="Size" value={creature.size} />}
      </div>

      {!readOnly && (
        <div className="w-full h-2 bg-panel2 rounded-sm overflow-hidden mb-5 border border-line">
          <div
            className={`h-full transition-all ${
              hpPct <= 25 ? "bg-crimson" : hpPct <= 60 ? "bg-gold" : "bg-crimsonBright"
            }`}
            style={{ width: `${hpPct}%` }}
          />
        </div>
      )}

      {creature.stats && (
        <div className="grid grid-cols-6 gap-2 mb-5 text-center">
          {Object.entries(creature.stats).map(([k, v]) => (
            <div key={k} className="bg-panel2 border border-line rounded-sm py-2">
              <div className="text-xs text-muted uppercase">{k}</div>
              <div className="font-display">{v}</div>
              <div className="text-xs text-muted">{mod(v)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Reference block: skills, senses, languages, challenge rating —
          present on monster stat blocks, shown whenever supplied. */}
      {(creature.skills || creature.senses || creature.languages || creature.cr) && (
        <div className="mb-5 text-sm space-y-1">
          {creature.skills && Object.keys(creature.skills).length > 0 && (
            <p>
              <span className="text-muted">Skills </span>
              {Object.entries(creature.skills)
                .map(([k, v]) => `${k} ${v}`)
                .join(", ")}
            </p>
          )}
          {creature.senses && (
            <p><span className="text-muted">Senses </span>{creature.senses}</p>
          )}
          {creature.languages && (
            <p><span className="text-muted">Languages </span>{creature.languages}</p>
          )}
          {creature.cr && (
            <p>
              <span className="text-muted">Challenge </span>
              {creature.cr} {creature.xp ? `(${creature.xp} XP)` : ""}
              {creature.proficiencyBonus && (
                <span className="text-muted">
                  {"  ·  Proficiency Bonus +" + creature.proficiencyBonus}
                </span>
              )}
            </p>
          )}
        </div>
      )}

      {!readOnly && (
        <>
          {/* Conditions: freeform tagging so this behaves like a real
              table, where any status can be slapped on or pulled off
              mid-scene. */}
          <div className="mb-5">
            <h4 className="font-display text-sm text-crimsonBright mb-2">Conditions</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {conditions.length === 0 && (
                <span className="text-xs text-muted">None active.</span>
              )}
              {conditions.map((c) => (
                <span
                  key={c}
                  className="flex items-center gap-1.5 text-xs bg-panel2 border border-line rounded-sm px-2 py-1"
                >
                  {c}
                  <button
                    onClick={() => removeCondition(c)}
                    className="text-muted hover:text-crimsonBright"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={conditionPick}
                onChange={(e) => setConditionPick(e.target.value)}
                className="bg-panel2 border border-line rounded-sm px-2 py-1.5 text-xs focus:outline-none focus:border-crimson"
              >
                {COMMON_CONDITIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <button
                onClick={() => addCondition(conditionPick)}
                className="px-3 py-1.5 rounded-sm border border-line hover:border-crimson text-xs font-display tracking-wide"
              >
                Add
              </button>
              <input
                value={customCondition}
                onChange={(e) => setCustomCondition(e.target.value)}
                placeholder="Custom condition..."
                className="flex-1 min-w-[120px] bg-panel2 border border-line rounded-sm px-2 py-1.5 text-xs focus:outline-none focus:border-crimson"
              />
              <button
                onClick={() => {
                  addCondition(customCondition);
                  setCustomCondition("");
                }}
                className="px-3 py-1.5 rounded-sm border border-line hover:border-crimson text-xs font-display tracking-wide"
              >
                Add
              </button>
            </div>
          </div>
        </>
      )}

      {extra}

      {!readOnly && (
        <div>
          <h4 className="font-display text-sm text-crimsonBright mb-2">Notes</h4>
          <textarea
            value={creature.notes || ""}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Anything worth remembering..."
            rows={3}
            className="w-full bg-panel2 border border-line rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-crimson resize-none"
          />
        </div>
      )}
    </div>
  );
}

function EditableStat({ label, value, onChange }) {
  return (
    <div>
      <div className="text-xs text-muted uppercase tracking-wide mb-1">{label}</div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-16 bg-panel2 border border-line rounded-sm px-2 py-1 text-sm focus:outline-none focus:border-crimson"
      />
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
