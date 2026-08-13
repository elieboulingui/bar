import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/app/lib/prisma';
import { createToken } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, action } = body;

    if (action === 'register') {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'L\'utilisateur existe déjà' },
          { status: 400 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || email,
          role: 'CASHIER', // Default role in DB (internally English for compatibility)
        },
      });

      // Normalize role to French label in the token payload (CAISSIER) while keeping DB enum unchanged
      const token = await createToken({
        id: user.id,
        email: user.email,
        role: user.role === 'CASHIER' ? 'CAISSIER' : user.role,
      });

      const response = NextResponse.json(
        {
          message: 'Utilisateur créé avec succès',
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role === 'CASHIER' ? 'CAISSIER' : user.role,
          },
        },
        { status: 201 }
      );

      response.cookies.set('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    } else if (action === 'login') {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'Email ou mot de passe incorrect' },
          { status: 401 }
        );
      }

      // Compare password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Email ou mot de passe incorrect' },
          { status: 401 }
        );
      }

      // Normalize role to French label in the token payload (CAISSIER) while keeping DB enum unchanged
      const token = await createToken({
        id: user.id,
        email: user.email,
        role: user.role === 'CASHIER' ? 'CAISSIER' : user.role,
      });

      const response = NextResponse.json(
        {
          message: 'Connecté avec succès',
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role === 'CASHIER' ? 'CAISSIER' : user.role,
          },
        },
        { status: 200 }
      );

      response.cookies.set('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    } else {
      return NextResponse.json(
        { error: 'Action invalide' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
