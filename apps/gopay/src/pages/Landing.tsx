import { Link } from "react-router-dom";
import { DemoRibbon } from "@/components/ui/DemoRibbon";
import { ButtonLink } from "@/components/ui/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function LandingPage() {
  useDocumentTitle("GoPay ReKYC — Demo");
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <img src="/brand/logo-green.svg" alt="GoPay" className="h-8" />
        <div className="flex items-center gap-3">
          <DemoRibbon label="Unofficial demo" className="border-line text-ink-faint" />
          <ButtonLink to="/login" size="sm">
            Buka aplikasi
          </ButtonLink>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-semibold text-gopay">Self-serve ReKYC</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
          Perbarui data e-KTP tanpa turun dari GoPay Plus.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">
          Demo alur konsumen dari Pusat Akun Terverifikasi, Dira, verifikasi wajah, foto e-KTP, sampai
          antrian agen EMoney. Bukan produk resmi GoPay.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/login">Masuk sebagai Sari</ButtonLink>
          <ButtonLink to="/emoney" variant="secondary">
            Portal EMoney
          </ButtonLink>
        </div>
        <ul className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            { t: "VAC", d: "Identitas terverifikasi, data tertutup, mulai update." },
            { t: "OneKYC capture", d: "FR dulu, copy rekyc, skip selfie kedua." },
            { t: "EMoney", d: "Initial KYC + reverification dalam satu list." },
          ].map((item) => (
            <li key={item.t} className="rounded-3xl border border-line p-5">
              <h2 className="font-bold">{item.t}</h2>
              <p className="mt-1 text-sm text-ink-soft">{item.d}</p>
            </li>
          ))}
        </ul>
      </main>
      <footer className="border-t border-line px-6 py-8 text-center text-xs text-ink-faint">
        Unofficial demo — not affiliated with GoPay, Gojek, or GoTo.{" "}
        <Link to="/login" className="text-gopay">
          Login
        </Link>
      </footer>
    </div>
  );
}
