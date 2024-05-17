const addressBarContent = new URLSearchParams(location.search);
console.log(addressBarContent);
const albumId = addressBarContent.get("id");
console.log(albumId);

const apiUrl = "https://striveschool-api.herokuapp.com/api/deezer/album/";
const url = apiUrl + albumId;

// Funzione per recuperare i dati dell'album tramite il suo id
const getAlbumWithId = function () {
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nel recupero dei dettagli dell'evento");
      }
    })
    .then((alb) => {
      console.log(alb);
      if (albumId) {
        renderAlbum(alb);
      } else {
        console.log("Nessun album trovato");
      }
    })
    .catch((err) => {
      console.log("ERRORE", err);
    });
};

// Funzione per generare l'HTML per visualizzare l'album con tutte le tracce
const renderAlbum = function (album) {
  const colBodyAlbumPage = document.getElementById("header-album-page");
  const realeaseYear = album.release_date.split("-");
  const imgAlbum = document.querySelector("#header-album-page > img");
  const albumCoverBig = album.cover_big;
  imgAlbum.setAttribute("src", albumCoverBig);
  const title = document.querySelector("#header-album-page #titlE");
  title.innerHTML = album.title;
  const imgArtist = document.querySelector("#description > img");
  imgArtist.setAttribute("src", album.artist.picture);
  const description = document.querySelector("#description > p");
  const descriptionMobile = document.querySelector("#description > p");
  description.innerHTML = `
    ${album.artist.name} <span class="">- ${realeaseYear[0]} - ${
    album.nb_tracks
  } brani, <span class="grey-light">${Math.floor(album.duration / 60)} min ${
    album.duration % 60
  } sec</span></span>
    `;
  //setColorFromImage(albumCoverBig, "bgDinamico");
  setColorGradient(albumCoverBig, "bgDinamico");
  //descriptionMobile.innerHTML = `<p>Album &middot; ${realeaseYear[0]}<p>`;
  // Genera tutte le tracce dell'album all'interno della sezione rowTrack

  const containerTracks = document.getElementById("containeR-trackS");
  // Crea un array di oggetti rappresentanti le tracce dell'album
  const tracksArray = [];
  for (let i = 0; i < album.tracks.data.length; i++) {
    const track = album.tracks.data[i];
    tracksArray.push({
      trackNumber: i + 1,
      title: track.title,
      artist: track.artist.name,
      duration: track.duration,
      preview: track.preview, // Aggiungiamo la proprietà preview
    });
  }
  // Salviamo l'array delle tracce in localStorage
  localStorage.setItem("albumTracks", JSON.stringify(tracksArray));

  // Ora possiamo anche creare l'HTML per ogni traccia e aggiungerlo al container

  tracksArray.forEach((track, i) => {
    let randomVisual = Math.floor(Math.random() * 900) + 100;
    let randomVisual2 = Math.floor(Math.random() * 900) + 100;
    const rowTrack = document.createElement("div");
    rowTrack.classList.add("row", "mt-3");
    rowTrack.innerHTML = `
    
        <div class="col-1 d-flex justify-content-end align-items-center">
            <p class="ms-0">${track.trackNumber}</p>
        </div>
        <div class="col-1 p-0 d-flex align-items-center justify-content-center">
          <i id="playBuTton" class="bi bi-play-fill fs-1" data-index="${i}" style="cursor:pointer"></i>
        </div>
        <div class="col-6 p-0">
          <h5 class="m-0 fw-bold">${track.title}</h5>
          <p class="m-0 grey-light">${track.artist}</p>
        </div>
        <div class="col-3 p-0 d-flex align-items-center">
          <p class="m-0">${randomVisual + "." + randomVisual2}</p>
        </div>
        <div class="col-1 p-0 d-flex align-items-center justify-content-center">
          <p class="m-0">
          ${Math.floor(track.duration / 60)}:${(track.duration % 60)
      .toString()
      .padStart(2, "0")}</p>
        </div>
    `;
    containerTracks.appendChild(rowTrack);
  });

  // Ascolta il click del bottone di riproduzione della traccia
  containerTracks.addEventListener("click", function (event) {
    let target = event.target;

    // If the clicked element is an icon within the button, use the parent button as the target
    if (target.tagName === "I" && target.parentElement.id === "playBuTton") {
      target = target.parentElement;
    }
    if (target.id === "randomAlbumSong") {
      // Make sure tracksArray is defined and contains at least one element
      if (tracksArray && tracksArray.length > 0) {
        // Get a random track index
        const randomTrackIndex = Math.floor(Math.random() * tracksArray.length);

        if (tracksArray[randomTrackIndex].preview) {
          // Get the URL of the preview of the selected track
          const previewUrl = tracksArray[randomTrackIndex].preview;
          const title = tracksArray[randomTrackIndex].title;
          const artist = tracksArray[randomTrackIndex].artist;

          // Play the track
          playTrack(album, title, artist, previewUrl);
        } else {
          console.error(
            "Error: The selected track does not contain a 'preview' property"
          );
        }
      } else {
        console.error(
          "Error: The tracksArray is not defined or does not contain any elements"
        );
      }
    }
    // Check if the target is a play button
    if (target.id === "playBuTton") {
      // Get the track index from its data-index attribute
      const trackIndex = target
        .closest(".row")
        .querySelector("#playBuTton")
        .getAttribute("data-index");

      // Make sure tracksArray is defined and contains at least one element
      if (
        tracksArray &&
        tracksArray.length > trackIndex &&
        tracksArray[trackIndex].preview
      ) {
        // Get the URL of the preview of the selected track
        const previewUrl = tracksArray[trackIndex].preview;
        const title = tracksArray[trackIndex].title;
        const artist = tracksArray[trackIndex].artist;
        // Play the track
        playTrack(album, title, artist, previewUrl);
      } else {
        console.error(
          "Error: The tracksArray element is not defined or does not contain an element with the 'preview' property"
        );
      }
    }
  });
};

