import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  submissionCount: {
    type: Number,
    default: 0,
  },
  trustScore: {
    type: Number,
    default: 50,
    min: 0,
    max: 100,
  },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;