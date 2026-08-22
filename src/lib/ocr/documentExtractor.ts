export interface ExtractedDocumentData {
  documentType: "aadhaar" | "ration_card" | "marksheet" | "pan" | "voter_id" | "unknown";
  documentName: string;
  confidence: number;
  fields: {
    fullName?: string;
    idNumber?: string;
    dob?: string;
    age?: number;
    gender?: "Male" | "Female" | "Transgender" | string;
    fatherOrGuardianName?: string;
    address?: string;
    pincode?: string;
    state?: string;
    percentageOrMarks?: string;
    rollNumber?: string;
    institution?: string;
    yearOfPassing?: string;
    annualIncome?: string;
  };
  rawText: string;
  confidenceScores: Record<string, number>;
}

export const SAMPLE_DOCUMENTS: Record<string, { title: string; type: ExtractedDocumentData["documentType"]; description: string; data: ExtractedDocumentData; previewUrl: string }> = {
  aadhaar_senior: {
    title: "Aadhaar Card (Senior Citizen)",
    type: "aadhaar",
    description: "Ramesh Kumar Gowda — Pension & Healthcare verification",
    previewUrl: "/images/senior-hero.jpg",
    data: {
      documentType: "aadhaar",
      documentName: "Government of India - Unique Identification Authority",
      confidence: 0.98,
      fields: {
        fullName: "Ramesh Kumar Gowda",
        idNumber: "8942 6178 3920",
        dob: "14/08/1958",
        age: 68,
        gender: "Male",
        fatherOrGuardianName: "Late Channappa Gowda",
        address: "#42, 3rd Cross, Gandhi Nagar, JP Nagar 4th Phase, Bengaluru, Karnataka",
        pincode: "560078",
        state: "Karnataka",
      },
      confidenceScores: {
        fullName: 99,
        idNumber: 99,
        dob: 97,
        gender: 98,
        address: 96,
        pincode: 99,
      },
      rawText: "GOVERNMENT OF INDIA\nUnique Identification Authority of India\nEnrollment No: 1042/39201/09214\nTo: Ramesh Kumar Gowda\nS/O: Late Channappa Gowda\n#42, 3rd Cross, Gandhi Nagar, JP Nagar 4th Phase\nBengaluru, Karnataka - 560078\nDOB: 14/08/1958 | Gender: Male\n8942 6178 3920\nVID: 9182 3920 1823 8810\nMERA AADHAAR, MERI PEHCHAN",
    },
  },
  marksheet_merit: {
    title: "12th Board Marksheet (Scholarship)",
    type: "marksheet",
    description: "Ananya Sharma — 94.2% CBSE Merit Candidate",
    previewUrl: "/images/senior-hero.jpg",
    data: {
      documentType: "marksheet",
      documentName: "Central Board of Secondary Education - Senior School Certificate",
      confidence: 0.96,
      fields: {
        fullName: "Ananya Sharma",
        fatherOrGuardianName: "Rajesh Sharma",
        idNumber: "CBSE-2024-884102",
        rollNumber: "12648920",
        dob: "02/11/2006",
        gender: "Female",
        percentageOrMarks: "94.2%",
        institution: "Kendriya Vidyalaya Malleshwaram, Bengaluru",
        yearOfPassing: "2024",
        address: "Flat 402, Shanti Heights, Malleshwaram, Bengaluru",
        pincode: "560003",
      },
      confidenceScores: {
        fullName: 99,
        rollNumber: 98,
        percentageOrMarks: 99,
        yearOfPassing: 99,
        fatherOrGuardianName: 95,
        institution: 94,
      },
      rawText: "CENTRAL BOARD OF SECONDARY EDUCATION\nMARKS STATEMENT & CERTIFICATE\nRoll No: 12648920 | Candidate: ANANYA SHARMA\nFather: RAJESH SHARMA | Mother: SUNITA SHARMA\nSchool: KENDRIYA VIDYALAYA MALLESHWARAM\nGrand Total: 471/500 | Percentage: 94.2% | Result: PASS (DISTINCTION)",
    },
  },
  ration_card: {
    title: "Ration Card (BPL / Food Security)",
    type: "ration_card",
    description: "Food, Civil Supplies & Consumer Affairs Department",
    previewUrl: "/images/senior-hero.jpg",
    data: {
      documentType: "ration_card",
      documentName: "National Food Security Card (BPL/PHH)",
      confidence: 0.95,
      fields: {
        fullName: "Ramesh Kumar Gowda",
        idNumber: "RC-KA-092-881920",
        fatherOrGuardianName: "Channappa Gowda",
        annualIncome: "₹ 48,000",
        address: "#42, 3rd Cross, Gandhi Nagar, JP Nagar, Bengaluru",
        pincode: "560078",
        state: "Karnataka",
      },
      confidenceScores: {
        fullName: 98,
        idNumber: 97,
        annualIncome: 95,
        address: 94,
      },
      rawText: "DEPARTMENT OF FOOD & CIVIL SUPPLIES\nNATIONAL FOOD SECURITY CARD (PHH-BPL)\nRation Card No: RC-KA-092-881920\nHead of Family: Ramesh Kumar Gowda\nFamily Annual Income: Rs 48,000\nFair Price Shop No: FPS-BLR-042\nAddress: #42, Gandhi Nagar, JP Nagar, Bengaluru - 560078",
    },
  },
};

