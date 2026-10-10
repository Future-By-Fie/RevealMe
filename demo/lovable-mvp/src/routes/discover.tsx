import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RevealPhoto, RevealMeter } from "@/components/RevealPhoto";
import { Button, buttonVariants } from "@/components/ui-kit";
import { DEMO_PROFILES } from "@/lib/demo-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover — RevealMe" },
      {
        name: "description",
        content: "Browse obscured profiles and connect with people based on who they are.",
      },
      { property: "og:title", content: "Discover — RevealMe" },
      { property: "og:description", content: "Connect before you see." },
    ],
  }),
  component: Discover,
});

function Discover() {
  const { state, update, ready, reset } = useStore();
  const navigate = useNavigate();
  const queue = DEMO_PROFILES.filter(
    (p) =>
      !state.passed.includes(p.id) && !state.connections[p.id] && !state.blocked.includes(p.id),
  );
  const current = queue[0];

  return (
    <AppShell title="Discover">
      {ready && !state.profile && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 text-sm">
          <span>You're browsing without a profile.</span>
          <Link to="/onboarding" className={buttonVariants({ size: "sm" })}>
            Create profile
          </Link>
        </div>
      )}
      {!ready ? null : current ? (
        <article
          key={current.id}
          className="fade-up mx-auto max-w-sm overflow-hidden rounded-3xl border bg-card shadow-soft"
          aria-label={`${current.name}, ${current.age}`}
        >
          <RevealPhoto src={current.photo} level={0} alt={current.name} className="aspect-[4/5]" />
          <div className="space-y-4 p-5">
            <div>
              <h2 className="text-3xl">
                {current.name}, {current.age}
              </h2>
              <p className="mt-1 text-sm font-medium text-primary">{current.signal}</p>
              <p className="mt-2 text-muted-foreground">{current.bio}</p>
            </div>
            <RevealMeter level={0} />
            <div className="flex justify-center gap-6 pt-2">
              <Button
                variant="outline"
                size="icon"
                aria-label={`Pass on ${current.name}`}
                onClick={() => update((s) => ({ ...s, passed: [...s.passed, current.id] }))}
              >
                <X className="h-6 w-6" aria-hidden />
              </Button>
              <Button
                size="icon"
                aria-label={`Connect with ${current.name}`}
                onClick={() => {
                  update((s) => ({
                    ...s,
                    connections: {
                      ...s.connections,
                      [current.id]: { level: 0, answered: [], mutual: false },
                    },
                  }));
                  navigate({ to: "/session/$id", params: { id: current.id } });
                }}
              >
                <Heart className="h-6 w-6" aria-hidden />
              </Button>
            </div>
          </div>
        </article>
      ) : (
        <div className="py-16 text-center">
          <h2 className="text-3xl">You've seen everyone</h2>
          <p className="mx-auto mt-2 max-w-xs text-muted-foreground">
            That's all the demo profiles for now.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/connections" className={buttonVariants()}>
              View connections
            </Link>
            <Button variant="outline" onClick={() => update((s) => ({ ...s, passed: [] }))}>
              Show passed again
            </Button>
          </div>
          <button className="mt-6 text-sm text-muted-foreground underline" onClick={reset}>
            Reset entire demo
          </button>
        </div>
      )}
    </AppShell>
  );
}