import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, BarChart3, Eye, FileSpreadsheet, Files, Lock, LogIn, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { loginSchema, type LoginValues } from "../shared/types";
import { BrandMark, SkeletonLine } from "../shared/ui";

export function LoginPage({
  authError,
  onSubmit
}: {
  authError: string | null;
  onSubmit: (values: LoginValues) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" }
  });

  return (
    <main className="min-h-screen bg-[#eef7ff] p-5 text-[#072d4a]">
      <section className="grid min-h-[calc(100vh-40px)] overflow-hidden rounded-xl bg-white shadow-[0_18px_50px_rgba(7,45,74,0.18)] lg:grid-cols-[0.74fr_1fr]">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#0aa0ed] via-[#007fcb] to-[#072d4a] p-14 text-white lg:block">
          <div className="relative z-10">
            <BrandMark size="lg" />
            <p className="mt-4 max-w-xs text-xl leading-7 text-white/95">Conversion contable de archivos TXT a Excel</p>
          </div>
          <div className="relative z-10 mt-24 grid grid-cols-[1fr_auto_1fr] items-center gap-7">
            <FileCard label="TXT" tone="blue" />
            <div className="text-5xl font-semibold text-white/90">...</div>
            <FileCard label="XLSX" tone="green" />
          </div>
          <div className="relative z-10 mx-auto mt-12 h-32 max-w-sm rounded-lg border border-white/25 bg-white/10 p-5 shadow-2xl backdrop-blur">
            <BarChart3 className="h-16 w-16 text-[#7bd0fe]" />
          </div>
          <div className="relative z-10 mt-16 grid grid-cols-3 gap-6 text-center">
            <FeatureMini icon={ShieldCheck} label="Seguro" text="Protegemos tu informacion" />
            <FeatureMini icon={FileSpreadsheet} label="Conversion" text="TXT a Excel eficiente" />
            <FeatureMini icon={Files} label="Listo" text="Para tu plataforma contable" />
          </div>
        </div>

        <div className="flex min-h-full flex-col items-center justify-center bg-[#f6fbff] px-6 py-10">
          <form className="w-full max-w-[560px] rounded-xl border border-[#d8e8f6] bg-white p-10 shadow-[0_18px_42px_rgba(7,45,74,0.18)]" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex justify-center">
              <BrandMark dark size="xl" />
            </div>
            <p className="mt-4 text-center text-lg text-[#40577a]">Conversion contable de archivos TXT a Excel</p>
            <div className="my-8 flex items-center gap-4 text-[#7bd0fe]">
              <div className="h-px flex-1 bg-[#9ed8ff]" />
              <Lock className="h-5 w-5" />
              <div className="h-px flex-1 bg-[#9ed8ff]" />
            </div>

            <LoginField error={form.formState.errors.username?.message} icon={User} label="Usuario" placeholder="Ingresa tu usuario" registration={form.register("username")} />
            <LoginField
              action={<button className="flex h-full w-12 items-center justify-center text-[#8296b3]" onClick={() => setShowPassword((value) => !value)} type="button"><Eye size={22} /></button>}
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

            <button className="mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-md bg-[#007fcb] px-5 text-lg font-semibold text-white shadow-[0_12px_24px_rgba(0,127,203,0.28)] disabled:opacity-70" disabled={form.formState.isSubmitting} type="submit">
              <LogIn size={24} />
              Ingresar
            </button>
          </form>
          <p className="mt-12 text-sm text-[#6b7f9f]">© 2024 <span className="font-semibold text-[#007fcb]">SOFTBQ</span> | Version 1.0.0 | Aplicacion local</p>
        </div>
      </section>
    </main>
  );
}

export function LoginSkeleton() {
  return (
    <main className="min-h-screen bg-[#eef7ff] p-5">
      <section className="grid min-h-[calc(100vh-40px)] overflow-hidden rounded-xl bg-white shadow-[0_18px_50px_rgba(7,45,74,0.18)] lg:grid-cols-[0.74fr_1fr]">
        <div className="hidden bg-gradient-to-br from-[#0aa0ed] via-[#007fcb] to-[#072d4a] p-14 lg:block">
          <SkeletonLine className="h-16 w-64 bg-white/20" />
          <SkeletonLine className="mt-8 h-6 w-72 bg-white/20" />
          <div className="mt-24 grid grid-cols-2 gap-7">
            <SkeletonLine className="h-40 bg-white/20" />
            <SkeletonLine className="h-40 bg-white/20" />
          </div>
        </div>
        <div className="flex items-center justify-center bg-[#f6fbff] px-6 py-10">
          <div className="w-full max-w-[560px] rounded-xl border border-[#d8e8f6] bg-white p-10 shadow-[0_18px_42px_rgba(7,45,74,0.18)]">
            <SkeletonLine className="mx-auto h-20 w-72" />
            <SkeletonLine className="mt-10 h-14 w-full" />
            <SkeletonLine className="mt-5 h-14 w-full" />
            <SkeletonLine className="mt-7 h-14 w-full" />
          </div>
        </div>
      </section>
    </main>
  );
}

function LoginField({ action, error, icon: Icon, label, placeholder, registration, type = "text" }: any) {
  return (
    <label className="mt-5 block text-base font-bold text-[#072d4a]">
      {label}
      <div className="mt-2 flex h-14 overflow-hidden rounded-md border border-[#c9dbef] bg-white focus-within:border-[#0aa0ed]">
        <div className="flex w-14 items-center justify-center border-r border-[#e2edf8] bg-[#f6fbff] text-[#8296b3]"><Icon size={24} /></div>
        <input className="min-w-0 flex-1 px-4 text-base outline-none" placeholder={placeholder} type={type} {...registration} />
        {action}
      </div>
      {error ? <span className="mt-2 block text-xs text-red-600">{String(error)}</span> : null}
    </label>
  );
}

function FileCard({ label, tone }: { label: string; tone: "blue" | "green" }) {
  return <div className="relative h-40 rounded-lg bg-white p-6 shadow-2xl"><div className={`absolute left-4 top-12 rounded px-4 py-2 text-xl font-bold text-white ${tone === "blue" ? "bg-[#007fcb]" : "bg-emerald-600"}`}>{label}</div></div>;
}

function FeatureMini({ icon: Icon, label, text }: { icon: typeof ShieldCheck; label: string; text: string }) {
  return <div><Icon className="mx-auto h-8 w-8 text-[#7bd0fe]" /><p className="mt-2 font-semibold">{label}</p><p className="text-sm text-white/85">{text}</p></div>;
}
