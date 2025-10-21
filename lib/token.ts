import jwt from 'jsonwebtoken';

const TOKEN_TTL_HOURS = 8;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET não configurado');
  }
  return secret;
}

export function signAuthToken(userId: string) {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: `${TOKEN_TTL_HOURS}h` });
}

export function verifyAuthToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, getJwtSecret()) as { userId: string };
  } catch (error) {
    return null;
  }
}

export const tokenConfig = {
  ttlHours: TOKEN_TTL_HOURS
};
