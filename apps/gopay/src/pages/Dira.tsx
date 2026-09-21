import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/Button";
import { diraIntents } from "@/data/edd";

type Msg = { id: string; from: "user" | "dira"; text: string; cta?: "rekyc" };

function isRekycIntent(text: string): boolean {
  const lower = text.toLowerCase();
  return diraIntents.rekyc.some((k) => lower.includes(k));
}

export function DiraPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "m0",
      from: "dira",
      text: "Hai, aku Dira. Mau update data KTP? Ceritain aja — aku arahkan ke ReKYC, bukan tiket CCU.",
    },
  ]);
  const navigate = useNavigate();

  function send() {
    const text = input.trim();
    if (!text) return;
    const userMsg: Msg = { id: `u${Date.now()}`, from: "user", text };
    const rekyc = isRekycIntent(text);
    const reply: Msg = rekyc
      ? {
          id: `d${Date.now()}`,
          from: "dira",
          text: "Kamu bisa perbarui data e-KTP sendiri tanpa turunin GoPay Plus. Aku bukain alur ReKYC ya.",
          cta: "rekyc",
        }
      : {
          id: `d${Date.now()}`,
          from: "dira",
          text: "Aku bantu soal GoPay. Kalau mau ganti data e-KTP / nama / alamat, ketik “perbarui KTP”.",
        };
    setMessages((m) => [...m, userMsg, reply]);
    setInput("");
  }

  return (
    <ConsumerLayout title="Dira">
      <AppHeader title="Dira" onBack={() => navigate("/app")} />
      <div className="flex h-[640px] flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m) => (
            <div key={m.id} className={m.from === "user" ? "text-right" : "text-left"}>
              <div
                className={
                  m.from === "user"
                    ? "inline-block rounded-2xl bg-gopay px-3 py-2 text-sm text-white"
                    : "inline-block rounded-2xl bg-surface px-3 py-2 text-sm text-ink"
                }
              >
                {m.text}
              </div>
              {m.cta === "rekyc" ? (
                <div>
                  <Button className="mt-2" size="sm" onClick={() => navigate("/app/rekyc")}>
                    Mulai ReKYC
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <form
          className="flex gap-2 border-t border-line-soft p-3"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            className="flex-1 rounded-full border border-line px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-gopay"
            placeholder="Tulis pesan…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Pesan ke Dira"
          />
          <Button type="submit" size="sm">
            Kirim
          </Button>
        </form>
      </div>
    </ConsumerLayout>
  );
}
