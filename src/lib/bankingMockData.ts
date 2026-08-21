import { BankAccount, Beneficiary, BankTransaction, RiskAssessment } from '@/types/banking';

export const MOCK_BANK_ACCOUNT: BankAccount = {
  accountNumber: '123456781234',
  maskedAccountNumber: 'XXXXXX1234',
  accountHolderName: 'Ramesh Kumar',
  availableBalance: 42850.0,
  currency: 'INR',
  accountType: 'Savings',
  ifscCode: 'NAYN0004821',
  averageTransactionAmount: 850.0,
};

export const MOCK_BENEFICIARIES: Beneficiary[] = [
  {
    id: 'ben-1',
    name: 'Ramesh',
    nameKannada: 'ರಮೇಶ್',
    nameHindi: 'रमेश',
    accountNumber: '123456781234',
    maskedAccountNumber: 'XXXXXX1234',
    upiId: 'ramesh@upi',
    relation: 'Self / Primary Contact',
    frequentlyUsed: true,
    avatarColor: 'bg-blue-600',
  },
  {
    id: 'ben-2',
    name: 'Suresh',
    nameKannada: 'ಸುರೇಶ್',
    nameHindi: 'सुरेश',
    accountNumber: '987654326721',
    maskedAccountNumber: 'XXXXXX6721',
    upiId: 'suresh@okaxis',
    relation: 'Family Member',
    frequentlyUsed: true,
    avatarColor: 'bg-emerald-600',
  },
  {
    id: 'ben-3',
    name: 'Priya',
    nameKannada: 'ಪ್ರಿಯಾ',
    nameHindi: 'प्रिया',
    accountNumber: '456789129012',
    maskedAccountNumber: 'XXXXXX9012',
    upiId: 'priya@okhdfc',
    relation: 'Colleague',
    frequentlyUsed: true,
    avatarColor: 'bg-purple-600',
  },
  {
    id: 'ben-4',
    name: 'Anita',
    nameKannada: 'ಅನಿತಾ',
    nameHindi: 'अनिता',
    accountNumber: '789012343341',
    maskedAccountNumber: 'XXXXXX3341',
    upiId: 'anita@paytm',
    relation: 'Friend',
    frequentlyUsed: false,
    avatarColor: 'bg-amber-600',
  },
];

export const MOCK_TRANSACTIONS: BankTransaction[] = [
  {
    id: 'tx-101',
    title: 'UPI - Grocery Store',
    titleKannada: 'ಯುಪಿಐ - ದಿನಸಿ ಅಂಗಡಿ',
    titleHindi: 'यूपीआई - किराना स्टोर',
    category: 'upi',
    amount: 850.0,
    type: 'debit',
    timestamp: 'Today, 09:30 AM',
    status: 'completed',
    recipientOrSource: 'Daily Fresh Mart',
  },
  {
    id: 'tx-102',
    title: 'Electricity Bill Payment',
    titleKannada: 'ವಿದ್ಯುತ್ ಬಿಲ್ ಪಾವತಿ',
    titleHindi: 'बिजली बिल भुगतान',
    category: 'utility',
    amount: 1240.0,
    type: 'debit',
    timestamp: 'Yesterday, 04:15 PM',
    status: 'completed',
    recipientOrSource: 'BESCOM Karnataka',
  },
  {
    id: 'tx-103',
    title: 'Monthly Salary Credit',
    titleKannada: 'ಮಾಸಿಕ ವೇತನ ಜಮಾ',
    titleHindi: 'मासिक वेतन क्रेडिट',
    category: 'salary',
    amount: 48000.0,
    type: 'credit',
    timestamp: '01 Aug 2026',
    status: 'completed',
    recipientOrSource: 'TechCorp India Pvt Ltd',
  },
  {
    id: 'tx-104',
    title: 'Mobile Recharge',
    titleKannada: 'ಮೊಬೈಲ್ ರೀಚಾರ್ಜ್',
    titleHindi: 'मोबाइल रिचार्ज',
    category: 'recharge',
    amount: 299.0,
    type: 'debit',
    timestamp: '28 Jul 2026',
    status: 'completed',
    recipientOrSource: 'Jio Prepaid',
  },
];

/**
 * Deterministic Adaptive Friction & Risk Evaluation Engine
 */
