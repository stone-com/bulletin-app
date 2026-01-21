const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Usernames must be unique
    trim: true,   // Remove whitespace from start/end
  },
  email: {
    type: String,
    required: true,
    unique: true, // Emails must be unique
    lowercase: true, // Store all emails in lowercase
    trim: true,
  },
  password: {
    type: String,
    required: true,
    // Note: password should never be returned in API responses for security
  },
  createdAt: {
    type: Date, // Automatically set to current time
    default: Date.now,
  },
});
// Pre-save hook: Automatically hash password before storing in database
// Only hash if password is new or modified (not on every save)
userSchema.pre('save', async function (next) {
  // If the password hasn't been changed, skip hashing
  if (!this.isModified('password')) return next();
  try {
    // Generate salt for hashing (10 rounds of hashing)
    const salt = await bcrypt.genSalt(10);
   Instance method: Compare plain text password with stored hashed password (for login)
// Returns true if passwords match, false otherwise
userSchema.methods.comparePassword = async function (candidatePassword)
    next();
  } catch (err) {
    next(err);
  }
  this.password = await bcrypt.hash(this.password, salt);
});

//  Compare password for login
userSchema.methods.comparePassword = async (candidatePassword) => {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);



