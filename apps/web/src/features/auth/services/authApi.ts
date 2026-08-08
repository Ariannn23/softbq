import type { LoginValues } from "../types";
import type { SessionUser } from "../../shared/types";

export async function fetchSession(): Promise<SessionUser | null> {
  const response = await fetch("/api/auth/me", { credentials: "include" });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { user: SessionUser };
  return data.user;
}

export async function login(values: LoginValues): Promise<SessionUser> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(values)
  });

  if (!response.ok) {
    throw new Error("Usuario o contrasena incorrectos. Verifica tus datos e intentalo nuevamente.");
  }

  const data = (await response.json()) as { user: SessionUser };
  return data.user;
}

export async function logout() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include"
  });
}
