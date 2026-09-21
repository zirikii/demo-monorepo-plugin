import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PhoneBody } from "@/components/phone/PhoneScreen";
import { NOT_MY_EKTP_ARTICLE } from "@/data/help";
import { S } from "@/data/strings";
import { formatDate } from "@/lib/format";
import { useDemo } from "@/state/useDemo";

/** In-app browser chrome — opening it never starts a session or triggers FR/capture/Dukcapil. */
export function HelpArticle() {
  const { state, t } = useDemo();
  const navigate = useNavigate();
  const article = NOT_MY_EKTP_ARTICLE;

  return (
    <>
      <header className="shrink-0 border-b border-line bg-surface px-3 py-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-xs font-bold text-gopay-deep"
          >
            {t(S.inAppBrowserClose)}
          </button>
          <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-[11px] text-ink-soft">
            <Lock size={11} className="shrink-0" />
            <span className="truncate">{article.url}</span>
          </span>
        </div>
      </header>
      <PhoneBody className="space-y-4 pt-4">
        <div>
          <h1 className="text-lg font-extrabold leading-snug">{t(article.title)}</h1>
          <p className="mt-1 text-[11px] text-ink-faint">
            {state.locale === "id" ? "Diperbarui" : "Updated"}{" "}
            {formatDate(article.updatedAt, state.locale)}
          </p>
        </div>
        {article.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-sm leading-relaxed text-ink-soft">
            {t(paragraph)}
          </p>
        ))}
        <ol className="space-y-2">
          {article.steps.map((step, index) => (
            <li key={index} className="flex gap-2.5 text-sm text-ink">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gopay-tint text-[11px] font-bold text-gopay-deep">
                {index + 1}
              </span>
              {t(step)}
            </li>
          ))}
        </ol>
      </PhoneBody>
    </>
  );
}
