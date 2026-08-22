export type DocumentType = 
  | 'aadhaar' 
  | 'ration_card' 
  | 'marksheet' 
  | 'student_id' 
  | 'govt_certificate' 
  | 'pan_card' 
  | 'voter_id' 
  | 'unknown';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ExtractedField {
  key: string;
  label: string;
  labelKannada?: string;
  labelHindi?: string;
  value: string;
  rawValue: string;
  confidence: number; // 0 to 100
  level: ConfidenceLevel;
  source: string;
  verified: boolean;
  sensitive?: boolean;
  maskedValue?: string;
  validationMessage?: string;
  category: 'personal' | 'contact' | 'education' | 'family' | 'location' | 'document';
}

export interface DocumentQuality {
  isAcceptable: boolean;
  brightnessScore: number; // 0 - 100
  contrastScore: number;   // 0 - 100
  blurScore: number;       // 0 - 100
  issues: string[];
  suggestions: string[];
}

export interface ExtractionResult {
  documentType: DocumentType;
  documentTitle: string;
  confidence: number;
  quality: DocumentQuality;
  fields: Record<string, ExtractedField>;
  rawTextLength: number;
  processedAt: string;
  missingRequiredFields: string[];
}

export interface FormFieldTarget {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  value?: string;
  matchedFieldKey?: string;
}

export interface SampleDocumentItem {
  id: string;
  name: string;
  nameKannada: string;
  nameHindi: string;
  type: DocumentType;
  description: string;
  badge: string;
  mockRawText: string;
  expectedFields: Record<string, string>;
}
