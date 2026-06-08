import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Ban,
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronDown,
  Circle,
  Eye,
  FileSpreadsheet,
  Files,
  HelpCircle,
  Home,
  Laptop,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Menu,
  Pencil,
  PlusCircle,
  Search,
  Settings,
  ShieldCheck,
  Upload,
  User,
  UserCheck,
  Users,
  XCircle
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Ingresa tu usuario"),
  password: z.string().min(1, "Ingresa tu contrasena")
});

const clientSchema = z.object({
  ruc: z.string().regex(/^\d{11}$/, "El RUC debe tener 11 digitos"),
  businessName: z.string().trim().min(1, "Ingresa la razon social"),
  shortName: z.string().trim().min(1, "Ingresa el nombre corto"),
  contasisEntityCode: z.string().trim().min(1, "Ingresa el codigo"),
  contasisEntityDescription: z.string().trim().min(1, "Ingresa la descripcion"),
  defaultCondition: z.string().trim().min(1, "Ingresa la condicion"),
  defaultPaymentMethod: z.string().trim().min(1, "Ingresa el medio de pago"),
  defaultIgvPercent: z.coerce.number().min(0).max(100)
});

type LoginValues = z.infer<typeof loginSchema>;
type ClientValues = z.infer<typeof clientSchema>;
type View = "dashboard" | "clients";

type SessionUser = {
  id: number;
  username: string;
  role: "admin" | "principal_accountant";
};

type Client = ClientValues & {
  id: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

const emptyClient: ClientValues = {
  ruc: "",
  businessName: "",
  shortName: "",
  contasisEntityCode: "01",
  contasisEntityDescription: "MI ORGANIZACION",
  defaultCondition: "CON",
  defaultPaymentMethod: "008",
  defaultIgvPercent: 18
};

const navItems = [
  { id: "dashboard", label: "Panel Principal", icon: Home },
  { id: "conversions", label: "Conversiones", icon: FileSpreadsheet },
  { id: "clients", label: "Clientes", icon: Users },
  { id: "outputs", label: "Archivos Generados", icon: Files },
  { id: "reports", label: "Reportes", icon: BarChart3 },
  { id: "settings", label: "Configuracion", icon: Settings },
  { id: "users", label: "Usuarios", icon: User },
  { id: "logs", label: "Logs del Sistema", icon: FileSpreadsheet }
] as const;

export function App() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [clientsVersion, setClientsVersion] = useState(0);

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
      setAuthError("Usuario o contrasena incorrectos. Verifica tus datos e intentalo nuevamente.");
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
      <LoginScreen
        authError={authError}
        form={form}
        onSubmit={(values) => void handleLogin(values)}
      />
    );
  }

  return (
    <AppShell
      activeView={activeView}
      clientsVersion={clientsVersion}
      onClientsChanged={() => setClientsVersion((version) => version + 1)}
      onLogout={() => void handleLogout()}
      onNavigate={setActiveView}
      user={user}
    />
  );
}

