import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  industry: {
    type: String,
    required: true,
  },
  stance: {
    type: String,
    enum: ['pro', 'neutral', 'against'],
    required: true,
    index: true,
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
    index: true,
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
  parentCompany: {
    type: String,
    default: null,
  },
  summary: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Create text index for search
CompanySchema.index({ name: 'text', industry: 'text' });

const Company = mongoose.models.Company || mongoose.model('Company', CompanySchema);

export default Company;
