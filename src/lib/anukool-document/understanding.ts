import { DocumentType, ExtractedField, ExtractionResult, ConfidenceLevel, DocumentQuality } from './types';

/**
 * Capitalizes string to Title Case ("YASHWANTH GOWDA" -> "Yashwanth Gowda")
 */
export function normalizeName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Normalizes Date strings into DD/MM/YYYY
 */
export function normalizeDate(dateStr: string): string {
  if (!dateStr) return '';
  const cleaned = dateStr.replace(/[^\d/.-]/g, '');
  const parts = cleaned.split(/[/.-]/);
  if (parts.length === 3) {
    let [d, m, y] = parts;
    if (d.length === 4) {
      // YYYY-MM-DD -> DD/MM/YYYY
      [d, y] = [y, d];
    }
    const day = d.padStart(2, '0');
    const month = m.padStart(2, '0');
    const year = y.length === 2 ? `20${y}` : y;
    return `${day}/${month}/${year}`;
  }
  return dateStr;
}

/**
 * Normalizes 6-digit Indian Pincode, correcting obvious OCR character confusions ('I' -> '1', 'O' -> '0')
 */
export function normalizePincode(pinStr: string): { normalized: string; corrected: boolean } {
  if (!pinStr) return { normalized: '', corrected: false };
  let corrected = false;
  let s = pinStr.toUpperCase().replace(/\s+/g, '');
  
  if (s.includes('I') || s.includes('O') || s.includes('S') || s.includes('B')) {
    s = s.replace(/I/g, '1').replace(/O/g, '0').replace(/S/g, '5').replace(/B/g, '8');
    corrected = true;
  }

  const match = s.match(/\d{6}/);
  if (match) {
    return { normalized: match[0], corrected };
  }
  return { normalized: pinStr, corrected: false };
}

/**
 * Masks 12-digit Aadhaar number for security (XXXX-XXXX-1234)
 */
export function maskAadhaar(aadhaar: string): string {
  const digits = aadhaar.replace(/\D/g, '');
  if (digits.length >= 12) {
    return `XXXX-XXXX-${digits.slice(-4)}`;
  }
  return aadhaar;
}

/**
 * Identifies the document type from OCR text
 */
export function identifyDocumentType(text: string): { type: DocumentType; title: string; confidence: number } {
  const lower = text.toLowerCase();

  // 1. Aadhaar Card
  if (
    lower.includes('unique identification') ||
    lower.includes('uidai') ||
    lower.includes('aadhaar') ||
    lower.includes('aadhar') ||
    lower.includes('mera aadhaar') ||
    lower.includes('भारत सरकार') ||
    lower.includes('government of india') && (lower.includes('male') || lower.includes('female') || lower.includes('dob'))
  ) {
    return { type: 'aadhaar', title: 'Aadhaar Card (UIDAI)', confidence: 96 };
  }

  // 2. Marksheet / Academic Transcript
  if (
    lower.includes('mark sheet') ||
    lower.includes('marksheet') ||
    lower.includes('secondary school examination') ||
    lower.includes('board of secondary') ||
    lower.includes('cbse') ||
    lower.includes('icse') ||
    lower.includes('sslc') ||
    lower.includes('puc') ||
    lower.includes('roll no') ||
    lower.includes('registration no') ||
    lower.includes('percentage')
  ) {
    return { type: 'marksheet', title: '10th / 12th Academic Marksheet', confidence: 94 };
  }

  // 3. Ration Card / Food Security
  if (
    lower.includes('ration card') ||
    lower.includes('food and civil supplies') ||
    lower.includes('bpl') ||
    lower.includes('apl') ||
    lower.includes('ahara') ||
    lower.includes('kutumba') ||
    lower.includes('ಗೃಹಲಕ್ಷ್ಮಿ') ||
    lower.includes('ಆಹಾರ')
  ) {
    return { type: 'ration_card', title: 'Food Security Ration Card', confidence: 92 };
  }

  // 4. Student ID / College ID
  if (
    lower.includes('student identity') ||
    lower.includes('student id') ||
    lower.includes('college') ||
    lower.includes('university') ||
    lower.includes('institute of technology')
  ) {
    return { type: 'student_id', title: 'Institution Student Identity Card', confidence: 89 };
  }

  // 5. PAN Card
  if (
    lower.includes('income tax department') ||
    lower.includes('permanent account number') ||
    lower.includes('pan card') ||
    /[a-z]{5}\d{4}[a-z]/i.test(text)
  ) {
    return { type: 'pan_card', title: 'Permanent Account Number (PAN)', confidence: 95 };
  }

  return { type: 'unknown', title: 'Structured Document', confidence: 60 };
}

