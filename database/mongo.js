require("dotenv").config();
const mongoose = require("mongoose");
const Contact = require("./schemas/contacts.js");

const url = process.env.MONGODB_URI;
mongoose.connect(url);

const getAll = () => {
  return Contact.find({}).then((contacts) => {
    mongoose.connection.close();
    return contacts;
  });
};

const findBy = (id) => {
  console.log("requested id", id);
  console.log("contact has findbyid Method", Contact.findById);
  return Contact.findById(id)
    .then((contact) => {
      console.log(contact);
      mongoose.connection.close();
      return contact;
    })
    .catch((err) => console.log("error is ", err));
};

module.exports = {
  getAll,
  findBy,
};
