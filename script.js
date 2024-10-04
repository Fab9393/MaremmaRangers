// Funzione per mostrare una segnalazione nella tabella
// Funzione per mostrare una segnalazione nella tabella
function mostraSegnalazione(segnalazione) {
    const tabellaBody = document.querySelector('#tabella-segnalazioni tbody');
    const row = document.createElement('tr');

    const cellNome = document.createElement('td');
    const cellCognome = document.createElement('td');
    const cellDataNascita = document.createElement('td');
    const cellFoto = document.createElement('td');
    const cellSegnalazione = document.createElement('td');

    cellNome.textContent = segnalazione.nome;
    cellCognome.textContent = segnalazione.cognome;
    cellDataNascita.textContent = segnalazione.dataNascita;

    // Crea un elemento immagine se la foto esiste
    if (segnalazione.foto) {
        const img = document.createElement('img');
        img.src = segnalazione.foto;
        img.alt = 'Foto documento';
        img.style.width = '50px'; // Dimensione immagine
        img.style.cursor = 'pointer'; // Cambia il cursore per indicare che è cliccabile

        // Aggiungi evento di clic per ingrandire l'immagine
        img.addEventListener('click', function() {
            mostraImmagineIng(randita(img.src));
        });

        cellFoto.appendChild(img);
    } else {
        cellFoto.textContent = 'Nessuna foto disponibile';
    }

    cellSegnalazione.textContent = segnalazione.segnalazione;

    row.appendChild(cellNome);
    row.appendChild(cellCognome);
    row.appendChild(cellDataNascita);
    row.appendChild(cellFoto);
    row.appendChild(cellSegnalazione);
    
    tabellaBody.appendChild(row);
}

// Funzione per mostrare l'immagine ingrandita
function mostraImmagineIng(randita(url) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';

    const img = document.createElement('img');
    img.src = url;
    img.style.maxWidth = '90%'; // Limita la larghezza dell'immagine
    img.style.maxHeight = '90%'; // Limita l'altezza dell'immagine
    img.style.border = '2px solid white'; // Opzionale: aggiungi un bordo
    img.style.borderRadius = '8px'; // Opzionale: arrotonda gli angoli

    overlay.appendChild(img);
    document.body.appendChild(overlay);

    // Chiudi l'immagine ingrandita quando si clicca su di essa
    overlay.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
}


// Funzione per caricare le segnalazioni dal backend
async function caricaSegnalazioni() {
    try {
        const response = await fetch('http://localhost:3000/segnalazioni'); // Cambia l'URL in base alla tua configurazione
        const segnalazioni = await response.json();
        segnalazioni.forEach(mostraSegnalazione);
    } catch (error) {
        console.error("Errore nel caricamento delle segnalazioni:", error);
    }
}

// Funzione per aggiungere una segnalazione
async function aggiungiSegnalazione(data) {
    try {
        const response = await fetch('http://localhost:3000/segnalazioni', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const segnalazione = await response.json();
        mostraSegnalazione(segnalazione);
    } catch (error) {
        console.error("Errore aggiungendo segnalazione: ", error);
    }
}

// Carica le segnalazioni quando la pagina è pronta
document.addEventListener('DOMContentLoaded', caricaSegnalazioni);

// Aggiungi il codice per inviare una nuova segnalazione
document.getElementById('segnalazioneForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Ferma l'invio del modulo

    // Ottieni i valori dal modulo
    const nome = document.getElementById('nome').value;
    const cognome = document.getElementById('cognome').value;
    const dataNascita = document.getElementById('dataNascita').value;
    const fotoDocumento = document.getElementById('fotoDocumento').files[0];
    const segnalazione = document.getElementById('segnalazione').value;

    // Crea un URL temporaneo per visualizzare l'immagine
    const fotoURL = URL.createObjectURL(fotoDocumento);

    // Aggiungi la nuova segnalazione
    const nuovaSegnalazione = {
        nome,
        cognome,
        dataNascita,
        foto: fotoURL,
        segnalazione
    };

    aggiungiSegnalazione(nuovaSegnalazione);

    // Resetta il modulo
    this.reset();
});
