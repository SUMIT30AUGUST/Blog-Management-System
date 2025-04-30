const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: Boolean, default: false },
}, { timestamps: true });



const User = mongoose.model.Users || mongoose.model('Users', userSchema);

module.exports = User;