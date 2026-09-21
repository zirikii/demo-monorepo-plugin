export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  hint,
  format = (v: number) => v.toFixed(2),
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (next: number) => void;
  hint?: string;
  format?: (value: number) => string;
}) {
  return (
    <label className="block py-2">
      <span className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <span className="font-mono text-xs text-ink-soft">{format(value)}</span>
      </span>
      <input
        type="range"
        className="mt-2 w-full accent-[var(--color-gopay)]"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {hint ? <span className="block text-xs text-ink-faint">{hint}</span> : null}
    </label>
  );
}
