import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Celebrity from '@/models/Celebrity';

export async function GET() {
  try {
    await dbConnect();

    const celebrities = await Celebrity.find({})
      .sort({ createdAt: -1 })
      .lean();

    const serialized = celebrities.map(c => ({
      ...c,
      _id: c._id.toString(),
    }));

    return NextResponse.json({ celebrities: serialized });

  } catch (error) {
    console.error('Get all celebrities error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch celebrities', celebrities: [] },
      { status: 500 }
    );
  }
}