// Funzione per eseguire la riproduzione della traccia
function playTrack(album, title, artist, previewUrl) {
  if (album && album.cover_small) {
    // Ottieni l'URL della cover_small dell'album
    const coverUrl = album.cover_small;
    document.querySelector(".title").textContent = title;
    document.querySelector(".artist").textContent = artist;
    // Seleziona l'elemento audio del media player
    const audioPlayer = document.querySelector("audio");

    // Assegna l'URL della preview all'attributo src dell'elemento audio
    audioPlayer.src = previewUrl;

    // Imposta l'URL della cover_small dell'album nell'elemento img del media player
    const mediaPlayerImg = document.getElementById("media-image");
    mediaPlayerImg.setAttribute("src", coverUrl);
    mediaPlayerImg.style.display = "block";
    // Avvia la riproduzione dell'audio
    audioPlayer.play();

    // Log per verificare se tutto è a posto
    console.log("Preview della traccia caricata nel media player:", previewUrl);

    console.log("Cover_small dell'album caricata nel media player:", coverUrl);
  } else {
    console.error(
      "Errore: L'elemento alb non è definito o non contiene una proprietà 'cover_small'"
    );
  }
}

// Funzione per impostare il gradiente del background in base all'immagine dell'album
function setColorGradient(albumCoverBig, bgDinamico) {
  const element = document.getElementById(bgDinamico);

  new Vibrant(albumCoverBig)
    .getPalette()
    .then((palette) => {
      // Preparazione della stringa del gradiente
      const gradientColors = [
        palette.Vibrant.getHex(),
        palette.DarkVibrant.getHex(),
        palette.LightVibrant.getHex(),
        palette.Muted.getHex(),
      ].join(", ");

      // Applica un gradiente lineare che include tutti i colori
      element.style.backgroundImage = `linear-gradient(to top, ${gradientColors})`;
    })
    .catch((err) => {
      console.error("Errore nell'estrazione dei colori: ", err);
    });
}

// Funzione per gestire la visualizzazione del campo di ricerca

// Richiama la funzione per ottenere e visualizzare l'album con l'id specificato
getAlbumWithId();
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
