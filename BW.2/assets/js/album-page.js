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
    ${album.artist.name} <span class="">- ${realeaseYear[0]} - ${album.nb_tracks
    } brani, <span class="grey-light">${Math.floor(album.duration / 60)} min ${album.duration % 60
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
      preview: track.preview // Aggiungiamo la proprietà preview
    });
  }
  // Salviamo l'array delle tracce in localStorage
  localStorage.setItem('albumTracks', JSON.stringify(tracksArray));

  // Ora possiamo anche creare l'HTML per ogni traccia e aggiungerlo al container
  tracksArray.forEach((track, i) => {
    const rowTrack = document.createElement("div");
    rowTrack.classList.add("row", "mt-3");
    rowTrack.innerHTML = `
        <div class="col-1 ms-3 d-flex justify-content-end align-items-center">
            <p class="ms-0">${track.trackNumber}</p>
        </div>
        <div class="col-1 p-0 d-flex align-items-center justify-content-center">
          <button class="bg-transparent border-0 play-button " type="button" data-index="${i}"><i class="bi bi-play-fill fs-1"></i></button>
        </div>
        <div class="col-6 p-0">
          <h5 class="m-0 fw-bold">${track.title}</h5>
          <p class="m-0 grey-light">${track.artist}</p>
        </div>
        <div class="col-3 p-0 d-flex align-items-center">
          <p class="m-0">123</p>
        </div>
        <div class="col-1 p-0 d-flex align-items-center justify-content-center">
          <p class="m-0">${(track.duration / 60).toFixed(2)}</p>
        </div>
    `;
    containerTracks.appendChild(rowTrack);
  });

  // Ascolta il click del bottone di riproduzione della traccia
  containerTracks.addEventListener("click", function (event) {
    // Verifica se l'elemento cliccato è un bottone di riproduzione
    if (event.target.matches(".play-button")) {
      // Ottieni l'indice della traccia dal suo attributo data-index
      const trackIndex = event.target.closest(".row").querySelector(".play-button").getAttribute("data-index");

      // Assicurati che tracksArray sia definito e che contenga almeno un elemento
      if (tracksArray && tracksArray.length > trackIndex && tracksArray[trackIndex].preview) {
        // Ottieni l'URL della preview della traccia selezionata
        const previewUrl = tracksArray[trackIndex].preview;
        const title = tracksArray[trackIndex].title;
        const artist = tracksArray[trackIndex].artist;

        // Esegui la riproduzione della traccia
        playTrack(album, title, artist, previewUrl);
      } else {
        console.error("Errore: L'elemento tracksArray non è definito o non contiene un elemento con la proprietà 'preview'");
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
    console.error("Errore: L'elemento alb non è definito o non contiene una proprietà 'cover_small'");
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
// Richiama la funzione per ottenere e visualizzare l'album con l'id specificato
getAlbumWithId();
