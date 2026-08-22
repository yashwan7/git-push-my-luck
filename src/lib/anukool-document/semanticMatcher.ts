import { ExtractedField, FormFieldTarget } from './types';

// Map of canonical field keys to common alias variations
export const FIELD_SEMANTIC_ALIASES: Record<string, string[]> = {
  fullName: [
    'name',
    'full_name',
    'fullname',
    'applicant_name',
    'applicantname',
    'student_name',
    'candidate_name',
    'applicantfullname',
    'legal_name',
    'name_of_applicant',
    'user_name',
    'patient_name',
    'beneficiary_name',
  ],
  dateOfBirth: [
    'dob',
    'date_of_birth',
    'birth_date',
    'birthdate',
    'dateofbirth',
    'd_o_b',
    'born_on',
  ],
  gender: [
    'gender',
    'sex',
    'applicant_gender',
  ],
  phone: [
    'phone',
    'mobile',
    'mobile_number',
    'mobilenumber',
    'phone_number',
    'contact_number',
    'contact_no',
    'telephone',
    'cell_number',
  ],
  pincode: [
    'pin',
    'pincode',
    'postal_code',
    'postalcode',
    'zip',
    'zipcode',
    'area_code',
  ],
  address: [
    'address',
    'residential_address',
    'current_address',
    'permanent_address',
    'street_address',
    'home_address',
    'full_address',
  ],
  aadhaarNumber: [
    'aadhaar',
    'aadhaar_number',
    'aadhar',
    'uidai',
    'national_id',
    'id_number',
    'identity_number',
    'citizen_id',
  ],
  rollNumber: [
    'roll_number',
    'roll_no',
    'rollno',
    'registration_number',
    'reg_no',
    'hall_ticket',
    'hallticket_no',
    'student_id',
  ],
  percentage: [
    'percentage',
    'marks',
    'score',
    'total_percentage',
    'aggregate_marks',
    'gpa',
  ],
  fatherName: [
    'father_name',
    'fathername',
    'guardian_name',
    'guardian',
    'parent_name',
  ],
  educationBoard: [
    'board',
    'institution',
    'university',
    'college',
    'school',
    'board_name',
  ],
};

/**
 * Calculates string similarity (0.0 to 1.0)
 */
function stringSimilarity(s1: string, s2: string): number {
  const a = s1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const b = s2.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (a === b) return 1.0;
  if (a.includes(b) || b.includes(a)) return 0.85;
  return 0.0;
}

/**
 * Finds the best matching extracted field for a given form target
 */
export function matchFieldToTarget(
  target: FormFieldTarget,
  extractedFields: Record<string, ExtractedField>
): ExtractedField | null {
  const targetTokens = [
    target.name,
    target.id,
    target.label,
    target.placeholder || '',
  ].map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, ''));

  let bestMatch: ExtractedField | null = null;
  let bestScore = 0;

  for (const [key, field] of Object.entries(extractedFields)) {
    const aliases = [key, ...(FIELD_SEMANTIC_ALIASES[key] || [])].map((a) =>
      a.toLowerCase().replace(/[^a-z0-9]/g, '')
    );

    for (const targetToken of targetTokens) {
      if (!targetToken) continue;

      for (const alias of aliases) {
        if (targetToken === alias) {
          return field; // Exact match
        }
        const sim = stringSimilarity(targetToken, alias);
        if (sim > bestScore) {
          bestScore = sim;
          bestMatch = field;
        }
      }
    }
  }

  return bestScore >= 0.8 ? bestMatch : null;
}

/**
 * Generates automated mapping report for a service application
 */
export function mapExtractedDataToFormTargets(
  targets: FormFieldTarget[],
  extractedFields: Record<string, ExtractedField>
): {
  matched: Array<{ target: FormFieldTarget; field: ExtractedField }>;
  unmatchedTargets: FormFieldTarget[];
  unusedExtracted: ExtractedField[];
} {
  const matched: Array<{ target: FormFieldTarget; field: ExtractedField }> = [];
  const unmatchedTargets: FormFieldTarget[] = [];
  const usedKeys = new Set<string>();

  for (const target of targets) {
    const match = matchFieldToTarget(target, extractedFields);
    if (match) {
      matched.push({ target, field: match });
      usedKeys.add(match.key);
    } else {
      unmatchedTargets.push(target);
    }
  }

  const unusedExtracted = Object.values(extractedFields).filter((f) => !usedKeys.has(f.key));

  return {
    matched,
    unmatchedTargets,
    unusedExtracted,
  };
}