/**
 * Extracts and normalizes structured fields with confidence scoring from OCR text
 */
export function extractDocumentFields(
  rawText: string,
  docType: DocumentType,
  quality: DocumentQuality
): Record<string, ExtractedField> {
  const fields: Record<string, ExtractedField> = {};
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

  // Helper to create field
  const addField = (
    key: string,
    label: string,
    value: string,
    rawValue: string,
    confidenceBase: number,
    category: ExtractedField['category'],
    sensitive = false,
    labelKannada?: string,
    labelHindi?: string,
    validationMessage?: string
  ) => {
    let conf = confidenceBase;
    if (!quality.isAcceptable) conf = Math.max(30, conf - 15);

    let level: ConfidenceLevel = 'high';
    if (conf < 65) level = 'low';
    else if (conf < 85) level = 'medium';

    let maskedValue: string | undefined = undefined;
    if (sensitive && key.includes('aadhaar')) {
      maskedValue = maskAadhaar(value);
    } else if (sensitive && key.includes('phone')) {
      maskedValue = value.replace(/(\d{3})\d{4}(\d{3})/, '$1-XXXX-$2');
    }

    fields[key] = {
      key,
      label,
      labelKannada,
      labelHindi,
      value,
      rawValue,
      confidence: conf,
      level,
      source: 'Client-side OCR',
      verified: conf >= 85,
      sensitive,
      maskedValue,
      validationMessage,
      category,
    };
  };

  // ----------------------------------------------------
  // 1. EXTRACT NAME
  // ----------------------------------------------------
  let extractedName = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      !extractedName &&
      /^[A-Z][a-zA-Z\s.]{3,35}$/.test(line) &&
      !/(government|india|union|card|department|income|director|certificate|secondary|board|marksheet|signature|authority)/i.test(line)
    ) {
      extractedName = normalizeName(line);
      break;
    }
    // Name after label
    const nameMatch = line.match(/(?:Name|Full Name|Candidate Name|Applicant Name|Student Name|ಹೆಸರು|नाम)[:\s]+([A-Za-z\s.]+)/i);
    if (nameMatch && nameMatch[1].trim().length > 2) {
      extractedName = normalizeName(nameMatch[1].trim());
      break;
    }
  }

  if (extractedName) {
    addField('fullName', 'Full Legal Name', extractedName, extractedName, 92, 'personal', false, 'ಪೂರ್ಣ ಹೆಸರು', 'पूरा नाम');
  }

  // ----------------------------------------------------
  // 2. EXTRACT DATE OF BIRTH
  // ----------------------------------------------------
  const dobMatch = rawText.match(/(?:DOB|Date of Birth|Birth Date|ಹುಟ್ಟಿದ ದಿನಾಂಕ|जन्म तिथि)[:\s]*([0-9]{1,2}[/.-][0-9]{1,2}[/.-][0-9]{2,4})/i) ||
                   rawText.match(/\b([0-9]{2}[/.-][0-9]{2}[/.-][0-9]{4})\b/);
  if (dobMatch) {
    const normDob = normalizeDate(dobMatch[1]);
    addField('dateOfBirth', 'Date of Birth', normDob, dobMatch[1], 95, 'personal', false, 'ಹುಟ್ಟಿದ ದಿನಾಂಕ', 'जन्म तिथि');
  }

  // ----------------------------------------------------
  // 3. EXTRACT GENDER
  // ----------------------------------------------------
  if (/\b(Female|MALE|Female|Male|TRANSGENDER|ಪುರುಷ|ಮಹಿಳೆ|महिला|पुरुष)\b/i.test(rawText)) {
    const genderMatch = rawText.match(/\b(Female|Male|Transgender|ಪುರುಷ|ಮಹಿಳೆ|महिला|पुरुष)\b/i);
    let gender = 'Male';
    if (genderMatch && /female|ಮಹಿಳೆ|महिला/i.test(genderMatch[0])) {
      gender = 'Female';
    } else if (genderMatch && /transgender/i.test(genderMatch[0])) {
      gender = 'Transgender';
    }
    addField('gender', 'Gender', gender, genderMatch ? genderMatch[0] : gender, 94, 'personal', false, 'ಲಿಂಗ', 'लिंग');
  }

  // ----------------------------------------------------
  // 4. EXTRACT PHONE NUMBER
  // ----------------------------------------------------
  const phoneMatch = rawText.match(/(?:\+91[\s-]?)?([6-9]\d{9})\b/);
  if (phoneMatch) {
    addField('phone', 'Mobile Number', phoneMatch[1], phoneMatch[0], 90, 'contact', true, 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', 'मोबाइल नंबर');
  }

  // ----------------------------------------------------
  // 5. EXTRACT PINCODE & ADDRESS
  // ----------------------------------------------------
  const pinMatch = rawText.match(/\b([1-9][0-9IO]{5})\b/);
  if (pinMatch) {
    const { normalized, corrected } = normalizePincode(pinMatch[1]);
    const pinConf = corrected ? 72 : 94;
    addField(
      'pincode',
      'Postal Pincode',
      normalized,
      pinMatch[1],
      pinConf,
      'location',
      false,
      'ಪಿನ್‌ಕೋಡ್',
      'पिनकोड',
      corrected ? 'Corrected OCR digit character confusion (Verify)' : undefined
    );
  }

  // Extract Address
  const addrMatch = rawText.match(/(?:Address|Add|ವಿಳಾಸ|पता)[:\s]+([^.]+)/i);
  if (addrMatch && addrMatch[1].trim().length > 8) {
    const addr = addrMatch[1].trim().replace(/\n+/g, ', ');
    addField('address', 'Residential Address', addr, addrMatch[1], 80, 'location', false, 'ವಿಳಾಸ', 'पता');
  }

  // ----------------------------------------------------
  // 6. EXTRACT AADHAAR / ID NUMBER
  // ----------------------------------------------------
  const aadhaarMatch = rawText.match(/\b(\d{4}\s\d{4}\s\d{4})\b/) || rawText.match(/\b(\d{12})\b/);
  if (aadhaarMatch) {
    const num = aadhaarMatch[1].replace(/\s+/g, '');
    addField(
      'aadhaarNumber',
      'Aadhaar / National Identity',
      num,
      aadhaarMatch[0],
      96,
      'document',
      true,
      'ಆಧಾರ್ ಸಂಖ್ಯೆ',
      'आधार संख्या',
      'Masked for privacy'
    );
  }

  // ----------------------------------------------------
  // 7. EXTRACT EDUCATION DETAILS (IF MARKSHEET / ID)
  // ----------------------------------------------------
  const rollMatch = rawText.match(/(?:Roll No|Roll Number|Reg No|Registration No)[:\s]*([A-Z0-9-]+)/i);
  if (rollMatch) {
    addField('rollNumber', 'Roll / Registration Number', rollMatch[1].trim(), rollMatch[0], 93, 'education', false, 'ರೋಲ್ ನಂಬರ್', 'रोल नंबर');
  }

  const pctMatch = rawText.match(/(\d{2}(?:\.\d{1,2})?)\s*%/);
  if (pctMatch) {
    addField('percentage', 'Total Percentage / Marks', `${pctMatch[1]}%`, pctMatch[0], 90, 'education', false, 'ಶೇಕಡಾವಾರು ಅಂಕ', 'प्रतिशत');
  }

  const boardMatch = rawText.match(/(CBSE|ICSE|State Board|Pre-University Board|KSEEB|Karnataka Board)/i);
  if (boardMatch) {
    addField('educationBoard', 'Educational Board / Institution', boardMatch[0], boardMatch[0], 92, 'education', false, 'ಮಂಡಳಿ / ಸಂಸ್ಥೆ', 'शिक्षा बोर्ड');
  }

  // ----------------------------------------------------
  // 8. EXTRACT FAMILY DETAILS
  // ----------------------------------------------------
  const fatherMatch = rawText.match(/(?:Father's Name|Father Name|Guardian|ತಂದೆಯ ಹೆಸರು|पिता का नाम)[:\s]+([A-Za-z\s.]+)/i);
  if (fatherMatch && fatherMatch[1].trim().length > 2) {
    const fName = normalizeName(fatherMatch[1].trim());
    addField('fatherName', "Father's / Guardian's Name", fName, fatherMatch[1], 88, 'family', false, 'ತಂದೆ / ಪೋಷಕರ ಹೆಸರು', 'पिता / अभिभावक का नाम');
  }

  return fields;
}

/**
 * Complete document understanding pipeline
 */
export function processDocumentUnderstanding(
  rawText: string,
  quality: DocumentQuality
): ExtractionResult {
  const { type, title, confidence } = identifyDocumentType(rawText);
  const fields = extractDocumentFields(rawText, type, quality);

  const missingRequiredFields: string[] = [];
  if (!fields.fullName) missingRequiredFields.push('Full Name');
  if (!fields.dateOfBirth && type === 'aadhaar') missingRequiredFields.push('Date of Birth');

  return {
    documentType: type,
    documentTitle: title,
    confidence,
    quality,
    fields,
    rawTextLength: rawText.length,
    processedAt: new Date().toISOString(),
    missingRequiredFields,
  };
}
