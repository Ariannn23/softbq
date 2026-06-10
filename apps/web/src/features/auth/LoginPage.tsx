import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  BarChart3,
  Eye,
  FileSpreadsheet,
  Files,
  Lock,
  LogIn,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { loginSchema, type LoginValues } from "../shared/types";
import { BrandMark, SkeletonLine } from "../shared/ui";

export function LoginPage({
  authError,
  onSubmit,
}: {
  authError: string | null;
  onSubmit: (values: LoginValues) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#eef7ff] p-4 sm:p-8 text-[#072d4a]">
      <section className="w-full max-w-5xl grid overflow-hidden rounded-xl bg-white shadow-[0_18px_50px_rgba(7,45,74,0.18)] lg:grid-cols-[0.8fr_1fr]">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#0aa0ed] via-[#056ba6] to-[#072d4a] p-8 lg:block">
          <div className="relative z-10 flex flex-col items-center text-center">
            <BrandMark size="lg" />
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#063b5f]">
              Software Contable
            </p>
          </div>
          <div className="relative z-10 mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <FileCard label="TXT" tone="blue" />
            <div className="text-3xl font-semibold text-white/90">...</div>
            <FileCard label="XLSX" tone="green" />
          </div>
          <div className="relative z-10 mx-auto mt-8 flex h-24 max-w-[200px] items-center justify-center rounded-lg border border-white/25 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <BarChart3 className="h-10 w-10 text-[#7bd0fe]" />
          </div>
          <div className="relative z-10 mt-8 grid grid-cols-3 gap-3 text-center">
            <FeatureMini
              icon={ShieldCheck}
              label="Seguro"
              text="Protegemos tu informacion"
            />
            <FeatureMini
              icon={FileSpreadsheet}
              label="Conversion"
              text="TXT a Excel eficiente"
            />
            <FeatureMini
              icon={Files}
              label="Listo"
              text="Para tu plataforma contable"
            />
          </div>
        </div>

        <div className="flex min-h-full flex-col items-center justify-center bg-[#f6fbff] px-6 py-6">
          <form
            className="w-full max-w-[420px] rounded-xl border border-[#d8e8f6] bg-white p-6 shadow-[0_18px_42px_rgba(7,45,74,0.18)]"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <h2 className="text-center text-3xl font-extrabold text-[#072d4a]">
              Inicia Sesión
            </h2>
            <div className="my-6 flex items-center gap-4 text-[#7bd0fe]">
              <div className="h-px flex-1 bg-[#9ed8ff]" />
              <Lock className="h-5 w-5" />
              <div className="h-px flex-1 bg-[#9ed8ff]" />
            </div>

            <LoginField
              error={form.formState.errors.username?.message}
              icon={User}
              label="Usuario"
              placeholder="Ingresa tu usuario"
              registration={form.register("username")}
            />
            <LoginField
              action={
                <button
                  className="flex h-full w-12 items-center justify-center text-[#8296b3]"
                  onClick={() => setShowPassword((value) => !value)}
                  type="button"
                >
                  <Eye size={22} />
                </button>
              }
              error={form.formState.errors.password?.message}
              icon={Lock}
              label="Contrasena"
              placeholder="Ingresa tu contrasena"
              registration={form.register("password")}
              type={showPassword ? "text" : "password"}
            />

            {authError ? (
              <div className="mt-6 flex gap-4 rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
                <AlertCircle className="mt-0.5 h-7 w-7 shrink-0" />
                <p className="text-sm font-medium leading-6">{authError}</p>
              </div>
            ) : null}

            <button
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#056ba6] px-5 text-base font-semibold text-white shadow-[0_12px_24px_rgba(0,127,203,0.28)] disabled:opacity-70"
              disabled={form.formState.isSubmitting}
              type="submit"
            >
              <LogIn size={20} />
              Ingresar
            </button>
          </form>
          <p className="mt-6 text-xs text-[#6b7f9f]">
            © 2026{" "}
            <span className="font-semibold text-[#056ba6]">
              Desarrollado por SharkCorp
            </span>
          </p>
        </div>
      </section>
    </main>
  );
}

export function LoginSkeleton() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#eef7ff] p-4 sm:p-8">
      <section className="w-full max-w-6xl grid overflow-hidden rounded-xl bg-white shadow-[0_18px_50px_rgba(7,45,74,0.18)] lg:grid-cols-[0.8fr_1fr]">
        <div className="hidden bg-gradient-to-br from-[#0aa0ed] via-[#056ba6] to-[#072d4a] p-10 lg:block">
          <SkeletonLine className="h-14 w-56 bg-white/20" />
          <SkeletonLine className="mt-6 h-5 w-64 bg-white/20" />
          <div className="mt-16 grid grid-cols-2 gap-6">
            <SkeletonLine className="h-32 bg-white/20" />
            <SkeletonLine className="h-32 bg-white/20" />
          </div>
        </div>
        <div className="flex items-center justify-center bg-[#f6fbff] px-6 py-8">
          <div className="w-full max-w-[480px] rounded-xl border border-[#d8e8f6] bg-white p-8 shadow-[0_18px_42px_rgba(7,45,74,0.18)]">
            <SkeletonLine className="mx-auto h-16 w-64" />
            <SkeletonLine className="mt-8 h-12 w-full" />
            <SkeletonLine className="mt-4 h-12 w-full" />
            <SkeletonLine className="mt-6 h-12 w-full" />
          </div>
        </div>
      </section>
    </main>
  );
}

function LoginField({
  action,
  error,
  icon: Icon,
  label,
  placeholder,
  registration,
  type = "text",
}: any) {
  return (
    <label className="mt-4 block text-sm font-bold text-[#072d4a]">
      {label}
      <div className="mt-2 flex h-12 overflow-hidden rounded-md border border-[#c9dbef] bg-white focus-within:border-[#0aa0ed]">
        <div className="flex w-12 items-center justify-center border-r border-[#e2edf8] bg-[#f6fbff] text-[#8296b3]">
          <Icon size={20} />
        </div>
        <input
          className="min-w-0 flex-1 px-4 text-sm outline-none"
          placeholder={placeholder}
          type={type}
          {...registration}
        />
        {action}
      </div>
      {error ? (
        <span className="mt-1 block text-xs text-red-600">{String(error)}</span>
      ) : null}
    </label>
  );
}

function FileCard({ label, tone }: { label: string; tone: "blue" | "green" }) {
  return (
    <div className="relative h-24 rounded-lg bg-white p-4 shadow-2xl">
      <div
        className={`absolute left-3 top-6 rounded px-3 py-1.5 text-lg font-bold text-white ${tone === "blue" ? "bg-[#056ba6]" : "bg-emerald-600"}`}
      >
        {label}
      </div>
    </div>
  );
}

function FeatureMini({
  icon: Icon,
  label,
  text,
}: {
  icon: typeof ShieldCheck;
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm transition-all hover:bg-white/15">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
        <Icon className="h-4 w-4 text-[#7bd0fe]" />
      </div>
      <p className="mt-1.5 text-sm font-bold text-white">{label}</p>
      <p className="mt-0.5 text-[11px] leading-tight text-white/80">{text}</p>
    </div>
  );
}
