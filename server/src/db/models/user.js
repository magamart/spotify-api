const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  searchQuerys: [
    {
      type: Schema.Types.ObjectId,
      ref: "Query",
    },
  ],
});

module.exports = model("User", userSchema);
