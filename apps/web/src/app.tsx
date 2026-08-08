import { lazy, Suspense, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import { LoginPage, LoginSkeleton } from "./features/auth/LoginPage";
import { AppLayout } from "./features/layout/AppLayout";
import type { LoginValues } from "./features/auth/types";
import type { SessionUser } from "./features/shared/types";
import { fetchSession, login, logout } from "./features/auth/services/authApi";
import { BlockingUpdateOverlay } from "./features/layout/BlockingUpdateOverlay";
import { isVersionOlder } from "./lib/version";

const DashboardPage = lazy(() => import("./features/dashboard/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const ClientsPage = lazy(() => import("./features/clients/ClientsPage").then((module) => ({ default: module.ClientsPage })));
const ImportClientsPage = lazy(() => import("./features/clients/ImportClientsPage").then((module) => ({ default: module.ImportClientsPage })));
const ConversionsPage = lazy(() => import("./features/conversions/pages/ConversionsPage").then((module) => ({ default: module.ConversionsPage })));
const NewConversionPage = lazy(() => import("./features/conversions/pages/NewConversionPage").then((module) => ({ default: module.NewConversionPage })));
const ValidationPreviewPage = lazy(() => import("./features/conversions/pages/ValidationPreviewPage").then((module) => ({ default: module.ValidationPreviewPage })));
const ConversionResultPage = lazy(() => import("./features/conversions/pages/ConversionResultPage").then((module) => ({ default: module.ConversionResultPage })));
const BillingPage = lazy(() => import("./features/billing/pages/BillingPage").then((module) => ({ default: module.BillingPage })));
const BillingHistoryPage = lazy(() => import("./features/billing/pages/BillingHistoryPage").then((module) => ({ default: module.BillingHistoryPage })));
const SettingsPage = lazy(() => import("./features/settings/pages/SettingsPage").then((module) => ({ default: module.SettingsPage })));
const ObligationsPage = lazy(() => import("./features/obligations/pages/ObligationsPage").then((module) => ({ default: module.ObligationsPage })));

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [clientsVersion, setClientsVersion] = useState(0);
  const [minVersionRequired, setMinVersionRequired] = useState<string | null>(null);

  useEffect(() => {
    async function loadConfigAndSession() {
      try {
        // Fetch public config
        const res = await fetch('/api/public-settings').catch(() => null);
        if (res && res.ok) {
          const config = await res.json();
          if (config.min_version_required) {
            setMinVersionRequired(config.min_version_required);
          }
        }
      } catch (e) {
        // Ignore config errors
      }

      try {
        setUser(await fetchSession());
      } finally {
        setCheckingSession(false);
      }
    }

    void loadConfigAndSession();
  }, []);

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  // Use the global __APP_VERSION__ if defined, otherwise assume 0.0.0 for dev
  const currentVersion = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "0.0.0";
  const needsUpdate = minVersionRequired && currentVersion !== "0.0.0" ? isVersionOlder(currentVersion, minVersionRequired) : false;

  if (checkingSession) {
    return <LoginSkeleton />;
  }

  if (needsUpdate && minVersionRequired) {
    return <BlockingUpdateOverlay minVersion={minVersionRequired} />;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginRoute authError={authError} onLogin={setUser} setAuthError={setAuthError} />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    );
  }

  return (
    <Suspense fallback={<LoginSkeleton />}>
      <Routes>
        <Route element={<AppLayout onLogout={() => void handleLogout()} user={user} />}>
          <Route index element={<Navigate replace to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage clientsVersion={clientsVersion} />} />
          <Route
            path="/clients"
            element={
              <ClientsPage
                onClientsChanged={() => setClientsVersion((version) => version + 1)}
                user={user}
              />
            }
          />
          <Route
            path="/clients/import"
            element={
              <ImportClientsPage
                onClientsChanged={() => setClientsVersion((version) => version + 1)}
                user={user}
              />
            }
          />
          <Route path="/conversions" element={<ConversionsPage />} />
          <Route path="/conversions/new" element={<NewConversionPage />} />
          <Route path="/conversions/preview" element={<ValidationPreviewPage />} />
          <Route path="/conversions/result/:id" element={<ConversionResultPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/billing/history" element={<BillingHistoryPage />} />
          <Route path="/settings" element={<SettingsPage user={user} />} />
          <Route path="/obligations" element={<ObligationsPage />} />
        </Route>
        <Route path="/login" element={<Navigate replace to="/dashboard" />} />
        <Route path="*" element={<Navigate replace to="/dashboard" />} />
      </Routes>
    </Suspense>
  );
}

function LoginRoute({
  authError,
  onLogin,
  setAuthError
}: {
  authError: string | null;
  onLogin: (user: SessionUser) => void;
  setAuthError: (error: string | null) => void;
}) {
  const navigate = useNavigate();

  async function handleLogin(values: LoginValues) {
    setAuthError(null);
    const toastId = toast.loading("Iniciando sesión...");

    try {
      onLogin(await login(values));
      toast.success("¡Bienvenido a Grupo BQ!", { id: toastId });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Usuario o contraseña incorrectos.", { id: toastId });
      setAuthError(error instanceof Error ? error.message : "Usuario o contraseña incorrectos.");
    }
  }

  return <LoginPage authError={authError} onSubmit={(values) => void handleLogin(values)} />;
}
