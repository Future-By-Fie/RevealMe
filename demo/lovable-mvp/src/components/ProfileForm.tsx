import { useState, type FormEvent } from "react";
import { Lock, Upload } from "lucide-react";
import type { MyProfile } from "@/lib/store";
import { Button, inputCls, labelCls } from "./ui-kit";
import { RevealPhoto } from "./RevealPhoto";

/** Downscale uploads so they fit in localStorage (demo mode). */
function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 600, s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = img.width * s; c.height = img.height * s;
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = reject;
    img.src = url;
  });
}

type Errors = Partial<Record<"name" | "age" | "bio", string>>;

export function ProfileForm({ initial, submitLabel, onSubmit }: { initial?: MyProfile | null; submitLabel: string; onSubmit: (p: MyProfile) => void }) {
  const [p, setP] = useState<MyProfile>(initial ?? { name: "", age: 0, bio: "", blurPhoto: true, showAge: true, discoverable: true });
  const [ageStr, setAgeStr] = useState(initial?.age ? String(initial.age) : "");
  const [err, setErr] = useState<Errors>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const age = Number(ageStr);
    const errors: Errors = {};
    if (!p.name.trim()) errors.name = "Please add your first name.";
    if (!ageStr || Number.isNaN(age)) errors.age = "Please add your age.";
    else if (age < 18) errors.age = "RevealMe is for adults 18 and over.";
    else if (age > 120) errors.age = "Please enter a valid age.";
    if (p.bio.length > 160) errors.bio = "Keep it under 160 characters.";
    setErr(errors);
    if (Object.keys(errors).length) return;
    onSubmit({ ...p, name: p.name.trim(), age });
  };

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="flex items-center gap-4">
        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl border bg-muted">
          {p.photo ? <RevealPhoto src={p.photo} level={25} alt="Your photo" className="h-full w-full" /> : <div className="grid h-full place-items-center text-muted-foreground"><Upload className="h-5 w-5" aria-hidden /></div>}
        </div>
        <div className="min-w-0">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-muted focus-within:ring-2 focus-within:ring-ring">
            <Upload className="h-4 w-4" aria-hidden /> {p.photo ? "Change photo" : "Upload photo"}
            <input type="file" accept="image/*" className="sr-only" onChange={async (e) => {
              const f = e.target.files?.[0]; if (f) setP({ ...p, photo: await readImage(f) });
            }} />
          </label>
          <p className="mt-2 text-xs text-muted-foreground">Preview shows how others first see you.</p>
        </div>
      </div>

      <div className="flex gap-3 rounded-2xl bg-accent/60 p-4 text-sm text-accent-foreground">
        <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p>Your photo starts <strong>blurred</strong> for everyone. It only becomes clearer as you and someone else interact — and reveal is always mutual. In this prototype, your photo stays in this browser only.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>First name</label>
          <input id="name" className={inputCls} value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} aria-invalid={!!err.name} autoComplete="given-name" />
          {err.name && <p className="mt-1 text-sm text-destructive">{err.name}</p>}
        </div>
        <div>
          <label htmlFor="age" className={labelCls}>Age</label>
          <input id="age" inputMode="numeric" className={inputCls} value={ageStr} onChange={(e) => setAgeStr(e.target.value.replace(/\D/g, ""))} aria-invalid={!!err.age} />
          {err.age && <p className="mt-1 text-sm text-destructive">{err.age}</p>}
        </div>
        <div>
          <label htmlFor="gender" className={labelCls}>Gender / identity <span className="font-normal text-muted-foreground">(optional)</span></label>
          <input id="gender" className={inputCls} value={p.gender ?? ""} onChange={(e) => setP({ ...p, gender: e.target.value })} />
        </div>
        <div>
          <label htmlFor="seeking" className={labelCls}>Who you'd like to meet <span className="font-normal text-muted-foreground">(optional)</span></label>
          <select id="seeking" className={inputCls} value={p.seeking ?? ""} onChange={(e) => setP({ ...p, seeking: e.target.value })}>
            <option value="">No preference</option>
            <option>Women</option><option>Men</option><option>Non-binary people</option><option>Everyone</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="bio" className={labelCls}>Short bio</label>
        <textarea id="bio" rows={3} className={inputCls} value={p.bio} onChange={(e) => setP({ ...p, bio: e.target.value })} placeholder="A few words about what you're into…" />
        <p className={`mt-1 text-xs ${err.bio ? "text-destructive" : "text-muted-foreground"}`}>{err.bio ?? `${p.bio.length}/160`}</p>
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-auto">{submitLabel}</Button>
    </form>
  );
}