const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    user_name: { type: String, sparse: true }, // Allows multiple null values for user_name
    employee_id: { type: Number, unique: true },
    active: { type: Boolean, default: true },
    resetToken: { type: String },
    resetTokenExpiration: { type: Date },
    remember_created_at: { type: Date },
    authentication_token: { type: String },
    free_meal_count: { type: Number, default: 0 },
    is_free_meal: { type: Boolean, default: false },
    location: { type: String, default: "" },
    profile_url: { type: String }
  }, { timestamps: true });
  
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);
