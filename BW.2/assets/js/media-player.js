document.addEventListener("DOMContentLoaded", function () {
    // Seleziona gli elementi HTML necessari
    const playPauseButton = document.querySelector(".play-pause");
    const progressBar = document.querySelector(".progress");
    const progressReference = document.querySelector(".progress-reference");
    const currentTimeDisplay = document.querySelector(".current-time");
    const volumeBar = document.querySelector(".volume-bar .progress");
    const volumeIcon = document.querySelector(".volume-bar i");
    const volumeReference = document.querySelector(".volume-reference");
    const randomButton = document.querySelector(".fa-random");
    const heartButton = document.querySelector(".far.fa-heart");
    const rewindButton = document.querySelector("#rewindBtn");
    const audioElement = document.querySelector("audio");

    // Variabili di stato per il player audio
    let isPlaying = false;
    let isMuted = false;
    let isLiked = false;
    let isRandom = false;
    progressBar.style.width = "0%";

    // Funzione per gestire il click sulla progress bar
    function setProgress(e) {
        const progressReferenceWidth = progressReference.clientWidth;
        const clickX = e.clientX - progressReference.getBoundingClientRect().left;
        const relativeClickX = Math.min(1, Math.max(0, clickX / progressReferenceWidth));

        // Aggiorna la posizione della progress bar
        progressBar.style.width = `${relativeClickX * 100}%`;

        // Aggiorna il tempo di riproduzione dell'audio
        const duration = audioElement.duration;
        audioElement.currentTime = duration * relativeClickX;
    }

    // Aggiungi un listener per l'evento mousedown sulla barra di riferimento
    progressReference.addEventListener("mousedown", startDrag);

    // Funzione per aggiornare la posizione della progress bar durante il trascinamento
    function updateProgressBarDuringDrag(e) {
        if (isDragging) {
            setProgress(e);
        }
    }

    // Definisce una funzione per gestire l'inizio del trascinamento
    function startDrag(e) {
        isDragging = true;
        updateProgressBarDuringDrag(e);
        // Aggiungi listener per mousemove e mouseup sul documento
        document.addEventListener("mousemove", updateProgressBarDuringDrag);
        document.addEventListener("mouseup", stopDrag);
    }

    // Definisce una funzione per gestire la fine del trascinamento
    function stopDrag() {
        isDragging = false;
        // Rimuovi i listener per mousemove e mouseup sul documento
        document.removeEventListener("mousemove", updateProgressBarDuringDrag);
        document.removeEventListener("mouseup", stopDrag);
    }

    audioElement.addEventListener("timeupdate", updateProgressBar);

    // Funzione per aggiornare la progress bar in base alla riproduzione dell'audio
    function updateProgressBar() {
        const currentTime = audioElement.currentTime;
        const duration = audioElement.duration;
        const progress = (currentTime / duration) * 100;

        // Aggiorna la larghezza della progress bar
        progressBar.style.width = `${progress}%`;

        // Aggiorna il tempo corrente di riproduzione
        currentTimeDisplay.textContent = formatTime(currentTime);
    }

    // Aggiungi gli eventi ai pulsanti e alle barre
    playPauseButton.addEventListener("click", togglePlayPause);
    volumeIcon.addEventListener("click", toggleMute);
    randomButton.addEventListener("click", toggleRandom);
    heartButton.addEventListener("click", toggleHeart);
    rewindButton.addEventListener("click", rewind);
    volumeReference.addEventListener("click", setVolume);

    // Funzione per gestire il play e il pausa
    function togglePlayPause() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            audioElement.play();
            playPauseButton.classList.remove("fa-play");
            playPauseButton.classList.add("fa-pause");
        } else {
            audioElement.pause();
            playPauseButton.classList.remove("fa-pause");
            playPauseButton.classList.add("fa-play");
        }
    }

    // Funzione per gestire il mute
    function toggleMute() {
        isMuted = !isMuted;
        if (isMuted) {
            // Memorizza temporaneamente il volume prima di impostarlo a zero
            localStorage.setItem("previousVolume", audioElement.volume);

            audioElement.volume = 0;
            volumeIcon.classList.remove("fa-volume-down");
            volumeIcon.classList.add("fa-volume-mute", "active");
            volumeBar.style.width = "0%"; // Imposta la barra del volume a zero
        } else {
            // Ripristina il volume al valore memorizzato
            const previousVolume = localStorage.getItem("previousVolume");
            audioElement.volume = previousVolume ? parseFloat(previousVolume) : 1;

            volumeIcon.classList.remove("fa-volume-mute", "active");
            volumeIcon.classList.add("fa-volume-down");

            // Aggiorna la larghezza della barra del volume
            volumeBar.style.width = `${audioElement.volume * 100}%`;
        }
    }

    // Funzione per gestire la riproduzione casuale
    function toggleRandom() {
        isRandom = !isRandom;
        if (isRandom) {
            randomButton.classList.add("active");
            // Logica per riproduzione casuale
        } else {
            randomButton.classList.remove("active");
            // Logica per riproduzione normale
        }
    }

    // Funzione per gestire il like
    function toggleHeart() {
        isLiked = !isLiked;
        if (isLiked) {
            heartButton.classList.remove("far");
            heartButton.classList.add("fas", "active");
            // Logica per like
        } else {
            heartButton.classList.remove("fas", "active");
            heartButton.classList.add("far");
            // Logica per rimuovere il like
        }
    }

    // Funzione per riprodurre (da implementare)
    function rewind() {
        // Logica per riprodurre (se vogliamo implementarla)
        isRandom = !isRandom;
        if (isRandom) {
            rewindButton.classList.add("active");
            // Logica per riproduzione casuale
        } else {
            rewindButton.classList.remove("active");
            // Logica per riproduzione normale
        }
    }

    // Funzione per impostare il volume
    function setVolume(e) {
        const volumeReferenceWidth = volumeReference.clientWidth;
        const clickX = e.clientX - volumeReference.getBoundingClientRect().left;
        const relativeClickX = Math.min(1, Math.max(0, clickX / volumeReferenceWidth));

        // Aggiorna la posizione della barra del volume
        volumeBar.style.width = `${relativeClickX * 100}%`;

        // Aggiorna il volume dell'audio
        audioElement.volume = relativeClickX;
    }

    // Aggiorna il tempo corrente e totale ogni secondo
    setInterval(updateTimeDisplays, 1000);

    function updateTimeDisplays() {
        const currentTimeDisplay = document.querySelector(".current-time");
        const totalTimeDisplay = document.querySelector(".total-time");
        const currentTime = audioElement.currentTime;
        const totalTime = audioElement.duration;
        const formattedCurrentTime = formatTime(currentTime);
        const formattedTotalTime = formatTime(totalTime);
        currentTimeDisplay.textContent = formattedCurrentTime;
        totalTimeDisplay.textContent = formattedTotalTime;
    }

    // Funzione per formattare il tempo in mm:ss
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }


    // Definisci una funzione per gestire l'inizio del trascinamento
    function startDrag(e) {
        isDragging = true;
        updateProgressBarDuringDrag(e);
        // Aggiungi listener per mousemove e mouseup sul documento
        document.addEventListener("mousemove", updateProgressBarDuringDrag);
        document.addEventListener("mouseup", stopDrag);
    }

    // Funzione per aggiornare la posizione della progress bar durante il trascinamento
    function updateProgressBarDuringDrag(e) {
        if (isDragging) {
            const progressReferenceWidth = progressReference.clientWidth;
            const clickX = e.clientX - progressReference.getBoundingClientRect().left;
            const relativeClickX = Math.min(1, Math.max(0, clickX / progressReferenceWidth));

            // Aggiorna la posizione della progress bar
            progressBar.style.width = `${relativeClickX * 100}%`;

            // Aggiorna il tempo di riproduzione dell'audio
            const duration = audioElement.duration;
            audioElement.currentTime = duration * relativeClickX;
        }
    }
    function updateTimeDisplays() {
        const currentTimeDisplay = document.querySelector(".current-time");
        const totalTimeDisplay = document.querySelector(".total-time");

        if (audioElement && !isNaN(audioElement.duration)) {
            const currentTime = audioElement.currentTime;
            const totalTime = audioElement.duration;
            const formattedCurrentTime = formatTime(currentTime);
            const formattedTotalTime = formatTime(totalTime);

            currentTimeDisplay.textContent = formattedCurrentTime;
            totalTimeDisplay.textContent = formattedTotalTime;
        } else {
            // Se non c'è un elemento audio o se la durata non è un numero, mostra "--.--"
            currentTimeDisplay.textContent = "--:--";
            totalTimeDisplay.textContent = "--:--";
        }
    }
});




