const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    firstName: {
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    },
  }, { timestamps: true });
  
  const user = mongoose.model("user", UserSchema)
  module.exports=user;