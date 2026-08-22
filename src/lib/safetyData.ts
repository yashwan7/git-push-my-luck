import { ScamScenario, TrustedContact, SafetyProgress, TrustedRequest } from '@/types/safety';

export const SCAM_SCENARIOS: ScamScenario[] = [
  // 1. Fake KYC Update
  {
    id: 'scam-kyc-01',
    category: 'fake_kyc',
    categoryLabel: 'Fake KYC Warning',
    difficulty: 'beginner',
    title: 'Urgent Bank KYC Suspension Notice',
    titleKannada: 'ತುರ್ತು ಬ್ಯಾಂಕ್ KYC ಅಮಾನತು ಸೂಚನೆ',
    titleHindi: 'अति आवश्यक बैंक KYC खाता निलंबन सूचना',
    sender: 'HDFC-ALERT / +91 98210 54129',
    senderBadge: 'Unverified SMS Header',
    visualType: 'sms',
    message: '⚠️ Dear Customer, your SBI/HDFC Bank Account will be BLOCKED TODAY within 2 hours due to pending KYC verification. Please click the link immediately to update your Aadhaar & PAN to avoid permanent suspension: http://bit.ly/sbi-kyc-update-fast',
    messageKannada: '⚠️ ಗೌರವಾನ್ವಿತ ಗ್ರಾಹಕರೇ, ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಯು KYC ಬಾಕಿ ಇರುವ ಕಾರಣ ಇಂದೇ 2 ಗಂಟೆಗಳಲ್ಲಿ ನಿರ್ಬಂಧಿಸಲ್ಪಡುತ್ತದೆ. ಖಾತೆ ರದ್ದಾಗುವುದನ್ನು ತಡೆಯಲು ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಿ: http://bit.ly/sbi-kyc-update-fast',
    messageHindi: '⚠️ प्रिय ग्राहक, लंबित KYC सत्यापन के कारण आपका बैंक खाता आज 2 घंटे के भीतर ब्लॉक कर दिया जाएगा। खाता चालू रखने के लिए तुरंत लिंक पर क्लिक करें: http://bit.ly/sbi-kyc-update-fast',
    options: [
      {
        id: 'opt-safe',
        label: 'Ignore link & verify directly through the official bank app or branch',
        labelKannada: 'ಲಿಂಕ್ ನಿರ್ಲಕ್ಷಿಸಿ ಮತ್ತು ಅಧಿಕೃತ ಬ್ಯಾಂಕ್ ಆ್ಯಪ್ ಅಥವಾ ಶಾಖೆಯ ಮೂಲಕ ಪರಿಶೀಲಿಸಿ',
        labelHindi: 'संदिग्ध लिंक को अनदेखा करें और आधिकारिक बैंक ऐप या शाखा से जांचें',
        isSafe: true,
        explanation: 'Banks never send shortened links (bit.ly) or threaten 2-hour blocking for KYC.',
        explanationKannada: 'ಬ್ಯಾಂಕ್‌ಗಳು ಎಂದಿಗೂ bit.ly ಲಿಂಕ್‌ಗಳನ್ನು ಕಳುಹಿಸುವುದಿಲ್ಲ ಅಥವಾ 2 ಗಂಟೆಗಳಲ್ಲಿ ಬ್ಲಾಕ್ ಮಾಡುವುದಾಗಿ ಬೆದರಿಸುವುದಿಲ್ಲ.',
        explanationHindi: 'बैंक कभी भी bit.ly लिंक नहीं भेजते हैं और न ही 2 घंटे में खाता बंद करने की धमकी देते हैं।'
      },
      {
        id: 'opt-risky',
        label: 'Click the link quickly and enter Aadhaar/OTP to prevent account blockage',
        labelKannada: 'ಖಾತೆ ಬ್ಲಾಕ್ ಆಗುವುದನ್ನು ತಪ್ಪಿಸಲು ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಆಧಾರ್/OTP ನಮೂದಿಸಿ',
        labelHindi: 'ब्लॉकेज से बचने के लिए तुरंत लिंक खोलें और आधार/OTP दर्ज करें',
        isSafe: false,
        explanation: 'Clicking this link leads to a phishing site designed to steal your credentials.',
        explanationKannada: 'ಈ ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡುವುದರಿಂದ ನಿಮ್ಮ ಬ್ಯಾಂಕಿಂಗ್ ವಿವರಗಳನ್ನು ಕದಿಯುವ ನಕಲಿ ಸೈಟ್ ತೆರೆಯುತ್ತದೆ.',
        explanationHindi: 'यह लिंक आपको एक फर्जी वेबसाइट पर ले जाएगा जो आपकी बैंकिंग जानकारी चुरा लेगी।'
      }
    ],
    correctAnswerId: 'opt-safe',
    generalExplanation: 'This is a classic KYC phishing scam using artificial urgency and fear of account closure to force you into entering credentials on a malicious website.',
    generalExplanationKannada: 'ಖಾತೆ ಸ್ಥಗಿತಗೊಳಿಸುವ ಬೆದರಿಕೆಯೊಡ್ಡಿ ಮತ್ತು ತುರ್ತು ಪರಿಸ್ಥಿತಿಯನ್ನು ಸೃಷ್ಟಿಸಿ ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಕದಿಯುವ ತಂತ್ರ ಇದು.',
    generalExplanationHindi: 'यह तात्कालिकता और खाते को ब्लॉक करने के डर का उपयोग करके आपकी संवेदनशील जानकारी चुराने का एक आम तरीका है।',
    redFlags: [
      'Artificial 2-hour deadline inducing panic',
      'Suspicious shortened URL (bit.ly instead of official bank domain)',
      'Threat of immediate financial suspension',
      'Sent from an ordinary mobile number rather than verified bank SMS header'
    ],
    redFlagsKannada: [
      '2 ಗಂಟೆಗಳ ತುರ್ತು ಗಡುವು ನೀಡಿ ಭಯ ಹುಟ್ಟಿಸುವುದು',
      'ಅಧಿಕೃತ ಬ್ಯಾಂಕ್ ಡೊಮೇನ್ ಬದಲಿಗೆ bit.ly ಸಂಕ್ಷಿಪ್ತ ಲಿಂಕ್ ಬಳಕೆ',
      'ಖಾತೆ ರದ್ದುಪಡಿಸುವ ಬೆದರಿಕೆ',
      'ಅಧಿಕೃತ ಬ್ಯಾಂಕ್ ಬದಲಿಗೆ ಸಾಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯಿಂದ ಬಂದ ಸಂದೇಶ'
    ],
    redFlagsHindi: [
      '2 घंटे की कृत्रिम समय सीमा का दबाव',
      'आधिकारिक बैंक वेबसाइट के बजाय bit.ly जैसा छोटा लिंक',
      'खाता बंद करने की धमकी',
      'सत्यापित बैंक आईडी के बजाय अनजान मोबाइल नंबर से संदेश'
    ],
    safetyTip: 'Safety Rule: Never click unexpected links regarding KYC or account blockage. Verify in-person or via official banking apps.',
    safetyTipKannada: 'ಸುರಕ್ಷತಾ ನಿಯಮ: KYC ಅಥವಾ ಖಾತೆ ಬ್ಲಾಕ್ ಬಗೆಗಿನ ಅನಿರೀಕ್ಷಿತ ಲಿಂಕ್‌ಗಳನ್ನು ಎಂದಿಗೂ ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ.',
    safetyTipHindi: 'सुरक्षा नियम: KYC के संबंध में आए किसी भी अज्ञात लिंक पर क्लिक न करें। हमेशा आधिकारिक ऐप या शाखा में जाएं।'
  },

  // 2. Bank Impersonation / OTP Stealing
  {
    id: 'scam-bank-otp-02',
    category: 'bank_impersonation',
    categoryLabel: 'Bank Impersonation',
    difficulty: 'intermediate',
    title: 'Customer Executive Verification Call & OTP',
    titleKannada: 'ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿ ಹೆಸರಿನಲ್ಲಿ OTP ಕಳವು ಕರೆ',
    titleHindi: 'बैंक अधिकारी बनकर OTP मांगने वाली कॉल',
    sender: 'Incoming Call from +91 98450 11200 (Name displayed: "Bank Security Support")',
    senderBadge: 'Spoofed Caller ID',
    visualType: 'system_dialog',
    message: '"Hello Sir/Madam, I am calling from SBI Fraud Prevention Unit. We noticed an unauthorized debit of ₹25,000 initiated from your account. To immediately block this transaction and refund your money, please read out the 6-digit verification code sent to your SMS."',
    messageKannada: '"ನಮಸ್ಕಾರ, ನಾನು ಬ್ಯಾಂಕ್ ಭದ್ರತಾ ವಿಭಾಗದಿಂದ ಕರೆ ಮಾಡುತ್ತಿದ್ದೇನೆ. ನಿಮ್ಮ ಖಾತೆಯಿಂದ ₹25,000 ಅನಧಿಕೃತ ವರ್ಗಾವಣೆ ಪತ್ತೆಯಾಗಿದೆ. ಇದನ್ನು ತಕ್ಷಣ ರದ್ದುಗೊಳಿಸಲು ನಿಮ್ಮ ಮೊಬೈಲ್‌ಗೆ ಬಂದ 6 ಅಂಕಿಯ OTP ತಿಳಿಸಿ."',
    messageHindi: '"नमस्ते, मैं बैंक सुरक्षा विभाग से बोल रहा हूँ। आपके खाते से ₹25,000 का अवैध लेनदेन देखा गया है। इसे तुरंत रोकने के लिए आपके फोन पर आए 6 अंकों के OTP को बताएं।"',
    options: [
      {
        id: 'opt-safe',
        label: 'Disconnect the call immediately. Never share OTP with anyone under any circumstance.',
        labelKannada: 'ಕರೆ ತಕ್ಷಣ ಕಡಿತಗೊಳಿಸಿ. ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ಯಾರೊಂದಿಗೂ OTP ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.',
        labelHindi: 'तुरंत कॉल काटें। किसी भी परिस्थिति में किसी के साथ भी OTP साझा न करें।',
        isSafe: true,
        explanation: 'Bank employees never ask for OTPs or PINs over phone calls.',
        explanationKannada: 'ಬ್ಯಾಂಕ್ ಉದ್ಯೋಗಿಗಳು ಫೋನ್ ಕರೆ ಮೂಲಕ ಎಂದಿಗೂ OTP ಅಥವಾ PIN ಕೇಳುವುದಿಲ್ಲ.',
        explanationHindi: 'बैंक के अधिकारी कभी भी फोन कॉल पर OTP या पासवर्ड नहीं मांगते।'
      },
      {
        id: 'opt-risky',
        label: 'Share the OTP quickly to save the ₹25,000 from being debited',
        labelKannada: '₹25,000 ನಷ್ಟವಾಗುವುದನ್ನು ತಡೆಯಲು ತಕ್ಷಣ OTP ತಿಳಿಸಿ',
        labelHindi: '₹25,000 बचाने के लिए तुरंत OTP बता दें',
        isSafe: false,
        explanation: 'Sharing the OTP allows the scammer to complete a fraudulent transfer from your account.',
        explanationKannada: 'OTP ಹಂಚಿಕೊಂಡರೆ ವಂಚಕರು ನಿಮ್ಮ ಖಾತೆಯಿಂದಲೇ ಹಣವನ್ನು ಕದಿಯುತ್ತಾರೆ.',
        explanationHindi: 'OTP बताते ही जालसाज आपके खाते से पैसे निकाल लेगा।'
      }
    ],
    correctAnswerId: 'opt-safe',
    generalExplanation: 'Scammers pretend an unauthorized transaction is happening, generating panic so you read out the OTP that actually authorizes their own transfer.',
    generalExplanationKannada: 'ಹಣ ಕಡಿತವಾಗಿದೆ ಎಂದು ಸುಳ್ಳು ಹೇಳಿ ಆತಂಕ ಸೃಷ್ಟಿಸಿ, ನಿಮ್ಮಿಂದಲೇ OTP ಪಡೆದು ಹಣ ವರ್ಗಾವಣೆ ಮಾಡುವ ತಂತ್ರ.',
    generalExplanationHindi: 'धोखेबाज फर्जी लेन-देन का डर दिखाकर आपसे वह OTP मांगते हैं जिससे वे वास्तव में आपके पैसे निकाल सकें।',
    redFlags: [
      'Caller demands OTP to "cancel" or "refund" money',
      'Caller creates extreme urgency and prevents you from hanging up',
      'Bank staff will NEVER ask for one-time passwords'
    ],
    redFlagsKannada: [
      'ಹಣ ಹಿಂತಿರುಗಿಸಲು OTP ಕೇಳುವುದು',
      'ಕರೆ ಕಟ್ ಮಾಡದಂತೆ ವಿಪರೀತ ಒತ್ತಡ ಹೇರುವುದು',
      'ಬ್ಯಾಂಕ್ ಸಿಬ್ಬಂದಿ ಎಂದಿಗೂ OTP ಕೇಳುವುದಿಲ್ಲ ಎಂಬ ನಿಯಮ ಉಲ್ಲಂಘನೆ'
    ],
    redFlagsHindi: [
      'लेनदेन रोकने के नाम पर OTP की मांग करना',
      'कॉल न काटने का अत्यधिक मानसिक दबाव बनाना',
      'बैंक कर्मचारी कभी भी फोन पर गुप्त OTP नहीं मांगते'
    ],
    safetyTip: 'Safety Rule: OTP is only used to AUTHORIZE money going OUT. It is never needed to receive a refund.',
    safetyTipKannada: 'ಸುರಕ್ಷತಾ ನಿಯಮ: ಹಣ ಕಳುಹಿಸಲು ಮಾತ್ರ OTP ಬೇಕು; ಹಣ ಪಡೆಯಲು ಎಂದಿಗೂ OTP ಅಗತ್ಯವಿಲ್ಲ.',
    safetyTipHindi: 'सुरक्षा नियम: OTP केवल पैसे भेजने के लिए होता है, पैसे प्राप्त करने या रिफंड के लिए नहीं।'
  },

  // 3. UPI Payment Request / "Receive Money" QR Trap
  {
    id: 'scam-upi-trap-03',
    category: 'upi_payment_trap',
    categoryLabel: 'UPI "Receive Money" Trap',
    difficulty: 'intermediate',
    title: 'OLX / Buyer "Scan QR to Receive Advance Payment"',
    titleKannada: 'ಹಣ ಸ್ವೀಕರಿಸಲು QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಎನ್ನುವ UPI ವಂಚನೆ',
    titleHindi: 'पैसे प्राप्त करने के लिए QR कोड स्कैन करने का धोखा',
    sender: 'Buyer on WhatsApp: "Rajesh Furniture Buyer"',
    senderBadge: 'Unknown WhatsApp Contact',
    visualType: 'upi_request',
    message: '"Sir, I am transferring ₹8,500 advance for your old sofa. I have sent this official PhonePe/GPay QR code. Just open your Google Pay, scan this QR code, and enter your UPI PIN to receive ₹8,500 directly into your bank account."',
    subDetails: 'Payment Request: Pay ₹8,500.00 to Merchant "FAST-PAY-TECH"',
    messageKannada: '"ಸರ್, ನಿಮ್ಮ ಸೋಫಾ ಖರೀದಿಗೆ ₹8,500 ಮುಂಗಡ ಕಳುಹಿಸುತ್ತಿದ್ದೇನೆ. ನಾನು ಈ QR ಕೋಡ್ ಕಳುಹಿಸಿದ್ದೇನೆ. ನಿಮ್ಮ GPay ತೆರೆದು ಈ QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ನಿಮ್ಮ UPI PIN ನಮೂದಿಸಿ."',
    messageHindi: '"सर, मैं आपके सोफे के लिए ₹8,500 एडवांस भेज रहा हूँ। मैंने यह QR कोड भेजा है। गूगल पे खोलकर इसे स्कैन करें और अपना UPI पिन डालें, पैसे तुरंत आपके खाते में आ जाएंगे।"',
    options: [
      {
        id: 'opt-safe',
        label: 'Refuse to scan QR or enter UPI PIN. You NEVER need to enter a PIN to receive money.',
        labelKannada: 'QR ಸ್ಕ್ಯಾನ್ ಅಥವಾ UPI PIN ನಮೂದಿಸಲು ನಿರಾಕರಿಸಿ. ಹಣ ಪಡೆಯಲು PIN ಅಗತ್ಯವಿಲ್ಲ.',
        labelHindi: 'QR स्कैन करने या UPI पिन डालने से मना करें। पैसे पाने के लिए पिन की कभी ज़रूरत नहीं होती।',
        isSafe: true,
        explanation: 'Entering UPI PIN always deducts money from your account, it never deposits money.',
        explanationKannada: 'UPI PIN ನಮೂದಿಸಿದರೆ ನಿಮ್ಮ ಖಾತೆಯಿಂದ ಹಣ ಕಡಿತವಾಗುತ್ತದೆ, ಜಮೆಯಾಗುವುದಿಲ್ಲ.',
        explanationHindi: 'UPI पिन डालने से आपके खाते से पैसे कटते हैं, कभी जमा नहीं होते।'
      },
      {
        id: 'opt-risky',
        label: 'Scan the QR code and enter UPI PIN to claim the ₹8,500 advance',
        labelKannada: '₹8,500 ಪಡೆಯಲು QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ UPI PIN ನಮೂದಿಸಿ',
        labelHindi: '₹8,500 एडवांस प्राप्त करने के लिए QR स्कैन करके UPI पिन दर्ज करें',
        isSafe: false,
        explanation: 'Entering your UPI PIN will instantly debit ₹8,500 from your account to the scammer.',
        explanationKannada: 'PIN ನಮೂದಿಸಿದ ತಕ್ಷಣ ನಿಮ್ಮ ಖಾತೆಯಿಂದ ₹8,500 ವಂಚಕರಿಗೆ ತಲುಪುತ್ತದೆ.',
        explanationHindi: 'पिन डालते ही ₹8,500 आपके खाते से कटकर धोखेबाज के पास चले जाएंगे।'
      }
    ],
    correctAnswerId: 'opt-safe',
    generalExplanation: 'QR codes and UPI PINs are only used to SEND money or make payments. Receiving money happens automatically directly into your account with zero PIN required.',
    generalExplanationKannada: 'ಹಣ ಕಳುಹಿಸಲು ಮಾತ್ರ QR ಕೋಡ್ ಮತ್ತು UPI PIN ಬಳಸಲಾಗುತ್ತದೆ. ಹಣ ಪಡೆಯಲು ಯಾವುದೇ PIN ಅಗತ್ಯವಿರುವುದಿಲ್ಲ.',
    generalExplanationHindi: 'पैसे प्राप्त करने के लिए कभी भी QR कोड स्कैन करने या UPI पिन दर्ज करने की आवश्यकता नहीं होती है।',
    redFlags: [
      'Claiming that scanning a QR code or entering a PIN receives money',
      'The payment screen displays "Pay ₹8,500" instead of "Received"',
      'Buyer rushing you to enter PIN immediately'
    ],
    redFlagsKannada: [
      'ಹಣ ಪಡೆಯಲು QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ PIN ಹಾಕಿ ಎಂದು ಹೇಳುವುದು',
      'ಪಾವತಿ ಪರದೆಯಲ್ಲಿ "Pay" ಎಂದು ಇರುವುದು',
      'ತಕ್ಷಣ PIN ನಮೂದಿಸುವಂತೆ ಒತ್ತಾಯಿಸುವುದು'
    ],
    redFlagsHindi: [
      'पैसे पाने के लिए QR स्कैन या पिन डालने का दावा',
      'पेमेंट स्क्रीन पर "Pay ₹8,500" लिखा होना',
      'तुरंत पिन डालने की जल्दबाजी कराना'
    ],
    safetyTip: 'Safety Rule: Entering UPI PIN ALWAYS means money is LEAVING your account. Golden Rule: No PIN to receive money.',
    safetyTipKannada: 'ಚಿನ್ನದ ನಿಯಮ: ಹಣ ಪಡೆಯಲು ಯಾವುದೇ PIN ನಮೂದಿಸಬೇಕಾಗಿಲ್ಲ.',
    safetyTipHindi: 'सुनहरा नियम: पैसे प्राप्त करने के लिए कभी किसी पिन की आवश्यकता नहीं होती।'
  },

  // 4. Fake Government Benefit / Subsidy Scheme
  {
    id: 'scam-govt-scheme-04',
    category: 'fake_govt_scheme',
    categoryLabel: 'Fake Government Subsidy',
    difficulty: 'beginner',
    title: 'PM Free Citizen Cash Grant of ₹50,000',
    titleKannada: 'ಪ್ರಧಾನಮಂತ್ರಿ ₹50,000 ಉಚಿತ ಅನುದಾನ ನಕಲಿ ಯೋಜನೆ',
    titleHindi: 'प्रधानमंत्री ₹50,000 मुफ्त नकद योजना का फर्जी संदेश',
    sender: 'WhatsApp Forward: "PM-YOJANA-2026"',
    senderBadge: 'Forwarded Many Times',
    visualType: 'whatsapp',
    message: '🇮🇳 *GOVERNMENT OF INDIA SCHEME* 🇮🇳\nUnder the new PM Vikas Yojna, every senior citizen & eligible family will receive ₹50,000 direct bank transfer.\n\nOnly 4,000 slots remaining today!\n👉 Click here to register your bank details: http://pm-yojana-grant.free-site.in\n\nShare with 10 friends to activate approval.',
    messageKannada: '🇮🇳 ಸರ್ಕಾರದ ಹೊಸ ಯೋಜನೆಯಡಿ ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕರಿಗೆ ₹50,000 ನೇರ ಬ್ಯಾಂಕ್ ಜಮೆ. ಇಂದೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ: http://pm-yojana-grant.free-site.in. 10 ಜನರಿಗೆ ಫಾರ್ವರ್ಡ್ ಮಾಡಿ.',
    messageHindi: '🇮🇳 सरकारी योजना के तहत सभी वरिष्ठ नागरिकों को ₹50,000 सीधे बैंक में मिलेंगे। केवल आज के लिए! यहाँ रजिस्टर करें: http://pm-yojana-grant.free-site.in और 10 दोस्तों को भेजें।',
    options: [
      {
        id: 'opt-safe',
        label: 'Do not click the link or forward. Check genuine government schemes on official portals (.gov.in)',
        labelKannada: 'ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ. ಅಧಿಕೃತ .gov.in ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಮಾತ್ರ ಪರಿಶೀಲಿಸಿ.',
        labelHindi: 'लिंक पर क्लिक न करें। केवल आधिकारिक सरकारी पोर्टल (.gov.in) पर योजनाओं की पुष्टि करें।',
        isSafe: true,
        explanation: 'All real Indian government scheme portals end in .gov.in or .nic.in and never require WhatsApp forwarding.',
        explanationKannada: 'ನೈಜ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್‌ಗಳು .gov.in ಅಥವಾ .nic.in ನೊಂದಿಗೆ ಕೊನೆಗೊಳ್ಳುತ್ತವೆ.',
        explanationHindi: 'असली सरकारी वेबसाइटों के पते हमेशा .gov.in या .nic.in पर समाप्त होते हैं।'
      },
      {
        id: 'opt-risky',
        label: 'Register bank details on the link and forward to 10 friends before slots run out',
        labelKannada: 'ಲಿಂಕ್‌ನಲ್ಲಿ ಬ್ಯಾಂಕ್ ವಿವರ ಭರ್ತಿ ಮಾಡಿ 10 ಜನರಿಗೆ ಕಳುಹಿಸಿ',
        labelHindi: 'लिंक पर बैंक विवरण भरें और 10 दोस्तों को भेजें',
        isSafe: false,
        explanation: 'This captures your personal identity and banking credentials for fraud.',
        explanationKannada: 'ಇದು ನಿಮ್ಮ ಬ್ಯಾಂಕಿಂಗ್ ಮಾಹಿತಿಯನ್ನು ಕದಿಯುವ ಸೈಬರ್ ವಂಚನೆಯಾಗಿದೆ.',
        explanationHindi: 'यह आपकी निजी और बैंकिंग जानकारी चुराने का फर्जी जाल है।'
      }
    ],
    correctAnswerId: 'opt-safe',
    generalExplanation: 'Free cash grants on non-official websites are identity theft traps. Real schemes are hosted strictly on official government domains (.gov.in).',
    generalExplanationKannada: 'ಉಚಿತ ಹಣದ ಆಮಿಷವೊಡ್ಡಿ ನಕಲಿ ವೆಬ್‌ಸೈಟ್‌ಗಳ ಮೂಲಕ ಮಾಹಿತಿ ಕದಿಯುವ ತಂತ್ರವಿದು. ನೈಜ ಯೋಜನೆಗಳು .gov.in ನಲ್ಲಿರುತ್ತವೆ.',
    generalExplanationHindi: 'फर्जी वेबसाइटों पर मुफ्त पैसे का लालच पहचान और पैसे चुराने का जरिया होता है। असली योजनाएं केवल .gov.in पर होती हैं।',
    redFlags: [
      'Hosted on unofficial domain (.free-site.in instead of .gov.in)',
      'Asks to forward to 10 WhatsApp groups for "activation"',
      'Promises unverified free cash grants without standard documentation'
    ],
    redFlagsKannada: [
      '.gov.in ಬದಲಿಗೆ .free-site.in ನಂತಹ ನಕಲಿ ಡೊಮೇನ್',
      'ಆ್ಯಕ್ಟಿವೇಶನ್‌ಗಾಗಿ 10 ಜನರಿಗೆ ಫಾರ್ವರ್ಡ್ ಮಾಡಲು ಕೇಳುವುದು',
      'ಅನಧಿಕೃತ ಉಚಿತ ನಗದು ಆಮಿಷ'
    ],
    redFlagsHindi: [
      '.gov.in के बजाय अनधिकृत डोमेन (.free-site.in)',
      '10 लोगों को फॉरवर्ड करने की शर्त',
      'बिना किसी सत्यापन के सीधे नकद राशि का लालच'
    ],
    safetyTip: 'Safety Rule: Official Indian Government websites strictly use .gov.in or .nic.in domains. Never trust generic URLs.',
    safetyTipKannada: 'ಸುರಕ್ಷತಾ ನಿಯಮ: ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್‌ಗಳು ಕಡ್ಡಾಯವಾಗಿ .gov.in ಅಥವಾ .nic.in ಹೊಂದಿರುತ್ತವೆ.',
    safetyTipHindi: 'सुरक्षा नियम: आधिकारिक सरकारी वेबसाइटें हमेशा .gov.in या .nic.in पर समाप्त होती हैं।'
  },

  // 5. Fake Work-From-Home Job Scam
  {
    id: 'scam-wfh-job-05',
    category: 'fake_job_offer',
    categoryLabel: 'Fake Job / Task Scam',
    difficulty: 'intermediate',
    title: 'Easy Part-time Job: Earn ₹5,000/day Rating Hotels',
    titleKannada: 'ಹೋಟೆಲ್ ರಿವ್ಯೂ ಮಾಡಿ ದಿನಕ್ಕೆ ₹5,000 ಗಳಿಸಿ ಎನ್ನುವ ನಕಲಿ ಉದ್ಯೋಗ',
    titleHindi: 'घर बैठे होटल रेटिंग करके ₹5,000 रोज कमाने का फर्जी जॉब ऑफर',
    sender: 'Telegram / WhatsApp: "HR Tanya — Global Media Corp"',
    senderBadge: 'International Number (+1 555-0192)',
    visualType: 'whatsapp',
    message: '"Hi! We are offering a flexible Work-From-Home part-time job. Simply like YouTube videos & rate 5 hotels on Google Maps daily to earn ₹3,000 to ₹8,000 per day. To start your first VIP paid batch, please deposit a refundable security fee of ₹1,000."',
    messageKannada: '"ನಮಸ್ಕಾರ! ಮನೆಯಿಂದಲೇ ಕೆಲಸ ಮಾಡಿ ದಿನಕ್ಕೆ ₹3,000 ರಿಂದ ₹8,000 ಗಳಿಸಿ. ಯೂಟ್ಯೂಬ್ ಲೈಕ್ ಮತ್ತು ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್ ರೇಟಿಂಗ್ ಮಾಡಿ. ಮೊದಲ ಟಾಸ್ಕ್ ಆರಂಭಿಸಲು ₹1,000 ಸೆಕ್ಯುರಿಟಿ ಠೇವಣಿ ಕಳುಹಿಸಿ."',
    messageHindi: '"नमस्ते! घर बैठे यूट्यूब वीडियो लाइक और होटल रेटिंग करके रोज ₹3,000 से ₹8,000 कमाएं। पहला वीआईपी टास्क शुरू करने के लिए ₹1,000 की रिफंडेबल सिक्योरिटी फीस जमा करें।"',
    options: [
      {
        id: 'opt-safe',
        label: 'Block and report the contact. Legitimate companies never ask job seekers to pay upfront money.',
        labelKannada: 'ಸಂಪರ್ಕವನ್ನು ಬ್ಲಾಕ್ ಮಾಡಿ. ನೈಜ ಕಂಪನಿಗಳು ಎಂದಿಗೂ ಕೆಲಸ ನೀಡಲು ಮುಂಗಡ ಹಣ ಕೇಳುವುದಿಲ್ಲ.',
        labelHindi: 'नंबर को ब्लॉक करें। वैध कंपनियाँ कभी भी नौकरी देने के लिए अग्रिम पैसे नहीं मांगती हैं।',
        isSafe: true,
        explanation: 'Any job asking you to pay money/deposit before earning is 100% a task-based Ponzi scam.',
        explanationKannada: 'ಕೆಲಸ ಕೊಡುವ ಮುನ್ನ ಹಣ ಠೇವಣಿ ಇಡಲು ಕೇಳುವ ಯಾವುದೇ ಆಫರ್ ಖಂಡಿತ ವಂಚನೆಯಾಗಿದೆ.',
        explanationHindi: 'कमाई शुरू करने से पहले पैसे या डिपॉजिट मांगने वाली हर नौकरी एक बड़ा धोखा है।'
      },
      {
        id: 'opt-risky',
        label: 'Pay ₹1,000 to test the job since it is refundable and high earning',
        labelKannada: 'ಹಣ ವಾಪಸ್ ಬರುತ್ತದೆ ಎಂದು ₹1,000 ಕಳುಹಿಸಿ ಪರೀಕ್ಷಿಸಿ',
        labelHindi: 'यह सोचकर ₹1,000 भेजें कि पैसे वापस मिल जाएंगे और कमाई अच्छी होगी',
        isSafe: false,
        explanation: 'Once you pay ₹1,000, scammers will demand ₹5,000, then ₹20,000, without ever allowing withdrawals.',
        explanationKannada: 'ಒಮ್ಮೆ ₹1,000 ನೀಡಿದರೆ, ನಂತರ ಇನ್ನಷ್ಟು ಹಣ ಕೇಳಿ ನಿಮ್ಮನ್ನು ವಂಚಿಸುತ್ತಾರೆ.',
        explanationHindi: 'एक बार ₹1,000 देने के बाद वे और बड़े डिपॉजिट की मांग करेंगे और पैसे कभी नहीं लौटेंगे।'
      }
    ],
    correctAnswerId: 'opt-safe',
    generalExplanation: 'This is the widespread Telegram task/hotel review scam where victims are lured with small initial earnings and then tricked into depositing large sums under the guise of "VIP tasks".',
    generalExplanationKannada: 'ಆರಂಭದಲ್ಲಿ ಸಣ್ಣ ಮೊತ್ತ ನೀಡಿ ನಂಬಿಸಿ, ನಂತರ ದೊಡ್ಡ ಮೊತ್ತದ ಠೇವಣಿ ಪಡೆದು ವಂಚಿಸುವ ಟೆಲಿಗ್ರಾಂ ಟಾಸ್ಕ್ ಸ್ಕ್ಯಾಮ್ ಇದು.',
    generalExplanationHindi: 'यह एक प्रसिद्ध टास्क स्कैम है जहाँ पहले छोटे मुनाफे का लालच देकर फिर बड़े डिपॉजिट के नाम पर पैसे हड़प लिए जाते हैं।',
    redFlags: [
      'Demanding upfront "security deposit" or "VIP task fee" to work',
      'Unrealistic daily income (₹5,000/day for simple video likes)',
      'Communication conducted entirely on WhatsApp/Telegram with unknown numbers'
    ],
    redFlagsKannada: [
      'ಕೆಲಸ ಆರಂಭಿಸಲು ಮುಂಗಡ ಭದ್ರತಾ ಠೇವಣಿ ಕೇಳುವುದು',
      'ಕೇವಲ ಲೈಕ್ ಮಾಡಲು ದಿನಕ್ಕೆ ₹5,000 ನಂತಹ ಅಸಾಧ್ಯ ವೇತನದ ಆಮಿಷ',
      'ಕೇವಲ ವಾಟ್ಸಾಪ್/ಟೆಲಿಗ್ರಾಂ ಮೂಲಕ ಅಪರಿಚಿತರಿಂದ ಸಂವಹನ'
    ],
    redFlagsHindi: [
      'काम शुरू करने के लिए एडवांस "सिक्योरिटी डिपॉजिट" मांगना',
      'साधारण काम के लिए अवास्तविक कमाई का लालच (रोज ₹5,000)',
      'केवल टेलीग्राम या व्हाट्सएप पर अज्ञात नंबरों से बातचीत'
    ],
    safetyTip: 'Safety Rule: Real jobs PAY you; they NEVER ask you to pay money to get paid.',
    safetyTipKannada: 'ಸುರಕ್ಷತಾ ನಿಯಮ: ನೈಜ ಉದ್ಯೋಗಗಳು ನಿಮಗೆ ಹಣ ನೀಡುತ್ತವೆ; ಅವು ನಿಮ್ಮಿಂದ ಹಣ ಕೇಳುವುದಿಲ್ಲ.',
    safetyTipHindi: 'सुरक्षा नियम: असली नौकरियां आपको वेतन देती हैं, आपसे पैसे नहीं मांगतीं।'
  },

  // 6. Fake Courier / Customs Delivery Scam
  {
    id: 'scam-courier-06',
    category: 'fake_courier_customs',
    categoryLabel: 'Fake Courier / Package Notice',
    difficulty: 'beginner',
    title: 'India Post / BlueDart: Package Undelivered Due to Wrong Address',
    titleKannada: 'ಪಾರ್ಸಲ್ ವಿಳಾಸ ತಪ್ಪಾಗಿದೆ, ₹25 ಶುಲ್ಕ ಪಾವತಿಸಿ ಎನ್ನುವ ಸಂದೇಶ',
    titleHindi: 'पार्सल डिलीवरी अटकी है, ₹25 का शुल्क भरें वाला फर्जी SMS',
    sender: 'SMS from +91 97120 44910',
    senderBadge: 'Unknown Sender',
    visualType: 'sms',
    message: '📦 India Post: Your parcel IND-94820 cannot be delivered due to incomplete address details. Please update your address and pay ₹25 re-delivery fee within 24 hours or the parcel will be returned: http://indiapost-parcel-update.com/pay',
    messageKannada: '📦 ಇಂಡಿಯಾ ಪೋಸ್ಟ್: ನಿಮ್ಮ ಪಾರ್ಸಲ್ ವಿಳಾಸ ತಪ್ಪಾಗಿರುವ ಕಾರಣ ತಲುಪಿಸಲಾಗಿಲ್ಲ. 24 ಗಂಟೆಯೊಳಗೆ ವಿಳಾಸ ನವೀಕರಿಸಿ ಮತ್ತು ₹25 ಶುಲ್ಕ ಪಾವತಿಸಿ: http://indiapost-parcel-update.com/pay',
    messageHindi: '📦 इंडिया पोस्ट: गलत पते के कारण आपका पार्सल डिलीवर नहीं हो सका। 24 घंटे के भीतर पता अपडेट करें और ₹25 का शुल्क भरें: http://indiapost-parcel-update.com/pay',
    options: [
      {
        id: 'opt-safe',
        label: 'Do not click the link. If expecting a parcel, track it only on indiapost.gov.in using your consignment number.',
        labelKannada: 'ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ. ಅಧಿಕೃತ indiapost.gov.in ನಲ್ಲಿ ಮಾತ್ರ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.',
        labelHindi: 'लिंक पर न जाएं। केवल indiapost.gov.in पर आधिकारिक ट्रैकिंग नंबर से जांचें।',
        isSafe: true,
        explanation: 'Official postal services do not send unofficial .com links demanding ₹25 payment to fix addresses.',
        explanationKannada: 'ಅಧಿಕೃತ ಅಂಚೆ ಇಲಾಖೆಯು ಖಾಸಗಿ .com ಲಿಂಕ್‌ಗಳನ್ನು ಕಳುಹಿಸಿ ಹಣ ಕೇಳುವುದಿಲ್ಲ.',
        explanationHindi: 'भारतीय डाक कभी भी निजी .com लिंक भेजकर ₹25 का भुगतान नहीं मांगता।'
      },
      {
        id: 'opt-risky',
        label: 'Click the link and pay ₹25 with debit card since the fee is very small',
        labelKannada: 'ಶುಲ್ಕ ಕೇವಲ ₹25 ಆಗಿರುವುದರಿಂದ ಕಾರ್ಡ್ ವಿವರ ನೀಡಿ ಪಾವತಿಸಿ',
        labelHindi: 'राशि केवल ₹25 है, इसलिए कार्ड से तुरंत भुगतान कर दें',
        isSafe: false,
        explanation: 'Entering your card details on the fake link allows scammers to siphon thousands from your card.',
        explanationKannada: 'ಕಾರ್ಡ್ ವಿವರ ನಮೂದಿಸಿದರೆ ನಿಮ್ಮ ಕಾರ್ಡ್‌ನಿಂದ ದೊಡ್ಡ ಮೊತ್ತದ ಹಣ ಕದಿಯಲಾಗುತ್ತದೆ.',
        explanationHindi: 'कार्ड का विवरण डालते ही जालसाज आपके खाते से हजारों रुपये निकाल लेंगे।'
      }
    ],
    correctAnswerId: 'opt-safe',
    generalExplanation: 'Scammers use small nominal fees (like ₹25) to trick victims into entering complete credit/debit card numbers and CVVs on fake payment gateways.',
    generalExplanationKannada: 'ಸಣ್ಣ ಮೊತ್ತದ ಶುಲ್ಕದ ನೆಪವೊಡ್ಡಿ ನಿಮ್ಮ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ ಮತ್ತು CVV ಕದಿಯುವ ತಂತ್ರವಿದು.',
    generalExplanationHindi: '₹25 जैसी छोटी राशि का बहाना बनाकर आपके कार्ड की पूरी जानकारी (नंबर, CVV, OTP) चुराने का प्रयास किया जाता है।',
    redFlags: [
      'Unofficial .com website for Indian Post',
      'Small token amount used to lure debit/credit card submission',
      'Urgent 24-hour return threat'
    ],
    safetyTip: 'Safety Rule: Track deliveries only on the official carrier app or indiapost.gov.in.'
  },

  // 7. Fake Customer Care Number Scam
  {
    id: 'scam-customer-care-07',
    category: 'fake_customer_care',
    categoryLabel: 'Fake Customer Care Helpline',
    difficulty: 'advanced',
    title: 'Google Search Result Customer Care Helpline',
    titleKannada: 'ಗೂಗಲ್ ಸರ್ಚ್‌ನಲ್ಲಿ ಕಂಡ ನಕಲಿ ಗ್ರಾಹಕ ಸೇವಾ ಸಂಖ್ಯೆ',
    titleHindi: 'सर्च इंजन पर मिला फर्जी कस्टमर केयर नंबर',
    sender: 'Helpdesk Call from Web Search',
    senderBadge: 'Toll-free Fraud Number',
    visualType: 'system_dialog',
    message: '"Sir, you called for electricity bill refund assistance. To process your ₹350 failed payment refund, please download the AnyDesk / TeamViewer QuickSupport app from Play Store and share the 9-digit code so our engineer can fix your bank connection."',
    messageKannada: '"ಸರ್, ನಿಮ್ಮ ವಿದ್ಯುತ್ ಬಿಲ್ ಮರುಪಾವತಿಗಾಗಿ Play Store ನಿಂದ AnyDesk ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಪರದೆಯ ಮೇಲಿನ 9 ಅಂಕಿಯ ಕೋಡ್ ತಿಳಿಸಿ."',
    messageHindi: '"सर, आपके बिजली बिल रिफंड के लिए कृपया प्ले स्टोर से AnyDesk या TeamViewer ऐप डाउनलोड करें और 9 अंकों का कोड बताएं ताकि हम रिफंड भेज सकें।"',
    options: [
      {
        id: 'opt-safe',
        label: 'Refuse immediately and uninstall any remote screen sharing app. Never share AnyDesk/TeamViewer codes.',
        labelKannada: 'ತಕ್ಷಣ ನಿರಾಕರಿಸಿ. AnyDesk ನಂತಹ ಸ್ಕ್ರೀನ್ ಶೇರಿಂಗ್ ಆ್ಯಪ್ ಕೋಡ್ ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.',
        labelHindi: 'तुरंत मना करें। AnyDesk या TeamViewer जैसे स्क्रीन शेयरिंग ऐप का कोड कभी किसी को न दें।',
        isSafe: true,
        explanation: 'AnyDesk gives scammers full remote access to view your screen, SMS, and steal banking passwords.',
        explanationKannada: 'AnyDesk ಕೋಡ್ ನೀಡಿದರೆ ವಂಚಕರು ನಿಮ್ಮ ಮೊಬೈಲ್ ಸ್ಕ್ರೀನ್ ನೋಡಿ ಪಾಸ್‌ವರ್ಡ್ ಕದಿಯುತ್ತಾರೆ.',
        explanationHindi: 'AnyDesk से धोखेबाज आपके पूरे फोन और स्क्रीन को नियंत्रित करके पासवर्ड चुरा लेते हैं।'
      },
      {
        id: 'opt-risky',
        label: 'Install AnyDesk and share the 9-digit code so the customer care officer can assist',
        labelKannada: 'ಗ್ರಾಹಕ ಸೇವಾ ಅಧಿಕಾರಿ ಸಹಾಯ ಮಾಡಲು AnyDesk ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ ಕೋಡ್ ನೀಡಿ',
        labelHindi: 'कस्टमर केयर की मदद लेने के लिए AnyDesk इंस्टॉल करके 9 अंकों का कोड साझा करें',
        isSafe: false,
        explanation: 'The scammer will see your screen in real time and steal your passwords as you type them.',
        explanationKannada: 'ವಂಚಕರು ನಿಮ್ಮ ಸ್ಕ್ರೀನ್ ನೋಡಿ ನೀವು ಟೈಪ್ ಮಾಡುವ ಪಾಸ್‌ವರ್ಡ್‌ಗಳನ್ನು ಕದಿಯುತ್ತಾರೆ.',
        explanationHindi: 'धोखेबाज आपकी स्क्रीन देखकर आपका पासवर्ड और बैंकिंग डाटा सीधे देख सकेंगे।'
      }
    ],
    correctAnswerId: 'opt-safe',
    generalExplanation: 'Customer support teams NEVER ask users to download AnyDesk, TeamViewer, or screen-sharing tools to process refunds.',
    generalExplanationKannada: 'ಯಾವುದೇ ನೈಜ ಗ್ರಾಹಕ ಸೇವಾ ವಿಭಾಗವು ರಿಫಂಡ್‌ಗಾಗಿ ಸ್ಕ್ರೀನ್ ಶೇರಿಂಗ್ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಕೇಳುವುದಿಲ್ಲ.',
    generalExplanationHindi: 'कोई भी वास्तविक बैंक या कंपनी रिफंड के लिए स्क्रीन शेयरिंग ऐप डाउनलोड करने को नहीं कहती।',
    redFlags: [
      'Customer care demanding remote screen sharing app installation',
      'Helpline numbers copied from random web search results',
      'Asking to share sensitive 9-digit remote control code'
    ],
    safetyTip: 'Safety Rule: Never install AnyDesk or TeamViewer for customer support.'
  },

  // 8. Friend / Relative in Distress Impersonation
  {
    id: 'scam-friend-distress-08',
    category: 'friend_in_distress',
    categoryLabel: 'Relative / Friend in Distress',
    difficulty: 'intermediate',
    title: 'Nephew / Friend Urgent Hospital Emergency WhatsApp',
    titleKannada: 'ಸ್ನೇಹಿತ ಅಥವಾ ಸಂಬಂಧಿಯ ಹೆಸರಿನಲ್ಲಿ ತುರ್ತು ಹಣದ ಮೆಸೇಜ್',
    titleHindi: 'रिश्तेदार बनकर अस्पताल के नाम पर आपातकालीन पैसे मांगना',
    sender: 'WhatsApp from Unknown Number (+91 99012 33441) with Friend\'s Photo',
    senderBadge: 'New Number with Cloned Profile Picture',
    visualType: 'whatsapp',
    message: '"Uncle, this is Rohan. My main phone broke and I am stuck in an emergency hospital situation with a friend. I urgently need ₹12,000 to pay medical bills immediately. Please GPay/PhonePe to this hospital QR right now. I will return your money tomorrow evening when I get home."',
    messageKannada: '"ಅಂಕಲ್, ನಾನು ರೋಹನ್. ನನ್ನ ಮೊಬೈಲ್ ಹಾಳಾಗಿದೆ, ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ತುರ್ತು ಹಣದ ಅಗತ್ಯವಿದೆ. ದಯವಿಟ್ಟು ಈ QR ಗೆ ₹12,000 ಕಳುಹಿಸಿ, ನಾಳೆ ಸಂಜೆ ಹಿಂದಿರುಗಿಸುತ್ತೇನೆ."',
    messageHindi: '"अंकल, मैं रोहन बोल रहा हूँ। मेरा फोन खराब हो गया है और मैं दोस्त के साथ अस्पताल में फंसा हूँ। कृपया तुरंत इस QR पर ₹12,000 भेजें, मैं कल शाम लौटा दूंगा।"',
    options: [
      {
        id: 'opt-safe',
        label: 'Call Rohan on his known original phone number or call family members directly to verify before sending any money.',
        labelKannada: 'ಹಣ ಕಳುಹಿಸುವ ಮುನ್ನ ರೋಹನ್‌ನ ಮೂಲ ನಂಬರ್‌ಗೆ ಅಥವಾ ಅವರ ಕುಟುಂಬಕ್ಕೆ ಕರೆ ಮಾಡಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
        labelHindi: 'पैसे भेजने से पहले रोहन के पुराने असली नंबर पर या उसके परिवार को सीधे कॉल करके पुष्टि करें।',
        isSafe: true,
        explanation: 'Scammers frequently download WhatsApp profile pictures and impersonate relatives in fake emergencies.',
        explanationKannada: 'ಫೋಟೋ ಬಳಸಿ ಸಂಬಂಧಿಕರಂತೆ ನಟಿಸಿ ತುರ್ತು ಪರಿಸ್ಥಿತಿಯ ಸುಳ್ಳು ಹೇಳುವ ವಂಚನೆ ಇದಾಗಿದೆ.',
        explanationHindi: 'जालसाज सोशल मीडिया से फोटो चुराकर फर्जी आपातकाल का नाटक करके पैसे मांगते हैं।'
      },
      {
        id: 'opt-risky',
        label: 'Quickly transfer ₹12,000 to the QR code because it is a medical emergency',
        labelKannada: 'ವೈದ್ಯಕೀಯ ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಇರುವುದರಿಂದ ತಕ್ಷಣ ₹12,000 ಕಳುಹಿಸಿ',
        labelHindi: 'मेडिकल इमरजेंसी समझकर बिना पुष्टि किए तुरंत ₹12,000 भेज दें',
        isSafe: false,
        explanation: 'You are transferring money directly to a scammer using a cloned profile picture.',
        explanationKannada: 'ನೀವು ನೇರವಾಗಿ ನಕಲಿ ಪ್ರೊಫೈಲ್ ಬಳಸಿದ ವಂಚಕರಿಗೆ ಹಣ ಕಳುಹಿಸುತ್ತಿದ್ದೀರಿ.',
        explanationHindi: 'आप सीधे तौर पर एक अज्ञात धोखेबाज को पैसे भेज रहे होंगे।'
      }
    ],
    correctAnswerId: 'opt-safe',
    generalExplanation: 'Always independently verify unexpected emergency money requests from new numbers by calling the person directly on their known regular phone number.',
    generalExplanationKannada: 'ಹೊಸ ನಂಬರ್‌ನಿಂದ ತುರ್ತು ಹಣ ಕೇಳಿದರೆ ಯಾವಾಗಲೂ ಆ ವ್ಯಕ್ತಿಯ ಮೂಲ ನಂಬರ್‌ಗೆ ಕರೆ ಮಾಡಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
    generalExplanationHindi: 'नए नंबर से आपातकालीन पैसों की मांग आने पर हमेशा उस व्यक्ति के पुराने नंबर पर कॉल करके पुष्टि करें।',
    redFlags: [
      'Message sent from an unknown number with a cloned display photo',
      'Emotional emergency pressure (hospital bill, accident)',
      'Avoiding direct phone call verification'
    ],
    safetyTip: 'Safety Rule: Always speak on a live voice call with the known person before sending money.'
  },

  // 9. Lottery / Prize Winning Scam
  {
    id: 'scam-lottery-09',
    category: 'lottery_prize_scam',
    categoryLabel: 'Lottery / Prize Scam',
    difficulty: 'beginner',
    title: 'KBC / Shopping Lucky Draw: Won ₹25 Lakhs',
    titleKannada: 'KBC ಲಕ್ಕಿ ಡ್ರಾದಲ್ಲಿ ₹25 ಲಕ್ಷ ಗೆದ್ದಿದ್ದೀರಿ ಎನ್ನುವ ವಂಚನೆ',
    titleHindi: 'लकी ड्रॉ में ₹25 लाख जीतने का फर्जी दावा',
    sender: 'WhatsApp Message from "KBC Head Office"',
    senderBadge: 'Fake Emblem & Letterhead',
    visualType: 'whatsapp',
    message: '🎉 CONGRATULATIONS! Your mobile number has won 1st Prize in KBC All-India Lucky Draw for ₹25,00,000 (Twenty Five Lakhs). To process cheque dispatch to your address, pay government GST & processing clearance fee of ₹4,500 to Manager Vikram Singh via UPI.',
    messageKannada: '🎉 ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ KBC ಲಕ್ಕಿ ಡ್ರಾದಲ್ಲಿ ₹25,00,000 ಬಹುಮಾನ ಬಂದಿದೆ. ಚೆಕ್ ಪಡೆಯಲು ₹4,500 GST ಶುಲ್ಕ ಪಾವತಿಸಿ.',
    messageHindi: '🎉 बधाई हो! आपके मोबाइल नंबर ने केबीसी लकी ड्रॉ में ₹25,00,000 का पहला इनाम जीता है। चेक प्राप्त करने के लिए ₹4,500 का सरकारी जीएसटी शुल्क जमा करें।',
    options: [
      {
        id: 'opt-safe',
        label: 'Ignore and delete. Legitimate lotteries never require paying an "advance fee" to claim winnings.',
        labelKannada: 'ನಿರ್ಲಕ್ಷಿಸಿ ಡಿಲೀಟ್ ಮಾಡಿ. ನೈಜ ಬಹುಮಾನ ಪಡೆಯಲು ಎಂದಿಗೂ ಮುಂಗಡ ಹಣ ಪಾವತಿಸಬೇಕಾಗಿಲ್ಲ.',
        labelHindi: 'संदेश को अनदेखा करें। असली लॉटरी या इनाम पाने के लिए कभी कोई "एडवांस फीस" नहीं देनी होती।',
        isSafe: true,
        explanation: 'You cannot win a lottery you never entered. Demanding advance fee is an advance-fee fraud.',
        explanationKannada: 'ನೀವು ಭಾಗವಹಿಸದ ಲಾಟರಿ ಗೆಲ್ಲಲು ಸಾಧ್ಯವಿಲ್ಲ. ಮುಂಗಡ ಹಣ ಕೇಳುವುದು ವಂಚನೆ.',
        explanationHindi: 'जिस लॉटरी में आपने कभी भाग नहीं लिया, उसे आप जीत नहीं सकते। यह सीधा फ्रॉड है।'
      },
      {
        id: 'opt-risky',
        label: 'Pay ₹4,500 processing fee to receive the ₹25,00,000 cheque',
        labelKannada: '₹25 ಲಕ್ಷ ಪಡೆಯಲು ₹4,500 ಪ್ರೊಸೆಸಿಂಗ್ ಶುಲ್ಕ ಪಾವತಿಸಿ',
        labelHindi: '₹25 लाख का चेक पाने के लिए ₹4,500 की प्रोसेसिंग फीस भरें',
        isSafe: false,
        explanation: 'There is no prize. Once you pay ₹4,500, the scammer will vanish or demand more fees.',
        explanationKannada: 'ಯಾವುದೇ ಬಹುಮಾನವಿರುವುದಿಲ್ಲ. ₹4,500 ಪಾವತಿಸಿದರೆ ಆ ಹಣ ನಷ್ಟವಾಗುತ್ತದೆ.',
        explanationHindi: 'कोई पुरस्कार नहीं है। पैसे देते ही धोखेबाज संपर्क तोड़ देगा या और पैसे मांगेगा।'
      }
    ],
    correctAnswerId: 'opt-safe',
    generalExplanation: 'This is the classic advance-fee prize scam. If you did not buy a ticket or enter an official contest, any winning notification is fake.',
    generalExplanationKannada: 'ಭಾಗವಹಿಸದ ಲಾಟರಿಯಲ್ಲಿ ಬಹುಮಾನ ಬಂದಿದೆ ಎಂದು ಹೇಳಿ ಮುಂಗಡ ಶುಲ್ಕ ವಸೂಲಿ ಮಾಡುವ ಮೋಸವಿದು.',
    generalExplanationHindi: 'यह एक पुराना फर्जी लॉटरी स्कैम है जहाँ इनाम देने के नाम पर एडवांस प्रोसेसिंग फीस ऐंठी जाती है।',
    redFlags: [
      'Prize for a lottery/contest you never entered',
      'Demand for advance fee or tax clearance',
      'Fake government symbols and letterheads on WhatsApp'
    ],
    safetyTip: 'Safety Rule: Legitimate prize giveaways deduct tax at source and never ask for advance payments.'
  },

  // 10. High-Return Investment Scheme
  {
    id: 'scam-investment-10',
    category: 'investment_scam',
    categoryLabel: 'High-Return Investment Scam',
    difficulty: 'advanced',
    title: 'Guaranteed 40% Monthly Profit in AI Stock Pool',
    titleKannada: 'ದಿನಕ್ಕೆ 40% ಗ್ಯಾರಂಟಿ ಲಾಭ ನೀಡುವ ನಕಲಿ ಹೂಡಿಕೆ ಯೋಜನೆ',
    titleHindi: 'प्रति माह 40% पक्के मुनाफे का फर्जी निवेश दावा',
    sender: 'WhatsApp Group Invitation: "VIP Wealth Creators Club"',
    senderBadge: 'Unregulated Investment Group',
    visualType: 'whatsapp',
    message: '"Invest ₹10,000 today and get guaranteed ₹14,000 return every month using our proprietary institutional AI algorithmic trading bot. 100% risk-free, SEBI registered, withdraw profits anytime. Join our private trading app now: http://ai-wealth-guaranteed.org/join"',
    messageKannada: '"ಇಂದೇ ₹10,000 ಹೂಡಿಕೆ ಮಾಡಿ ಮತ್ತು ಪ್ರತಿ ತಿಂಗಳು ಗ್ಯಾರಂಟಿ ₹14,000 ಲಾಭ ಪಡೆಯಿರಿ. 100% ಅಪಾಯವಿಲ್ಲದ ಯೋಜನೆ: http://ai-wealth-guaranteed.org/join"',
    messageHindi: '"आज ही ₹10,000 का निवेश करें और हर महीने ₹14,000 का पक्का मुनाफा पाएं। 100% सुरक्षित और जोखिम मुक्त: http://ai-wealth-guaranteed.org/join"',
    options: [
      {
        id: 'opt-safe',
        label: 'Do not invest or click. In the financial world, no legitimate investment offers "guaranteed high returns with zero risk".',
        labelKannada: 'ಹೂಡಿಕೆ ಮಾಡಬೇಡಿ. ಶೂನ್ಯ ಅಪಾಯದಲ್ಲಿ ಗ್ಯಾರಂಟಿ ಅಧಿಕ ಲಾಭ ನೀಡುವ ಯಾವುದೇ ನೈಜ ಹೂಡಿಕೆ ಇರುವುದಿಲ್ಲ.',
        labelHindi: 'निवेश न करें। वित्तीय दुनिया में "शून्य जोखिम पर भारी मुनाफे" का कोई भी वास्तविक विकल्प नहीं होता।',
        isSafe: true,
        explanation: 'Guaranteed high returns with zero risk is the universal red flag of illegal Ponzi schemes.',
        explanationKannada: 'ಶೂನ್ಯ ಅಪಾಯದಲ್ಲಿ ಹೆಚ್ಚಿನ ಲಾಭದ ಭರವಸೆ ನೀಡುವುದು ಕಾನೂನುಬಾಹಿರ ಪೊಂಜಿ ಸ್ಕೀಮ್‌ನ ಸಂಕೇತ.',
        explanationHindi: 'बिना किसी जोखिम के गारंटीड बड़े मुनाफे का दावा अवैध पोंजी स्कीम की पहचान है।'
      },
      {
        id: 'opt-risky',
        label: 'Deposit ₹10,000 to earn ₹14,000 monthly income',
        labelKannada: 'ತಿಂಗಳಿಗೆ ₹14,000 ಗಳಿಸಲು ₹10,000 ಠೇವಣಿ ಇರಿಸಿ',
        labelHindi: 'मासिक ₹14,000 कमाने के लिए तुरंत ₹10,000 जमा करें',
        isSafe: false,
        explanation: 'The fake website will show fake profits on screen but will lock all your capital permanently.',
        explanationKannada: 'ನಕಲಿ ವೆಬ್‌ಸೈಟ್ ಕೇವಲ ಸ್ಕ್ರೀನ್ ಮೇಲೆ ಸುಳ್ಳು ಲಾಭ ತೋರಿಸುತ್ತದೆ, ಹಣ ಹಿಂಪಡೆಯಲು ಬಿಡುವುದಿಲ್ಲ.',
        explanationHindi: 'फर्जी ऐप स्क्रीन पर नकली मुनाफा दिखाएगा लेकिन आपके पैसे हमेशा के लिए डूब जाएंगे।'
      }
    ],
    correctAnswerId: 'opt-safe',
    generalExplanation: 'Regulated financial investments always carry market risk. Anyone promising guaranteed 40%+ monthly returns is running an unregulated fraud operation.',
    generalExplanationKannada: 'ಯಾವುದೇ ಅಧಿಕೃತ ಹೂಡಿಕೆಯು ಮಾರುಕಟ್ಟೆ ಅಪಾಯವನ್ನು ಹೊಂದಿರುತ್ತದೆ. ಗ್ಯಾರಂಟಿ ದೊಡ್ಡ ಲಾಭದ ಭರವಸೆ ನೀಡುವವರು ವಂಚಕರು.',
    generalExplanationHindi: 'वास्तविक निवेश में हमेशा बाजार का जोखिम होता है। पक्के भारी मुनाफे का दावा करने वाले केवल धोखेबाज होते हैं।',
    redFlags: [
      'Promises of guaranteed 40%+ monthly return with zero risk',
      'Unregulated trading bot on third-party unofficial APK/link',
      'Operating exclusively inside private WhatsApp/Telegram groups'
    ],
    safetyTip: 'Safety Rule: Verify all investment brokers directly on the official SEBI directory (sebi.gov.in).'
  }
];

