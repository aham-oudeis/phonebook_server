require("dotenv").config();
const mongoose = require("mongoose");
const Contact = require("./schemas/contacts.js");

const url = process.env.MONGODB_URI;

const open = () => {
  mongoose
    .connect(url)
    .then((res) => console.log("connected to mongo"))
    .catch((err) => console.log("error connecting with mongo: ", err.message));
};

const getAll = () => {
  return Contact.find({}).then((contacts) => {
    return contacts;
  });
};

const findBy = (id) => {
  console.log("requested id", id);
  console.log("contact has findbyid Method", Contact.findById);
  return Contact.findById(id)
    .then((contact) => {
      console.log(contact);
      return contact;
    })
    .catch((err) => console.log("error is ", err));
};

const close = () => {
  console.log("closing mongo connection...");
  mongoose.connection.close();
};

module.exports = {
  open,
  getAll,
  findBy,
  close,
};
