
const http = require('http');

let notes = [
    { id: "1", content: "HTML is easy", important: true },
    { id: "2", content: "Browser can execute only JavaScript", important: false },
    { id: "3", content: "GET and POST are the most important methods of HTTP protocol", important: true }
];

const app = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(notes, null, 2));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT)
console.log(`Server is running on port ${PORT}\nURL: http://localhost:${PORT}/`);