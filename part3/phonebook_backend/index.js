require("dotenv").config();

const express = require("express");
const app = express();

const morgan = require("morgan");

const Person = require("./models/person"); 

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

/* MIDDLEWARE (Before route definitions) */
app.use(express.json());

morgan.token("body", (req) => {
    return JSON.stringify(req.body);
});

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.use(express.static('dist')); 


/* ENDPOINTS */

// GET

app.get("/info", (req, res) => {
    const date = new Date();
    const info = `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`;
    res.send(info);
});


app.get("/api/persons", (req, res, next) => {
    Person.find({})
        .then(returnedPersons => {
            res.json(returnedPersons);
        })
        .catch(error => next(error)); // Pass error to the error handler
});

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = persons.find(p => p.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).send({ error: "Person not found" });
    }
});

// POST
app.post("/api/persons", (req, res, next) => {
    const body = req.body;

    const { name, number } = body;
    if (!name || !number) {
        return res.status(400).json({ error: "Name or number is missing" });
    }

    const newPerson = Person({
        name: name,
        number: number,
    })
    
    newPerson.save()
        .then(savedPerson => {
            res.status(201).json(savedPerson);
        })
        .catch(error => next(error)); // Pass error to the error handler
});

// PUT
app.put("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    const body = req.body;

    const { name, number } = body;
    if (!name || !number) {
        return res.status(400).json({ error: "Name or number is missing" });
    }

    const person = {
        name: name,
        number: number,
    };

    // Find the person by ID and update it, returning the updated document (new:true)
    Person.findByIdAndUpdate(id, person, { new:true })
        .then(updatedPerson => {
            if (!updatedPerson) {
                return res.status(404).send({ error: "Person not found" });
            }
            res.json(updatedPerson);
        })
        .catch(error => next(error)); // Pass error to the error handler
})

// DELETE
app.delete("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id)
        .then(() => {
            res.status(204).end();
        })
        .catch(error => next(error)); // Pass error to the error handler
});

/* MIDDLEWARE (POST ROUTES) */
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "Unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return res.status(400).send({ error: "Malformed ID" });
    }

    next(error);
}
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\nURL: http://localhost:${PORT}/`);
});
