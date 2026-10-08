import { blurFor, stageLabel, REVEAL_STAGES } from "@/lib/reveal";
import { cn } from "@/lib/utils";

export function RevealPhoto({ src, level, alt, className }: { src: string; level: number; alt: string; className?: string }) {
  const blur = blurFor(level);
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <img
        src={src}
        alt={level >= 100 ? alt : `${alt} — photo obscured, ${level}% revealed`}
        className="reveal-img h-full w-full object-cover"
        style={{ filter: `blur(${blur}px) saturate(${0.6 + level / 250})`, transform: `scale(${1 + blur / 120})` }}
      />
    </div>
  );
}

export function RevealMeter({ level, compact }: { level: number; compact?: boolean }) {
  return (
    <div aria-label={`Reveal level ${level} percent: ${stageLabel(level)}`} role="meter" aria-valuenow={level} aria-valuemin={0} aria-valuemax={100}>
      {!compact && (
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="font-medium">{stageLabel(level)}</span>
          <span className="tabular-nums text-muted-foreground">{level}%</span>
        </div>
      )}
      <div className="flex gap-1">
        {REVEAL_STAGES.slice(1).map((s) => (
          <div key={s} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-700", level >= s ? "bg-primary" : "bg-border")} />
        ))}
      </div>
    </div>
  );
}