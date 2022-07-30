require("dotenv").config();
const mongoose = require("mongoose");
const Contact = require("./schemas/contacts.js");

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((res) => console.log("connected to mongo"))
  .catch((err) => console.log("error connecting with mongo: ", err.message));

const getAll = () => {
  return Contact.find({}).then((contacts) => {
    return contacts;
  });
};

const findBy = (id) => {
  console.log("requested id", id);
  return Contact.findById(id).then((contact) => {
    console.log(contact);
    return contact;
  });
};

const add = (obj) => {
  console.log("adding obj to the database");

  let newContact = new Contact(obj);
  return newContact.save();
};

const remove = (id) => {
  return Contact.findByIdAndDelete(id);
};
const close = () => {
  console.log("closing mongo connection...");
  mongoose.connection.close();
};

module.exports = {
  add,
  getAll,
  findBy,
  remove,
  close,
};
