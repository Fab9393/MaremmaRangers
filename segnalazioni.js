const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs'); // Importa il modulo fs
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let segnalazioni = [];

// Funzione per caricare le segnalazioni dal file JSON all'avvio del server
function caricaSegnalazioni() {
    fs.readFile('segnalazioni.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Errore nella lettura del file:', err);
            return;
        }
        // Se il file non è vuoto, analizza i dati e caricali nell'array segnalazioni
        if (data) {
            segnalazioni = JSON.parse(data);
        }
    });
}

// Funzione per salvare le segnalazioni nel file JSON
function salvaSegnalazioni() {
    fs.writeFile('segnalazioni.json', JSON.stringify(segnalazioni, null, 2), (err) => {
        if (err) {
            console.error('Errore nella scrittura nel file:', err);
        }
    });
}

// Endpoint per ottenere le segnalazioni
app.get('/segnalazioni', (req, res) => {
    res.json(segnalazioni);
});

// Endpoint per aggiungere una segnalazione
app.post('/segnalazioni', (req, res) => {
    const nuovaSegnalazione = req.body;
    segnalazioni.push(nuovaSegnalazione); // Aggiungi la nuova segnalazione all'array
    salvaSegnalazioni(); // Salva le segnalazioni aggiornate nel file
    res.status(201).json(nuovaSegnalazione); // Rispondi con la nuova segnalazione
});

// Carica le segnalazioni all'avvio del server
caricaSegnalazioni();

app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});