function LoginScreen({
  authError,
  form,
  onSubmit
}: {
  authError: string | null;
  form: ReturnType<typeof useForm<LoginValues>>;
  onSubmit: (values: LoginValues) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#eef7ff] p-5 text-[#072d4a]">
      <section className="grid min-h-[calc(100vh-40px)] overflow-hidden rounded-xl bg-white shadow-[0_18px_50px_rgba(7,45,74,0.18)] lg:grid-cols-[0.74fr_1fr]">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#0aa0ed] via-[#007fcb] to-[#072d4a] p-14 text-white lg:block">
          <div className="absolute -right-28 top-14 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -right-14 top-24 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute bottom-0 left-0 h-44 w-full bg-[#072d4a]/35" />
          <div className="relative z-10">
            <BrandMark size="lg" />
            <p className="mt-4 max-w-xs text-xl leading-7 text-white/95">
              Conversion contable de archivos TXT a Excel
            </p>
          </div>

          <div className="relative z-10 mt-24 grid grid-cols-[1fr_auto_1fr] items-center gap-7">
            <FileCard label="TXT" tone="blue" />
            <div className="text-5xl font-semibold text-white/90">...</div>
            <FileCard label="XLSX" tone="green" />
          </div>

          <div className="relative z-10 mx-auto mt-12 h-32 max-w-sm rounded-lg border border-white/25 bg-white/10 p-5 shadow-2xl backdrop-blur">
            <BarChart3 className="h-16 w-16 text-[#7bd0fe]" />
            <div className="absolute bottom-5 right-8 h-16 w-24 rounded-lg bg-[#072d4a]/60" />
          </div>

          <div className="relative z-10 mt-16 grid grid-cols-3 gap-6 text-center">
            <FeatureMini icon={ShieldCheck} label="Seguro" text="Protegemos tu informacion" />
            <FeatureMini icon={FileSpreadsheet} label="Conversion" text="TXT a Excel eficiente" />
            <FeatureMini icon={Files} label="Listo" text="Para tu plataforma contable" />
          </div>
        </div>

        <div className="flex min-h-full flex-col items-center justify-center bg-[#f6fbff] px-6 py-10">
          <form
            className="w-full max-w-[560px] rounded-xl border border-[#d8e8f6] bg-white p-10 shadow-[0_18px_42px_rgba(7,45,74,0.18)]"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex justify-center">
              <BrandMark dark size="xl" />
            </div>
            <p className="mt-4 text-center text-lg text-[#40577a]">
              Conversion contable de archivos TXT a Excel
            </p>
            <div className="my-8 flex items-center gap-4 text-[#7bd0fe]">
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
              className="mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-md bg-[#007fcb] px-5 text-lg font-semibold text-white shadow-[0_12px_24px_rgba(0,127,203,0.28)] hover:bg-[#006eb3] disabled:opacity-70"
              disabled={form.formState.isSubmitting}
              type="submit"
            >
              {form.formState.isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn size={24} />}
              Ingresar
            </button>

            <p className="mt-8 flex items-center justify-center gap-2 text-sm text-[#53698d]">
              <ShieldCheck className="h-5 w-5 text-[#0aa0ed]" />
              Acceso restringido. Solo usuarios autorizados.
            </p>
          </form>

          <p className="mt-12 text-sm text-[#6b7f9f]">
            © 2024 <span className="font-semibold text-[#007fcb]">SOFTBQ</span> | Version 1.0.0 | Aplicacion local
          </p>
        </div>
      </section>
    </main>
  );
}

