const addressBarContent = new URLSearchParams(location.search);
console.log(addressBarContent);
const artistId = addressBarContent.get("id");
console.log(artistId);

const apiUrl = "https://striveschool-api.herokuapp.com/api/deezer/artist/";
const url = apiUrl + artistId;

// Funzione per recuperare i dati dell'artista tramite il suo id
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

// Funzione per recuperare le tracce dell'artista
const getTracksArtist = function () {
  fetch(url + "/top?limit=50")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(
          "Errore nel recupero dei dettagli delle tracce dell'artista"
        );
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
            cover: track.album.cover_small,
            album: track.album, // Include the album object
          };
        });
        localStorage.setItem("Tracce", JSON.stringify(tracksData));
        trackArtistHtml(tracksArray.data);
        initializePlayButton(); // Inizializza il pulsante di riproduzione qui dopo aver salvato le tracce
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
  for (let i = 0; i < 8; i++) {
    let randomVisual = Math.floor(Math.random() * 900) + 100;
    let randomVisual2 = Math.floor(Math.random() * 900) + 100;
    const rowPopolari = document.createElement("div");
    rowPopolari.classList.add("row", "align-items-center", "mt-3");
    rowPopolari.innerHTML = `
      <p class="col-1 mb-0 grid ms-4">${i + 1}</p>
      <img src="${
        tracks[i].album.cover_medium
      }" class="immaginetta img-fluid img-track-album"/>
      <i class="bi bi-play-fill fs-1 playBuTton" data-index="${i}" style="cursor:pointer"></i>
      <p class="col-2 flex-grow-1 track-name">${tracks[i].title}</p>
      <p class="col-1 flex-grow-1 track-riprodution">${
        randomVisual + "." + randomVisual2
      }</p>
      <p class="col-1 flex-grow-1 track-duration">${Math.floor(
        tracks[i].duration / 60
      )}:${Math.floor(tracks[i].duration % 60)
      .toString()
      .padStart(2, "0")}</p>`;
    divPopolari.appendChild(rowPopolari);
  }

  const playButtons = document.querySelectorAll(".playBuTton");
  playButtons.forEach((button, index) => {
    button.setAttribute("data-index", index);
    button.addEventListener("click", function () {
      const artistName = document.querySelector(".artist");
      const title = document.querySelector(".title");
      const mediaImage = document.querySelector("#media-image");
      const audioElement = document.querySelector("audio");

      // Utilizza artistName.textContent invece di artist.name
      artistName.textContent = tracks[index].artist.name;
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
    const artistName = document
      .querySelector(".artist-name")
      .textContent.trim();

    // Assegna il nome dell'artista
    document.querySelector(".artist").textContent = artistName;

    // Assegna l'URL della preview all'attributo src dell'elemento audio
    audioPlayer.src = track.preview;

    // Imposta l'URL della cover_small dell'album nell'elemento img del media player
    const mediaPlayerImg = document.getElementById("media-image");
    mediaPlayerImg.setAttribute("src", coverUrl);
    mediaPlayerImg.style.display = "block";

    // Assegna il nome dell'artista alla classe artist
    const artistElement = document.querySelector(".artist");
    artistElement.textContent = artistName;

    // Avvia la riproduzione dell'audio
    audioPlayer.play();

    // Log per verificare se tutto è a posto
    console.log(
      "Preview della traccia caricata nel media player:",
      track.preview
    );
    console.log("Cover_small dell'album caricata nel media player:", coverUrl);
  } else {
    console.error("Errore: La traccia non è definita correttamente");
  }
}

function initializePlayButton() {
  const playButton = document.querySelector(".play-badge10");
  const audioElement = document.querySelector("audio");
  const tracks = JSON.parse(localStorage.getItem("Tracce"));

  if (!tracks || tracks.length === 0) {
    console.error("Errore: Non sono state trovate tracce");
    return;
  }

  if (playButton) {
    playButton.addEventListener("click", function () {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      const track = tracks[randomIndex];

      if (!track || !track.title || !track.preview) {
        console.error("Errore: La traccia non è definita correttamente");
        return;
      }

      console.log(`Bottone cliccato. Traccia selezionata: ${track.title}`);

      // Update the audio source and play
      audioElement.setAttribute("src", track.preview);
      audioElement.play();

      // Update the track title
      const trackTitleElement = document.querySelector("p.title");
      if (trackTitleElement) {
        trackTitleElement.textContent = track.title;
      }

      // Optional: Update another element with the artist name (not h1)
      const artistElement = document.querySelector(".artist");
      if (artistElement) {
        artistElement.textContent = track.artist;
      }

      // Update the cover image
      const mediaPlayerImg = document.getElementById("media-image");
      if (mediaPlayerImg) {
        if (track.album && track.album.cover_small) {
          const coverUrl = track.album.cover_small;
          mediaPlayerImg.setAttribute("src", coverUrl);
          mediaPlayerImg.style.display = "block";
        } else {
          console.error(
            "Errore: Informazioni sulla copertina non disponibili per questa traccia"
          );
        }
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  getArtistWithId(); // Ensure this call eventually leads to initializePlayButton being called
});

const audioPlayer = document.getElementById("audio-player");
const playButton = document.getElementById("changeState");

if (audioPlayer && playButton) {
  audioPlayer.addEventListener("play", function () {
    playButton.classList.remove("fa-play");
    playButton.classList.add("fa-pause");
  });

  audioPlayer.addEventListener("pause", function () {
    playButton.classList.remove("fa-pause");
    playButton.classList.add("fa-play");
  });
}
