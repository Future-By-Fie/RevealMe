import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Flag, Ban, Lock, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RevealPhoto, RevealMeter } from "@/components/RevealPhoto";
import { SafetyDialog } from "@/components/SafetyDialog";
import { Button, buttonVariants } from "@/components/ui-kit";
import { getDemoProfile, PROMPTS } from "@/lib/demo-data";
import { isMutual, nextLevel } from "@/lib/reveal";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/session/$id")({
  head: () => ({
    meta: [
      { title: "Reveal Session — RevealMe" },
      { name: "description", content: "Answer questions together to gradually reveal each other." },
      { property: "og:title", content: "Reveal Session — RevealMe" },
      { property: "og:description", content: "Answer questions together to reveal each other." },
    ],
  }),
  component: Session,
});

function Session() {
  const { id } = Route.useParams();
  const { state, update, ready } = useStore();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState<"report" | "block" | null>(null);
  const p = getDemoProfile(id);
  const c = state.connections[id];

  if (!ready) return <AppShell title="Reveal Session">{null}</AppShell>;
  if (!p || !c || c.ended || state.blocked.includes(id)) {
    return (
      <AppShell title="Reveal Session">
        <p className="text-muted-foreground">This session isn't available.</p>
        <Link to="/discover" className={buttonVariants({ className: "mt-4" })}>
          Back to Discover
        </Link>
      </AppShell>
    );
  }

  const answeredIds = c.answered.map((a) => a.promptId);
  const nextPrompt = PROMPTS.find((q) => !answeredIds.includes(q.id));
  const myName = state.profile?.name ?? "You";

  const answer = (promptId: string, mine: string) => {
    update((s) => {
      const cur = s.connections[id];
      if (!cur) return s;
      const level = nextLevel(cur.level);
      return {
        ...s,
        connections: {
          ...s.connections,
          [id]: {
            ...cur,
            level,
            answered: [...cur.answered, { promptId, mine }],
            mutual: isMutual(level, p.connectsBack),
          },
        },
      };
    });
  };

  return (
    <AppShell
      title="Reveal Session"
      action={
        <Link
          to="/connections"
          aria-label="Back to connections"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </Link>
      }
    >
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <div className="space-y-4">
          <RevealPhoto
            src={p.photo}
            level={c.level}
            alt={p.name}
            className="mx-auto aspect-[4/5] w-48 rounded-3xl md:w-full"
          />
          <div className="text-center md:text-left">
            <h2 className="text-3xl">
              {p.name}, {p.age}
            </h2>
            <p className="text-sm text-muted-foreground">{p.signal}</p>
          </div>
          <RevealMeter level={c.level} />
          <p className="flex gap-2 text-xs text-muted-foreground">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            Reveal is mutual: {p.name} sees you at the same level. Either of you can stop anytime.
          </p>
        </div>

        <div className="space-y-4">
          {c.answered.map((a) => {
            const q = PROMPTS.find((x) => x.id === a.promptId)!;
            return (
              <div key={a.promptId} className="rounded-2xl border bg-card p-4">
                <p className="font-display text-lg">{q.q}</p>
                <dl className="mt-3 space-y-1.5 text-sm">
                  <div className="flex gap-2">
                    <dt className="w-16 shrink-0 text-muted-foreground">{myName}</dt>
                    <dd>{a.mine}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-16 shrink-0 text-muted-foreground">{p.name}</dt>
                    <dd>{p.answers[a.promptId]}</dd>
                  </div>
                </dl>
              </div>
            );
          })}

          {c.mutual ? (
            <div className="fade-up rounded-3xl bg-ink p-6 text-ink-foreground">
              <Sparkles className="h-6 w-6" aria-hidden />
              <h3 className="mt-3 text-3xl">It's mutual.</h3>
              <p className="mt-2 opacity-80">
                You and {p.name} both chose to fully reveal. You can keep talking.
              </p>
              <Link
                to="/messages/$id"
                params={{ id }}
                className={buttonVariants({ className: "mt-5" })}
              >
                Continue conversation
              </Link>
            </div>
          ) : nextPrompt ? (
            <div
              key={nextPrompt.id}
              className="fade-up rounded-2xl border-2 border-primary/30 bg-card p-5"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-primary">
                Answer to reveal +25%
              </p>
              <p className="mt-2 font-display text-xl">{nextPrompt.q}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {nextPrompt.options.map((o) => (
                  <Button
                    key={o}
                    variant="outline"
                    size="sm"
                    onClick={() => answer(nextPrompt.id, o)}
                  >
                    {o}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="text-2xl">Fully revealed</h3>
              <p className="mt-1 text-muted-foreground">
                You've answered everything. {p.name} hasn't connected back yet — no pressure either
                way.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                update((s) => {
                  const cur = s.connections[id];
                  if (!cur) return s;
                  return { ...s, connections: { ...s.connections, [id]: { ...cur, ended: true } } };
                });
                navigate({ to: "/connections" });
              }}
            >
              End session
            </Button>
            <Button variant="danger" size="sm" onClick={() => setDialog("report")}>
              <Flag className="h-4 w-4" aria-hidden />
              Report
            </Button>
            <Button variant="danger" size="sm" onClick={() => setDialog("block")}>
              <Ban className="h-4 w-4" aria-hidden />
              Block
            </Button>
          </div>
        </div>
      </div>

      {dialog && (
        <SafetyDialog
          kind={dialog}
          name={p.name}
          onClose={() => setDialog(null)}
          onConfirm={(reason) => {
            if (dialog === "report")
              update((s) => ({ ...s, reports: [...s.reports, { id, reason, at: Date.now() }] }));
            else {
              update((s) => ({ ...s, blocked: [...s.blocked, id] }));
              navigate({ to: "/connections" });
            }
            setDialog(null);
          }}
        />
      )}
    </AppShell>
  );
}