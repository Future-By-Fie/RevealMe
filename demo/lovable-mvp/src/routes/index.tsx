import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, MessageSquareText, ShieldCheck } from "lucide-react";
import { RevealPhoto, RevealMeter } from "@/components/RevealPhoto";
import { DemoBadge } from "@/components/AppShell";
import { buttonVariants } from "@/components/ui-kit";
import { REVEAL_STAGES } from "@/lib/reveal";
import maya from "@/assets/demo-maya.svg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RevealMe — A New Way to Connect" },
      {
        name: "description",
        content:
          "Meet before you reveal. Profiles start visually obscured and reveal gradually as you get to know each other.",
      },
      { property: "og:title", content: "RevealMe — A New Way to Connect" },
      {
        property: "og:description",
        content: "Meet before you reveal. Connection first, photos second.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % REVEAL_STAGES.length), 1800);
    return () => clearInterval(t);
  }, []);
  const level = REVEAL_STAGES[i] ?? 0;

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-10">
        <span className="font-display text-2xl">
          Reveal<span className="text-primary">Me</span>
        </span>
        <DemoBadge />
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-8 md:grid-cols-[1.1fr_1fr] md:px-10 md:pt-16">
        <div className="fade-up">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            A New Way to Connect
          </p>
          <h1 className="text-5xl leading-[1.05] md:text-7xl">
            Meet before
            <br />
            you <em className="text-primary">reveal.</em>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            On RevealMe, photos start blurred. As you talk and answer each other's questions, you
            both see a little more.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/onboarding" className={buttonVariants({ size: "lg" })}>
              Try RevealMe
            </Link>
            <a href="#how" className={buttonVariants({ variant: "outline", size: "lg" })}>
              How it works
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="overflow-hidden rounded-3xl border bg-card shadow-soft">
            <RevealPhoto
              src={maya}
              level={level}
              alt="Maya, demo profile"
              className="aspect-[4/5]"
            />
            <div className="space-y-3 p-5">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-2xl">Maya, 28</span>
                <span className="text-xs text-muted-foreground">Demo profile</span>
              </div>
              <RevealMeter level={level} />
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="border-t bg-card">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-10">
          <h2 className="text-4xl">How it works</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Eye,
                t: "Start obscured",
                d: "Everyone's photo begins blurred. You see a name, an age and what they're into.",
              },
              {
                icon: MessageSquareText,
                t: "Talk to reveal",
                d: "Answer light questions together. Each one reveals a bit more — 25%, 50%, 75%, 100%.",
              },
              {
                icon: ShieldCheck,
                t: "Mutual by design",
                d: "Reveal moves for both of you at once. End, block or report anytime.",
              },
            ].map(({ icon: Icon, t, d }, n) => (
              <li key={t} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-sm text-muted-foreground">Step {n + 1}</span>
                </div>
                <h3 className="text-2xl">{t}</h3>
                <p className="text-muted-foreground">{d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-12 max-w-2xl text-sm text-muted-foreground">
            This is an early prototype. All profiles are fictional demo people, and the blur is a
            visual concept — not yet a security guarantee.
          </p>
          <Link to="/onboarding" className={buttonVariants({ className: "mt-8" })}>
            Try RevealMe
          </Link>
        </div>
      </section>
    </div>
  );
}