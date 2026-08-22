import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { DEFAULT_SAFETY_PROGRESS } from '@/lib/safetyData';
import { SafetyProgress } from '@/types/safety';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user?.id) {
      const { data, error } = await supabase
        .from('safety_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        const progress: SafetyProgress = {
          userId: data.user_id,
          score: data.score,
          totalAttempts: data.total_attempts,
          correctAttempts: data.correct_attempts,
          streakDays: data.streak_days,
          monthlyImprovementPercentage: data.monthly_improvement_percentage,
          weakCategories: data.weak_categories || [],
          completedScenarioIds: data.completed_scenario_ids || [],
          lastCompletedAt: data.updated_at,
        };
        return NextResponse.json({ progress });
      }
    }

    return NextResponse.json({ progress: DEFAULT_SAFETY_PROGRESS });
  } catch (error: any) {
    console.error('Error fetching safety progress:', error);
    return NextResponse.json({ progress: DEFAULT_SAFETY_PROGRESS });
  }
}
