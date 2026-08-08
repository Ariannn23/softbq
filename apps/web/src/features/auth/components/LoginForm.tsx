import { AlertCircle, Eye, Lock, LogIn, User } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

import type { LoginValues } from "../types";
import { useLoginForm } from "../hooks/useLoginForm";

export function LoginForm({
  authError,
  onSubmit,
}: {
  authError: string | null;
  onSubmit: (values: LoginValues) => void;
}) {
  const login = useLoginForm();

  return (
    <form className="w-full max-w-[420px] rounded-xl border border-[#d8e8f6] bg-white p-6 shadow-[0_18px_42px_rgba(7,45,74,0.18)]" onSubmit={login.form.handleSubmit(onSubmit)}>
      <h2 className="text-center text-3xl font-extrabold text-[#072d4a]">Inicia Sesion</h2>
      <div className="my-6 flex items-center gap-4 text-[#7bd0fe]">
        <div className="h-px flex-1 bg-[#9ed8ff]" />
        <Lock className="h-5 w-5" />
        <div className="h-px flex-1 bg-[#9ed8ff]" />
      </div>

      <LoginField error={login.form.formState.errors.username?.message} icon={User} label="Usuario" placeholder="Ingresa tu usuario" registration={login.form.register("username")} />
      <LoginField
        action={
          <button className="flex h-full w-12 items-center justify-center text-[#8296b3]" onClick={login.togglePassword} type="button">
            <Eye size={22} />
          </button>
        }
        error={login.form.formState.errors.password?.message}
        icon={Lock}
        label="Contrasena"
        placeholder="Ingresa tu contrasena"
        registration={login.form.register("password")}
        type={login.showPassword ? "text" : "password"}
      />

      {authError ? (
        <div className="mt-6 flex gap-4 rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-7 w-7 shrink-0" />
          <p className="text-sm font-medium leading-6">{authError}</p>
        </div>
      ) : null}

      <button className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#056ba6] px-5 text-base font-semibold text-white shadow-[0_12px_24px_rgba(0,127,203,0.28)] disabled:opacity-70" disabled={login.form.formState.isSubmitting} type="submit">
        <LogIn size={20} />
        Ingresar
      </button>
    </form>
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
}: {
  action?: React.ReactNode;
  error?: string;
  icon: typeof User;
  label: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  type?: string;
}) {
  return (
    <label className="mt-4 block text-sm font-bold text-[#072d4a]">
      {label}
      <div className="mt-2 flex h-12 overflow-hidden rounded-md border border-[#c9dbef] bg-white focus-within:border-[#0aa0ed]">
        <div className="flex w-12 items-center justify-center border-r border-[#e2edf8] bg-[#f6fbff] text-[#8296b3]">
          <Icon size={20} />
        </div>
        <input className="min-w-0 flex-1 px-4 text-sm outline-none" placeholder={placeholder} type={type} {...registration} />
        {action}
      </div>
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
