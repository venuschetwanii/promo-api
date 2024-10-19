const mongoose = require('mongoose');

const shelfSchema = new mongoose.Schema({

  name: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  shelfPath: {
    type: String,

  },
  status: {
    type: String,

  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }

});

const shelfUser = new mongoose.model("shelfUser", shelfSchema);

module.exports = shelfUser