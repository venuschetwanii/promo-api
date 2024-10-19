const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({

  brandName: {
    type: String,
    trim: true
  },
  no_Sku: {
    type: String,
    trim: true
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

const brandUser = new mongoose.model("brandUser", brandSchema);

module.exports = brandUser