import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const schema = z.object({
  name: z.string().min(2, "Nama terlalu pendek"),
  email: z.string().email("Masukkan email yang valid"),
  password: z.string().min(4, "Minimal 4 karakter"),
});

type FormValues = z.infer<typeof schema>;

export function SignupPage() {
  useDocumentTitle("Daftar — GoPay (Demo)");
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "Sari Wulandari", email: "sari.wulandari@gopay.id", password: "demo1234" },
  });

  const onSubmit = handleSubmit((values) => {
    login(values.email, values.password, { name: values.name, role: "consumer" });
    navigate("/app");
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <img src="/brand/logo-green.svg" alt="GoPay" className="h-8 w-auto" />
      <h1 className="mt-8 text-2xl font-extrabold">Buat akun demo</h1>
      <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
        <TextField label="Nama" error={errors.name?.message} {...register("name")} />
        <TextField label="Email" type="email" error={errors.email?.message} {...register("email")} />
        <TextField
          label="Kata sandi"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Lanjut
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        Sudah punya akun?{" "}
        <Link to="/login" className="font-bold text-gopay">
          Masuk
        </Link>
      </p>
    </div>
  );
}