export function parseDocumentText(text: string): ExtractedDocumentData {
  const clean = text.replace(/\r\n/g, "\n");
  const lower = clean.toLowerCase();

  let docType: ExtractedDocumentData["documentType"] = "unknown";
  let docName = "Scanned Identity Document";
  const fields: ExtractedDocumentData["fields"] = {};
  const confidenceScores: Record<string, number> = {};

  if (lower.includes("aadhaar") || lower.includes("unique identification") || lower.includes("uidai") || /\d{4}\s\d{4}\s\d{4}/.test(clean)) {
    docType = "aadhaar";
    docName = "Aadhaar Identity Document (UIDAI)";
    
    const aadhaarMatch = clean.match(/\b\d{4}\s\d{4}\s\d{4}\b/);
    if (aadhaarMatch) {
      fields.idNumber = aadhaarMatch[0];
      confidenceScores.idNumber = 98;
    }

    const dobMatch = clean.match(/(?:dob|date of birth|birth|जन्म तिथि)\s*[:\-\/]?\s*([0-3]?[0-9][\/\-\.][0-1]?[0-9][\/\-\.][12][90]\d\d)/i);
    if (dobMatch) {
      fields.dob = dobMatch[1].replace(/[\-\.]/g, "/");
      confidenceScores.dob = 96;
      
      const year = parseInt(fields.dob.split("/")[2]);
      if (year) {
        fields.age = new Date().getFullYear() - year;
      }
    }

    if (lower.includes("female") || lower.includes("महिला")) {
      fields.gender = "Female";
      confidenceScores.gender = 99;
    } else if (lower.includes("male") || lower.includes("पुरुष")) {
      fields.gender = "Male";
      confidenceScores.gender = 99;
    }

    const lines = clean.split("\n").map(l => l.trim()).filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^[A-Z][a-zA-Z\s]{3,30}$/.test(line) && !line.includes("INDIA") && !line.includes("GOVERNMENT") && !line.includes("DOB")) {
        fields.fullName = line;
        confidenceScores.fullName = 92;
        break;
      }
    }
  } else if (lower.includes("board") || lower.includes("marksheet") || lower.includes("cbse") || lower.includes("icse") || lower.includes("percentage") || lower.includes("roll no")) {
    docType = "marksheet";
    docName = "Academic Marksheet / Certificate";

    const rollMatch = clean.match(/(?:roll no|roll number|reg no|registration)\s*[:\-\/]?\s*([A-Za-z0-9\-]+)/i);
    if (rollMatch) {
      fields.rollNumber = rollMatch[1];
      confidenceScores.rollNumber = 96;
    }

    const percentMatch = clean.match(/(\d{2}(?:\.\d{1,2})?)\s*%/);
    if (percentMatch) {
      fields.percentageOrMarks = percentMatch[1] + "%";
      confidenceScores.percentageOrMarks = 97;
    }
  } else if (lower.includes("ration") || lower.includes("food security") || lower.includes("phh") || lower.includes("bpl")) {
    docType = "ration_card";
    docName = "National Food Security Ration Card";

    const rcMatch = clean.match(/(?:card no|rc no|ration card)\s*[:\-\/]?\s*([A-Za-z0-9\-]+)/i);
    if (rcMatch) {
      fields.idNumber = rcMatch[1];
      confidenceScores.idNumber = 95;
    }
  }

  const pinMatch = clean.match(/\b([1-9][0-9]{5})\b/);
  if (pinMatch) {
    fields.pincode = pinMatch[1];
    confidenceScores.pincode = 98;
  }

  return {
    documentType: docType,
    documentName: docName,
    confidence: Object.keys(confidenceScores).length > 0 ? 0.94 : 0.70,
    fields,
    confidenceScores,
    rawText: text,
  };
}
