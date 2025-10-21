import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signAuthToken, verifyAuthToken, tokenConfig } from '@/lib/token';

export { signAuthToken, verifyAuthToken } from '@/lib/token';

export const AUTH_COOKIE = 'flowcrm_session';
const COOKIE_MAX_AGE = tokenConfig.ttlHours * 60 * 60;

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function setAuthCookie(token: string) {
  cookies().set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE
  });
}

export function clearAuthCookie() {
  cookies().delete(AUTH_COOKIE);
}

export async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return null;

  const payload = verifyAuthToken(token);
  if (!payload?.userId) return null;

  return prisma.user.findUnique({ where: { id: payload.userId } });
}

export async function getCurrentUser() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return null;

  const payload = verifyAuthToken(token);
  if (!payload?.userId) return null;

  return prisma.user.findUnique({ where: { id: payload.userId } });
}
