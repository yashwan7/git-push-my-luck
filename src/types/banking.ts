export interface BankAccount {
  accountNumber: string;
  maskedAccountNumber: string;
  accountHolderName: string;
  availableBalance: number;
  currency: string;
  accountType: 'Savings' | 'Current';
  ifscCode: string;
  averageTransactionAmount: number;
}

export interface Beneficiary {
  id: string;
  name: string;
  nameKannada: string;
  nameHindi: string;
  accountNumber: string;
  maskedAccountNumber: string;
  upiId: string;
  relation: string;
  frequentlyUsed: boolean;
  avatarColor: string;
}

export interface BankTransaction {
  id: string;
  title: string;
  titleKannada: string;
  titleHindi: string;
  category: 'upi' | 'utility' | 'salary' | 'recharge' | 'transfer';
  amount: number;
  type: 'debit' | 'credit';
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  recipientOrSource: string;
}

export interface RiskAssessment {
  level: 'standard' | 'elevated' | 'high' | 'blocked';
  multiplier: number;
  averageAmount: number;
  requestedAmount: number;
  warningTitle: string;
  warningTitleKannada: string;
  warningTitleHindi: string;
  warningDescription: string;
  warningDescriptionKannada: string;
  warningDescriptionHindi: string;
  reasons: string[];
  reasonsKannada: string[];
  reasonsHindi: string[];
  requiresAdditionalConfirmation: boolean;
  allowContinue: boolean;
}

export interface TransferRequest {
  recipientId?: string;
  recipientName: string;
  recipientAccount: string;
  amount: number;
  note?: string;
  language?: string;
}

export interface TransferPreview {
  transferId: string;
  senderAccount: string;
  recipientName: string;
  recipientAccount: string;
  amount: number;
  formattedAmount: string;
  fee: number;
  totalDebit: number;
  riskAssessment: RiskAssessment;
  spokenPromptText: string;
  spokenPromptKannada: string;
  spokenPromptHindi: string;
}

export interface VoiceIntent {
  intent: 'SEND_MONEY' | 'CHECK_BALANCE' | 'RECENT_TRANSACTIONS' | 'GET_HELP' | 'CONFIRM' | 'CANCEL' | 'UNKNOWN';
  recipient?: string;
  amount?: number;
  currency?: string;
  confidence: number;
  originalQuery: string;
  translatedQuery: string;
  languageDetected: string;
}
