const mongoose = require('mongoose');
const User = require('../models/User');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  description: {
    type: String, 
    require: false
  },
  users: [{
    type: String,
    require: true
  }],
  image: {
    type: String, 
    require: false
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Group', groupSchema);