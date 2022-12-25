const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
  },
  coverPic: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1509023464722-18d996393ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8ZGFya3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  profession: {
    type: String,
  },
  birthDate: {
    type: String,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
