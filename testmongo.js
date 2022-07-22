require("dotenv").config();
const mongoose = require("mongoose");
const Contact = require("./database/schemas/contacts.js");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const [password, name, number] = process.argv.slice(2);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {
    if (name === undefined) return Contact.find({});

    let newContact = new Contact({ name, number });

    return newContact.save();
  })
  .then((contacts) => {
    if (name) return `added ${name} ${number} to phonebook`;

    return contacts.join("\n");
  })
  .then((res) => {
    console.log(res);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log("Mongoose ran into an error", err);
  });
