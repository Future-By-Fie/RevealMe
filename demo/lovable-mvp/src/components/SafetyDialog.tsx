import { useState } from "react";
import { Button, inputCls } from "./ui-kit";

const REASONS = ["Inappropriate messages", "Fake profile", "Harassment", "Underage", "Something else"];

/** Lightweight modal for Report / Block confirmation. */
export function SafetyDialog({ kind, name, onClose, onConfirm }: { kind: "report" | "block"; name: string; onClose: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState<string>(REASONS[0] ?? "Something else");
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/40 p-4 sm:place-items-center" role="dialog" aria-modal="true" aria-labelledby="safety-title" onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="fade-up w-full max-w-md rounded-3xl bg-card p-6 shadow-soft">
        <h2 id="safety-title" className="text-2xl">{kind === "report" ? `Report ${name}` : `Block ${name}?`}</h2>
        {kind === "report" ? (
          <>
            <p className="mt-2 text-sm text-muted-foreground">Reports are reviewed by our team. In this demo, they're saved locally only.</p>
            <label htmlFor="reason" className="mt-4 block text-sm font-medium">Reason</label>
            <select id="reason" autoFocus className={`${inputCls} mt-1.5`} value={reason} onChange={(e) => setReason(e.target.value)}>
              {REASONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">They won't see you, and your session and messages will be hidden. You can unblock in Profile.</p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} autoFocus={kind === "block"}>Cancel</Button>
          <Button variant="danger" onClick={() => onConfirm(reason)}>{kind === "report" ? "Send report" : "Block"}</Button>
        </div>
      </div>
    </div>
  );
}