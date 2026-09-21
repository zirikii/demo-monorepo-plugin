import { Lock } from "lucide-react";
import { FIELD_LABELS } from "@/data/fields";
import { pick } from "@/data/strings";
import { isMaskedField, maskField } from "@/domain/masking";
import type { IdentityData, IdentityField, Locale } from "@/domain/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

function displayValue(
  identity: IdentityData,
  field: IdentityField,
  locale: Locale,
  masked: boolean,
): string {
  const raw = identity[field];
  if (masked && isMaskedField(field)) return maskField(field, raw);
  if (field === "dateOfBirth") return formatDate(raw, locale);
  return raw;
}

export function IdentityList({
  identity,
  fields,
  locale,
  masked = true,
  dense = false,
}: {
  identity: IdentityData;
  fields: IdentityField[];
  locale: Locale;
  masked?: boolean;
  dense?: boolean;
}) {
  return (
    <dl className="divide-y divide-line-soft">
      {fields.map((field) => {
        const isMasked = masked && isMaskedField(field);
        return (
          <div
            key={field}
            className={cn("flex items-start justify-between gap-4", dense ? "py-2" : "py-2.5")}
            data-testid={`identity-field-${field}`}
          >
            <dt className="text-xs font-medium text-ink-soft">{pick(FIELD_LABELS[field], locale)}</dt>
            <dd
              className={cn(
                "text-right text-sm font-semibold text-ink",
                isMasked && "font-mono tracking-tight",
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                {isMasked ? <Lock size={11} className="text-ink-faint" aria-hidden /> : null}
                {displayValue(identity, field, locale, masked)}
              </span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
