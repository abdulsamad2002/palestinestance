import mongoose from 'mongoose';

const CelebritySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  profession: {
    type: String,
    required: true,
  },
  stance: {
    type: String,
    enum: ['pro', 'neutral', 'against'],
    required: true,
  },
  sources: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length >= 2,
      message: 'At least 2 sources required',
    },
  },
  aiConfidence: {
    type: Number,
    min: 0,
    max: 100,
  },
  status: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    default: 'pending',
    index: true,
  },
  submittedBy: {
    type: String,
    default: null,
  },
  verifications: {
    type: Number,
    default: 0,
  },
  disputes: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Create text index for search
CelebritySchema.index({ name: 'text', profession: 'text' });

const Celebrity = mongoose.models.Celebrity || mongoose.model('Celebrity', CelebritySchema);

export default Celebrity;