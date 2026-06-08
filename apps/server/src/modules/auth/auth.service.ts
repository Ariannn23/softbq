import { randomUUID } from "node:crypto";
import { compare } from "bcryptjs";

import type { UserRole } from "@softbq/core";

import { findActiveUserByUsername } from "./auth.repository.js";

export type AuthenticatedUser = {
  id: number;
  username: string;
  role: UserRole;
};

type Session = {
  token: string;
  user: AuthenticatedUser;
  expiresAt: number;
};

const sessions = new Map<string, Session>();
const sessionTtlMs = 1000 * 60 * 60 * 8;

function pruneExpiredSessions() {
  const now = Date.now();

  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt <= now) {
      sessions.delete(token);
    }
  }
}

export async function login(input: {
  username: string;
  password: string;
}): Promise<Session | null> {
  pruneExpiredSessions();

  const user = await findActiveUserByUsername(input.username);

  if (!user) {
    return null;
  }

  const passwordMatches = await compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    return null;
  }

  const session: Session = {
    token: randomUUID(),
    expiresAt: Date.now() + sessionTtlMs,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  };

  sessions.set(session.token, session);

  return session;
}

export function getSession(token: string | undefined): Session | null {
  if (!token) {
    return null;
  }

  const session = sessions.get(token);

  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }

  return session;
}

export function logout(token: string | undefined) {
  if (token) {
    sessions.delete(token);
  }
}
