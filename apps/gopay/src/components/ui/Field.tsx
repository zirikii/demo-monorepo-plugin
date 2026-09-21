import { cn } from "@/lib/cn";
import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const TextField = forwardRef<HTMLInputElement, FieldProps>(function TextField(
  { label, error, className, id, ...props },
  ref,
) {
  const fieldId = id ?? props.name;
  return (
    <label className="block text-sm font-medium text-ink" htmlFor={fieldId}>
      {label}
      <input
        id={fieldId}
        ref={ref}
        className={cn(
          "mt-1.5 w-full rounded-2xl border border-line bg-white px-3.5 py-3 text-[15px] font-normal text-ink outline-none focus-visible:ring-2 focus-visible:ring-gopay",
          error && "border-danger",
          className,
        )}
        {...props}
      />
      {error ? <p className="mt-1 text-xs text-danger">{error}</p> : null}
    </label>
  );
});

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

export const SelectField = forwardRef<HTMLSelectElement, SelectProps>(function SelectField(
  { label, children, id, ...props },
  ref,
) {
  const fieldId = id ?? props.name;
  return (
    <label className="block text-sm font-medium text-ink" htmlFor={fieldId}>
      {label}
      <select
        id={fieldId}
        ref={ref}
        className="mt-1.5 w-full rounded-2xl border border-line bg-white px-3.5 py-3 text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-gopay"
        {...props}
      >
        {children}
      </select>
    </label>
  );
});