function AppShell({
  activeView,
  clientsVersion,
  onClientsChanged,
  onLogout,
  onNavigate,
  user
}: {
  activeView: View;
  clientsVersion: number;
  onClientsChanged: () => void;
  onLogout: () => void;
  onNavigate: (view: View) => void;
  user: SessionUser;
}) {
  return (
    <main className="min-h-screen bg-[#f5faff] text-[#072d4a]">
      <aside className="fixed inset-y-0 left-0 hidden w-[270px] bg-gradient-to-b from-[#0aa0ed] via-[#055687] to-[#072d4a] text-white lg:flex lg:flex-col">
        <div className="px-7 py-8">
          <BrandMark size="md" />
          <p className="ml-[58px] mt-1 text-sm leading-5 text-white/90">
            Conversion contable
            <br />
            TXT a Excel
          </p>
        </div>

        <nav className="mt-4 flex-1 space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const enabled = item.id === "dashboard" || item.id === "clients";
            const isActive = activeView === item.id;

            return (
              <button
                className={`flex h-12 w-full items-center gap-4 rounded-md px-4 text-left text-sm font-medium transition ${
                  isActive ? "bg-[#0b8ff0] shadow-lg" : "text-white/90 hover:bg-white/10"
                } ${enabled ? "" : "opacity-60"}`}
                disabled={!enabled}
                key={item.id}
                onClick={() => enabled && onNavigate(item.id)}
                type="button"
              >
                <Icon size={24} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/20 px-7 py-6">
          <div className="flex items-center gap-3 text-white/90">
            <HelpCircle size={26} />
            Ayuda
          </div>
          <p className="mt-8 text-sm leading-6 text-white/85">
            Version 1.0.0
            <br />
            Aplicacion local
          </p>
        </div>
      </aside>

      <section className="lg:pl-[270px]">
        <header className="sticky top-0 z-10 flex h-[66px] items-center justify-between border-b border-[#d8e8f6] bg-white/95 px-6 backdrop-blur">
          <button className="flex h-10 w-10 items-center justify-center rounded-md text-[#072d4a]" type="button">
            <Menu size={26} />
          </button>
          <div className="flex items-center gap-5 text-sm">
            <div className="flex items-center gap-2">
              <Laptop size={24} />
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              LOCAL
            </div>
            <div className="h-7 w-px bg-[#d8e8f6]" />
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dff1ff] text-[#007fcb]">
                <User size={20} />
              </div>
              <span className="font-semibold">{user.role === "admin" ? "Administrador" : "Contador principal"}</span>
              <ChevronDown size={18} />
            </div>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-md border border-[#d8e8f6] text-[#055687]"
              onClick={onLogout}
              title="Cerrar sesion"
              type="button"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {activeView === "dashboard" ? (
          <DashboardPage clientsVersion={clientsVersion} onNavigateClients={() => onNavigate("clients")} />
        ) : (
          <ClientsPage onClientsChanged={onClientsChanged} user={user} />
        )}
      </section>
    </main>
  );
}

function DashboardPage({
  clientsVersion,
  onNavigateClients
}: {
  clientsVersion: number;
  onNavigateClients: () => void;
}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [dashboardSearch, setDashboardSearch] = useState("");
  const activeClients = clients.filter((client) => client.active).length;
  const inactiveClients = clients.length - activeClients;
  const filteredDashboardClients = clients.filter((client) => {
    const search = dashboardSearch.trim().toLowerCase();

    if (!search) {
      return true;
    }

    return (
      client.ruc.includes(search) ||
      client.businessName.toLowerCase().includes(search) ||
      client.shortName.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    async function loadClients() {
      const response = await fetch("/api/clients", { credentials: "include" });

      if (response.ok) {
        const data = (await response.json()) as { clients: Client[] };
        setClients(data.clients);
      }
    }

    void loadClients();
  }, [clientsVersion]);

  const metrics = [
    { label: "Clientes activos", value: activeClients, help: "Total de clientes", icon: Users, tone: "blue" },
    { label: "Pendientes", value: activeClients, help: "Clientes pendientes", icon: Calendar, tone: "orange" },
    { label: "Ventas procesadas", value: 0, help: "Ventas cargadas", icon: FileSpreadsheet, tone: "green" },
    { label: "Compras procesadas", value: 0, help: "Compras cargadas", icon: Files, tone: "purple" },
    { label: "Archivos generados", value: 0, help: "Archivos generados", icon: Files, tone: "teal" },
    { label: "Clientes revisados", value: 0, help: "Clientes revisados", icon: Eye, tone: "blue" },
    { label: "Clientes declarados", value: 0, help: "Clientes declarados", icon: CheckCircle, tone: "green" }
  ];

  return (
    <div className="mx-auto max-w-[1500px] px-8 py-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#072d4a]">Panel Principal</h1>
          <p className="mt-2 text-[#26466f]">
            Resumen del estado de la cartera de clientes del periodo seleccionado.
          </p>
        </div>
        <button
          className="flex h-12 items-center justify-center gap-3 rounded-md bg-[#007fcb] px-6 font-semibold text-white shadow-[0_10px_24px_rgba(0,127,203,0.2)]"
          type="button"
        >
          <PlusCircle size={20} />
          Nueva conversion
        </button>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <span className="font-medium">Periodo</span>
        <button className="flex h-10 min-w-56 items-center justify-between rounded-md border border-[#c9dbef] bg-white px-4 text-[#0a4770]" type="button">
          <span className="flex items-center gap-3">
            <Calendar size={18} />
            Junio 2026
          </span>
          <ChevronDown size={18} />
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <section className="mt-7 overflow-hidden rounded-lg border border-[#d8e8f6] bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#d8e8f6] px-5 py-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-bold">Estado de clientes del periodo</h2>
          <SearchBox
            value={dashboardSearch}
            placeholder="Buscar cliente..."
            onChange={setDashboardSearch}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f2f8fe] text-xs font-semibold text-[#072d4a]">
              <tr>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">RUC</th>
                <th className="px-5 py-3 text-center">Ventas</th>
                <th className="px-5 py-3 text-center">Compras</th>
                <th className="px-5 py-3 text-center">Archivo generado</th>
                <th className="px-5 py-3 text-center">Revisado</th>
                <th className="px-5 py-3 text-center">Declarado</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDashboardClients.slice(0, 6).map((client) => (
                <tr className="border-t border-[#e2edf8]" key={client.id}>
                  <td className="px-5 py-3 font-medium">{client.businessName}</td>
                  <td className="px-5 py-3 font-mono">{client.ruc}</td>
                  <StatusDot checked={false} />
                  <StatusDot checked={false} />
                  <StatusDot checked={false} />
                  <StatusDot checked={false} />
                  <StatusDot checked={false} />
                  <td className="px-5 py-3">
                    <StatusPill label={client.active ? "Pendiente" : "Inactivo"} tone={client.active ? "orange" : "gray"} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      className="rounded-md border border-[#c9dbef] px-3 py-2 text-[#0a4770]"
                      onClick={onNavigateClients}
                      type="button"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDashboardClients.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-[#53698d]" colSpan={9}>
                    No hay clientes para mostrar.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#e2edf8] px-5 py-4 text-sm text-[#53698d]">
          <span>
            Mostrando {Math.min(filteredDashboardClients.length, 6)} de {filteredDashboardClients.length} clientes
            {inactiveClients > 0 ? ` (${inactiveClients} inactivos)` : ""}
          </span>
          <button className="rounded-md bg-[#007fcb] px-4 py-2 font-semibold text-white" onClick={onNavigateClients} type="button">
            Ver clientes
          </button>
        </div>
      </section>

      <p className="mt-8 text-center text-sm text-[#53698d]">
        SOFTBQ - Conversion contable de archivos TXT a Excel | Aplicacion local
      </p>
    </div>
  );
}

function ClientsPage({
  onClientsChanged,
  user
}: {
  onClientsChanged: () => void;
  user: SessionUser;
}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const clientForm = useForm<ClientValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: emptyClient
  });

  async function loadClients(searchTerm = search) {
    setLoading(true);

    const query = searchTerm.trim()
      ? `?search=${encodeURIComponent(searchTerm.trim())}`
      : "";
    const response = await fetch(`/api/clients${query}`, {
      credentials: "include"
    });

    if (response.ok) {
      const data = (await response.json()) as { clients: Client[] };
      setClients(data.clients);
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadClients("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadClients(search);
    }, 250);

    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function startCreate() {
    setEditingClient(null);
    setShowForm(true);
    setMessage(null);
    clientForm.reset(emptyClient);
  }

  function handleEdit(client: Client) {
    if (!client.active) {
      setMessage("No se puede editar un cliente inhabilitado.");
      return;
    }

    setEditingClient(client);
    setShowForm(true);
    setMessage(null);
    clientForm.reset({
      ruc: client.ruc,
      businessName: client.businessName,
      shortName: client.shortName,
      contasisEntityCode: client.contasisEntityCode,
      contasisEntityDescription: client.contasisEntityDescription,
      defaultCondition: client.defaultCondition,
      defaultPaymentMethod: client.defaultPaymentMethod,
      defaultIgvPercent: client.defaultIgvPercent
    });
  }

  function clearForm() {
    setEditingClient(null);
    setShowForm(false);
    setMessage(null);
    clientForm.reset(emptyClient);
  }

  async function saveClient(values: ClientValues) {
    setMessage(null);

    const url = editingClient
      ? `/api/clients/${editingClient.id}`
      : "/api/clients";
    const method = editingClient ? "PUT" : "POST";
    const response = await fetch(url, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      const data = (await response.json()) as { message?: string };
      setMessage(data.message ?? "No se pudo guardar el cliente.");
      return;
    }

    setMessage(editingClient ? "Cliente actualizado." : "Cliente creado.");
    clearForm();
    await loadClients();
    onClientsChanged();
  }

  async function disableClient(client: Client) {
    const confirmed = window.confirm(`Inhabilitar cliente ${client.shortName}?`);

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/clients/${client.id}/disable`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: "{}"
    });

    if (!response.ok) {
      const data = (await response.json()) as { message?: string };
      setMessage(data.message ?? "No se pudo inhabilitar el cliente.");
      return;
    }

    setMessage("Cliente inhabilitado.");
    await loadClients();
    onClientsChanged();
  }

  async function enableClient(client: Client) {
    const confirmed = window.confirm(`Habilitar cliente ${client.shortName}?`);

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/clients/${client.id}/enable`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: "{}"
    });

    if (!response.ok) {
      const data = (await response.json()) as { message?: string };
      setMessage(data.message ?? "No se pudo habilitar el cliente.");
      return;
    }

    setMessage("Cliente habilitado.");
    await loadClients();
    onClientsChanged();
  }

  return (
    <div className="mx-auto max-w-[1540px] px-7 py-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="mt-2 text-[#26466f]">Administra la base de clientes del estudio.</p>
        </div>
        <div className="flex gap-4">
          <button
            className="flex h-12 items-center gap-3 rounded-md border border-[#c9dbef] bg-white px-6 font-semibold text-[#007fcb]"
            type="button"
          >
            <Upload size={20} />
            Importar clientes
          </button>
          <button
            className="flex h-12 items-center gap-3 rounded-md bg-[#007fcb] px-6 font-semibold text-white"
            onClick={startCreate}
            type="button"
          >
            <PlusCircle size={20} />
            Crear cliente
          </button>
        </div>
      </div>

      <section className="mt-7 overflow-hidden rounded-lg border border-[#d8e8f6] bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#d8e8f6] p-5 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:max-w-4xl">
            <SearchBox
              onChange={(value) => setSearch(value)}
              placeholder="Buscar por RUC, razon social o nombre corto..."
              value={search}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1120px] w-full text-left text-sm">
            <thead className="bg-[#f2f8fe] text-xs font-bold text-[#072d4a]">
              <tr>
                <th className="px-5 py-4">RUC</th>
                <th className="px-5 py-4">Razon social</th>
                <th className="px-5 py-4">Nombre corto</th>
                <th className="px-5 py-4">Estado</th>
                <th className="px-5 py-4">Codigo entidad Contasis</th>
                <th className="px-5 py-4">Descripcion entidad Contasis</th>
                <th className="px-5 py-4">Condicion por defecto</th>
                <th className="px-5 py-4">Medio de pago por defecto</th>
                <th className="px-5 py-4">IGV por defecto</th>
                <th className="px-5 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-5 py-8 text-[#53698d]" colSpan={10}>
                    Cargando clientes...
                  </td>
                </tr>
              ) : null}

              {!loading && clients.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-[#53698d]" colSpan={10}>
                    No hay clientes registrados.
                  </td>
                </tr>
              ) : null}

              {!loading
                ? clients.map((client) => (
                    <tr className="border-t border-[#e2edf8]" key={client.id}>
                      <td className="px-5 py-4 font-mono">{client.ruc}</td>
                      <td className="px-5 py-4 font-medium">{client.businessName}</td>
                      <td className="px-5 py-4">{client.shortName}</td>
                      <td className="px-5 py-4">
                        <StatusPill label={client.active ? "Activo" : "Inactivo"} tone={client.active ? "green" : "gray"} />
                      </td>
                      <td className="px-5 py-4">{client.contasisEntityCode}</td>
                      <td className="px-5 py-4">{client.contasisEntityDescription}</td>
                      <td className="px-5 py-4">{client.defaultCondition}</td>
                      <td className="px-5 py-4">{client.defaultPaymentMethod}</td>
                      <td className="px-5 py-4">{client.defaultIgvPercent}%</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <IconButton
                            disabled={!client.active}
                            icon={Pencil}
                            label="Editar"
                            onClick={() => handleEdit(client)}
                            tone="blue"
                          />
                          {client.active ? (
                            <IconButton
                              icon={Ban}
                              label="Inhabilitar"
                              onClick={() => void disableClient(client)}
                              tone="red"
                            />
                          ) : user.role === "admin" ? (
                            <IconButton
                              icon={UserCheck}
                              label="Habilitar"
                              onClick={() => void enableClient(client)}
                              tone="green"
                            />
                          ) : (
                            <IconButton disabled icon={XCircle} label="Inactivo" tone="gray" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#e2edf8] px-5 py-4 text-sm text-[#53698d]">
          <span>
            Mostrando 1 a {clients.length} de {clients.length} clientes
          </span>
          <div className="flex items-center gap-3">
            <button className="rounded-md border border-[#c9dbef] px-4 py-2" type="button">10</button>
            <span>por pagina</span>
          </div>
        </div>
      </section>

      {showForm ? (
        <section className="mt-6 rounded-lg border border-[#d8e8f6] bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold">{editingClient ? "Editar cliente" : "Crear cliente"}</h2>
            <button className="rounded-md border border-[#c9dbef] px-4 py-2 text-sm font-semibold" onClick={clearForm} type="button">
              Cancelar
            </button>
          </div>
          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={clientForm.handleSubmit(saveClient)}>
            <ClientField form={clientForm} label="RUC" maxLength={11} name="ruc" onlyDigits />
            <ClientField form={clientForm} label="Razon social" name="businessName" />
            <ClientField form={clientForm} label="Nombre corto" name="shortName" />
            <ClientField form={clientForm} label="Codigo entidad" name="contasisEntityCode" />
            <ClientField form={clientForm} label="Descripcion entidad" name="contasisEntityDescription" />
            <ClientField form={clientForm} label="Condicion" name="defaultCondition" />
            <ClientField form={clientForm} label="Medio de pago" name="defaultPaymentMethod" />
            <ClientField form={clientForm} label="IGV" name="defaultIgvPercent" type="number" />
            <div className="flex items-end">
              <button
                className="h-11 w-full rounded-md bg-[#007fcb] px-5 font-semibold text-white disabled:opacity-70"
                disabled={clientForm.formState.isSubmitting}
                type="submit"
              >
                {editingClient ? "Guardar cambios" : "Crear cliente"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {message ? (
        <p className="mt-5 rounded-md border border-[#c9dbef] bg-white px-4 py-3 text-sm text-[#0a4770]">
          {message}
        </p>
      ) : null}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <InfoBox title="Leyenda de estados">
          <p><span className="mr-3 inline-block h-2 w-2 rounded-full bg-emerald-500" />Activo - Cliente habilitado para conversiones.</p>
          <p className="mt-3"><span className="mr-3 inline-block h-2 w-2 rounded-full bg-slate-300" />Inactivo - Cliente inhabilitado.</p>
        </InfoBox>
        <InfoBox title="Informacion">
          Los clientes inactivos no estaran disponibles para nuevas conversiones, pero se mantendran en el historial del sistema.
        </InfoBox>
      </div>
    </div>
  );
}

function ClientField({
  form,
  label,
  maxLength,
  name,
  onlyDigits = false,
  type = "text"
}: {
  form: ReturnType<typeof useForm<ClientValues>>;
  label: string;
  maxLength?: number;
  name: keyof ClientValues;
  onlyDigits?: boolean;
  type?: string;
}) {
  const error = form.formState.errors[name]?.message;
  const registration = form.register(name);

  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        className="mt-2 h-11 w-full rounded-md border border-[#c9dbef] px-3 text-sm font-normal outline-none focus:border-[#0aa0ed]"
        inputMode={onlyDigits ? "numeric" : undefined}
        maxLength={maxLength}
        type={type}
        {...registration}
        onChange={(event) => {
          if (onlyDigits) {
            const value = event.currentTarget.value.replace(/\D/g, "").slice(0, maxLength);
            event.currentTarget.value = value;
          }

          void registration.onChange(event);
        }}
      />
      {error ? <span className="mt-2 block text-xs text-red-600">{String(error)}</span> : null}
    </label>
  );
}

function BrandMark({
  dark = false,
  size
}: {
  dark?: boolean;
  size: "md" | "lg" | "xl";
}) {
  const markSize = size === "xl" ? "h-20 w-20 text-5xl" : size === "lg" ? "h-16 w-16 text-4xl" : "h-12 w-12 text-3xl";
  const wordSize = size === "xl" ? "text-6xl" : size === "lg" ? "text-4xl" : "text-3xl";

  return (
    <div className="flex items-center gap-4">
      <div className={`${markSize} flex shrink-0 items-center justify-center rounded-2xl ${dark ? "bg-[#0aa0ed] text-white" : "bg-white text-[#0aa0ed]"} font-black`}>
        S
      </div>
      <span className={`${wordSize} font-black tracking-wide ${dark ? "text-[#072d4a]" : "text-white"}`}>
        SOFT<span className={dark ? "text-[#0aa0ed]" : "text-white"}>BQ</span>
      </span>
    </div>
  );
}

function FileCard({ label, tone }: { label: string; tone: "blue" | "green" }) {
  return (
    <div className="relative h-40 rounded-lg bg-white p-6 shadow-2xl">
      <div className={`absolute left-4 top-12 rounded px-4 py-2 text-xl font-bold text-white ${tone === "blue" ? "bg-[#007fcb]" : "bg-emerald-600"}`}>
        {label}
      </div>
      <div className="mt-16 space-y-3">
        <div className="h-3 rounded bg-[#c9dbef]" />
        <div className="h-3 rounded bg-[#c9dbef]" />
        <div className="h-3 w-2/3 rounded bg-[#c9dbef]" />
      </div>
    </div>
  );
}

function FeatureMini({
  icon: Icon,
  label,
  text
}: {
  icon: typeof ShieldCheck;
  label: string;
  text: string;
}) {
  return (
    <div className="border-r border-white/30 px-2 last:border-r-0">
      <Icon className="mx-auto mb-2 h-8 w-8 text-[#7bd0fe]" />
      <p className="font-semibold">{label}</p>
      <p className="text-sm leading-5 text-white/85">{text}</p>
    </div>
  );
}

function LoginField({
  action,
  error,
  icon: Icon,
  label,
  placeholder,
  registration,
  type = "text"
}: {
  action?: React.ReactNode;
  error?: string;
  icon: typeof User;
  label: string;
  placeholder: string;
  registration: ReturnType<ReturnType<typeof useForm<LoginValues>>["register"]>;
  type?: string;
}) {
  return (
    <label className="mt-5 block text-base font-bold text-[#072d4a]">
      {label}
      <div className="mt-3 flex h-14 overflow-hidden rounded-md border border-[#c9dbef] bg-white focus-within:border-[#0aa0ed]">
        <div className="flex w-14 items-center justify-center border-r border-[#e2edf8] bg-[#f7fbff] text-[#8296b3]">
          <Icon size={24} />
        </div>
        <input
          className="min-w-0 flex-1 px-4 text-base font-normal outline-none placeholder:text-[#8296b3]"
          placeholder={placeholder}
          type={type}
          {...registration}
        />
        {action}
      </div>
      {error ? <span className="mt-2 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

function SearchBox({
  onChange,
  placeholder,
  value
}: {
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <div className="flex h-11 items-center gap-3 rounded-md border border-[#c9dbef] bg-white px-4">
      <Search className="h-5 w-5 shrink-0 text-[#0a4770]" />
      <input
        className="min-w-0 flex-1 text-sm outline-none placeholder:text-[#8296b3]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
}

function MetricCard({
  help,
  icon: Icon,
  label,
  tone,
  value
}: {
  help: string;
  icon: typeof Users;
  label: string;
  tone: string;
  value: number;
}) {
  const toneMap: Record<string, string> = {
    blue: "bg-[#dff1ff] text-[#007fcb]",
    green: "bg-emerald-100 text-emerald-700",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-violet-100 text-violet-700",
    teal: "bg-cyan-100 text-cyan-700"
  };

  return (
    <article className="rounded-lg border border-[#d8e8f6] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-lg ${toneMap[tone]}`}>
          <Icon size={28} />
        </div>
        <div>
          <h2 className="text-sm font-semibold">{label}</h2>
          <p className={`mt-1 text-3xl font-bold ${tone === "orange" ? "text-orange-500" : tone === "green" ? "text-emerald-600" : "text-[#007fcb]"}`}>
            {value}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-[#53698d]">{help}</p>
    </article>
  );
}

function StatusDot({ checked }: { checked: boolean }) {
  return (
    <td className="px-5 py-3 text-center">
      {checked ? (
        <CheckCircle className="mx-auto h-5 w-5 text-emerald-600" />
      ) : (
        <Circle className="mx-auto h-5 w-5 text-slate-400" />
      )}
    </td>
  );
}

function StatusPill({ label, tone }: { label: string; tone: "green" | "gray" | "orange" }) {
  const classes = {
    green: "bg-emerald-100 text-emerald-700",
    gray: "bg-slate-100 text-slate-600",
    orange: "bg-orange-100 text-orange-700"
  };

  return <span className={`rounded-md px-3 py-1 text-xs font-semibold ${classes[tone]}`}>{label}</span>;
}

function IconButton({
  disabled = false,
  icon: Icon,
  label,
  onClick,
  tone
}: {
  disabled?: boolean;
  icon: typeof Pencil;
  label: string;
  onClick?: () => void;
  tone: "blue" | "red" | "green" | "gray";
}) {
  const classes = {
    blue: "border-[#b9d9f9] text-[#007fcb]",
    red: "border-red-200 bg-red-50 text-red-600",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    gray: "border-slate-200 bg-slate-50 text-slate-400"
  };

  return (
    <button
      className={`flex h-9 w-9 items-center justify-center rounded-md border disabled:opacity-50 ${classes[tone]}`}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      <Icon size={18} />
    </button>
  );
}

function InfoBox({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="rounded-lg border border-[#d8e8f6] bg-white p-5 text-sm text-[#26466f]">
      <h3 className="mb-3 font-bold text-[#007fcb]">{title}</h3>
      {children}
    </section>
  );
}
