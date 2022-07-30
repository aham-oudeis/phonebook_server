const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 1,
    required: true,
  },
  number: {
    type: String,
    required: true,
    minLength: 5,
  },
});

contactSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
