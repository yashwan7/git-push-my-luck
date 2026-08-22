import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SCAM_SCENARIOS, DEFAULT_SAFETY_PROGRESS } from '@/lib/safetyData';
import { SafetyProgress, ScamCategory } from '@/types/safety';

// In-memory progress tracking for guest / fallback sessions
const userProgressMap: Map<string, SafetyProgress> = new Map();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scenarioId, selectedOptionId } = body;

    if (!scenarioId || !selectedOptionId) {
      return NextResponse.json(
        { error: 'Scenario ID and selected option ID are required.' },
        { status: 400 }
      );
    }

    const scenario = SCAM_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: 'Scenario not found.' }, { status: 404 });
    }

    const selectedOption = scenario.options.find(o => o.id === selectedOptionId);
    const isCorrect = selectedOption ? selectedOption.isSafe : false;

    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'guest-citizen';

    // Retrieve or initialize current progress
    let currentProgress = userProgressMap.get(userId) || { ...DEFAULT_SAFETY_PROGRESS, userId };

    const totalAttempts = currentProgress.totalAttempts + 1;
    const correctAttempts = currentProgress.correctAttempts + (isCorrect ? 1 : 0);
    
    // Calculate new educational score (bounded 40 to 98)
    const accuracy = correctAttempts / totalAttempts;
    const newScore = Math.min(98, Math.max(45, Math.round(50 + accuracy * 45 + Math.min(10, totalAttempts))));

    const completedIds = Array.from(new Set([...currentProgress.completedScenarioIds, scenarioId]));

    // Adaptive tracking for weak categories
    let weakCategories = [...currentProgress.weakCategories];
    if (!isCorrect && !weakCategories.includes(scenario.category)) {
      weakCategories.push(scenario.category);
    } else if (isCorrect && weakCategories.includes(scenario.category)) {
      // If user got it right, remove from weak categories
      weakCategories = weakCategories.filter(c => c !== scenario.category);
    }

    const updatedProgress: SafetyProgress = {
      userId,
      score: newScore,
      totalAttempts,
      correctAttempts,
      streakDays: currentProgress.streakDays + (isCorrect ? 1 : 0),
      monthlyImprovementPercentage: Math.min(30, currentProgress.monthlyImprovementPercentage + (isCorrect ? 3 : 1)),
      weakCategories: weakCategories as ScamCategory[],
      completedScenarioIds: completedIds,
      lastCompletedAt: new Date().toISOString(),
    };

    userProgressMap.set(userId, updatedProgress);

    // If Supabase is available, persist
    if (user?.id) {
      try {
        await supabase
          .from('scam_attempts')
          .insert({
            user_id: user.id,
            scenario_id: scenarioId,
            selected_option_id: selectedOptionId,
            is_correct: isCorrect,
            category: scenario.category,
          });

        await supabase
          .from('safety_progress')
          .upsert({
            user_id: user.id,
            score: newScore,
            total_attempts: totalAttempts,
            correct_attempts: correctAttempts,
            streak_days: updatedProgress.streakDays,
            monthly_improvement_percentage: updatedProgress.monthlyImprovementPercentage,
            weak_categories: weakCategories,
            completed_scenario_ids: completedIds,
            updated_at: new Date().toISOString(),
          });
      } catch (dbErr) {
        console.warn('Supabase progress upsert fallback:', dbErr);
      }
    }

    return NextResponse.json({
      isCorrect,
      explanation: selectedOption?.explanation || scenario.generalExplanation,
      generalExplanation: scenario.generalExplanation,
      redFlags: scenario.redFlags,
      safetyTip: scenario.safetyTip,
      updatedScore: newScore,
      progress: updatedProgress,
    });
  } catch (error: any) {
    console.error('Error recording attempt:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to record attempt.' },
      { status: 500 }
    );
  }
}
