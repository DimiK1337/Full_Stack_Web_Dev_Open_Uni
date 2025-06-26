require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();


let notes = [
    { id: "1", content: "HTML is easy", important: true },
    { id: "2", content: "Browser can execute only JavaScript", important: false },
    { id: "3", content: "GET and POST are the most important methods of HTTP protocol", important: true }
];

app.use(express.json()); // Middleware to parse JSON bodies

const morgan = require('morgan');
morgan.token("body", (req) => {
    return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.use(express.static('dist'))

/* MongoDB */
const Note = require('./models/note'); // Import Note model 

/* ENDPOINT ROUTES */

// GET 
app.get('/api/notes', (req, res, next) => {
    Note.find({})
        .then(notes => res.json(notes))
        .catch(error => next(error)); // Pass error to the error handler
});

app.get('/api/notes/:id', (req, res, next) => {
    const id = req.params.id;
    Note.findById(id)
        .then(note => {
            if (note) {
                res.json(note);
            }
            else {
                res.status(404).end();
            }
        })
        .catch(error => next(error)); // Pass error to the error handler
});

// POST
app.post('/api/notes', (req, res, next) => {
    const body = req.body;
    if (!body.content) {
        return res.status(400).json({ error: 'Content is missing' });
    }
    const note = new Note({
        content: body.content,
        important: body.important || false
    });

    note.save()
        .then(savedNote => {
            res.status(201).json(savedNote);
        })
        .catch(error => next(error)); // Pass error to the error handler
});

// PUT
app.put('/api/notes/:id', (req, res, next) => {
    const id = req.params.id;
    const { content, important } = req.body;

    Note.findById(id)
        .then(note => {
            if (!note) {
                return res.status(404).end();
            }
            note.content = content;
            note.important = important;

            return note.save()
                .then(updatedNote => {
                    res.json(updatedNote);
                });
        })
        .catch(error => next(error)); // Pass error to the error handler
})

// DELETE
app.delete('/api/notes/:id', (req, res, next) => {
    const id = req.params.id;
    /* notes = notes.filter(note => note.id !== id);
    res.status(204).end(); */
    Note.findByIdAndDelete(id)
        .then(() => {
            res.status(204).end();
        })
        .catch(error => next(error)); // Pass error to the error handler
});

// MIDDLEWARE (Post routes)

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'Unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'Malformed ID' });
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }

    next(error); // Pass the error to the default express error handler middleware
};

app.use(errorHandler); // ERROR HANDLING MUST BE THE LAST MIDDLEWARE

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\nURL: http://localhost:${PORT}/`);
    console.log(`API endpoint: http://localhost:${PORT}/api/notes`);
});