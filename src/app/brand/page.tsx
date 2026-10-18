import type { Metadata } from "next";
import { setLocale, t } from "@/i18n/generated";
import { BrandBook } from "./brand-book";
import "./brand.css";

export async function generateMetadata(): Promise<Metadata> {
  await setLocale();
  return {
    title: t.app.brand.meta.title,
    description: t.app.brand.meta.description,
    robots: { index: false },
  };
}

export default async function BrandPage() {
  const locale = await setLocale();

  return (
    <BrandBook
      locale={locale}
      labels={{
        brand: t.app.brand,
        theme: t.components.theme,
        language: t.components.language,
      }}
    />
  );
}
