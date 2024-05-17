// Funzione che stora il contenuto in LocalStorage
function store(dati) {
  const albums = [];
  dati.data.forEach((element) => {
    const albumTitle = element.album.title;
    const artistName = element.artist.name;
    const albumCover = element.album.cover_medium;
    const albumId = element.album.id;
    const pictureArtist = element.artist.picture_medium;
    const artistId = element.artist.id;
    let previewUrl = element.album.preview;

    // Cerca l'URL dell'anteprima audio in altre proprietà se non è presente direttamente sotto element.preview
    if (element.preview) {
      previewUrl = element.preview;
    } else if (element.preview_medium) {
      previewUrl = element.preview_medium;
    } else if (element.preview_high) {
      previewUrl = element.preview_high;
    }

    const album = {
      albumTitle: albumTitle,
      artistName: artistName,
      albumCover: albumCover,
      albumId: albumId,
      pictureArtist: pictureArtist,
      artistId: artistId,
      preview: previewUrl,
    };
    albums.push(album);
  });
  console.log(albums);
  localStorage.setItem("searchResult", JSON.stringify(albums));
}

// Funzione che fa la ricerca con la fetch
function search(searchInput, callback) {
  fetch(
    "https://striveschool-api.herokuapp.com/api/deezer/search?q=" + searchInput
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nel recupero dei dettagli dell'evento");
      }
    })
    .then((searchResult) => {
      console.log(searchResult);
      store(searchResult);
      callback(); // Call the callback function to reload the page
    })
    .catch((err) => {
      console.log("ERRORE", err);
    });
}

