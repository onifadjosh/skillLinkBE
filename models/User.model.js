const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  fullname:{ type: String, required: true},
  email: { type: String, required: true, unique: true },
  username:{ type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'seller', 'buyer'], default: 'buyer' },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  skill: { type: Array, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  profilePicture:{ type:String},
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;

//String[]
