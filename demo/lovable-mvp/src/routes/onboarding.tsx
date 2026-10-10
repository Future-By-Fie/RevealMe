import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ProfileForm } from "@/components/ProfileForm";
import { DemoBadge } from "@/components/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Create your profile — RevealMe" },
      {
        name: "description",
        content:
          "Set up your RevealMe profile. Your photo stays blurred until you choose to connect.",
      },
      { property: "og:title", content: "Create your profile — RevealMe" },
      { property: "og:description", content: "Your photo stays blurred until you connect." },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const { update } = useStore();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-xl items-center justify-between px-5 py-5">
        <Link to="/" className="font-display text-2xl">
          Reveal<span className="text-primary">Me</span>
        </Link>
        <DemoBadge />
      </header>
      <main className="mx-auto max-w-xl px-5 pb-16 fade-up">
        <h1 className="text-4xl">Let's start with the basics</h1>
        <p className="mb-8 mt-2 text-muted-foreground">
          Nobody sees your face yet. That's the point.
        </p>
        <ProfileForm
          submitLabel="Start discovering"
          onSubmit={(profile) => {
            update((s) => ({ ...s, profile }));
            navigate({ to: "/discover" });
          }}
        />
      </main>
    </div>
  );
}