import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RevealPhoto } from "@/components/RevealPhoto";
import { getDemoProfile } from "@/lib/demo-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/messages/")({
  head: () => ({
    meta: [
      { title: "Messages — RevealMe" },
      { name: "description", content: "Chat with your mutual connections." },
      { property: "og:title", content: "Messages — RevealMe" },
      { property: "og:description", content: "Chat with your mutual connections." },
    ],
  }),
  component: Messages,
});

function Messages() {
  const { state, ready } = useStore();
  const list = Object.entries(state.connections)
    .filter(([id, c]) => c.mutual && !c.ended && !state.blocked.includes(id))
    .map(([id]) => ({ p: getDemoProfile(id)!, last: state.messages[id]?.at(-1) }))
    .filter((x) => x.p);

  return (
    <AppShell title="Messages">
      {ready && list.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">
          Messages open once a connection is mutual.
        </p>
      )}
      <ul className="divide-y rounded-2xl border bg-card">
        {list.map(({ p, last }) => (
          <li key={p.id}>
            <Link
              to="/messages/$id"
              params={{ id: p.id }}
              className="flex items-center gap-4 p-4 hover:bg-muted"
            >
              <RevealPhoto
                src={p.photo}
                level={100}
                alt={p.name}
                className="h-12 w-12 shrink-0 rounded-full"
              />
              <div className="min-w-0">
                <p className="font-medium">{p.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {last ? `${last.from === "me" ? "You: " : ""}${last.text}` : "Say hello"}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}