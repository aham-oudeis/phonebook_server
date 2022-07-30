const express = require("express");
const morgan = require("morgan");
const phonebook = express();
const db = require("./database/mongo.js");

phonebook.use(express.static("build"));
phonebook.use(express.json());
//skipped the exercise on using morgan in more granular way
phonebook.use(morgan("tiny"));

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

const invalidValuesHandler = ({ name, number }) => {
  const isInvalid = (number) => {
    return number == "";
  };

  let error = [];

  const nameAlreadyPresent = () => false;

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
  db.getAll().then((contacts) => {
    response.json(contacts);
  });
});

phonebook.get("/info", async (request, response) => {
  console.log("requested info");
  let all = await db.getAll();
  console.log(all);
  let total = all.length;
  let message = `<p>Phonebook has info for ${total} people</p> <br></br> ${new Date().toLocaleString()}`;

  response.send(message);
});

phonebook.get("/api/persons/:id", (request, response, next) => {
  let id = request.params.id;

  console.log("has entered the get by id endpoint");
  db.findBy(id)
    .then((res) => {
      return response.json(res);
    })
    .catch((err) => next(err));
});

phonebook.post("/api/persons", (request, response, next) => {
  let { name, number } = request.body;
  let errorObj = invalidValuesHandler({ name, Number });

  console.log("error report", errorObj);

  if (errorObj) {
    return response.status(404).send({ error: errorObj.message });
  }

  db.add({ name, number })
    .then((contact) => response.json(contact))
    .catch((err) => {
      next(err);
    });
});

phonebook.delete("/api/persons/:id", (request, response) => {
  let id = request.params.id;

  db.remove(id)
    .then((response) => {
      if (response === null) {
        return response.status(400).send("The contact is not available");
      }

      return response.send("");
    })
    .catch((error) => {
      return response.send("The id is invalid!");
    });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "The endpoint is unknown" });
};

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

phonebook.use(unknownEndpoint);
phonebook.use(errorHandler);

const PORT = process.env.PORT || 3002;
phonebook.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
