import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAuditReport extends Document {
  url: string;
  overallScore: number;
  visualScore: number;
  interactionScore: number;
  languageScore: number;
  cognitiveScore: number;
  navigationScore: number;
  afterTransformationScore: number;
  issues: {
    severity: 'high' | 'medium' | 'low';
    category: string;
    description: string;
    recommendation: string;
  }[];
  createdAt: Date;
}

const AuditReportSchema = new Schema<IAuditReport>(
  {
    url: { type: String, required: true },
    overallScore: { type: Number, required: true },
    visualScore: { type: Number, required: true },
    interactionScore: { type: Number, required: true },
    languageScore: { type: Number, required: true },
    cognitiveScore: { type: Number, required: true },
    navigationScore: { type: Number, required: true },
    afterTransformationScore: { type: Number, required: true },
    issues: [
      {
        severity: { type: String, enum: ['high', 'medium', 'low'] },
        category: { type: String },
        description: { type: String },
        recommendation: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const AuditReportModel: Model<IAuditReport> =
  mongoose.models.AuditReport || mongoose.model<IAuditReport>('AuditReport', AuditReportSchema);

export default AuditReportModel;
