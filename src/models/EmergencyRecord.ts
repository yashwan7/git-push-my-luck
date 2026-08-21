import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmergencyRecord extends Document {
  fullName: string;
  bloodType: string;
  emergencyContact: string;
  allergies?: string[];
  medicalNotes?: string;
  sosEvents: {
    eventType: string;
    location?: { latitude: number; longitude: number };
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const EmergencyRecordSchema = new Schema<IEmergencyRecord>(
  {
    fullName: { type: String, default: 'Ramesh Kumar' },
    bloodType: { type: String, default: 'O+' },
    emergencyContact: { type: String, default: '+91 98765 43210' },
    allergies: { type: [String], default: ['Penicillin', 'Dust'] },
    medicalNotes: { type: String, default: 'Carries inhaler' },
    sosEvents: [
      {
        eventType: { type: String, required: true },
        location: {
          latitude: { type: Number },
          longitude: { type: Number },
        },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const EmergencyRecordModel: Model<IEmergencyRecord> =
  mongoose.models.EmergencyRecord || mongoose.model<IEmergencyRecord>('EmergencyRecord', EmergencyRecordSchema);

export default EmergencyRecordModel;
