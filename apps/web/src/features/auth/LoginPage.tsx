import { LoginForm } from "./components/LoginForm";
import { LoginVisualPanel } from "./components/LoginVisualPanel";
import type { LoginValues } from "./types";
import { SkeletonLine } from "../shared/ui";

export function LoginPage({
  authError,
  onSubmit,
}: {
  authError: string | null;
  onSubmit: (values: LoginValues) => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#eef7ff] p-4 sm:p-8 text-[#072d4a]">
      <section className="w-full max-w-5xl grid overflow-hidden rounded-xl bg-white shadow-[0_18px_50px_rgba(7,45,74,0.18)] lg:grid-cols-[0.8fr_1fr]">
        <LoginVisualPanel />
        <div className="flex min-h-full flex-col items-center justify-center bg-[#f6fbff] px-6 py-6">
          <LoginForm authError={authError} onSubmit={onSubmit} />
          <p className="mt-6 text-xs text-[#6b7f9f]">
            © 2026 <span className="font-semibold text-[#056ba6]">Desarrollado por SharkCorp</span>
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
