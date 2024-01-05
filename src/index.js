import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import weatherRouter from './weather-router.mjs';

const hostname = '127.0.0.1';
const port = 3000;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (like HTML, CSS, and JavaScript)
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve the weather page

app.use('/weather', weatherRouter);

// Start the server
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
