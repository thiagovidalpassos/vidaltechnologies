import Link from "next/link";
import { AutomationFlow } from "@/components/automation-flow";
import { Logo } from "@/components/logo";
import { ServiceCards } from "@/components/service-cards";
import { StarField } from "@/components/star-field";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { LanguageSwitcher } from "@/components/language-switcher";
import { dictionaries, htmlLang, localePath, type Locale } from "@/i18n/dictionaries";

// Link do botão "Ver no GitHub" da seção Projetos.
const GITHUB_URL = "https://github.com/vidaltechnologies";

export function Home({ lang }: { lang: Locale }) {
  const t = dictionaries[lang];

  return (
    <div lang={htmlLang[lang]} className="flex flex-1 flex-col">
      <StarField />
      <header className="sticky top-0 z-10 border-b border-line/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href={localePath(lang)}
            aria-label="vidal technologies"
            className="flex items-center text-2xl leading-none"
          >
            <Logo />
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
            <a href="#servicos" className="hover:text-foreground">{t.nav.services}</a>
            <a href="#como-trabalho" className="hover:text-foreground">{t.nav.process}</a>
            <a href="#projetos" className="hover:text-foreground">{t.nav.projects}</a>
            <a href="#sobre" className="hover:text-foreground">{t.nav.about}</a>
          </nav>
          <div className="flex items-center gap-5">
            <a
              href="#contato"
              className="hidden rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-ink transition hover:brightness-110 sm:block"
            >
              {t.cta}
            </a>
            <LanguageSwitcher current={lang} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-accent/20 blur-[140px]"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 md:py-28 lg:grid-cols-[1fr_1.15fr]">
            <div className="flex flex-col gap-8">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                {t.hero.eyebrow}
              </p>
              <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                {t.hero.titleStart} <span className="text-accent">{t.hero.titleAccent}</span>.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted">{t.hero.text}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#contato"
                  className="rounded-full bg-accent px-6 py-3 font-semibold text-accent-ink transition hover:brightness-110"
                >
                  {t.hero.primary}
                </a>
                <a
                  href="#servicos"
                  className="rounded-full border border-line px-6 py-3 font-semibold transition hover:border-foreground"
                >
                  {t.hero.secondary}
                </a>
              </div>
            </div>

            <AutomationFlow t={t.flow} />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        </section>

        <section id="servicos" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.services.title}</h2>
          <div className="mt-10">
            <ServiceCards items={t.services.items} />
          </div>
        </section>

        <section id="como-trabalho" className="scroll-mt-16 border-y border-line/60 bg-surface/60">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.process.title}</h2>
            <ol className="mt-10 grid gap-10 md:grid-cols-3">
              {t.process.steps.map((s, i) => (
                <li key={s.title} className="flex flex-col gap-2">
                  <span className="font-mono text-sm text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                  <p className="leading-relaxed text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="projetos" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex max-w-2xl flex-col gap-3">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.projects.title}</h2>
              <p className="text-lg leading-relaxed text-muted">{t.projects.text}</p>
            </div>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-accent py-3 pl-5 pr-6 font-semibold text-accent-ink transition hover:brightness-110"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
              {t.projects.button}
            </a>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {t.projects.items.map((p) => (
              <article
                key={p.title}
                className="flex flex-col gap-3 rounded-2xl border border-line/60 bg-surface-2 p-6 transition hover:border-accent/60"
              >
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <p className="leading-relaxed text-muted">{p.text}</p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                  {p.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-line px-3 py-1 font-mono text-xs text-accent"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="sobre" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6">
          <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.about.title}</h2>
            <div className="flex flex-col gap-5 text-lg leading-relaxed text-muted">
              {t.about.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="mx-auto max-w-6xl scroll-mt-16 px-4 pb-24 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface-2 px-6 py-16 text-center sm:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[640px] -translate-x-1/2 rounded-full bg-accent/25 blur-[100px]"
            />
            <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">
              {t.contact.title}
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-muted">{t.contact.text}</p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="mailto:contato@vidaltechnologies.com.br"
                className="rounded-full bg-accent px-6 py-3 font-semibold text-accent-ink transition hover:brightness-110"
              >
                {t.contact.button}
              </a>
              <a
                href={`https://wa.me/5541988779179?text=${encodeURIComponent(t.contact.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-semibold transition hover:border-[#25D366]"
              >
                <WhatsAppIcon />
                {t.contact.whatsapp}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-subtle sm:flex-row sm:justify-between sm:px-6">
          <Logo className="text-lg text-muted" />
          <p>© Vidal Technologies. {t.rights}</p>
        </div>
      </footer>
    </div>
  );
}