// Aggiungi un listener per l'evento keydown sull'input
document.getElementById("search").addEventListener("keydown", function (event) {
  // Verifica se il tasto premuto è Enter
  if (event.key === "Enter") {
    console.log(this.value);
    search(this.value, () => window.location.reload());
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const storedData = localStorage.getItem("searchResult");
  const albums = JSON.parse(storedData);
  if (albums && albums.length > 0) {
    const firstAlbum = albums[0];
    let titoloAlbum = document.getElementById("titoloAlbum");
    let artistaAlbums = document.getElementsByClassName("artistaAlbum");
    const fotofirstAlbum = document.getElementById("first-album");

    titoloAlbum.textContent = firstAlbum.albumTitle;
    Array.from(artistaAlbums).forEach(
      (artista) => (artista.textContent = firstAlbum.artistName)
    );
    fotofirstAlbum.innerHTML = `
      <a href="./album-page.html?id=${firstAlbum.albumId}">
        <img id="fotoAlbum" src="${firstAlbum.albumCover}" alt="immagine album" class="img-fluid py-3"/>
      </a>`;

    //escludere elementi ripetuti nell'array
    for (let i = 0; i < albums.length; i++) {
      for (let n = i + 1; n < albums.length; n++) {
        if (albums[i].albumTitle === albums[n].albumTitle) {
          albums.splice(n, 1);
          n--;
        }
      }
    }
    localStorage.setItem("searchResult", JSON.stringify(albums));
    console.log(albums);

    for (let i = 0; i < albums.length; i++) {
      let card = document.createElement("div");
      card.classList.add("col-12", "col-sm-6", "col-lg-4", "col-xl-3", "mt-3");
      card.innerHTML = `
    <a href="./album-page.html?id=${albums[i].albumId}" class="text-decoration-none w-100">
    <div class="card mb-3 grey-horizontal-card position-relative h-100 ">
        <div class="row ">
            <div class="col-lg-12 col-xl d-flex align-items-center">
                <img src="${albums[i].albumCover}" class="personal-imG rounded-start"
                    alt="immagine album" /></a>
            </div>
            <div>
              <div class="col d-flex align-items-center">
                  <div class="card-body py-3 px-3 ">
                      <h5 id="titoloHorizontalCard"
                          class="card-title d-flex justify-content-center text-white">
                          ${albums[i].albumTitle}
                      </h5>
                  </div>
              </div>
            </div>
        </div>
        <div class="play-badge">
          <img class="playButton " src="./assets/imgs/svg/play-fill.svg" alt="play button" data-index="${i}" style="cursor:pointer" />
        </div>
    </div>
`;
      document.getElementById("printHorizontalCards").appendChild(card);
    }
    const rowArtistsList = document.getElementById("row-artists-list");
    const selectedArtists = new Set(); // Set per tracciare gli artisti selezionati

    for (let j = 0; j < 4; j++) {
      if (selectedArtists.size >= albums.length) break; // Esci dal ciclo se non ci sono più artisti unici disponibili

      let randomIndex;
      let selectedAlbum;
      let attempts = 0; // Add a counter for attempts to find a unique artist

      // Trova un album con un artista non ancora selezionato
      do {
        randomIndex = Math.floor(Math.random() * albums.length);
        selectedAlbum = albums[randomIndex];
        attempts++; // Increment the attempts counter

        // If we've attempted to find a unique artist more times than there are albums, break the loop
        if (attempts > albums.length) break;
      } while (
        selectedArtists.has(selectedAlbum.artistName) &&
        selectedArtists.size < albums.length
      );

      // Aggiungi l'artista selezionato al set
      selectedArtists.add(selectedAlbum.artistName);
      console.log(selectedAlbum);

      const colCardArtist = document.createElement("div");
      colCardArtist.classList.add("col", "mb-3");
      colCardArtist.innerHTML = `
      <a href="./artist-page.html?id=${selectedAlbum.artistId}" class="text-decoration-none">
        <div class="card grey-vertical-card p-2">
          <div class="position-relative">
            <img
              src="${selectedAlbum.pictureArtist}"
              class="card-img-top"
              alt="Foto artista"
            />
            <div class="play-badge2">
              <img
                class="playButton2"
                src="./assets/imgs/svg/three-dots.svg"
                alt="play button"
              />
            </div>
          </div>
          <div class="card-body">
            <h5 class="card-title text-white text-center ">${selectedAlbum.artistName}</h5>
          </div>
        </div>
      </a>`;

      rowArtistsList.appendChild(colCardArtist);
    }
  }
});
function toggleSearchInput() {
  let container = document.querySelector(".search-container");
  let cercaText = document.getElementById("cerca").innerText;
  console.log(cercaText);
  if (cercaText === "Cerca") {
    document.getElementById("cerca").innerText = " ";
  } else {
    document.getElementById("cerca").innerText = "Cerca";
  }
  container.classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", function () {
  const storedData = localStorage.getItem("searchResult");
  const albums = JSON.parse(storedData);
  if (albums && albums.length > 0) {
    const firstAlbumCover = albums[0].albumCover;
  }
});
// MEDIA PLAYER
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
    const relativeClickX = Math.min(
      1,
      Math.max(0, clickX / progressReferenceWidth)
    );

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
    const relativeClickX = Math.min(
      1,
      Math.max(0, clickX / volumeReferenceWidth)
    );

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

  // Funzione per formattare il tempo in mm:ss
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  // Definisci una funzione per rimuovere l'elemento 'divider' quando la larghezza supera i 768px
  function removeDividerOnResize() {
    if (window.innerWidth >= 768) {
      var elementsToRemove = document.getElementsByClassName("divider");
      for (var i = 0; i < elementsToRemove.length; i++) {
        var element = elementsToRemove[i];
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }
    }
  }

  // Esegui la funzione all'avvio e ogni volta che la finestra viene ridimensionata
  removeDividerOnResize(); // Esegui subito al caricamento della pagina
  window.addEventListener("resize", removeDividerOnResize); // Esegui ogni volta che la finestra viene ridimensionata

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
      const relativeClickX = Math.min(
        1,
        Math.max(0, clickX / progressReferenceWidth)
      );

      // Aggiorna la posizione della progress bar
      progressBar.style.width = `${relativeClickX * 100}%`;

      // Aggiorna il tempo di riproduzione dell'audio
      const duration = audioElement.duration;
      audioElement.currentTime = duration * relativeClickX;
    }
  }
});

