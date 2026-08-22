import { NextRequest, NextResponse } from 'next/server';

interface ChatAction {
  type: 'navigate' | 'profile' | 'emergency' | 'none';
  target?: string;
  label?: string;
  key?: string;
  value?: any;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message = '', language = 'en', currentPath = '/' } = body;

    const lower = message.toLowerCase().trim();

    let replyText = '';
    let action: ChatAction = { type: 'none' };

    // 0. Document Snap-to-Form / OCR intent
    if (
      lower.includes('snap') ||
      lower.includes('scan') ||
      lower.includes('document') ||
      lower.includes('ocr') ||
      lower.includes('auto fill') ||
      lower.includes('autofill') ||
      lower.includes('read my details') ||
      lower.includes('fill form') ||
      lower.includes('दस्तावेज़') ||
      lower.includes('ದಾಖಲೆ')
    ) {
      if (language === 'hi') {
        replyText = 'मैंने ANUKOOL दस्तावेज़ सहायक खोल दिया है। आप अपने आधार, राशन कार्ड या अंकतालिका की तस्वीर ले सकते हैं — फॉर्म अपने आप भर जाएगा।';
      } else if (language === 'kn') {
        replyText = 'ನಾನು ANUKOOL ದಾಖಲೆ ಸಹಾಯವನ್ನು ತೆರೆದಿದ್ದೇನೆ. ನಿಮ್ಮ ಆಧಾರ್ ಅಥವಾ ಅಂಕಪಟ್ಟಿಯ ಫೋಟೋ ತೆಗೆಯಿರಿ — ಅರ್ಜಿ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಭರ್ತಿಯಾಗುತ್ತದೆ.';
      } else {
        replyText = 'Opened ANUKOOL Document Assist. Snap or upload your ID, Marksheet, or Ration Card, and your form will be auto-filled intelligently.';
      }
      action = { type: 'navigate', target: '/services/government-scholarship', label: 'Open Document Assist' };
    }

    // 1. Emergency intent
    else if (
      lower.includes('help') ||
      lower.includes('emergency') ||
      lower.includes('ambulance') ||
      lower.includes('police') ||
      lower.includes('112') ||
      lower.includes('chest pain') ||
      lower.includes('accident') ||
      lower.includes('मदद') ||
      lower.includes('सहायता') ||
      lower.includes('ತುರ್ತು') ||
      lower.includes('ಸಹಾಯ') ||
      lower.includes('sahaya') ||
      lower.includes('aapatkal')
    ) {
      if (language === 'hi') {
        replyText = 'मैंने तुरंत आपातकालीन सहायता स्क्रीन खोल दी है। आप 112 पर कॉल कर सकते हैं या निकटतम अपोलो अस्पताल के लिए लाइव रूट देख सकते हैं।';
      } else if (language === 'kn') {
        replyText = 'ನಾನು ತಕ್ಷಣ ತುರ್ತು ಸಹಾಯ ಪರದೆಯನ್ನು ತೆರೆದಿದ್ದೇನೆ. ನೀವು 112 ಗೆ ಕರೆ ಮಾಡಬಹುದು ಅಥವಾ ಅಪೋಲೋ ಆಸ್ಪತ್ರೆಗೆ ಲೈವ್ ರೂಟ್ ನೋಡಬಹುದು.';
      } else {
        replyText = 'Opened the Emergency Assistance screen. You can call 112 or follow the live fastest route to Apollo Hospital.';
      }
      action = { type: 'navigate', target: '/emergency', label: 'Open Emergency Assist' };
    }

    // 2. Pension / Ration Card / Monthly Dudu intent (e.g. "Nage pension Dudu Baku", "pension apply", "duddu beku")
    else if (
      lower.includes('pension') ||
      lower.includes('dudu') ||
      lower.includes('duddu') ||
      lower.includes('baku') ||
      lower.includes('beku') ||
      lower.includes('ration') ||
      lower.includes('food security') ||
      lower.includes('राशन') ||
      lower.includes('पेंशन') ||
      lower.includes('रೇಷನ್') ||
      lower.includes('ಪೆನ್ಷನ್') ||
      lower.includes('ದುಡ್ಡು')
    ) {
      if (language === 'hi' || lower.includes('pension nikalna')) {
        replyText = 'ज़रूर! राशन कार्ड और वरिष्ठ नागरिक मासिक पेंशन सेवा खोल दी गई है। चरण 1: अपना आधार नंबर दर्ज करें या "Snap ID to Auto-Fill" पर क्लिक करें। चरण 2: अपना बैंक खाता सत्यापित करें।';
      } else if (language === 'kn' || lower.includes('baku') || lower.includes('beku') || lower.includes('dudu') || lower.includes('duddu') || lower.includes('nage')) {
        replyText = 'ಖಂಡಿತ! ರೇಷನ್ ಕಾರ್ಡ್ ಮತ್ತು ಮಾಸಿಕ ಪಿಂಚಣಿ ಸೇವೆ ತೆರೆಯಲಾಗಿದೆ. ಹಂತ 1: ನಿಮ್ಮ ಆಧಾರ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ ಅಥವಾ "Snap ID to Auto-Fill" ಕ್ಲಿಕ್ ಮಾಡಿ. ಹಂತ 2: ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಯನ್ನು ದೃಢೀಕರಿಸಿ.';
      } else {
        replyText = 'Opened Monthly Pension & Ration Card Service. Step 1: Provide your Aadhaar ID or click "Snap ID to Auto-Fill". Step 2: Confirm your direct benefit bank account.';
      }
      action = { type: 'navigate', target: '/services/ration-card', label: 'Open Pension Service' };
    }

    // 3. Scholarship / Student / Education intent
    else if (
      lower.includes('scholarship') ||
      lower.includes('student') ||
      lower.includes('education') ||
      lower.includes('marksheet') ||
      lower.includes('college') ||
      lower.includes('छात्रवृत्ति') ||
      lower.includes('स्कॉलरशिप') ||
      lower.includes('ವಿದ್ಯಾರ್ಥಿವೇತನ') ||
      lower.includes('ಓದು') ||
      lower.includes('vidyarthi')
    ) {
      if (language === 'hi') {
        replyText = 'ज़रूर! राष्ट्रीय मेरिट छात्रवृत्ति आवेदन पृष्ठ खोल दिया गया है। ANUKOOL आपको हर चरण में सहायता करेगा।';
      } else if (language === 'kn') {
        replyText = 'ಖಂಡಿತ! ರಾಷ್ಟ್ರೀಯ ಮೆರಿಟ್ ವಿದ್ಯಾರ್ಥಿವೇತನ ಅರ್ಜಿ ಪುಟ ತೆರೆಯಲಾಗಿದೆ. ANUKOOL ನಿಮಗೆ ಹಂತ-ಹಂತವಾಗಿ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ.';
      } else {
        replyText = 'Opened National Merit Scholarship application. ANUKOOL will guide you through each simple step.';
      }
      action = { type: 'navigate', target: '/services/government-scholarship', label: 'Open Scholarship' };
    }

    // 4. Hospital / OPD / Doctor appointment intent
    else if (
      lower.includes('hospital') ||
      lower.includes('doctor') ||
      lower.includes('appointment') ||
      lower.includes('opd') ||
      lower.includes('clinic') ||
      lower.includes('checkup') ||
      lower.includes('fever') ||
      lower.includes('अस्पताल') ||
      lower.includes('डॉक्टर') ||
      lower.includes('ಆಸ್ಪತ್ರೆ') ||
      lower.includes('ವೈದ್ಯರು') ||
      lower.includes('aspathre')
    ) {
      if (language === 'hi') {
        replyText = 'अस्पताल ओपीडी स्लॉट बुकिंग खोल दी गई है। अपनी पसंदीदा तारीख और विभाग चुनें।';
      } else if (language === 'kn') {
        replyText = 'ಆಸ್ಪತ್ರೆ ಒಪಿಡಿ ಸ್ಲಾಟ್ ಬುಕಿಂಗ್ ಪುಟ ತೆರೆಯಲಾಗಿದೆ. ನಿಮ್ಮ ದಿನಾಂಕ ಮತ್ತು ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ.';
      } else {
        replyText = 'Opened Hospital OPD appointment booking. Select your preferred department and doctor.';
      }
      action = { type: 'navigate', target: '/services/healthcare-appointment', label: 'Open Hospital OPD' };
    }

    // 5. Banking / Money transfer / UPI / Limit intent
    else if (
      lower.includes('bank') ||
      lower.includes('transfer') ||
      lower.includes('send money') ||
      lower.includes('balance') ||
      lower.includes('account') ||
      lower.includes('upi') ||
      lower.includes('paise') ||
      lower.includes('limit') ||
      lower.includes('warning') ||
      lower.includes('बैंक') ||
      lower.includes('ಬ್ಯಾಂಕ್') ||
      lower.includes('ಹಣ')
    ) {
      // Check if user specified a limit number
      const numMatch = lower.match(/\b\d+\b/);
      const limitVal = numMatch ? parseInt(numMatch[0]) : null;

      if (limitVal && (lower.includes('limit') || lower.includes('warning') || lower.includes('submit'))) {
        if (language === 'hi') {
          replyText = `आपकी सुरक्षित लेनदेन चेतावनी सीमा ₹${limitVal.toLocaleString('en-IN')} निर्धारित कर दी गई है और ANUKOOL बैंकिंग खोल दी गई है।`;
        } else if (language === 'kn') {
          replyText = `ನಿಮ್ಮ ಸುರಕ್ಷಿತ ವಹಿವಾಟು ಮಿತಿಯನ್ನು ₹${limitVal.toLocaleString('en-IN')} ಕ್ಕೆ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ ಮತ್ತು ANUKOOL ಬ್ಯಾಂಕಿಂಗ್ ತೆರೆಯಲಾಗಿದೆ.`;
        } else {
          replyText = `Set your safe transaction limit to ₹${limitVal.toLocaleString('en-IN')} and opened ANUKOOL Inclusive Banking.`;
        }
        action = { type: 'navigate', target: `/banking?limit=${limitVal}`, label: 'Open Banking' };
      } else {
        if (language === 'hi') {
          replyText = 'ANUKOOL समावेशी बैंकिंग खोल दी गई है। आप बैलेंस चेक कर सकते हैं या सुरक्षित आवाज से पैसे भेज सकते हैं।';
        } else if (language === 'kn') {
          replyText = 'ANUKOOL ಬ್ಯಾಂಕಿಂಗ್ ತೆರೆಯಲಾಗಿದೆ. ಬ್ಯಾಲೆನ್ಸ್ ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಧ್ವನಿ ಮೂಲಕ ಹಣ ಕಳುಹಿಸಿ.';
        } else {
          replyText = 'Opened ANUKOOL Inclusive Banking. You can check balance, send money via UPI, or manage limits.';
        }
        action = { type: 'navigate', target: '/banking', label: 'Open Banking' };
      }
    }

    // 6. Electricity / Utility bill payment intent
    else if (
      lower.includes('bill') ||
      lower.includes('electricity') ||
      lower.includes('power') ||
      lower.includes('utility') ||
      lower.includes('light bill') ||
      lower.includes('बिजली') ||
      lower.includes('बिल') ||
      lower.includes('ವಿದ್ಯುತ್') ||
      lower.includes('ಬಿಲ್') ||
      lower.includes('bijli')
    ) {
      if (language === 'hi') {
        replyText = 'बिजली बिल भुगतान पृष्ठ खोल दिया गया है। अपना उपभोक्ता नंबर तैयार रखें।';
      } else if (language === 'kn') {
        replyText = 'ವಿದ್ಯುತ್ ಬಿಲ್ ಪಾವತಿ ಪುಟ ತೆರೆಯಲಾಗಿದೆ. ನಿಮ್ಮ ಗ್ರಾಹಕ ಖಾತೆ ಸಂಖ್ಯೆಯನ್ನು ಸಿದ್ಧವಾಗಿಡಿ.';
      } else {
        replyText = 'Opened Electricity & Utility Bill Payment. Keep your consumer account number ready.';
      }
      action = { type: 'navigate', target: '/services/banking-billpay', label: 'Open Bill Pay' };
    }

    // 7. Audit a service intent
    else if (
      lower.includes('audit') ||
      lower.includes('check website') ||
      lower.includes('wcag') ||
      lower.includes('accessibility test') ||
      lower.includes('जांच') ||
      lower.includes('ಆಡಿಟ್')
    ) {
      if (language === 'hi') {
        replyText = 'मैंने ANUKOOL एक्सेसिबिलिटी ऑडिट टूल खोल दिया है। आप किसी भी डिजिटल पोर्टल की पहुंच जांच सकते हैं।';
      } else if (language === 'kn') {
        replyText = 'ನಾನು ANUKOOL ಆಕ್ಸೆಸಿಬಿಲಿಟಿ ಆಡಿಟ್ ಟೂಲ್ ತೆರೆದಿದ್ದೇನೆ. ನೀವು ಯಾವುದೇ ಡಿಜಿಟಲ್ ಪೋರ್ಟಲ್ ಅನ್ನು ಪರಿಶೀಲಿಸಬಹುದು.';
      } else {
        replyText = 'Opened the ANUKOOL Accessibility Audit Tool. You can evaluate the accessibility index of any public digital service.';
      }
      action = { type: 'navigate', target: '/audit', label: 'Open Audit Tool' };
    }

    // 8. Language switch intents
    else if (lower.includes('kannada') || lower.includes('ಕನ್ನಡ') || lower.includes('kannad')) {
      replyText = 'ಖಂಡಿತ, ನಾನು ಈಗ ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿದ್ದೇನೆ. ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?';
      action = { type: 'profile', key: 'language', value: 'kn' };
    } else if (lower.includes('hindi') || lower.includes('हिन्दी') || lower.includes('हिंदी')) {
      replyText = 'नमस्ते! मैंने पोर्टल को हिन्दी में बदल दिया है। आप क्या करना चाहते हैं?';
      action = { type: 'profile', key: 'language', value: 'hi' };
    } else if (lower.includes('tamil') || lower.includes('தமிழ்')) {
      replyText = 'வணக்கம்! நான் தமிழுக்கு மாற்றியுள்ளேன். நான் உங்களுக்கு எப்படி உதவ முடியும்?';
      action = { type: 'profile', key: 'language', value: 'ta' };
    } else if (lower.includes('english')) {
      replyText = 'Switched to English. How can I help you today?';
      action = { type: 'profile', key: 'language', value: 'en' };
    }

    // 9. Profile / Onboarding intent
    else if (
      lower.includes('profile') ||
      lower.includes('setup') ||
      lower.includes('onboarding') ||
      lower.includes('settings') ||
      lower.includes('सेटिंग')
    ) {
      if (language === 'hi') {
        replyText = 'आइए आपकी व्यक्तिगत पहुंच प्रोफ़ाइल सेट करते हैं।';
      } else if (language === 'kn') {
        replyText = 'ಬನ್ನಿ ನಿಮ್ಮ ಪ್ರವೇಶಿಸುವಿಕೆ ಪ್ರೊಫೈಲ್ ಅನ್ನು ಹೊಂದಿಸೋಣ.';
      } else {
        replyText = "Let's configure your personalized accessibility profile so every public portal adapts to your exact needs.";
      }
      action = { type: 'navigate', target: '/onboarding' };
    }

    // 10. Default Conversational Guidance
    else {
      if (language === 'hi') {
        replyText = `मैंने सुना: "${message}"। मैं ANUKOOL हूँ। आप मुझसे पेंशन सहायता, छात्रवृत्ति आवेदन, अस्पताल की अपॉइंटमेंट, बिजली बिल भुगतान, या आपातकालीन सहायता के लिए बोल सकते हैं।`;
      } else if (language === 'kn') {
        replyText = `ನಾನು ಕೇಳಿದೆ: "${message}". ನಾನು ANUKOOL. ಪಿಂಚಣಿ ಹಣ, ವಿದ್ಯಾರ್ಥಿವೇತನ, ಆಸ್ಪತ್ರೆ ಬುಕಿಂಗ್, ಬಿಲ್ ಪಾವತಿ ಅಥವಾ ತುರ್ತು ಸಹಾಯಕ್ಕಾಗಿ ನೀವು ನನಗೆ ತಿಳಿಸಬಹುದು.`;
      } else {
        replyText = `I understood: "${message}". I can guide you through Senior Citizen Pension, Scholarship applications, Hospital OPD booking, or Emergency assistance. What would you like to do?`;
      }
    }

    return NextResponse.json({
      success: true,
      replyText,
      action,
      language,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Chat error',
        replyText: "I'm listening. How can I help you navigate services?",
      },
      { status: 500 }
    );
  }
}
