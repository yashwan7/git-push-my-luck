import mongoose, { Schema, Document, Model } from 'mongoose';
import { AccessibilityProfile } from '@/types';

export interface IUserProfile extends Document {
  userId: string;
  activePersonaName?: string;
  profile: AccessibilityProfile;
  updatedAt: Date;
  createdAt: Date;
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: { type: String, required: true, unique: true, default: 'anonymous_user' },
    activePersonaName: { type: String, default: null },
    profile: {
      textSize: { type: String, enum: ['normal', 'large', 'xlarge', 'xxlarge'], default: 'normal' },
      contrastTheme: { type: String, enum: ['standard', 'high-contrast-dark', 'high-contrast-light', 'warm-paper'], default: 'standard' },
      interactionMode: { type: String, enum: ['touch', 'keyboard', 'voice', 'large-controls', 'assisted'], default: 'touch' },
      informationMode: { type: String, enum: ['read', 'hear', 'read-hear', 'simplified'], default: 'read' },
      cognitiveLevel: { type: String, enum: ['standard', 'step-by-step', 'guided-visual', 'max-simplified'], default: 'standard' },
      language: { type: String, enum: ['en', 'kn', 'hi', 'ta', 'te', 'ml', 'mr', 'bn'], default: 'en' },
      motionReduction: { type: Boolean, default: false },
      voiceSpeed: { type: Number, default: 1.0 },
      audioFeedback: { type: Boolean, default: false },
      actionConfirmations: { type: Boolean, default: false },
      buttonTargetSize: { type: String, enum: ['standard', 'large', 'extra-large'], default: 'standard' },
    },
  },
  { timestamps: true }
);

export const UserProfileModel: Model<IUserProfile> =
  mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);

export default UserProfileModel;
