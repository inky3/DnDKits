import NavBar from "./NavBar";
import { useT } from "@/lib/i18n/useT";

export default function Layout({ children }) {
  const { t } = useT();

  return (
    <div className="min-h-screen bg-ink text-parchment font-body">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      <footer className="max-w-6xl mx-auto px-4 py-10 text-muted text-sm border-t border-line mt-16">
        {t("footer.tagline")}
      </footer>
    </div>
  );
}
