const videoPlayer = document.querySelector(".player__video");
const playBtn = document.querySelector(`button[title='Toggle Play']`);
const progressBar = document.querySelector(".progress__filled");
const progressCont = document.querySelector(".progress");
const audioSlider = document.querySelector(`input[name='volume']`);

const speed = document.querySelector(`input[name='playbackRate']`);
const skip = document.querySelectorAll("[data-skip]"); // for selecting multiple btns with data-skip attri
const fullScreen = document.querySelector(".full_screen");

function updateProgress() {
  const currentTime = videoPlayer.currentTime;
  const duration = videoPlayer.duration;
  const progress = (currentTime / duration) * 100;
  progressBar.style.flexBasis = progress + "%";
}

function updateVideo(e) {
  // offsetX gives the x axis pos with respect to container elements node
  const clickX = e.offsetX;
  // clienwidth --> innerWidth w/o padding || offsetWidth -> including all || innerWidth is only available on window ele
  const contWidth = progressCont.clientWidth;
  //   clickX/contWidth gets the percentage (ex : 50% * duration = get time 60 sec ka 50% = 30sec)
  const seekTime = (clickX / contWidth) * videoPlayer.duration;
  videoPlayer.currentTime = seekTime;
}

// Event listeners
playBtn.addEventListener("click", function () {
  //since videoPlayer is same in both meths optimal way

  const method = videoPlayer.paused ? "play" : "pause";
  videoPlayer[method]();
  // video ele properties
  //   if (videoPlayer.paused) {
  //     videoPlayer.play();
  //   } else videoPlayer.pause();
});

// For changing the toggle button instead of attaching it to the meth we can listen for videoplay event cuz people use plugins as well to pause video
function updateButton() {
  const icon = this.paused ? "►" : "❚ ❚";
  playBtn.textContent = icon;
}

videoPlayer.addEventListener("play", updateButton);

videoPlayer.addEventListener("pause", updateButton);

// fires a timeupdate event each time
videoPlayer.addEventListener("timeupdate", updateProgress);

// updating the video on click
progressCont.addEventListener("click", updateVideo);

// audio Update
audioSlider.addEventListener("input", function () {
  videoPlayer.volume = audioSlider.value;
});

//Speed update (speed and audio can be done in one single refer final version)
speed.addEventListener("input", function () {
  videoPlayer.playbackRate = speed.value;
});

skip.forEach((btn) =>
  btn.addEventListener("click", function () {
    videoPlayer.currentTime =
      Number(videoPlayer.currentTime) + Number(this.dataset.skip);
    // instead of e.target.dataset use this cuz this refers to that ele on which its called upon
  })
);

// scrubbing feature
let isMouseDown = false; // *** Trick : use flag variable to know mouse is down or not
progressCont.addEventListener(
  "mousemove",
  (e) => isMouseDown && updateVideo(e)
);
progressCont.addEventListener("mousedown", () => (isMouseDown = true));
progressCont.addEventListener("mouseup", () => (isMouseDown = false));

fullScreen.addEventListener("click", () => {
  videoPlayer.requestFullscreen(); // fullscreen api (check cuz not all browsers have this functionality)
});

// Key takeaways :
// use this over e.target
// use [] if same name meths (dry)
// flag var trick for knowing isMouseDown
