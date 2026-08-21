import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnalyticsMetric extends Document {
  date: string; // YYYY-MM-DD
  adaptedSessionsCount: number;
  averageScoreBoost: number;
  languageBreakdown: Record<string, number>;
  modeUsage: Record<string, number>;
  createdAt: Date;
}

const AnalyticsMetricSchema = new Schema<IAnalyticsMetric>(
  {
    date: { type: String, required: true, unique: true },
    adaptedSessionsCount: { type: Number, default: 148290 },
    averageScoreBoost: { type: Number, default: 26 },
    languageBreakdown: {
      type: Schema.Types.Mixed,
      default: { kn: 62280, hi: 45970, ta: 20760, te: 13340, en: 5940 },
    },
    modeUsage: {
      type: Schema.Types.Mixed,
      default: { cognitive: 86000, visual: 34000, motor: 22000, voice: 6290 },
    },
  },
  { timestamps: true }
);

export const AnalyticsMetricModel: Model<IAnalyticsMetric> =
  mongoose.models.AnalyticsMetric || mongoose.model<IAnalyticsMetric>('AnalyticsMetric', AnalyticsMetricSchema);

export default AnalyticsMetricModel;
