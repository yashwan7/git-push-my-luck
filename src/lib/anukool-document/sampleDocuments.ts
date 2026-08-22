import { SampleDocumentItem } from './types';

export const SAMPLE_DOCUMENTS: SampleDocumentItem[] = [
  {
    id: 'aadhaar-senior',
    name: 'Aadhaar Card (Senior Citizen)',
    nameKannada: 'ಆಧಾರ್ ಕಾರ್ಡ್ (ಹಿರಿಯ ನಾಗರಿಕರು)',
    nameHindi: 'आधार कार्ड (वरिष्ठ नागरिक)',
    type: 'aadhaar',
    description: 'Universal national identity document with Name, DOB, Gender, Address, and Pincode.',
    badge: 'Senior Citizen Identity',
    mockRawText: `GOVERNMENT OF INDIA
UNIQUE IDENTIFICATION AUTHORITY OF INDIA
Mera Aadhaar, Meri Pehchan

To:
Ramesh Kumar
S/O: Late Somanna Kumar
Address: #42, 3rd Main, 4th Cross, Malleshwaram,
Bengaluru, Karnataka - 5600IO
DOB: 14/05/1958
Gender: Male
Aadhaar No: 5498 7123 9041`,
    expectedFields: {
      fullName: 'Ramesh Kumar',
      dateOfBirth: '14/05/1958',
      gender: 'Male',
      fatherName: 'Late Somanna Kumar',
      pincode: '560010',
      address: '#42, 3rd Main, 4th Cross, Malleshwaram, Bengaluru',
      aadhaarNumber: 'XXXX-XXXX-9041',
    },
  },
  {
    id: 'marksheet-cbse',
    name: '12th Academic Marksheet',
    nameKannada: '12ನೇ ತರಗತಿ ಅಂಕಪಟ್ಟಿ (CBSE)',
    nameHindi: '12वीं बोर्ड अंकतालिका (CBSE)',
    type: 'marksheet',
    description: 'Secondary School Examination transcript with Roll Number, Board, Percentage & Student Details.',
    badge: 'Education Certificate',
    mockRawText: `CENTRAL BOARD OF SECONDARY EDUCATION
SECONDARY SCHOOL EXAMINATION CERTIFICATE (2024)

Candidate Name: Yashwanth Gowda
Father Name: Narayana Gowda
Roll Number: 8291045
Date of Birth: 29/09/2006
Institution: National Public School, Bengaluru
Education Board: CBSE
Total Percentage: 92.4%
Result: PASSED IN FIRST CLASS WITH DISTINCTION`,
    expectedFields: {
      fullName: 'Yashwanth Gowda',
      fatherName: 'Narayana Gowda',
      dateOfBirth: '29/09/2006',
      rollNumber: '8291045',
      percentage: '92.4%',
      educationBoard: 'CBSE',
    },
  },
  {
    id: 'ration-card',
    name: 'Food Security Ration Card',
    nameKannada: 'ಆಹಾರ ಭದ್ರತೆ ರೇಷನ್ ಕಾರ್ಡ್ (BPL)',
    nameHindi: 'खाद्य सुरक्षा राशन कार्ड (BPL)',
    type: 'ration_card',
    description: 'Food & Civil Supplies welfare card with Beneficiary Name, Category & Family Head.',
    badge: 'Public Welfare Card',
    mockRawText: `DEPARTMENT OF FOOD AND CIVIL SUPPLIES
GOVERNMENT OF KARNATAKA
Priority Household (BPL) Food Security Card

Head of Household: Sumitra Bai
Card Category: BPL Food Security
Card Number: KA-04-BPL-882910
Address: Ward 12, Gandhi Nagar, Shivamogga, Karnataka - 577201
Mobile Number: 9845123490
Eligible Monthly Benefit: ₹2,000 Direct Support`,
    expectedFields: {
      fullName: 'Sumitra Bai',
      phone: '9845123490',
      pincode: '577201',
      address: 'Ward 12, Gandhi Nagar, Shivamogga, Karnataka',
      cardCategory: 'BPL Food Security',
    },
  },
];
