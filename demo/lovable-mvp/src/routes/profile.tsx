import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProfileForm } from "@/components/ProfileForm";
import { Button, buttonVariants } from "@/components/ui-kit";
import { getDemoProfile } from "@/lib/demo-data";
import { useStore, type MyProfile } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & privacy — RevealMe" },
      { name: "description", content: "Edit your profile, privacy controls and safety settings." },
      { property: "og:title", content: "Profile & privacy — RevealMe" },
      { property: "og:description", content: "Edit your profile and privacy controls." },
    ],
  }),
  component: Profile,
});

function Toggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-4">
      <span className="min-w-0">
        <span className="block font-medium">{label}</span>
        <span className="block text-sm text-muted-foreground">{desc}</span>
      </span>
      <input
        type="checkbox"
        role="switch"
        className="mt-1 h-5 w-5 shrink-0 accent-primary"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

function Profile() {
  const { state, update, ready, reset } = useStore();
  const [saved, setSaved] = useState(false);
  const p = state.profile;
  const setP = (patch: Partial<MyProfile>) =>
    update((s) => (s.profile ? { ...s, profile: { ...s.profile, ...patch } } : s));

  return (
    <AppShell title="Profile">
      {!ready ? null : !p ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">You haven't created a profile yet.</p>
          <Link to="/onboarding" className={buttonVariants({ className: "mt-4" })}>
            Create profile
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          <section aria-labelledby="edit-h">
            <h2 id="edit-h" className="mb-4 text-2xl">
              Your profile
            </h2>
            <ProfileForm
              initial={p}
              submitLabel={saved ? "Saved" : "Save changes"}
              onSubmit={(np) => {
                update((s) => ({ ...s, profile: np }));
                setSaved(true);
                setTimeout(() => setSaved(false), 1500);
              }}
            />
          </section>

          <section aria-labelledby="priv-h">
            <h2 id="priv-h" className="text-2xl">
              Privacy
            </h2>
            <div className="mt-2 divide-y rounded-2xl border bg-card px-4">
              <Toggle
                label="Blur my photo by default"
                desc="Others start at 0% reveal. Recommended."
                checked={p.blurPhoto}
                onChange={(v) => setP({ blurPhoto: v })}
              />
              <Toggle
                label="Show my age"
                desc="Displayed next to your name."
                checked={p.showAge}
                onChange={(v) => setP({ showAge: v })}
              />
              <Toggle
                label="Visible in Discover"
                desc="Turn off to pause. Existing connections stay."
                checked={p.discoverable}
                onChange={(v) => setP({ discoverable: v })}
              />
            </div>
          </section>
        </div>
      )}

      {ready && (
        <section aria-labelledby="safe-h" className="mt-10">
          <h2 id="safe-h" className="text-2xl">
            Safety
          </h2>
          <div className="mt-2 rounded-2xl border bg-card p-4">
            <h3 className="font-sans font-medium">Blocked</h3>
            {state.blocked.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nobody blocked.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {state.blocked.map((id) => (
                  <li key={id} className="flex items-center justify-between text-sm">
                    <span>{getDemoProfile(id)?.name ?? id}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        update((s) => ({ ...s, blocked: s.blocked.filter((b) => b !== id) }))
                      }
                    >
                      Unblock
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <h3 className="mt-4 font-sans font-medium">Reports sent</h3>
            <p className="text-sm text-muted-foreground">
              {state.reports.length === 0
                ? "None."
                : state.reports
                    .map((r) => `${getDemoProfile(r.id)?.name}: ${r.reason}`)
                    .join(" · ")}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              To block or report someone, open their session or chat and use Report / Block.
            </p>
          </div>
          <div className="mt-6 rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Demo mode.</strong> Everything is stored in this
              browser only. All other people are fictional. The blur is a visual prototype, not a
              security feature.
            </p>
            <Button
              variant="danger"
              size="sm"
              className="mt-3"
              onClick={() => {
                if (confirm("Reset all demo data, including your profile?")) reset();
              }}
            >
              Reset demo
            </Button>
          </div>
        </section>
      )}
    </AppShell>
  );
}