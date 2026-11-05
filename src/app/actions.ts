"use server";

import { timingSafeEqual } from "node:crypto";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export async function verifyAdminLogin(user: string, password: string): Promise<boolean> {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword) return false;

  const userOk = safeEqual(user, expectedUser);
  const passOk = safeEqual(password, expectedPassword);
  return userOk && passOk;
}
