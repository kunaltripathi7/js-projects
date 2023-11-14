const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  // how to get a video stream
  // navigator is an obj on window
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false }) // returns a promise
    .then(function (stream) {
      video.srcObject = stream; // src is blob(binary large obj)  -> raw data piped in from the webcam to video ele
      video.play();
    })
    .catch((error) => console.error(error));
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // raw pixels data (rgba) for each pixel vals
    let pixels = ctx.getImageData(0, 0, width, height);
    // changing the pixels
    pixels = rgbSplit(pixels);
    // putting it back to canvas
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // sound
  snap.currentTime = 0; // resets time after second click
  snap.play();

  // take data out of canvas
  const data = canvas.toDataURL("image/jpeg"); // cuz video/other ele accept video/data in url form || the big encoding is like text representation of the image
  const link = document.createElement("a"); // creates a new anchor ele
  link.href = data;
  link.setAttribute("download", "xyz"); // target of the link will be downloaded
  link.innerHTML = `<img src="${data}" alt="cam picture" />`;
  strip.insertBefore(link, strip.firstChild); // link is a node not html doesn't works with insertHtml
}

function redEffect(pixels) {
  // can't use map special array
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  // shifting the pixels
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll(".rgb input").forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    // if the pixel is in the range remove it.
    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener("canplay", paintToCanvas); // emits when video is ready to play

// Takeaways :
//green screen works like replacing one color with some other img/video typically green
