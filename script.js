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

// Funzione per caricare le segnalazioni dal backend
async function caricaSegnalazioni() {
    try {
        const response = await fetch('http://localhost:3000/segnalazioni');
        const segnalazioni = await response.json();
        // Salva le segnalazioni in una variabile globale per poterle filtrare
        window.segnalazioniGlobali = segnalazioni;
        // Mostra tutte le segnalazioni
        segnalazioni.forEach(mostraSegnalazione);
    } catch (error) {
        console.error("Errore nel caricamento delle segnalazioni:", error);
    }
}

// Funzione per filtrare le segnalazioni
function filtraSegnalazioni() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const tabellaBody = document.querySelector('#tabella-segnalazioni tbody');
    
    // Pulisci la tabella
    tabellaBody.innerHTML = '';

    // Filtra le segnalazioni
    const segnalazioniFiltrate = window.segnalazioniGlobali.filter(segnalazione => {
        return segnalazione.nome.toLowerCase().includes(searchTerm) ||
               segnalazione.cognome.toLowerCase().includes(searchTerm);
    });

    // Mostra le segnalazioni filtrate
    segnalazioniFiltrate.forEach(mostraSegnalazione);
}

// Funzione per ingrandire l'immagine
function mostraImmagineIng(event) {
    const img = event.target; // L'immagine cliccata
    const imgIng = document.createElement('div'); // Creiamo un div per l'ingrandimento
    imgIng.classList.add('img-ingrandita'); // Aggiungiamo una classe per lo stile
    imgIng.innerHTML = `<span class="close" onclick="this.parentElement.style.display='none'">&times;</span>
                        <img src="${img.src}" alt="Immagine Ingrandita">`; // Immagine ingrandita
    document.body.appendChild(imgIng); // Aggiungiamo il div al body
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

// Funzione per resettare la tabella
function resettaFiltri() {
    // Pulisci la barra di ricerca
    document.getElementById('searchBar').value = '';
    lista.innerHTML = ''; // Rimuove tutte le segnalazioni esistenti
    // Ricarica tutte le segnalazioni
    caricaSegnalazioni();
}

document.getElementById('resetButton').addEventListener('click', resettaFiltri);

// Carica le segnalazioni quando la pagina è pronta
document.addEventListener('DOMContentLoaded', () => {
    caricaSegnalazioni();
    document.getElementById('searchBar').addEventListener('input', filtraSegnalazioni);
});

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
