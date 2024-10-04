// Funzione per mostrare l'immagine ingrandita
function mostraImmagineIng(event) {
    const urlImmagine = event.target.src; // Ottieni l'URL dell'immagine cliccata
    const imgIng = document.createElement('img'); // Crea un nuovo elemento immagine
    imgIng.src = urlImmagine; // Imposta l'URL dell'immagine
    imgIng.id = 'imgIng'; // Aggiungi un ID per riferirsi all'immagine ingrandita
    imgIng.style.position = 'fixed'; // Fissa la posizione
    imgIng.style.top = '50%'; // Centra verticalmente
    imgIng.style.left = '50%'; // Centra orizzontalmente
    imgIng.style.transform = 'translate(-50%, -50%)'; // Centra l'immagine
    imgIng.style.maxWidth = '90%'; // Limita la larghezza al 90%
    imgIng.style.maxHeight = '90%'; // Limita l'altezza al 90%
    imgIng.style.zIndex = '1000'; // Porta l'immagine ingrandita in primo piano

    // Aggiungi un evento di click per chiudere l'immagine ingrandita
    imgIng.addEventListener('click', function() {
        document.body.removeChild(imgIng); // Rimuovi l'immagine ingrandita dal DOM
    });

    document.body.appendChild(imgIng); // Aggiungi l'immagine ingrandita al body
}



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
        img.addEventListener('click', function(event) {
            mostraImmagineIng(event); // Passa l'evento corrente
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

    // Controlla se è stata selezionata un'immagine
    if (fotoDocumento) {
        const reader = new FileReader(); // Crea un FileReader per leggere il file

        // Quando il file è caricato, crea la segnalazione
        reader.onloadend = () => {
            const base64String = reader.result; // Ottieni la stringa Base64 dell'immagine

            // Crea un oggetto per la nuova segnalazione
            const nuovaSegnalazione = {
                nome,
                cognome,
                dataNascita,
                foto: base64String, // Salva l'immagine come stringa Base64
                segnalazione
            };

            // Invia la segnalazione al server
            fetch('http://localhost:3000/segnalazioni', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuovaSegnalazione)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Errore nell\'aggiunta della segnalazione');
                }
                return response.json(); // Converti la risposta in JSON
            })
            .then(segnalazione => {
                mostraSegnalazione(segnalazione); // Mostra la segnalazione nella tabella
            })
            .catch(error => {
                console.error("Errore aggiungendo segnalazione: ", error);
            });
        };

        // Leggi il file come URL di dati (Base64)
        reader.readAsDataURL(fotoDocumento);
    } else {
        // Se non è stata selezionata alcuna immagine, crea la segnalazione senza foto
        const nuovaSegnalazione = {
            nome,
            cognome,
            dataNascita,
            foto: null, // Nessuna foto
            segnalazione
        };

        // Invia la segnalazione al server
        fetch('http://localhost:3000/segnalazioni', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuovaSegnalazione)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nell\'aggiunta della segnalazione');
            }
            return response.json(); // Converti la risposta in JSON
        })
        .then(segnalazione => {
            mostraSegnalazione(segnalazione); // Mostra la segnalazione nella tabella
        })
        .catch(error => {
            console.error("Errore aggiungendo segnalazione: ", error);
        });
    }

    // Resetta il modulo
    this.reset();
});
