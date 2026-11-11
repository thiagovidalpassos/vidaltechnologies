import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Home } from "@/components/home";
import { hasLocale } from "@/i18n/dictionaries";

// Português fica na raiz "/"; aqui só inglês e espanhol.
const otherLocales = ["en", "es"];

export function generateStaticParams() {
  return otherLocales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  alternates: { languages: { "pt-BR": "/", "en-US": "/en", "es-ES": "/es" } },
};

// O idioma vem da URL. Ler os params dentro de um Suspense deixa a troca de
// idioma instantânea; como /en e /es são gerados no build, a página chega
// completa e o Suspense não mostra nada de carregamento.
export default function Page({ params }: PageProps<"/[lang]">) {
  return (
    <Suspense>
      <LocalizedHome params={params} />
    </Suspense>
  );
}

async function LocalizedHome({ params }: { params: PageProps<"/[lang]">["params"] }) {
  const { lang } = await params;
  if (!otherLocales.includes(lang) || !hasLocale(lang)) notFound();
  return <Home lang={lang} />;
}
