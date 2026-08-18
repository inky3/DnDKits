import Link from "next/link";
import Panel from "@/components/Panel";

const TOOLS = [
  {
    href: "/shops",
    label: "Shops",
    desc: "Generate a settlement's shops and stock, sized from a village to a city, in one click.",
  },
  {
    href: "/monsters",
    label: "Monsters",
    desc: "Browse and filter a bestiary by CR and environment for quick encounter building.",
  },
  {
    href: "/character-sheet",
    label: "Character Sheet",
    desc: "A clean digital sheet: stats, saves, skills, HP, and gear, saved to your account.",
  },
  {
    href: "/homebrew",
    label: "Homebrew",
    desc: "Write and save your own monsters, locations, or shop goods for later sessions.",
  },
];

export default function Home() {
  return (
    <div>
      <div className="mb-10">
        <div className="section-rule mb-4" />
        <h1 className="font-display text-4xl text-parchment mb-2">
          Everything the table needs, before you sit down
        </h1>
        <p className="text-muted max-w-2xl">
          Roll a town, stock its shops, look up a monster, or pull up a
          character sheet — no prep, no spreadsheets.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Panel
              eyebrow="Tool"
              title={tool.label}
              className="h-full hover:border-crimson transition-colors cursor-pointer"
            >
              <p className="text-muted text-sm">{tool.desc}</p>
            </Panel>
          </Link>
        ))}
      </div>
    </div>
  );
}
