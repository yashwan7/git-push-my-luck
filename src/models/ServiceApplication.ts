import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IServiceApplication extends Document {
  serviceId: string;
  serviceTitle: string;
  category: string;
  applicantAnswers: Record<string, any>;
  confirmationCode: string;
  adaptationModeUsed: string; // 'cognitive' | 'visual' | 'motor' | 'standard'
  languageUsed: string;
  status: 'submitted' | 'processing' | 'approved';
  createdAt: Date;
  updatedAt: Date;
}

const ServiceApplicationSchema = new Schema<IServiceApplication>(
  {
    serviceId: { type: String, required: true },
    serviceTitle: { type: String, required: true },
    category: { type: String, required: true },
    applicantAnswers: { type: Schema.Types.Mixed, default: {} },
    confirmationCode: { type: String, required: true },
    adaptationModeUsed: { type: String, default: 'cognitive' },
    languageUsed: { type: String, default: 'en' },
    status: { type: String, enum: ['submitted', 'processing', 'approved'], default: 'submitted' },
  },
  { timestamps: true }
);

export const ServiceApplicationModel: Model<IServiceApplication> =
  mongoose.models.ServiceApplication || mongoose.model<IServiceApplication>('ServiceApplication', ServiceApplicationSchema);

export default ServiceApplicationModel;
