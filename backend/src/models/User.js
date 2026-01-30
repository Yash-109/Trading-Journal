// User model schema
// Fields: email, password (hashed), timestamps

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // User email - unique identifier
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    // User password - will be hashed before saving
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    }
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

export default User;
