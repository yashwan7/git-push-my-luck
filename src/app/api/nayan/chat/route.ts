import { NextRequest, NextResponse } from 'next/server';

interface ChatAction {
  type: 'navigate' | 'profile' | 'emergency' | 'none';
  target?: string;
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

    // 1. Emergency intent
    if (
      lower.includes('help') ||
      lower.includes('emergency') ||
      lower.includes('ambulance') ||
      lower.includes('police') ||
      lower.includes('112') ||
      lower.includes('मदद') ||
      lower.includes('सहायता') ||
      lower.includes('ತುರ್ತು') ||
      lower.includes('ಸಹಾಯ')
    ) {
      if (language === 'hi') {
        replyText = 'मैंने तुरंत आपातकालीन सहायता स्क्रीन खोल दी है। आप 112 पर कॉल कर सकते हैं या अपनी लोकेशन साझा कर सकते हैं।';
      } else if (language === 'kn') {
        replyText = 'ನಾನು ತಕ್ಷಣ ತುರ್ತು ಸಹಾಯ ಪರದೆಯನ್ನು ತೆರೆದಿದ್ದೇನೆ. ನೀವು 112 ಗೆ ಕರೆ ಮಾಡಬಹುದು ಅಥವಾ ಸ್ಥಳವನ್ನು ಹಂಚಿಕೊಳ್ಳಬಹುದು.';
      } else {
        replyText = 'I have opened the Emergency Assistance screen. You can call 112 or broadcast your real-time location with one tap.';
      }
      action = { type: 'navigate', target: '/emergency' };
    }

    // 2. Scholarship / Education intent
    else if (
      lower.includes('scholarship') ||
      lower.includes('student') ||
      lower.includes('education') ||
      lower.includes('छात्रवृत्ति') ||
      lower.includes('स्कॉलरशिप') ||
      lower.includes('ವಿದ್ಯಾರ್ಥಿವೇತನ') ||
      lower.includes('ಓದು')
    ) {
      if (language === 'hi') {
        replyText = 'ज़रूर! मैं आपको राष्ट्रीय योग्यता छात्रवृत्ति आवेदन पर ले जा रही हूँ। NAYAN आपको हर चरण में सहायता करेगा।';
      } else if (language === 'kn') {
        replyText = 'ಖಂಡಿತ! ನಾನು ನಿಮ್ಮನ್ನು ರಾಷ್ಟ್ರೀಯ ಮೆರಿಟ್ ವಿದ್ಯಾರ್ಥಿವೇತನ ಅರ್ಜಿ ಪುಟಕ್ಕೆ ಕರೆದೊಯ್ಯುತ್ತಿದ್ದೇನೆ. NAYAN ನಿಮಗೆ ಹಂತ-ಹಂತವಾಗಿ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ.';
      } else {
        replyText = 'Sure! Navigating you to the National Merit Scholarship application. NAYAN will guide you through each simple step.';
      }
      action = { type: 'navigate', target: '/services/government-scholarship' };
    }

    // 3. Hospital / OPD / Health intent
    else if (
      lower.includes('hospital') ||
      lower.includes('doctor') ||
      lower.includes('appointment') ||
      lower.includes('opd') ||
      lower.includes('clinic') ||
      lower.includes('अस्पताल') ||
      lower.includes('डॉक्टर') ||
      lower.includes('ಆಸ್ಪತ್ರೆ') ||
      lower.includes('ವೈದ್ಯರು')
    ) {
      if (language === 'hi') {
        replyText = 'मैं आपको अस्पताल ओपीडी स्लॉट बुकिंग पर ले जा रही हूँ। आपको किस विभाग में डॉक्टर से मिलना है?';
      } else if (language === 'kn') {
        replyText = 'ನಾನು ನಿಮ್ಮನ್ನು ಆಸ್ಪತ್ರೆ ಒಪಿಡಿ ಸ್ಲಾಟ್ ಬುಕಿಂಗ್ ಪುಟಕ್ಕೆ ಕರೆದೊಯ್ಯುತ್ತಿದ್ದೇನೆ. ಯಾವ ವಿಭಾಗದಲ್ಲಿ ವೈದ್ಯರನ್ನು ಭೇಟಿಯಾಗಬೇಕು?';
      } else {
        replyText = 'Navigating to the Hospital OPD appointment booking. Which department would you like to book for?';
      }
      action = { type: 'navigate', target: '/services/hospital-appointment' };
    }

    // 4. Electricity / Bill payment intent
    else if (
      lower.includes('bill') ||
      lower.includes('electricity') ||
      lower.includes('power') ||
      lower.includes('utility') ||
      lower.includes('बिजली') ||
      lower.includes('बिल') ||
      lower.includes('ವಿದ್ಯುತ್') ||
      lower.includes('ಬಿಲ್')
    ) {
      if (language === 'hi') {
        replyText = 'बिजली बिल भुगतान पृष्ठ खुल रहा है। अपना उपभोक्ता नंबर तैयार रखें।';
      } else if (language === 'kn') {
        replyText = 'ವಿದ್ಯುತ್ ಬಿಲ್ ಪಾವತಿ ಪುಟ ತೆರೆಯುತ್ತಿದೆ. ನಿಮ್ಮ ಗ್ರಾಹಕ ಖಾತೆ ಸಂಖ್ಯೆಯನ್ನು ಸಿದ್ಧವಾಗಿಡಿ.';
      } else {
        replyText = 'Opening Electricity & Utility Bill Payment. Keep your consumer account number ready.';
      }
      action = { type: 'navigate', target: '/services/electricity-bill' };
    }

