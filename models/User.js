const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long'],
      },
      lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long'],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 8 characters long'],
      },
      // Optional fields to be filled during profile update
      image: {
        type: String, // Can be a URL or path to the image
      },
      address: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
        match: [/^\d{10,15}$/, 'Please provide a valid phone number'], // Validation for 10 to 15 digits
      },
      cnic: {
        type: String,
        unique: true,
        match: [/^\d{13}$/, 'Please provide a valid 13-digit CNIC'], // Validation for 13 digits
      },
      district: {
        type: String,
      },
      tehsil: {
        type: String,
      },
      feePaid: {
        type: Boolean,
        default: false, // Default to false until payment proof is uploaded
      },
      paymentProof: {
        type: String, // URL or path of the uploaded file
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      token : {
        type: String
      }
});
module.exports = mongoose.model('User', userSchema)

