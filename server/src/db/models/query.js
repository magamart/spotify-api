const { Schema, model } = require("mongoose");

const querySchema = new Schema({
  query: {
    type: String,
    required: true,
  },
});

module.exports = model("Query", querySchema);
