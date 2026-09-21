import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { DemoRibbon } from "@/components/ui/DemoRibbon";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const schema = z.object({
  email: z.string().email("Masukkan email yang valid"),
  password: z.string().min(1, "Masukkan kata sandi"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  useDocumentTitle("Masuk — GoPay (Demo)");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "sari.wulandari@gopay.id", password: "demo1234" },
  });

  const onSubmit = handleSubmit((values) => {
    login(values.email, values.password);
    const redirect = params.get("redirect") || "/app";
    navigate(redirect);
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <img src="/brand/logo-green.svg" alt="GoPay" className="h-8 w-auto" />
      <DemoRibbon label="Unofficial demo" className="mt-3 w-fit border-line text-ink-faint" />
      <h1 className="mt-8 text-2xl font-extrabold tracking-tight">Masuk ke GoPay</h1>
      <p className="mt-1 text-sm text-ink-soft">Lanjut ke Pusat Akun Terverifikasi dan ReKYC.</p>
      <div className="mt-5 rounded-2xl bg-gopay-tint px-4 py-3 text-sm text-gopay-deep">
        Demo mode — email dan kata sandi apa pun diterima. Prefill: sari.wulandari@gopay.id / demo1234
      </div>
      <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label="Kata sandi"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Masuk
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        Belum punya akun?{" "}
        <Link to="/signup" className="font-bold text-gopay">
          Daftar
        </Link>
      </p>
    </div>
  );
}
