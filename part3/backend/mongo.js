
require('dotenv').config();
const mongoose = require('mongoose');

const url = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.xlabd.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

console.log(`Connecting to MongoDB at ${url}`);

mongoose.set('strictQuery', false);

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema);

/* const note = new Note({
    content: 'HTML is easy',
    important: true,
})

note.save().then(
    result => {
        console.log('note saved!', result);
        mongoose.connection.close();
    }
) */

/* let notes = [
    { id: "2", content: "Browser can execute only JavaScript", important: false },
    { id: "3", content: "GET and POST are the most important methods of HTTP protocol", important: true }
];

notes.forEach(note => {
    const noteObject = new Note(note);
    noteObject.save()
        .then(result => {
            console.log('note saved!', result);
        })
        .catch(error => {
            console.error('Error saving note:', error);
        });
mongoose.connection.close();
}); */

Note.find({ important: true }).then(result => {
    console.log('notes:');
    result.forEach(note => {
        console.log(note);
    });
    mongoose.connection.close();
})

