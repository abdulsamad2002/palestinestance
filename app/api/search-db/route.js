import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Celebrity from '@/models/Celebrity';
import Company from '@/models/Company';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    await dbConnect();

    // Search database for matching celebrities
    const celebrityResults = await Celebrity.find({
      status: 'approved',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { profession: { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ name: 1 })
    .limit(25)
    .lean();

    // Search database for matching companies
    const companyResults = await Company.find({
      status: 'approved',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { industry: { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ name: 1 })
    .limit(25)
    .lean();

    // Serialize and tag results
    const results = [
      ...celebrityResults.map(c => ({ ...c, _id: c._id.toString(), type: 'celebrity' })),
      ...companyResults.map(c => ({ ...c, _id: c._id.toString(), type: 'company', profession: c.industry }))
    ];

    return NextResponse.json({ results });

  } catch (error) {
    console.error('Database search error:', error);
    return NextResponse.json(
      { error: 'Search failed', results: [] },
      { status: 500 }
    );
  }
}