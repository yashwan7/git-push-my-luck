import { NextRequest, NextResponse } from 'next/server';
import { MOCK_BANK_ACCOUNT, MOCK_BENEFICIARIES, evaluateTransferRisk } from '@/lib/bankingMockData';
import { TransferPreview } from '@/types/banking';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      amount = 0, 
      recipientName = 'Ramesh', 
      recipientAccount = 'XXXXXX1234', 
      language = 'kn',
      userConfiguredLimit = 5000 
    } = body;

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: 'Valid transfer amount is required' }, { status: 400 });
    }

    const matchedBeneficiary = MOCK_BENEFICIARIES.find(
      (b) => b.name.toLowerCase() === recipientName.toLowerCase() ||
             b.nameKannada.includes(recipientName) ||
             b.nameHindi.includes(recipientName)
    );

    const finalRecipientName = matchedBeneficiary ? matchedBeneficiary.name : recipientName;
    const finalRecipientAccount = matchedBeneficiary ? matchedBeneficiary.maskedAccountNumber : recipientAccount;

    const riskAssessment = evaluateTransferRisk(numAmount, finalRecipientName, Number(userConfiguredLimit) || 5000);

    const formattedAmount = `₹${numAmount.toLocaleString('en-IN')}`;
    const transferId = `TRF-${Date.now().toString().slice(-6)}`;

    // Generate language-specific natural spoken confirmation prompts reflecting safety limits
    const spokenPromptKannada = riskAssessment.isLimitExceeded
      ? `ಈ ಪಾವತಿಯು ನಿಮ್ಮ ${riskAssessment.configuredLimit} ರೂಪಾಯಿ ಸುರಕ್ಷತಾ ಮಿತಿಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ. ಮುಂದುವರಿಯುವ ಮೊದಲು ನೀವು ಇದನ್ನು ಪರಿಶೀಲಿಸಬೇಕು.`
      : `ನೀವು ${finalRecipientName} ಅವರಿಗೆ ${numAmount} ರೂಪಾಯಿಗಳನ್ನು ಕಳುಹಿಸುತ್ತಿದ್ದೀರಿ. ದಯವಿಟ್ಟು ದೃಢೀಕರಿಸಿ.`;

    const spokenPromptHindi = riskAssessment.isLimitExceeded
      ? `यह भुगतान आपकी ${riskAssessment.configuredLimit} रुपये की सुरक्षा सीमा से अधिक है। आगे बढ़ने से पहले कृपया इसका सत्यापन करें।`
      : `आप ${finalRecipientName} को ${numAmount} रुपये भेज रहे हैं। कृपया पुष्टि करें।`;

    const spokenPromptText = riskAssessment.isLimitExceeded
      ? `This payment is above your ₹${riskAssessment.configuredLimit.toLocaleString('en-IN')} safety limit. I'll ask you to verify the transaction before it can continue.`
      : `You are sending ${formattedAmount} to ${finalRecipientName}. Please confirm.`;

    const preview: TransferPreview = {
      transferId,
      senderAccount: MOCK_BANK_ACCOUNT.maskedAccountNumber,
      recipientName: finalRecipientName,
      recipientAccount: finalRecipientAccount,
      amount: numAmount,
      formattedAmount,
      fee: 0,
      totalDebit: numAmount,
      riskAssessment,
      spokenPromptText,
      spokenPromptKannada,
      spokenPromptHindi,
    };

    return NextResponse.json({
      success: true,
      preview,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to preview transfer' },
      { status: 500 }
    );
  }
}
