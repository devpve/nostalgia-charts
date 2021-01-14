const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  lastfmId: {
    type: String,
    require: true
  },
  displayName: {
    type: String,
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', UserSchema);