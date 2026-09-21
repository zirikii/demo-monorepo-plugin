import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function NotFoundPage() {
  useDocumentTitle("Tidak ditemukan — GoPay (Demo)");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <p className="text-lg font-bold">Halaman tidak ada</p>
      <Link to="/" className="text-gopay">
        Ke beranda
      </Link>
    </div>
  );
}
