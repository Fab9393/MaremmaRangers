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

// Aggiungi il codice per inviare una nuova segnalazione, se necessario
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
