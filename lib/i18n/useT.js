import { useRouter } from "next/router";
import { en, th } from "./dictionaries";

const DICTS = { en, th };

function getPath(obj, path) {
  return path.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
}

function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{{${k}}}`));
}

// Usage: const { t, locale } = useT();  t("shops.heading")  t("shops.generate", { size: "Town" })
export function useT() {
  const router = useRouter();
  const locale = router.locale || "en";
  const dict = DICTS[locale] || DICTS.en;

  function t(key, vars) {
    const val = getPath(dict, key) ?? getPath(DICTS.en, key) ?? key;
    return typeof val === "string" ? interpolate(val, vars) : val;
  }

  return { t, locale };
}