    // 5. Ration card / Pension intent
    else if (
      lower.includes('ration') ||
      lower.includes('pension') ||
      lower.includes('food') ||
      lower.includes('राशन') ||
      lower.includes('पेंशन') ||
      lower.includes('ರೇಷನ್') ||
      lower.includes('ಪೆನ್ಷನ್')
    ) {
      if (language === 'hi') {
        replyText = 'राशन और पेंशन सहायता सेवा पर नेविगेट किया जा रहा है।';
      } else if (language === 'kn') {
        replyText = 'ರೇಷನ್ ಕಾರ್ಡ್ ಮತ್ತು ಪಿಂಚಣಿ ಸೇವೆಗೆ ಕರೆದೊಯ್ಯಲಾಗುತ್ತಿದೆ.';
      } else {
        replyText = 'Navigating to Ration Card & Monthly Pension Service.';
      }
      action = { type: 'navigate', target: '/services/ration-card' };
    }

    // 6. Audit a service intent
    else if (
      lower.includes('audit') ||
      lower.includes('check website') ||
      lower.includes('wcag') ||
      lower.includes('जांच') ||
      lower.includes('ಆಡಿಟ್')
    ) {
      if (language === 'hi') {
        replyText = 'मैं NAYAN एक्सेसिबिलिटी ऑडिट टूल खोल रही हूँ। आप किसी भी सरकारी या अस्पताल वेबसाइट की पहुंच जांच सकते हैं।';
      } else if (language === 'kn') {
        replyText = 'ನಾನು NAYAN ಆಕ್ಸೆಸಿಬಿಲಿಟಿ ಆಡಿಟ್ ಟೂಲ್ ತೆರೆಯುತ್ತಿದ್ದೇನೆ. ನೀವು ಯಾವುದೇ ಡಿಜಿಟಲ್ ಪೋರ್ಟಲ್ ಅನ್ನು ಪರಿಶೀಲಿಸಬಹುದು.';
      } else {
        replyText = 'Opening the NAYAN Accessibility Audit Tool. You can check the accessibility index of any public digital service.';
      }
      action = { type: 'navigate', target: '/audit' };
    }

    // 7. Profile / Onboarding intent
    else if (
      lower.includes('profile') ||
      lower.includes('setup') ||
      lower.includes('onboarding') ||
      lower.includes('settings') ||
      lower.includes('सेटिंग')
    ) {
      if (language === 'hi') {
        replyText = 'आइए आपकी व्यक्तिगत पहुंच प्रोफ़ाइल सेट करते हैं ताकि पूरा पोर्टल आपकी ज़रूरतों के अनुसार काम करे।';
      } else if (language === 'kn') {
        replyText = 'ಬನ್ನಿ ನಿಮ್ಮ ಪ್ರವೇಶಿಸುವಿಕೆ ಪ್ರೊಫೈಲ್ ಅನ್ನು ಹೊಂದಿಸೋಣ.';
      } else {
        replyText = "Let's configure your personalized accessibility profile so every public portal adapts to your exact needs.";
      }
      action = { type: 'navigate', target: '/onboarding' };
    }

    // 8. Language switch intents
    else if (lower.includes('kannada') || lower.includes('ಕನ್ನಡ')) {
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

    // 9. Accessibility adjustments (Contrast, Text Size, Focus Mode)
    else if (lower.includes('contrast') || lower.includes('dark mode') || lower.includes('हाई कंट्रास्ट') || lower.includes('ಕಾಂಟ್ರಾಸ್ಟ್')) {
      if (language === 'hi') {
        replyText = 'हाई कंट्रास्ट मोड सक्रिय कर दिया गया है।';
      } else if (language === 'kn') {
        replyText = 'ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್ ಮೋಡ್ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ.';
      } else {
        replyText = 'High Contrast visibility theme is now activated.';
      }
      action = { type: 'profile', key: 'contrastTheme', value: 'high-contrast-dark' };
    } else if (lower.includes('bigger text') || lower.includes('large text') || lower.includes('font size') || lower.includes('बड़ा टेक्स्ट') || lower.includes('ದೊಡ್ಡ ಅಕ್ಷರ')) {
      if (language === 'hi') {
        replyText = 'टेक्स्ट का आकार बड़ा कर दिया गया है।';
      } else if (language === 'kn') {
        replyText = 'ಅಕ್ಷರಗಳ ಗಾತ್ರವನ್ನು ದೊಡ್ಡದಾಗಿಸಲಾಗಿದೆ.';
      } else {
        replyText = 'Enlarged text size mode is now active.';
      }
      action = { type: 'profile', key: 'textSize', value: 'xxlarge' };
    }

    // 10. Default General Conversational Guidance
    else {
      if (language === 'hi') {
        replyText = `मैंने सुना: "${message}"। मैं NAYAN हूँ। आप मुझसे छात्रवृत्ति आवेदन, अस्पताल की अपॉइंटमेंट, बिजली बिल भुगतान, या आपातकालीन सहायता के लिए बोल सकते हैं।`;
      } else if (language === 'kn') {
        replyText = `ನಾನು ಕೇಳಿದೆ: "${message}". ನಾನು NAYAN. ವಿದ್ಯಾರ್ಥಿವೇತನ, ಆಸ್ಪತ್ರೆ ಬುಕಿಂಗ್, ಬಿಲ್ ಪಾವತಿ ಅಥವಾ ತುರ್ತು ಸಹಾಯಕ್ಕಾಗಿ ನೀವು ನನಗೆ ತಿಳಿಸಬಹುದು.`;
      } else {
        replyText = `I understood: "${message}". I can help you apply for scholarships, book hospital OPD slots, pay electricity bills, or adjust visual and motor accessibility. What would you like to do?`;
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
