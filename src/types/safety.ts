export type TrustedContactRelationship = 'Daughter' | 'Son' | 'Sister' | 'Brother' | 'Parent' | 'Friend' | 'Caregiver' | 'Spouse' | 'Other';

export type ContactMethod = 'WhatsApp' | 'SMS' | 'Phone Call';

export interface TrustedContact {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  contactMethod: ContactMethod;
  contactValue: string; // phone number or identifier
  avatarColor?: string;
  createdAt: string;
  updatedAt?: string;
}

export type TrustedRequestStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export type TrustedResponseAction = 'looks_safe' | 'dont_proceed' | 'call_me';

export interface TrustedRequest {
  id: string;
  userId: string;
  trustedContactId: string;
  contactName: string;
  contactRelationship: string;
  reason: string;
  riskLevel: 'caution' | 'high_risk' | 'unusual_amount' | 'unknown_recipient';
  minimalContext: {
    transactionType?: string;
    amount?: number;
    recipientName?: string;
    detectedWarning?: string;
    actionDescription?: string;
  };
  status: TrustedRequestStatus;
  response?: TrustedResponseAction;
  responseNote?: string;
  createdAt: string;
  expiresAt: string;
  respondedAt?: string;
}

export type ScamCategory = 
  | 'fake_kyc'
  | 'bank_impersonation'
  | 'upi_payment_trap'
  | 'fake_govt_scheme'
  | 'fake_job_offer'
  | 'fake_courier_customs'
  | 'fake_customer_care'
  | 'friend_in_distress'
  | 'lottery_prize_scam'
  | 'investment_scam';

export type ScenarioDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ScenarioOption {
  id: string;
  label: string;
  labelKannada?: string;
  labelHindi?: string;
  isSafe: boolean;
  explanation: string;
  explanationKannada?: string;
  explanationHindi?: string;
}

export interface ScamScenario {
  id: string;
  category: ScamCategory;
  categoryLabel: string;
  difficulty: ScenarioDifficulty;
  title: string;
  titleKannada?: string;
  titleHindi?: string;
  sender: string;
  senderBadge?: string;
  visualType: 'sms' | 'whatsapp' | 'upi_request' | 'email' | 'system_dialog';
  message: string;
  messageKannada?: string;
  messageHindi?: string;
  subDetails?: string;
  options: ScenarioOption[];
  correctAnswerId: string;
  generalExplanation: string;
  generalExplanationKannada?: string;
  generalExplanationHindi?: string;
  redFlags: string[];
  redFlagsKannada?: string[];
  redFlagsHindi?: string[];
  safetyTip: string;
  safetyTipKannada?: string;
  safetyTipHindi?: string;
}

export interface ScamAttempt {
  id: string;
  userId: string;
  scenarioId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  category: ScamCategory;
  completedAt: string;
}

export interface SafetyProgress {
  userId: string;
  score: number; // 0 to 100
  totalAttempts: number;
  correctAttempts: number;
  streakDays: number;
  monthlyImprovementPercentage: number;
  weakCategories: ScamCategory[];
  completedScenarioIds: string[];
  lastCompletedAt?: string;
}
