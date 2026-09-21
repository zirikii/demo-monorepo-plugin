import { useNavigate, useParams } from "react-router-dom";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { helpNotMine } from "@/data/copy-config";

export function HelpPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = slug === helpNotMine.slug ? helpNotMine : helpNotMine;
  return (
    <ConsumerLayout title="Bantuan" showNav={false}>
      <AppHeader title="Pusat bantuan" onBack={() => navigate(-1)} />
      <article className="px-5 py-5">
        <h2 className="text-lg font-extrabold">{article.title}</h2>
        {article.body.map((p) => (
          <p key={p} className="mt-3 text-sm leading-relaxed text-ink-soft">
            {p}
          </p>
        ))}
      </article>
    </ConsumerLayout>
  );
}
