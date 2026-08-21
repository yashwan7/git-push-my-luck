export type TextSize = 'normal' | 'large' | 'xlarge' | 'xxlarge';
export type ContrastTheme = 'standard' | 'high-contrast-dark' | 'high-contrast-light' | 'warm-paper';
export type InteractionStyle = 'touch' | 'keyboard' | 'voice' | 'large-controls' | 'assisted';
export type InfoFormat = 'read' | 'hear' | 'read-hear' | 'simplified';
export type CognitiveLevel = 'standard' | 'step-by-step' | 'guided-visual' | 'max-simplified';
export type SupportedLanguage = 'en' | 'kn' | 'hi' | 'ta' | 'te' | 'ml' | 'mr' | 'bn';

export interface AccessibilityProfile {
  textSize: TextSize;
  contrastTheme: ContrastTheme;
  interactionMode: InteractionStyle;
  informationMode: InfoFormat;
  cognitiveLevel: CognitiveLevel;
  language: SupportedLanguage;
  motionReduction: boolean;
  voiceSpeed: number; // 0.8 to 1.5
  audioFeedback: boolean;
  actionConfirmations: boolean;
  buttonTargetSize: 'standard' | 'large' | 'extra-large';
}

export interface PersonaPreset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  iconName: string;
  profile: AccessibilityProfile;
}

export interface WorkflowStep {
  stepNumber: number;
  totalSteps: number;
  title: string;
  titleKannada?: string;
  titleHindi?: string;
  description: string;
  descriptionKannada?: string;
  descriptionHindi?: string;
  simplifiedDescription: string;
  fieldLabel: string;
  fieldLabelKannada?: string;
  fieldLabelHindi?: string;
  fieldType: 'text' | 'number' | 'select' | 'file' | 'radio' | 'date';
  options?: { value: string; label: string; labelKannada?: string; labelHindi?: string }[];
  placeholder?: string;
  helpText: string;
  audioPrompt: string;
}

export interface ServiceDefinition {
  id: string;
  title: string;
  titleKannada?: string;
  titleHindi?: string;
  category: 'government' | 'healthcare' | 'banking' | 'education';
  organization: string;
  description: string;
  estimatedTime: string;
  badge: string;
  steps: WorkflowStep[];
  standardDenseNotice: string; // Used to show standard complex dense form text
}

export interface AuditMetrics {
  overallScore: number;
  visualScore: number;
  interactionScore: number;
  languageScore: number;
  cognitiveScore: number;
  navigationScore: number;
  issues: {
    severity: 'high' | 'medium' | 'low';
    category: string;
    description: string;
    recommendation: string;
  }[];
  afterTransformationScore: number;
}
