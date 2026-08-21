import { AuditMetrics } from '@/types';

export function runAccessibilityAudit(urlOrName: string): AuditMetrics {
  const isGov = urlOrName.toLowerCase().includes('gov') || urlOrName.toLowerCase().includes('scholarship');
  const isHealth = urlOrName.toLowerCase().includes('health') || urlOrName.toLowerCase().includes('hospital');

  if (isGov) {
    return {
      overallScore: 68,
      visualScore: 74,
      interactionScore: 58,
      languageScore: 52,
      cognitiveScore: 62,
      navigationScore: 70,
      afterTransformationScore: 96,
      issues: [
        {
          severity: 'high',
          category: 'Language Clarity',
          description: 'High density of legalistic bureaucracy ("Section 12(B) forfeiture clause")',
          recommendation: 'Apply NAYAN Semantic Simplifier to convert to Plain Grade 4 language.'
        },
        {
          severity: 'high',
          category: 'Interaction Target',
          description: 'Checkbox and radio target sizes under 24px diameter',
          recommendation: 'Scale interaction targets to minimum 52px diameter with dwell support.'
        },
        {
          severity: 'medium',
          category: 'Cognitive Load',
          description: '15 form fields displayed simultaneously on a single scroll view',
          recommendation: 'Transform workflow into NAYAN 1-question-per-screen Focus Mode.'
        },
        {
          severity: 'medium',
          category: 'Visual Contrast',
          description: 'Help text text-to-background contrast ratio is 3.2:1 (below WCAG AAA 7:1)',
          recommendation: 'Enable NAYAN High-Contrast Ink Navy or High-Contrast Dark theme.'
        }
      ]
    };
  }

  if (isHealth) {
    return {
      overallScore: 74,
      visualScore: 79,
      interactionScore: 68,
      languageScore: 65,
      cognitiveScore: 71,
      navigationScore: 76,
      afterTransformationScore: 95,
      issues: [
        {
          severity: 'high',
          category: 'Multilingual Support',
          description: 'Clinical terminology available only in English; no voice synthesis in regional languages',
          recommendation: 'Enable NAYAN Kannada/Hindi Multilingual Bridge with TTS playback.'
        },
        {
          severity: 'medium',
          category: 'Navigation Complexity',
          description: 'Nested dropdown menus require multi-tap precise cursor hover',
          recommendation: 'Use NAYAN Single-Tap Large Category Selector.'
        }
      ]
    };
  }

  return {
    overallScore: 72,
    visualScore: 81,
    interactionScore: 64,
    languageScore: 57,
    cognitiveScore: 68,
    navigationScore: 76,
    afterTransformationScore: 94,
    issues: [
      {
        severity: 'high',
        category: 'Interaction Accessibility',
        description: 'Small touch targets (< 32px height) on mobile viewports',
        recommendation: 'Enlarge control heights to 60px with NAYAN Motor Assist.'
      },
      {
        severity: 'high',
        category: 'Language Complexity',
        description: 'Technical terminology in customer policy declarations',
        recommendation: 'Rewrite declarations using NAYAN Plain Language Generator.'
      },
      {
        severity: 'medium',
        category: 'Audio Alternatives',
        description: 'No voice-guided audio prompts for visually impaired screen-reader users',
        recommendation: 'Activate NAYAN Speech Engine audio prompts.'
      }
    ]
  };
}