// Initial mock trusted contacts for instant demo / fallback
export const DEFAULT_TRUSTED_CONTACTS: TrustedContact[] = [
  {
    id: 'tc-01',
    userId: 'guest-citizen',
    name: 'Ananya Sharma',
    relationship: 'Sister',
    contactMethod: 'WhatsApp',
    contactValue: '+91 98450 12345',
    avatarColor: '#1E3A2F',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tc-02',
    userId: 'guest-citizen',
    name: 'Ravi Kumar',
    relationship: 'Father',
    contactMethod: 'Phone Call',
    contactValue: '+91 98210 98765',
    avatarColor: '#1D4ED8',
    createdAt: new Date().toISOString()
  }
];

// Default Safety Progress for demo
export const DEFAULT_SAFETY_PROGRESS: SafetyProgress = {
  userId: 'guest-citizen',
  score: 84,
  totalAttempts: 6,
  correctAttempts: 5,
  streakDays: 3,
  monthlyImprovementPercentage: 14,
  weakCategories: ['upi_payment_trap'],
  completedScenarioIds: ['scam-kyc-01', 'scam-bank-otp-02', 'scam-govt-scheme-04']
};

// Global in-memory cache for ephemeral requests
export const ephemeralRequestsStore: Map<string, TrustedRequest> = new Map();

