const mongoose = require('mongoose');

const skuSchema = new mongoose.Schema({

  name: {
    type: String,
    trim: true
  },
  product: {
    type: String,
    trim: true
  },
  dayId: {
    type: Number
  },
  brand: {
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

const skuUser = new mongoose.model("skuUser", skuSchema);

module.exports = skuUser