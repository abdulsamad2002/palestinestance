import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Celebrity from '@/models/Celebrity';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { name } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Celebrity name is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check database FIRST before doing expensive AI research
    const existing = await Celebrity.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existing) {
      return NextResponse.json({
        name: existing.name,
        profession: existing.profession,
        stance: existing.stance,
        sources: existing.sources,
        summary: '',
        confidence: existing.aiConfidence,
        _id: existing._id.toString(),
        message: 'Found in database'
      });
    }

    // Not in database - do AI research
    const research = await researchCelebrity(name);

    if (!research || research.confidence < 30) {
      return NextResponse.json(
        { error: 'Unable to find reliable information about this person' },
        { status: 404 }
      );
    }

    // Normalize name to Title Case
    const normalizedName = (research.name || name)
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Create new entry
    const celebrity = await Celebrity.create({
      name: normalizedName,
      profession: research.profession || 'Public Figure',
      stance: research.stance,
      sources: research.sources,
      aiConfidence: research.confidence,
      status: 'approved',
      featured: research.stance === 'pro' && research.confidence >= 90,
    });

    return NextResponse.json({
      name: celebrity.name,
      profession: celebrity.profession,
      stance: celebrity.stance,
      sources: celebrity.sources,
      summary: research.summary,
      confidence: celebrity.aiConfidence,
      _id: celebrity._id.toString(),
      message: 'Research complete and saved'
    });

  } catch (error) {
    console.error('AI research error:', error);
    return NextResponse.json(
      { error: error.message || 'Research failed' },
      { status: 500 }
    );
  }
}

async function researchCelebrity(name) {
  const prompt = `Research "${name}" and their public stance on Palestine.

Task:
1. Determine stance: "pro" (supports Palestine), "neutral" (silent/unclear), or "against" (supports Israel)
2. Find 3-5 credible source URLs (news, verified social media, official statements)
3. Identify their profession
4. Brief 2-3 sentence summary
5. Confidence rating (0-100)

Rules:
- Use credible sources only
- If unclear evidence, mark "neutral" with low confidence
- Base on PUBLIC statements/actions only

Return valid JSON only:
{
  "name": "Full Name",
  "profession": "Their profession",
  "stance": "pro" | "neutral" | "against",
  "sources": ["url1", "url2", "url3"],
  "summary": "Brief explanation",
  "confidence": 0-100
}`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a research assistant. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const text = completion.choices[0]?.message?.content || '{}';
    const cleaned = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);

    if (!result.stance || !Array.isArray(result.sources)) {
      throw new Error('Invalid response format');
    }

    return result;

  } catch (error) {
    console.error('Groq error:', error);
    throw new Error('AI research failed');
  }
}