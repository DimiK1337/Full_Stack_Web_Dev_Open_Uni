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

app.get('/api/notes', (req, res) => {
    //res.json(notes);
    Note.find({})
        .then(notes => {
            res.json(notes)
        })
        .catch(error => {
            console.error('Error fetching notes:', error);
            res.status(500).send({ error: 'Failed to fetch notes' });
        });
});

app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    Note.findById(id)
        .then(note => {
            if (note) {
                res.json(note);
            }
            else {
                res.status(404).send({ error: 'Note not found' });
            }
        })
        .catch(error => {
            console.error('Error fetching note:', error);
            res.status(500).send({ error: 'Note not found' });
        });
});

// POST
app.post('/api/notes', (req, res) => {
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
        .catch(error => {
            console.error('Error saving note:', error);
            res.status(500).send({ error: 'Failed to save note' });
        });
    
});

// DELETE
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    /* notes = notes.filter(note => note.id !== id);
    res.status(204).end(); */
    Note.findByIdAndDelete(id)
        .then(() => {
            res.status(204).end();
        })
        .catch(error => {
            console.error('Error deleting note:', error);
            res.status(500).send({ error: 'Failed to delete note' });
        });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\nURL: http://localhost:${PORT}/`);
    console.log(`API endpoint: http://localhost:${PORT}/api/notes`);
});