export function evaluateTransferRisk(amount: number, recipientName: string): RiskAssessment {
  const avg = MOCK_BANK_ACCOUNT.averageTransactionAmount;
  const multiplier = Number((amount / avg).toFixed(1));

  if (amount > 100000) {
    return {
      level: 'blocked',
      multiplier,
      averageAmount: avg,
      requestedAmount: amount,
      warningTitle: 'Transaction Exceeds Daily Limit',
      warningTitleKannada: 'ವಹಿವಾಟು ದೈನಂದಿನ ಮಿತಿಯನ್ನು ಮೀರಿದೆ',
      warningTitleHindi: 'लेनदेन दैनिक सीमा से अधिक है',
      warningDescription: 'For your security, single online transfers are capped at ₹1,00,000.',
      warningDescriptionKannada: 'ನಿಮ್ಮ ಸುರಕ್ಷತೆಗಾಗಿ ಆನ್‌ಲೈನ್ ವರ್ಗಾವಣೆ ಮಿತಿ ₹1,00,000 ಆಗಿದೆ.',
      warningDescriptionHindi: 'आपकी सुरक्षा के लिए अधिकतम सीमा ₹1,00,000 है।',
      reasons: ['Amount exceeds maximum permitted single transaction threshold.'],
      reasonsKannada: ['ಗರಿಷ್ಠ ಅನುಮತಿಸಲಾದ ವಹಿವಾಟು ಮಿತಿ ಮೀರಿದೆ.'],
      reasonsHindi: ['अधिकतम अनुमत सीमा पार हो गई है।'],
      requiresAdditionalConfirmation: true,
      allowContinue: false,
    };
  }

  if (multiplier >= 8) {
    return {
      level: 'high',
      multiplier,
      averageAmount: avg,
      requestedAmount: amount,
      warningTitle: 'High-Value Transfer Verification',
      warningTitleKannada: 'ಹೆಚ್ಚಿನ ಮೊತ್ತದ ವಹಿವಾಟು ಪರಿಶೀಲನೆ',
      warningTitleHindi: 'उच्च मूल्य लेनदेन सत्यापन',
      warningDescription: `₹${amount.toLocaleString('en-IN')} is significantly higher than your typical activity.`,
      warningDescriptionKannada: `₹${amount.toLocaleString('en-IN')} ನಿಮ್ಮ ಸಾಮಾನ್ಯ ವಹಿವಾಟುಗಿಂತ ಗಣನೀಯವಾಗಿ ಹೆಚ್ಚಾಗಿದೆ.`,
      warningDescriptionHindi: `₹${amount.toLocaleString('en-IN')} आपके सामान्य लेनदेन से काफी अधिक है।`,
      reasons: [
        `Amount is ${multiplier}× your usual transaction size (₹${avg}).`,
        'High-value transfer requires explicit audio and visual step confirmation.',
      ],
      reasonsKannada: [
        `ಮೊತ್ತವು ನಿಮ್ಮ ಸಾಮಾನ್ಯ ವಹಿವಾಟಿನ ${multiplier} ಪಟ್ಟು ಹೆಚ್ಚಾಗಿದೆ (₹${avg}).`,
        'ಹೆಚ್ಚಿನ ಮೊತ್ತಕ್ಕೆ ಹೆಚ್ಚುವರಿ ಧ್ವನಿ ಮತ್ತು ಸ್ಪರ್ಶ ದೃಢೀಕರಣ ಅಗತ್ಯವಿದೆ.',
      ],
      reasonsHindi: [
        `राशि आपके सामान्य आकार (₹${avg}) से ${multiplier} गुना अधिक है।`,
        'उच्च मूल्य के लिए स्पष्ट पुष्टि आवश्यक है।',
      ],
      requiresAdditionalConfirmation: true,
      allowContinue: true,
    };
  }

  if (multiplier >= 4) {
    return {
      level: 'elevated',
      multiplier,
      averageAmount: avg,
      requestedAmount: amount,
      warningTitle: 'Before you continue',
      warningTitleKannada: 'ಮುಂದುವರಿಯುವ ಮುನ್ನ ಗಮನಿಸಿ',
      warningTitleHindi: 'आगे बढ़ने से पहले ध्यान दें',
      warningDescription: `₹${amount.toLocaleString('en-IN')} is higher than your usual transaction amount.`,
      warningDescriptionKannada: `₹${amount.toLocaleString('en-IN')} ನಿಮ್ಮ ಸಾಮಾನ್ಯ ವಹಿವಾಟು ಮೊತ್ತಕ್ಕಿಂತ ಹೆಚ್ಚಾಗಿದೆ.`,
      warningDescriptionHindi: `₹${amount.toLocaleString('en-IN')} आपकी सामान्य लेनदेन राशि से अधिक है।`,
      reasons: [
        `Amount is ${multiplier}× your usual transaction size (₹${avg}).`,
        `Recipient: ${recipientName}`,
      ],
      reasonsKannada: [
        `ಮೊತ್ತವು ನಿಮ್ಮ ಸಾಮಾನ್ಯ ವಹಿವಾಟಿನ ${multiplier} ಪಟ್ಟು ಹೆಚ್ಚಾಗಿದೆ (₹${avg}).`,
        `ಸ್ವೀಕರಿಸುವವರು: ${recipientName}`,
      ],
      reasonsHindi: [
        `राशि आपके सामान्य आकार (₹${avg}) से ${multiplier} गुना अधिक है।`,
        `प्राप्तकर्ता: ${recipientName}`,
      ],
      requiresAdditionalConfirmation: true,
      allowContinue: true,
    };
  }

  return {
    level: 'standard',
    multiplier,
    averageAmount: avg,
    requestedAmount: amount,
    warningTitle: 'Standard Payment Review',
    warningTitleKannada: 'ಸಾಮಾನ್ಯ ಪಾವತಿ ಪರಿಶೀಲನೆ',
    warningTitleHindi: 'सामान्य भुगतान समीक्षा',
    warningDescription: 'Transaction within your normal spending profile.',
    warningDescriptionKannada: 'ನಿಮ್ಮ ಸಾಮಾನ್ಯ ಖರ್ಚು ಪ್ರೊಫೈಲ್‌ನ ವ್ಯಾಪ್ತಿಯಲ್ಲಿದೆ.',
    warningDescriptionHindi: 'आपके सामान्य खर्च के दायरे में लेनदेन।',
    reasons: ['Amount is aligned with your everyday activity.'],
    reasonsKannada: ['ನಿಮ್ಮ ದೈನಂದಿನ ವಹಿವಾಟಿಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ.'],
    reasonsHindi: ['आपकी दैनिक गतिविधि के अनुरूप है।'],
    requiresAdditionalConfirmation: false,
    allowContinue: true,
  };
}
