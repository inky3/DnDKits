import NavBar from "./NavBar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-ink text-parchment font-body">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      <footer className="max-w-6xl mx-auto px-4 py-10 text-muted text-sm border-t border-line mt-16">
        Wayfarer's Toolkit — built for the table, not against it.
      </footer>
    </div>
  );
}
