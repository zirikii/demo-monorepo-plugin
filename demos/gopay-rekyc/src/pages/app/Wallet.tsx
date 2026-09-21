import { useNavigate } from "react-router-dom";
import { PhoneAppBar, PhoneBody } from "@/components/phone/PhoneScreen";
import { PhoneBottomNav } from "@/components/phone/PhoneBottomNav";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { useDemo } from "@/state/useDemo";

const TRANSACTIONS = [
  { id: "tx1", merchant: "Kopi Kenangan", amount: -28_000, at: "2026-09-19T02:15:00.000Z" },
  { id: "tx2", merchant: "Top up BCA", amount: 500_000, at: "2026-09-18T11:40:00.000Z" },
  { id: "tx3", merchant: "GoRide", amount: -17_500, at: "2026-09-18T01:05:00.000Z" },
  { id: "tx4", merchant: "Tokopedia", amount: -239_000, at: "2026-09-16T08:22:00.000Z" },
];

export function Wallet() {
  const { state } = useDemo();
  const navigate = useNavigate();

  return (
    <>
      <PhoneAppBar
        title={state.locale === "id" ? "Dompet" : "Wallet"}
        onBack={() => navigate("/app")}
      />
      <PhoneBody className="space-y-3">
        <div className="rounded-2xl bg-surface px-4 py-3">
          <p className="text-xs text-ink-soft">{state.locale === "id" ? "Saldo" : "Balance"}</p>
          <p className="text-xl font-extrabold">{formatRupiah(842_500)}</p>
        </div>
        <ul className="divide-y divide-line-soft">
          {TRANSACTIONS.map((transaction) => (
            <li key={transaction.id} className="flex items-center justify-between gap-3 py-3">
              <span>
                <span className="block text-sm font-semibold">{transaction.merchant}</span>
                <span className="block text-[11px] text-ink-faint">
                  {formatDateTime(transaction.at, state.locale)}
                </span>
              </span>
              <span
                className={
                  transaction.amount > 0
                    ? "text-sm font-bold text-state-success"
                    : "text-sm font-bold text-ink"
                }
              >
                {formatRupiah(transaction.amount)}
              </span>
            </li>
          ))}
        </ul>
      </PhoneBody>
      <PhoneBottomNav />
    </>
  );
}
