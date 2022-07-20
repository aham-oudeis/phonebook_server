const express = require("express");
const morgan = require("morgan");
const phonebook = express();

const database =
  "mongodb+srv://here-gagan:<password>@fsopen.rldmv.mongodb.net/?retryWrites=true&w=majority";

phonebook.use(express.json());

//skipped the exercise on using morgan in more granular way
phonebook.use(morgan("tiny"));
phonebook.use(express.static("build"));

const contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const requestLogger = (request, response, next) => {
  console.log("----------------------");
  console.log("Method: ", request.method);
  console.log("Path: ", request.path);
  console.log("Body: ", request.body);
  console.log("----------------------");

  next();
};

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
  console.log("request", request.headers);
  response.json(contacts);
});

phonebook.get("/info", (request, response) => {
  console.log("requested info");
  response.send(
    `<p>Phonebook has info for ${
      contacts.length
    } people</p> <br></br> ${new Date().toLocaleString()}`
  );
});

phonebook.get("/api/persons/:id", (request, response) => {
  let id = Number(request.params.id);
  let requestedContact = contacts.find((contact) => contact.id === id);

  if (requestedContact === undefined) {
    return response.status(400).send("The requested contact is not available");
  }
  response.json(requestedContact);
});

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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "The endpoint is unknown" });
};

phonebook.use(unknownEndpoint);

const PORT = process.env.PORT || 3002;
phonebook.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
