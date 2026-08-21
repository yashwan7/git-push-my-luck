export type TransactionState = 
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'LIMIT_CHECK'
  | 'LIMIT_WARNING'
  | 'USER_CONFIRMATION'
  | 'USER_VERIFICATION'
  | 'AUTHENTICATION'
  | 'COMPLETED'
  | 'CANCELLED';

export interface UserTransactionLimit {
  warningThreshold: number; // e.g. 5000
  enabled: boolean;
  currency: string;
  lastUpdated: string;
}

export interface BankAccount {
  accountNumber: string;
  maskedAccountNumber: string;
  accountHolderName: string;
  availableBalance: number;
  currency: string;
  accountType: 'Savings' | 'Current';
  ifscCode: string;
  averageTransactionAmount: number;
  userConfiguredLimit?: number;
}

export interface BankCard {
  id: string;
  cardNumber: string;
  maskedCardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  cardType: 'VISA' | 'Mastercard' | 'RuPay';
  network: string;
  bankName: string;
  isFrozen: boolean;
  isContactless: boolean;
  dailyLimit: number;
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
  colorHex?: string;
  avatarImage?: string;
}

export interface BankTransaction {
  id: string;
  title: string;
  titleKannada: string;
  titleHindi: string;
  merchant?: string;
  category: 'upi' | 'utility' | 'salary' | 'recharge' | 'transfer' | 'entertainment' | 'food' | 'shopping';
  amount: number;
  type: 'debit' | 'credit';
  timestamp: string;
  dateFormatted?: string;
  status: 'completed' | 'pending' | 'failed';
  recipientOrSource: string;
  paymentMethod?: string;
  referenceId?: string;
  note?: string;
}

export interface BillItem {
  id: string;
  title: string;
  category: 'electricity' | 'mobile' | 'internet' | 'water' | 'gas';
  billerName: string;
  amount: number;
  dueDate: string;
  isDueToday?: boolean;
  consumerNumber: string;
  status: 'unpaid' | 'paid';
}

export interface SpendingCategory {
  id: string;
  name: string;
  nameKannada: string;
  nameHindi: string;
  amount: number;
  percentage: number;
  color: string;
  trend: string;
}

export interface SpendingAnalytics {
  monthName: string;
  totalIncome: number;
  totalExpense: number;
  spentPercentage: number;
  savedPercentage: number;
  categories: SpendingCategory[];
  monthlyHistory: { month: string; amount: number }[];
  foodExpenseIncreasePct: number;
}

export interface RiskAssessment {
  level: 'standard' | 'elevated' | 'high' | 'blocked';
  multiplier: number;
  averageAmount: number;
  requestedAmount: number;
  configuredLimit: number;
  isLimitExceeded: boolean;
  exceededBy: number;
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
  userConfiguredLimit?: number;
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
  note?: string;
}

export interface VoiceIntent {
  intent: 'SEND_MONEY' | 'CHECK_BALANCE' | 'RECENT_TRANSACTIONS' | 'GET_HELP' | 'CONFIRM' | 'CANCEL' | 'UNKNOWN' | 'EXPLAIN_SPENDING' | 'PAY_BILL';
  recipient?: string;
  amount?: number;
  category?: string;
  currency?: string;
  confidence: number;
  originalQuery: string;
  translatedQuery: string;
  languageDetected: string;
  spokenResponse?: string;
}
