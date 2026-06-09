import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import { LoginPage, LoginSkeleton } from "./features/auth/LoginPage";
import { ClientsPage } from "./features/clients/ClientsPage";
import { ImportClientsPage } from "./features/clients/ImportClientsPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { AppLayout } from "./features/layout/AppLayout";
import { ConversionsPage } from "./features/conversions/pages/ConversionsPage";
import { NewConversionPage } from "./features/conversions/pages/NewConversionPage";
import { ValidationPreviewPage } from "./features/conversions/pages/ValidationPreviewPage";
import { ConversionResultPage } from "./features/conversions/pages/ConversionResultPage";
import { BillingPage } from "./features/billing/pages/BillingPage";
import { BillingHistoryPage } from "./features/billing/pages/BillingHistoryPage";
import type { LoginValues, SessionUser } from "./features/shared/types";
import { fetchSession, login, logout } from "./features/auth/services/authApi";

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

  useEffect(() => {
    async function loadSession() {
      try {
        setUser(await fetchSession());
      } finally {
        setCheckingSession(false);
      }
    }

    void loadSession();
  }, []);

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  if (checkingSession) {
    return <LoginSkeleton />;
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
    <Routes>
      <Route element={<AppLayout onLogout={() => void handleLogout()} user={user} />}>
        <Route index element={<Navigate replace to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardPage clientsVersion={clientsVersion} />} />
        <Route
          path="/clientes"
          element={
            <ClientsPage
              onClientsChanged={() => setClientsVersion((version) => version + 1)}
              user={user}
            />
          }
        />
        <Route
          path="/importar-clientes"
          element={
            <ImportClientsPage
              onClientsChanged={() => setClientsVersion((version) => version + 1)}
              user={user}
            />
          }
        />
        <Route path="/conversiones" element={<ConversionsPage />} />
        <Route path="/conversiones/nueva" element={<NewConversionPage />} />
        <Route path="/conversiones/preview" element={<ValidationPreviewPage />} />
        <Route path="/conversiones/resultado/:id" element={<ConversionResultPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/billing/history" element={<BillingHistoryPage />} />
      </Route>
      <Route path="/login" element={<Navigate replace to="/dashboard" />} />
      <Route path="*" element={<Navigate replace to="/dashboard" />} />
    </Routes>
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

    try {
      onLogin(await login(values));
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Usuario o contrasena incorrectos.");
    }
  }

  return <LoginPage authError={authError} onSubmit={(values) => void handleLogin(values)} />;
}
