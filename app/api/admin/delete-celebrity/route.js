import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Celebrity from '@/models/Celebrity';

export async function POST(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Celebrity ID required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const celebrity = await Celebrity.findByIdAndDelete(id);

    if (!celebrity) {
      return NextResponse.json(
        { error: 'Celebrity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: `${celebrity.name} deleted successfully` 
    });

  } catch (error) {
    console.error('Delete celebrity error:', error);
    return NextResponse.json(
      { error: 'Failed to delete celebrity' },
      { status: 500 }
    );
  }
}