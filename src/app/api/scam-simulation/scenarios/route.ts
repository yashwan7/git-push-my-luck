import { NextRequest, NextResponse } from 'next/server';
import { SCAM_SCENARIOS } from '@/lib/safetyData';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const id = searchParams.get('id');

    if (id) {
      const single = SCAM_SCENARIOS.find(s => s.id === id);
      if (!single) {
        return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
      }
      return NextResponse.json({ scenario: single });
    }

    let filtered = [...SCAM_SCENARIOS];

    if (category && category !== 'all') {
      filtered = filtered.filter(s => s.category === category);
    }

    if (difficulty && difficulty !== 'all') {
      filtered = filtered.filter(s => s.difficulty === difficulty);
    }

    return NextResponse.json({
      scenarios: filtered,
      totalCount: filtered.length,
    });
  } catch (error: any) {
    console.error('Error fetching scam scenarios:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch scenarios.' },
      { status: 500 }
    );
  }
}
