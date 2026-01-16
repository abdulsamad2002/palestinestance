import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Celebrity from '@/models/Celebrity';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    await dbConnect();

    // Search database for matching celebrities
    const results = await Celebrity.find({
      status: 'approved',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { profession: { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ name: 1 })
    .limit(50)
    .lean();

    // Serialize results
    const serialized = results.map(celebrity => ({
      ...celebrity,
      _id: celebrity._id.toString(),
    }));

    return NextResponse.json({ results: serialized });

  } catch (error) {
    console.error('Database search error:', error);
    return NextResponse.json(
      { error: 'Search failed', results: [] },
      { status: 500 }
    );
  }
}