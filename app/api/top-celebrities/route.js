import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Celebrity from '@/models/Celebrity';

export async function GET() {
  try {
    await dbConnect();

    // Get top 3 pro-Palestine celebrities
    // Priority: Featured first, then by confidence, then by source count
    const celebrities = await Celebrity.find({
      status: 'approved',
      stance: 'pro',
    })
    .sort({ 
      featured: -1,        // Featured first
      aiConfidence: -1,    // Then highest confidence
      sources: -1          // Then most sources
    })
    .limit(3)
    .lean();

    const serialized = celebrities.map(c => ({
      ...c,
      _id: c._id.toString(),
    }));

    return NextResponse.json({ celebrities: serialized });

  } catch (error) {
    console.error('Top celebrities fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top celebrities', celebrities: [] },
      { status: 500 }
    );
  }
}