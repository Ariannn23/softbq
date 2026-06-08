import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileSpreadsheet,
  Loader2,
  LockKeyhole,
  LogOut,
  UsersRound
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const cards = [
  { title: "Clientes", value: "Base local", icon: UsersRound },
  { title: "Conversiones", value: "SIRE a Contasis", icon: FileSpreadsheet },
  { title: "Acceso", value: "admin / armando", icon: LockKeyhole }
];

const loginSchema = z.object({
  username: z.string().trim().min(1, "Ingresa tu usuario"),
  password: z.string().min(1, "Ingresa tu contrasena")
});

type LoginValues = z.infer<typeof loginSchema>;

type SessionUser = {
  id: number;
  username: string;
  role: "admin" | "principal_accountant";
};

export function App() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include"
        });

        if (response.ok) {
          const data = (await response.json()) as { user: SessionUser };
          setUser(data.user);
        }
      } finally {
        setCheckingSession(false);
      }
    }

    void loadSession();
  }, []);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  async function handleLogin(values: LoginValues) {
    setAuthError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      setAuthError("Usuario o contrasena incorrectos.");
      return;
    }

    const data = (await response.json()) as { user: SessionUser };
    setUser(data.user);
    form.reset();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });

    setUser(null);
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-6 py-10 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">SOFTBQ</p>
            <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-tight">
              Acceso local para el estudio contable
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              Ingresa con tu usuario para administrar clientes, conversiones SIRE y archivos Contasis desde la red local.
            </p>
          </div>

          <form
            className="rounded-lg border border-border bg-white p-6 shadow-sm"
            onSubmit={form.handleSubmit(handleLogin)}
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-muted text-primary">
              <LockKeyhole size={22} />
            </div>
            <h2 className="text-xl font-semibold">Iniciar sesion</h2>

            <label className="mt-6 block text-sm font-medium" htmlFor="username">
              Usuario
            </label>
            <input
              className="mt-2 h-10 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-primary"
              id="username"
              autoComplete="username"
              {...form.register("username")}
            />
            {form.formState.errors.username ? (
              <p className="mt-2 text-sm text-red-600">
                {form.formState.errors.username.message}
              </p>
            ) : null}

            <label className="mt-4 block text-sm font-medium" htmlFor="password">
              Contrasena
            </label>
            <input
              className="mt-2 h-10 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-primary"
              id="password"
              type="password"
              autoComplete="current-password"
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <p className="mt-2 text-sm text-red-600">
                {form.formState.errors.password.message}
              </p>
            ) : null}

            {authError ? <p className="mt-4 text-sm text-red-600">{authError}</p> : null}

            <button
              className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-70"
              disabled={form.formState.isSubmitting}
              type="submit"
            >
              {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Ingresar
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">SOFTBQ</p>
            <h1 className="text-2xl font-semibold">Panel local del estudio contable</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sesion activa: {user.username}
            </p>
          </div>
          <button
            className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium"
            onClick={handleLogout}
            type="button"
          >
            <LogOut size={16} />
            Cerrar sesion
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="rounded-lg border border-border bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-muted text-primary">
                  <Icon size={20} />
                </div>
                <h2 className="text-sm font-medium text-muted-foreground">{card.title}</h2>
                <p className="mt-1 text-xl font-semibold">{card.value}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">MVP inicial</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Esta base separa la UI, el backend y los paquetes de conversion. El siguiente paso es implementar login,
            clientes, validacion de archivos SIRE y generacion Excel para Contasis.
          </p>
        </div>
      </section>
    </main>
  );
}
