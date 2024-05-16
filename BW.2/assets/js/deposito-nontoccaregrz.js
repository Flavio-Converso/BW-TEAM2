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

/*
                <div class="progress-controller pt-3">
                  <div class="control-buttons pt-2">
                      <i class="fas fa-random" id="randomBtn"></i>
                      <i class="fas fa-step-backward" id="backwardBtn"></i>
                      <button id="playPauseBtn" class="bg-transparent border-0 "><i
                              class="play-pause fas fa-play" id="changeState"></i></button>
                      <i class="fas fa-step-forward" id="forwardBtn"></i>
                      <i class="fas fa-undo-alt" id="rewindBtn"></i>
                  </div>
                  <div class="progress-container pb-4 flex-grow-1   ">
                      <span class="current-time me-2 "></span>
                      <div class="progress-bar bg-secondary ">
                          <div class="progress"></div>
                          <div class="progress-reference"></div>
                          <audio src="" id="audio-player"></audio>*/