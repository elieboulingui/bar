import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from '@/app/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function createToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// getAuth: verifies token, then looks up the current user in DB to get up-to-date role
export async function getAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  const decoded = await verifyToken(token) as any;
  if (!decoded || !decoded.id) return null;

  // Fetch latest user data from DB to ensure role is current
  try {
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return null;

    // Normalize role to French label for use in the app while preserving DB values
    const role = user.role === 'CASHIER' ? 'CAISSIER' : user.role;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role,
    };
  } catch (err) {
    console.error('getAuth error:', err);
    return null;
  }
}
