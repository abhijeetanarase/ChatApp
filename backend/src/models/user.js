import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    trim: true,
    select: false, // Do not return password in queries
  },
  picture: {
    type: String,
    trim: true,
  },
  verified : {
    type : Boolean,
    default : false
  },
  slug : {
     type : String,
 }
 
});

const User = mongoose.model("User", userSchema);
export default User;
