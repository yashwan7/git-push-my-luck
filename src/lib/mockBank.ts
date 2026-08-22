// Simulated account data. This is intentionally mocked: no hackathon team gets
// production bank API access in a few hours, and pretending otherwise would be
// exactly the kind of "fake" this project is trying to avoid. The gaze/blink
// interaction layer, voice feedback, and navigation are all real; only the
// account numbers behind them are fixtures.

export interface Transaction {
  id: string;
  label: string;
  amount: number; // negative = debit
  date: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  relation: string;
}

export const account = {
  holder: "Medha",
  accountNumberMasked: "•••• 4471",
  balance: 18420.5,
};

export const transactions: Transaction[] = [
  { id: "t1", label: "Grocery - BigBasket", amount: -840, date: "20 Aug" },
  { id: "t2", label: "Scholarship credit", amount: 12000, date: "18 Aug" },
  { id: "t3", label: "Electricity bill", amount: -1250, date: "15 Aug" },
  { id: "t4", label: "UPI - Aarushi", amount: -500, date: "12 Aug" },
];

export const beneficiaries: Beneficiary[] = [
  { id: "b1", name: "Amma", relation: "Family" },
  { id: "b2", name: "Aarushi", relation: "Friend" },
  { id: "b3", name: "Caregiver - Ravi", relation: "Caregiver" },
];

export function simulateTransfer(beneficiaryId: string, amount: number) {
  const b = beneficiaries.find((x) => x.id === beneficiaryId);
  return {
    success: true,
    reference: "NYN" + Math.floor(100000 + Math.random() * 900000),
    beneficiary: b?.name ?? "Unknown",
    amount,
  };
}
