import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Celebrity from '@/models/Celebrity';

export async function POST(request) {
  try {
    const { id, updates } = await request.json();

    if (!id || !updates) {
      return NextResponse.json(
        { error: 'ID and updates required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const celebrity = await Celebrity.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!celebrity) {
      return NextResponse.json(
        { error: 'Celebrity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      celebrity: {
        ...celebrity.toObject(),
        _id: celebrity._id.toString()
      }
    });

  } catch (error) {
    console.error('Update celebrity error:', error);
    return NextResponse.json(
      { error: 'Failed to update celebrity' },
      { status: 500 }
    );
  }
}