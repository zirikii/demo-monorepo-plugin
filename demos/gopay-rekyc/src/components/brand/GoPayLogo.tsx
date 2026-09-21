/**
 * Typographic stand-in for the GoPay wordmark. The real brand asset could not be fetched (the
 * GoPay media kit is outside this environment's network allowlist) and inventing a look-alike mark
 * would be worse than an honest text logo.
 */
export function GoPayLogo({ className, tone = "brand" }: { className?: string; tone?: "brand" | "light" }) {
  const primary = tone === "light" ? "#ffffff" : "var(--color-gopay)";
  const secondary = tone === "light" ? "rgba(255,255,255,0.75)" : "var(--color-gopay-dark)";
  return (
    <span className={className} aria-label="GoPay (demo)" role="img">
      <svg viewBox="0 0 108 28" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="12" fill={primary} />
        <path
          d="M20 10.6a7 7 0 1 0 1 3.6h-6.4v-2.6H20Z"
          fill="#ffffff"
        />
        <text
          x="33"
          y="20"
          fill={secondary}
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="18"
          fontWeight="800"
          letterSpacing="-0.6"
        >
          GoPay
        </text>
      </svg>
    </span>
  );
}
