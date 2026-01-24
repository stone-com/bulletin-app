const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Remove whitespace from start/end
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Store all emails in lowercase
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to current time
  },
});

// Pre-save hook: Automatically hash password before storing in database
// Only hash if password is new or modified (not on every save)
userSchema.pre("save", async function () {
  console.log("Pre-save hook running for user:", this.email);
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method: Compare plain text password with stored hashed password (for login)
// Returns true if passwords match, false otherwise
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
