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


app.get("/api/persons", (req, res) => {
    Person.find({})
        .then(returnedPersons => {
            res.json(returnedPersons);
        })
        .catch(error => {
            console.error("Error fetching persons:", error);
            res.status(500).send({ error: "Failed to fetch persons" });
        });
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
app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({ error: "Name or number is missing" });
    }

    /* if (persons.some(person => person.name === body.name)) {
        return res.status(400).json({ error: "Name must be unique" });
    } */

    const newPerson = Person({
        name: body.name,
        number: body.number,
    })
    
    newPerson.save()
        .then(savedPerson => {
            res.status(201).json(savedPerson);
        })
        .catch(error => {
            console.error("Error saving person:", error);
            res.status(500).send({ error: "Failed to save person" });
        })
});

// DELETE
app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
});

// MIDDLEWARE for unknown endpoints
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "Unknown endpoint" });
};
app.use(unknownEndpoint);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\nURL: http://localhost:${PORT}/`);
});
