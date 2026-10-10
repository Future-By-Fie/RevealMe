import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RevealPhoto, RevealMeter } from "@/components/RevealPhoto";
import { buttonVariants } from "@/components/ui-kit";
import { getDemoProfile } from "@/lib/demo-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/connections")({
  head: () => ({
    meta: [
      { title: "Connections — RevealMe" },
      { name: "description", content: "Your active reveal sessions and mutual connections." },
      { property: "og:title", content: "Connections — RevealMe" },
      { property: "og:description", content: "Your active reveal sessions." },
    ],
  }),
  component: Connections,
});

function Connections() {
  const { state, ready } = useStore();
  const list = Object.entries(state.connections)
    .filter(([id, c]) => !c.ended && !state.blocked.includes(id))
    .map(([id, c]) => ({ p: getDemoProfile(id)!, c }))
    .filter((x) => x.p);

  return (
    <AppShell title="Connections">
      {ready && list.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No connections yet.</p>
          <Link to="/discover" className={buttonVariants({ className: "mt-4" })}>
            Discover people
          </Link>
        </div>
      )}
      <ul className="space-y-3">
        {list.map(({ p, c }) => (
          <li key={p.id}>
            <Link
              to={c.mutual ? "/messages/$id" : "/session/$id"}
              params={{ id: p.id }}
              className="flex items-center gap-4 rounded-2xl border bg-card p-3 transition-colors hover:bg-muted"
            >
              <RevealPhoto
                src={p.photo}
                level={c.level}
                alt={p.name}
                className="h-20 w-16 shrink-0 rounded-xl"
              />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate font-display text-xl">
                    {p.name}, {p.age}
                  </span>
                  <span
                    className={`shrink-0 text-xs font-medium ${c.mutual ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {c.mutual ? "Mutual" : `${c.level}% revealed`}
                  </span>
                </div>
                <RevealMeter level={c.level} compact />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}