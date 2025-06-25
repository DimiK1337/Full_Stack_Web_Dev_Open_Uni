const express = require("express");
const app = express();

const morgan = require("morgan");

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

// MIDDLEWARE
app.use(express.json());

morgan.token("body", (req) => {
    return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));


// ENDPOINTS

// GET
app.get("/", (req, res) => {
    res.send('<h1>Phonebook Backend</h1><a href="http://localhost:3001/api/persons">Go to /api/persons</a>');
});

app.get("/info", (req, res) => {
    const date = new Date();
    const info = `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`;
    res.send(info);
});


app.get("/api/persons", (req, res) => {
    res.json(persons);
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
const generateId = () => {
    return Math.floor(Math.random() * 10000).toString();
};

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({ error: "Name or number is missing" });
    }

    if (persons.some(person => person.name === body.name)) {
        return res.status(400).json({ error: "Name must be unique" });
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number,
    };
    persons = persons.concat(newPerson);
    res.status(201).json(newPerson);
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
