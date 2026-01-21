import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  organization: {
    type: String,
    required: true,
  },
  leaders: [{
    name: { type: String, required: true },
    role: { type: String }, // e.g. "Lead Organizer", "Founder"
  }],
  location: {
    type: String, // e.g. "London, UK", "New York, USA", "Global"
    required: true,
  },
  date: {
    type: String, // e.g. "October 2023 - Present"
  },
  description: {
    type: String,
    required: true,
  },
  impact: {
    type: String, // e.g. "Over 500,000 attendees", "Raised $2M"
  },
  sources: [{
    type: String,
    required: true,
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'ongoing'],
    default: 'ongoing',
  }
}, {
  timestamps: true,
});

// Text index for searching campaigns
CampaignSchema.index({ title: 'text', organization: 'text', 'leaders.name': 'text' });

const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);

export default Campaign;
