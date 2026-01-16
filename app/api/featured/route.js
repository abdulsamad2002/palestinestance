import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Celebrity from '@/models/Celebrity';

export async function GET() {
  try {
    await dbConnect();

    // Get featured pro-Palestine celebrities only
    const celebrities = await Celebrity.find({
      status: 'approved',
      stance: 'pro',
      featured: true,
    })
    .sort({ aiConfidence: -1, createdAt: -1 })
    .limit(6)
    .lean();

    // If no featured celebrities, get top 6 pro-Palestine by confidence
    let finalCelebrities = celebrities;
    
    if (celebrities.length === 0) {
      finalCelebrities = await Celebrity.find({
        status: 'approved',
        stance: 'pro',
      })
      .sort({ aiConfidence: -1, sources: -1 })
      .limit(6)
      .lean();
    }

    // Serialize results
    const serialized = finalCelebrities.map(c => ({
      ...c,
      _id: c._id.toString(),
    }));

    return NextResponse.json({ celebrities: serialized });

  } catch (error) {
    console.error('Featured fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured celebrities', celebrities: [] },
      { status: 500 }
    );
  }
}