// STAMPA NEL MEDIA PLAYER
document.addEventListener("DOMContentLoaded", function () {
  // Seleziona il bottone playButtonMain
  const playButtonMain = document.getElementById("playButtonMain");

  // Aggiungi un listener per il click sul bottone playButtonMain
  playButtonMain.addEventListener("click", handlePlayButtonClick);
  const mediaPlayerImage = document.getElementById("media-image");
  const divider = document.getElementById("divisore");
  // Funzione per gestire il click su playButtonMain
  function handlePlayButtonClick() {
    // Seleziona gli elementi HTML necessari per visualizzare i dettagli dell'album nel media player
    const albumImage = document.getElementById("media-image");
    const albumTitle = document.querySelector("p.title");
    const artistName = document.querySelector("p.artist");

    // Ottieni i dati dell'album dal localStorage
    const storedData = localStorage.getItem("searchResult");
    const album = JSON.parse(storedData);

    // Assicurati che ci siano album e che ne esista almeno uno
    if (album && album.length > 0) {
      // Ottieni il primo album (puoi modificare questa logica per ottenere l'album desiderato)
      const firstAlbum = album[0];

      // Imposta i valori degli elementi HTML con i dati dell'album
      albumImage.src = firstAlbum.albumCover; // Imposta l'immagine dell'album
      albumTitle.textContent = firstAlbum.albumTitle; // Imposta il titolo dell'album
      artistName.textContent = firstAlbum.artistName; // Imposta il nome dell'artista
      const audioPlayer = document.getElementById("audio-player");
      if (firstAlbum.preview) {
        mediaPlayerImage.style.display = "block";
        const playPauseButton = document.querySelector(".play-pause");
        playPauseButton.classList.remove("fa-play");
        playPauseButton.classList.add("fa-pause");
        audioPlayer.src = firstAlbum.preview;
        audioPlayer.play(); // Avvia la riproduzione automaticamente
      } else {
        console.error("L'album non ha un'anteprima audio.");
      }
    }
  }
  const playButtons = document.querySelectorAll(".playButton");

  // Aggiungi un listener per il click su ogni bottone play-button-card
  playButtons.forEach(function (playButton) {
    playButton.addEventListener("click", handlePlayButtonCardClick);
  });

  // Funzione per gestire il click su ogni bottone play-button-card
  function handlePlayButtonCardClick(event) {
    // Ottieni l'indice della card dalla proprietà data-index del bottone cliccato
    let index = parseInt(event.currentTarget.getAttribute("data-index"), 10);
    console.log("Clicked index:", index);

    // Ottieni i dati dell'album dal localStorage
    const storedData = localStorage.getItem("searchResult");
    const albums = JSON.parse(storedData);
    // Assicurati che ci siano album e che l'indice sia valido
    if (albums && albums.length > index && index >= 0) {
      // Ottieni i dati dell'album relativo all'indice cliccato
      const album = albums[index];
      // Trasferisci i valori nella sezione del media player

      if (!mediaPlayerImage) {
        console.error("Elemento mediaPlayerImage non trovato.");
        return;
      }
      const mediaPlayerTitle = document.querySelector("p.title");
      const mediaPlayerArtist = document.querySelector("p.artist");
      console.log("Albums:", albums);
      console.log("Albums length:", albums.length);
      console.log(
        "Index valid:",
        albums && albums.length > index && index >= 0
      );
      const audioPlayer = document.getElementById("audio-player");
      mediaPlayerImage.src = album.albumCover;
      if (!album.albumCover) {
        console.error("album.albumCover non è valido:", album.albumCover);
        return;
      }
      mediaPlayerTitle.textContent = album.albumTitle;
      mediaPlayerArtist.textContent = album.artistName;
      if (album.preview) {
        mediaPlayerImage.style.display = "block";
        const playPauseButton = document.querySelector(".play-pause");
        playPauseButton.classList.remove("fa-play");
        playPauseButton.classList.add("fa-pause");
        audioPlayer.src = album.preview;
        audioPlayer.play(); // Avvia la riproduzione automaticamente
      } else {
        console.error("L'album non ha un'anteprima audio.");
      }
    }
  }
});
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

const containerFirstAlbum = document.getElementById("container-first-album");
const mostraAnnunciBtn = document.getElementById("mostra-annunci");
/* FUNZIONE PER NASCONDERE GLI ANNUNCI */
const nascondiAnnunci = function () {
  console.log(containerFirstAlbum);
  containerFirstAlbum.classList.add("d-none");
  containerFirstAlbum.classList.remove("d-block");
  mostraAnnunciBtn.classList.add("d-block");
  mostraAnnunciBtn.classList.remove("d-none");
};

const mostraAnnunci = function () {
  containerFirstAlbum.classList.add("d-block");
  containerFirstAlbum.classList.remove("d-none");
  mostraAnnunciBtn.classList.add("d-none");
};

const mostraSaluto = function () {
  const saluto = document.getElementById("saluto");
  const date = new Date();
  const ora = date.getHours();

  if (ora >= 6 && ora < 13) {
    console.log("Buongiorno");
    saluto.innerHTML = "Buongiorno";
  } else if (ora >= 13 && ora < 18) {
    console.log("Buon pomeriggio");
    saluto.innerHTML = "Buon pomeriggio";
  } else if (ora >= 18 && ora < 23) {
    console.log("Buonasera");
    saluto.innerHTML = "Buonasera";
  } else if (ora >= 23 && ora < 6) {
    console.log("Buonanotte");
    saluto.innerHTML = "Buonanotte";
  }
  console.log(ora);
};

mostraSaluto();
