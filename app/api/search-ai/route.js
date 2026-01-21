import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Celebrity from '@/models/Celebrity';
import Company from '@/models/Company';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { name } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check database FIRST (both collections)
    const existingCelebrity = await Celebrity.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });
    
    if (existingCelebrity) {
      return NextResponse.json({
        ...existingCelebrity.toObject(),
        type: 'celebrity',
        _id: existingCelebrity._id.toString(),
        message: 'Found in database'
      });
    }

    const existingCompany = await Company.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existingCompany) {
      return NextResponse.json({
        ...existingCompany.toObject(),
        type: 'company',
        profession: existingCompany.industry,
        _id: existingCompany._id.toString(),
        message: 'Found in database'
      });
    }

    // Not in database - do AI research
    const research = await researchEntity(name);

    if (!research || research.confidence < 30) {
      return NextResponse.json(
        { error: 'Unable to find reliable information about this entity' },
        { status: 404 }
      );
    }

    // Normalize name to Title Case
    const normalizedName = (research.name || name)
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    let savedEntity;
    if (research.entityType === 'company') {
      savedEntity = await Company.create({
        name: normalizedName,
        industry: research.profession || 'Business',
        stance: research.stance,
        sources: research.sources,
        aiConfidence: research.confidence,
        summary: research.summary,
        status: 'approved',
        parentCompany: research.parentCompany || null
      });
    } else {
      savedEntity = await Celebrity.create({
        name: normalizedName,
        profession: research.profession || 'Public Figure',
        stance: research.stance,
        sources: research.sources,
        aiConfidence: research.confidence,
        summary: research.summary,
        status: 'approved',
        featured: research.stance === 'pro' && research.confidence >= 90,
      });
    }

    return NextResponse.json({
      ...savedEntity.toObject(),
      type: research.entityType,
      profession: research.entityType === 'company' ? savedEntity.industry : savedEntity.profession,
      summary: research.summary,
      confidence: savedEntity.aiConfidence,
      _id: savedEntity._id.toString(),
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

async function researchEntity(name) {
  const prompt = `Research "${name}" and their/its public stance on Palestine.

You MUST follow these 3 steps of verification:
1. STEP 1: Evidence Gathering - Search for direct public statements, social media posts, official corporate actions, donations, or affiliations regarding the Palestine/Israel conflict.
2. STEP 2: Stance Categorization - Analyze the evidence. "pro" means explicit support for Palestine/ceasefire. "against" means explicit support for Israel's military actions or clear financial ties to the Israeli military. "neutral" means no clear public stance, vague humanitarian statements, or silence.
3. STEP 3: Source Validation - Verify that the sources are credible (major news organizations, verified social media handles, official corporate statements, or boycott lists).

Task:
1. Determine if this is a "person" or a "company"
2. Determine final stance: "pro", "neutral", or "against"
3. Provide 3-5 verified source URLs
4. Identify their profession (if person) or industry (if company)
5. Provide a 2-3 sentence summary explaining the evidence found
6. Assign a confidence rating (0-100) based on source strength

Rules:
- Use credible sources only
- If unclear evidence, mark "neutral" with low confidence
- Base on PUBLIC statements/actions/financial ties only

Return valid JSON only:
{
  "name": "Full Name/Company Name",
  "entityType": "person" | "company",
  "profession": "Their profession or industry",
  "stance": "pro" | "neutral" | "against",
  "sources": ["url1", "url2", "url3"],
  "summary": "Brief explanation",
  "confidence": 0-100,
  "parentCompany": "Parent company name if applicable (only for companies)"
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
