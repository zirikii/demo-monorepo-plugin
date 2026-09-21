import { Link } from "react-router-dom";
import { useRekyc } from "@/hooks/useRekyc";
import { formatDateId } from "@/lib/format";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function CallbacksPage() {
  useDocumentTitle("Partner callbacks — GoPay (Demo)");
  const { store } = useRekyc();
  return (
    <div className="min-h-screen bg-surface px-6 py-8">
      <Link to="/emoney" className="text-sm font-semibold text-gopay">
        ← Submissions
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold">Partner callbacks</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Payload: account id, event, timestamp — no identity data.
      </p>
      <ul className="mt-6 space-y-3">
        {store.callbacks.length === 0 ? (
          <li className="text-sm text-ink-faint">Belum ada callback. Approve ReKYC di app konsumen.</li>
        ) : (
          store.callbacks.map((cb) => (
            <li key={cb.id} className="rounded-2xl border border-line bg-white px-4 py-3 text-sm">
              <p className="font-bold">
                {cb.partner} · {cb.event}
              </p>
              <p className="text-ink-soft">
                {cb.accountId} · {formatDateId(cb.timestamp)}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
