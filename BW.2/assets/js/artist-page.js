const addressBarContent = new URLSearchParams(location.search);
console.log(addressBarContent);
const artistId = addressBarContent.get("id");
console.log(artistId);

const apiUrl = "https://striveschool-api.herokuapp.com/api/deezer/artist/";
const url = apiUrl + artistId;

// funzione per recuperare i dati dell'artista tramite il suo id
const getArtistWithId = function () {
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nel recupero dei dettagli dell'artista");
      }
    })
    .then((artist) => {
      console.log(artist);
      if (artist) {
        artistHtml(artist); // Utilizza l'oggetto artist restituito dalla chiamata API
        getTracksArtist(); // Chiama getTracksArtist() qui dopo aver ottenuto l'artista
      } else {
        console.log("Nessun artista trovato");
      }
    })
    .catch((err) => {
      console.log("ERRORE", err);
    });
};

// funzione per recuperare le tracce dell'artista
const getTracksArtist = function () {
  fetch(url + "/top?limit=50")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nel recupero dei dettagli delle tracce dell'artista");
      }
    })
    .then((tracksArray) => {
      console.log(tracksArray);
      if (tracksArray) {
        const tracksData = tracksArray.data.map((track) => {
          return {
            preview: track.preview,
            title: track.title,
            artist: track.artist.name,
            cover: track.md5_image,
          };
        });
        localStorage.setItem("Tracce", JSON.stringify(tracksData));
        trackArtistHtml(tracksArray.data);
      } else {
        console.log("Nessuna traccia trovata");
      }
    })
    .catch((err) => {
      console.log("ERRORE", err);
    });
};

const artistHtml = function (artist) {
  const fotoArtista2 = document.getElementById("Profilo");
  fotoArtista2.setAttribute("src", artist.picture_xl);
  const fotoArtista1 = document.getElementById("sfondo-artista");
  fotoArtista1.setAttribute("src", artist.picture_xl);
  const artistsName = document.querySelectorAll(".artist-name");
  artistsName.forEach((artistName) => {
    artistName.innerHTML = artist.name;
  });

  const fans = document.getElementById("fans");
  fans.innerHTML = artist.nb_fan;
};

const trackArtistHtml = function (tracks) {
  const divPopolari = document.getElementById("div-popolari");
  for (let i = 0; i < 5; i++) {
    const rowPopolari = document.createElement("div");
    rowPopolari.classList.add("row", "align-items-center", "mt-3");
    rowPopolari.innerHTML = `
      <p class="col-1 mb-0 grid ms-4">${i + 1}</p>
      <img src="${tracks[i].album.cover_medium}" class="immaginetta img-fluid img-track-album"/>
      <img class="playButton" src="./assets/imgs/svg/play-fill.svg" alt="play button" data-index="${i}" style="cursor:pointer" />
      <p class="col-2 flex-grow-1 track-name">${tracks[i].title}</p>
      <p class="col-1 flex-grow-1 track-riprodution">${Math.floor(Math.random() * 1000000)}</p>
      <p class="col-1 flex-grow-1 track-duration">${Math.floor(tracks[i].duration / 60)}:${Math.floor(tracks[i].duration % 60)}</p>`;
    divPopolari.appendChild(rowPopolari);
  }

  const playButtons = document.querySelectorAll(".playButton");
  playButtons.forEach((button, index) => {
    button.setAttribute("data-index", index);
    button.addEventListener("click", function () {
      const artistName = document.querySelector(".artist");
      const title = document.querySelector(".title");
      const mediaImage = document.querySelector("#media-image");
      const audioElement = document.querySelector("audio");

      // Utilizza artistName.textContent invece di artist.name
      artistName.textContent = tracks[index].artist;
      title.textContent = tracks[index].title;
      mediaImage.setAttribute("src", tracks[index].album.cover_medium);
      audioElement.setAttribute("src", tracks[index].preview);

      // Esegui la funzione playTrack passando l'oggetto artist
      playTrack(tracks[index]);
    });
  });
};

// Funzione per eseguire la riproduzione della traccia
function playTrack(track) {
  if (track && track.album && track.album.cover_small) {
    // Ottieni l'URL della cover_small dell'album
    const coverUrl = track.album.cover_small;
    const audioPlayer = document.querySelector("audio");

    // Ottieni il nome dell'artista dal tag h1 con classe artist-name
    const artistName = document.querySelector(".artist-name").textContent.trim();

    // Assegna il nome dell'artista
    document.querySelector(".artist").textContent = artistName;

    // Assegna l'URL della preview all'attributo src dell'elemento audio
    audioPlayer.src = track.preview;

    // Imposta l'URL della cover_small dell'album nell'elemento img del media player
    const mediaPlayerImg = document.getElementById("media-image");
    mediaPlayerImg.setAttribute("src", coverUrl);
    mediaPlayerImg.style.display = "block";

    // Avvia la riproduzione dell'audio
    audioPlayer.play();


    // Log per verificare se tutto è a posto
    console.log("Preview della traccia caricata nel media player:", track.preview);
    console.log("Cover_small dell'album caricata nel media player:", coverUrl);
  } else {
    console.error("Errore: La traccia non è definita correttamente");
  }
  document.addEventListener("DOMContentLoaded", () => {
    const playPauseButton = document.getElementById("changeState");
    const audioElement = document.getElementById("audio-player");
    let isPlaying = false;

    if (!playPauseButton) {
      console.log("playPauseButton non trovato");
    }

    if (!audioElement) {
      console.log("audioElement non trovato");
    }

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

    function updatePlayPauseButton() {
      if (audioElement.paused) {
        playPauseButton.classList.remove("fa-pause");
        playPauseButton.classList.add("fa-play");
      } else {
        playPauseButton.classList.remove("fa-play");
        playPauseButton.classList.add("fa-pause");
      }
    }

    if (audioElement) {
      audioElement.addEventListener("play", updatePlayPauseButton);
      audioElement.addEventListener("pause", updatePlayPauseButton);
      audioElement.addEventListener("loadeddata", togglePlayPause);
    }

    if (playPauseButton) {
      playPauseButton.addEventListener("click", () => {
        if (audioElement.paused) {
          audioElement.play();
        } else {
          audioElement.pause();
        }
        updatePlayPauseButton();
      });
    }
  });

}


// Chiamata iniziale per ottenere l'artista e le sue tracce
getArtistWithId();
