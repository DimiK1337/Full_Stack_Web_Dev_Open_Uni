const express = require('express');
const app = express();

const cors = require('cors');
let notes = [
    { id: "1", content: "HTML is easy", important: true },
    { id: "2", content: "Browser can execute only JavaScript", important: false },
    { id: "3", content: "GET and POST are the most important methods of HTTP protocol", important: true }
];

app.use(cors()); // Enable CORS for all routes

app.use(express.json()); // Middleware to parse JSON bodies

const morgan = require('morgan');
morgan.token("body", (req) => {
    return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.use(express.static('dist'))


// GET 
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const note = notes.find(note => note.id === id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).send({ error: `Note with id ${id} not found` });
    }
});

// POST

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(note => parseInt(note.id))) : 0;
    return String(maxId + 1);
};

app.post('/api/notes', (req, res) => {
    const body = req.body;
    if (!body.content) {
        return res.status(400).json({ error: 'Content is missing' });
    }
    const note = {
        id: generateId(),
        content: body.content,
        important: body.important || false
    };
    notes = notes.concat(note);
    console.log('Received note:', note);
    res.json(note);
});

// DELETE
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    notes = notes.filter(note => note.id !== id);
    res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\nURL: http://localhost:${PORT}/`);
    console.log(`API endpoint: http://localhost:${PORT}/api/notes`);
});