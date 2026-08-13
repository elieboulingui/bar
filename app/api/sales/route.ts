import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getAuth } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuth();

    if (!auth) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Allow only ADMIN and CAISSIER to create sales
    if (auth.role !== 'ADMIN' && auth.role !== 'CAISSIER') {
      return NextResponse.json(
        { error: 'Non autorisé à créer des ventes' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'ProductId et quantity sont obligatoires' },
        { status: 400 }
      );
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    if (product.quantity < quantity) {
      return NextResponse.json(
        { error: 'Quantité insuffisante en stock' },
        { status: 400 }
      );
    }

    // Create sale
    const sale = await prisma.sale.create({
      data: {
        productId,
        quantity,
        price: product.price,
        total: product.price * quantity,
      },
    });

    // Update product quantity
    await prisma.product.update({
      where: { id: productId },
      data: {
        quantity: product.quantity - quantity,
      },
    });

    return NextResponse.json(
      {
        message: 'Vente créée avec succès',
        sale: {
          ...sale,
          product,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuth();

    if (!auth) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Only ADMIN can list all sales
    if (auth.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      );
    }

    const sales = await prisma.sale.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
