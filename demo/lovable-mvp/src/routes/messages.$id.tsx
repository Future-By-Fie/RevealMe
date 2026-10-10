import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Ban, Flag, Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SafetyDialog } from "@/components/SafetyDialog";
import { Button, buttonVariants, inputCls } from "@/components/ui-kit";
import { DEMO_REPLIES, getDemoProfile } from "@/lib/demo-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/messages/$id")({
  head: () => ({
    meta: [
      { title: "Conversation — RevealMe" },
      { name: "description", content: "Continue your conversation with a mutual connection." },
      { property: "og:title", content: "Conversation — RevealMe" },
      { property: "og:description", content: "Continue your conversation." },
    ],
  }),
  component: Chat,
});

function Chat() {
  const { id } = Route.useParams();
  const { state, update, ready } = useStore();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [dialog, setDialog] = useState<"report" | "block" | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const p = getDemoProfile(id);
  const msgs = state.messages[id] ?? [];
  const ok = p && state.connections[id]?.mutual && !state.blocked.includes(id);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  if (!ready) return <AppShell title="Messages">{null}</AppShell>;
  if (!ok)
    return (
      <AppShell title="Messages">
        <p className="text-muted-foreground">This conversation isn't available.</p>
      </AppShell>
    );

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setText("");
    update((s) => ({
      ...s,
      messages: {
        ...s.messages,
        [id]: [...(s.messages[id] ?? []), { from: "me", text: t, at: Date.now() }],
      },
    }));
    // Simulated demo reply
    setTimeout(
      () =>
        update((s) => ({
          ...s,
          messages: {
            ...s.messages,
            [id]: [
              ...(s.messages[id] ?? []),
              {
                from: "them",
                text:
                  DEMO_REPLIES[Math.floor(Math.random() * DEMO_REPLIES.length)] ??
                  "Ha, I like that.",
                at: Date.now(),
              },
            ],
          },
        })),
      1400,
    );
  };

  return (
    <AppShell
      title={p.name}
      action={
        <div className="flex gap-1">
          <Link
            to="/messages"
            aria-label="Back to messages"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </Link>
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Report ${p.name}`}
            onClick={() => setDialog("report")}
          >
            <Flag className="h-4 w-4" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Block ${p.name}`}
            onClick={() => setDialog("block")}
          >
            <Ban className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      }
    >
      <div className="space-y-2" aria-live="polite">
        <p className="mb-4 text-center text-xs text-muted-foreground">
          You both revealed fully. Replies from {p.name} are simulated (demo).
        </p>
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <p
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${m.from === "me" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-card border"}`}
            >
              {m.text}
            </p>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form
        className="sticky bottom-20 mt-6 flex gap-2 md:bottom-6"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label htmlFor="msg" className="sr-only">
          Message
        </label>
        <input
          id="msg"
          className={inputCls}
          placeholder="Write a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoComplete="off"
        />
        <Button type="submit" size="icon" className="h-12 w-12 shrink-0" aria-label="Send">
          <Send className="h-5 w-5" aria-hidden />
        </Button>
      </form>
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
              navigate({ to: "/messages" });
            }
            setDialog(null);
          }}
        />
      )}
    </AppShell>
  );
}