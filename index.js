const express = require("express");
const morgan = require("morgan");
const phonebook = express();
const db = require("./database/mongo.js");

phonebook.use(express.json());

//skipped the exercise on using morgan in more granular way
phonebook.use(morgan("tiny"));
phonebook.use(express.static("build"));

/*
const requestLogger = (request, response, next) => {
  console.log("----------------------");
  console.log("Method: ", request.method);
  console.log("Path: ", request.path);
  console.log("Body: ", request.body);
  console.log("----------------------");

  next();
};
*/
const errorHandler = ({ name, number }) => {
  const isInvalid = (number) => {
    return number == "";
  };

  let error = [];

  const nameAlreadyPresent = () =>
    contacts.some((contact) => contact.name === name);

  if (name === "") {
    error.push("Name is required.");
  } else if (nameAlreadyPresent()) {
    error.push("Name must be unique");
  }

  if (isInvalid(number)) {
    error.push("The number is not valid.");
  }

  if (error.length === 0) return null;

  return { message: error.join(" & ") };
};

/*
phonebook.get("/", (request, response) => {
  response.send(
    "<h1 style='margin:150px auto'>Welcome to the phonebook app!</h1>"
  );
});
*/

phonebook.get("/api/persons", (request, response) => {
  db.open();
  db.getAll().then((contacts) => {
    db.close();
    response.json(contacts);
  });
});

phonebook.get("/info", async (request, response) => {
  console.log("requested info");
  await db.open();
  let all = await db.getAll();
  let total = all.length;
  let message = `<p>Phonebook has info for ${total} people</p> <br></br> ${new Date().toLocaleString()}`;
  await db.close();

  response.send(message);
});

phonebook.get("/api/persons/:id", (request, response) => {
  let id = request.params.id;

  console.log("has entered the get by id endpoint");
  db.findBy(id)
    .then((res) => {
      console.log(res);
      return response.send("It seems to be working so far");
    })
    .catch((err) => console.log("ooops! ran into some error: ", err.message));
});

/*
phonebook.post("/api/persons", (request, response) => {
  let { name, number } = request.body;
  let errorObj = errorHandler({ name, Number });

  console.log("error report", errorObj);

  if (errorObj) {
    return response.status(404).send({ error: errorObj.message });
  }

  let id = Math.floor(Math.random() * 100000000);

  let newContact = { id, name, number };
  contacts.push(newContact);

  return response.json(newContact);
});

phonebook.delete("/api/persons/:id", (request, response) => {
  let id = Number(request.params.id);

  let contactIndex = contacts.findIndex((contact) => contact.id === id);

  if (contactIndex === -1) {
    return response.status(400).send("The contact is not available");
  }

  contacts.splice(contactIndex, 1);

  return response.send("");
});
*/
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "The endpoint is unknown" });
};

phonebook.use(unknownEndpoint);

const PORT = process.env.PORT || 3002;
phonebook.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
