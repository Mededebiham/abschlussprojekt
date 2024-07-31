const express = require('express');
const cors = require('cors');
const EventEmitter = require('events');

const app = express();
const port = 5000;
const emitter = new EventEmitter();

let lastCode = null;
let codeTimeout = null;
let isVerified = false; // Status, ob der Code bereits verifiziert wurde

app.use(cors());
app.use(express.json());

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    emitter.on('code', (code) => {
        res.write(`data: ${JSON.stringify({ code })}\n\n`);
    });
});

app.post('/send-code', (req, res) => {
    const { code } = req.body;
    lastCode = code;
    isVerified = false; // Setze den Verifizierungsstatus zurück

    if (codeTimeout) clearTimeout(codeTimeout);
    codeTimeout = setTimeout(() => {
        lastCode = null;
    }, 60000);

    emitter.emit('code', code);
    res.sendStatus(200);
});

app.post('/verify-code', (req, res) => {
    const { code } = req.body;
    if (isVerified) {
        res.json({ message: 'Code already used.' });
    } else if (code === lastCode) {
        lastCode = null;
        isVerified = true; // Setze den Status auf verifiziert
        clearTimeout(codeTimeout);
        res.json({ message: 'Code verified successfully!' });
    } else {
        res.json({ message: 'Invalid code. Please try again.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = { emitter };
