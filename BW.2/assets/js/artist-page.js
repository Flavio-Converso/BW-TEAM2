const addressBarContent = new URLSearchParams(location.search);
console.log(addressBarContent);
const artistId = addressBarContent.get("id");
console.log(artistId);

const apiUrl = "https://striveschool-api.herokuapp.com/api/deezer/artist/";
const url = apiUrl + artistId;

// funzione per recuperare i dati dell'album tramite il suo id
const getArtistWithId = function () {
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nel recupero dei dettagli dell'evento");
      }
    })
    .then((artistArr) => {
      console.log(artistArr);
      if (artistArr) {
        artistHtml(artistArr);
      } else {
        console.log("nessun artista trovato");
      }
    })
    .catch((err) => {
      console.log("ERRORE", err);
    });
};

// funzione per recuperare le tracce di quell'artista
const getTracksArtist = function () {
  fetch(url + "/top?limit=50")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nel recupero dei dettagli dell'evento");
      }
    })
    .then((tracksArray) => {
      console.log(tracksArray);
      if (tracksArray) {
        trackArtistHtml(tracksArray.data);
      } else {
        console.log("nessuna traccia trovata");
      }
    })
    .catch((err) => {
      console.log("ERRORE", err);
    });
};
const artistHtml = function (artist) {
  const fotoArtista1 = document.getElementById("sfondo-artista");
  fotoArtista1.setAttribute("src", artist.picture_xl);
  const artistsName = document.querySelectorAll(".artist-name");
  artistsName.forEach((artistName) => {
    artistName.innerHTML = artist.name;
  });

  const fans = document.getElementById("fans");
  fans.innerHTML = artist.nb_fan;
  /*
  const fotoArtista = document.getElementsByClassName("bg-artist")[0];
  fotoArtista.style.backgroundImage = `url(${artist.picture_xl})`;*/
};
const trackArtistHtml = function (tracks) {
  const divPopolari = document.getElementById("div-popolari");
  for (let i = 0; i < 5; i++) {
    const rowPopolari = document.createElement("div");
    rowPopolari.classList.add("row", "align-items-center", "mt-3");
    rowPopolari.innerHTML = `
        <p class="col-1 mb-0 grid ms-4">1</p>
        <img src="${
          tracks[i].album.cover_medium
        }" class="immaginetta img-fluid img-track-album"/>
        <p class="col-2 flex-grow-1 track-name">${tracks[i].title}</p>
        <p class="col-1 flex-grow-1 track-riprodution">${Math.floor(
          Math.random() * 1000000
        )}</p>
        <p class="col-1 flex-grow-1 track-duration">${Math.floor(
          tracks[i].duration / 60
        )}:${Math.floor(tracks[i].duration % 60)}</p>`;
    divPopolari.appendChild(rowPopolari);
  }
};
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

getArtistWithId();
getTracksArtist();
