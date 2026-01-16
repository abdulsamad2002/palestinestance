import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Celebrity from '@/models/Celebrity';

export async function POST(request) {
  try {
    const { id, featured } = await request.json();

    if (!id || typeof featured !== 'boolean') {
      return NextResponse.json(
        { error: 'ID and featured status required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const celebrity = await Celebrity.findByIdAndUpdate(
      id,
      { featured },
      { new: true }
    );

    if (!celebrity) {
      return NextResponse.json(
        { error: 'Celebrity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Toggle featured error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle featured status' },
      { status: 500 }
    );
  }
}