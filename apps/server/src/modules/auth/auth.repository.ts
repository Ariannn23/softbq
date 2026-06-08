import { eq } from "drizzle-orm";

import { db, users } from "@softbq/db";

export type AuthUserRecord = {
  id: number;
  username: string;
  passwordHash: string;
  role: "admin" | "principal_accountant";
  active: boolean;
};

export async function findActiveUserByUsername(
  username: string
): Promise<AuthUserRecord | null> {
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      passwordHash: users.passwordHash,
      role: users.role,
      active: users.active
    })
    .from(users)
    .where(eq(users.username, username.toLowerCase().trim()))
    .limit(1);

  if (!user || !user.active) {
    return null;
  }

  return user;
}
