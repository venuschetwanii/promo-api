const mongoose = require('mongoose');

const formBulider = new mongoose.Schema({
   promoName:{
       type:String
   },

  fieldData:[{
      type:Object
  }],
 
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }

});

const formBulid = new mongoose.model("formBulid", formBulider);

module.exports = formBulid