const mongoose = require('mongoose');

const ChartSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true
  },
  displayName: {
    type: String,
    require: true
  },
  image: {
    type: String, 
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Chart', ChartSchema);