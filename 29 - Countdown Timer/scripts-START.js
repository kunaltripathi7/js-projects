const timeLeft = document.querySelector(".display__time-left");
const endTime = document.querySelector(".display__end-time");
const timers = document.querySelectorAll(".timer__button");
const customForm = document.querySelector('[name="customForm"]'); // its not the input element its the form element on which you can call the value property to get the value
let intervalId;

// should have split into more functions
function setTimer(time) {
  let minsLeft = Math.floor(time / 60);
  time %= 60;
  let seconds = time === 0 ? 60 : time;
  const currTime = new Date();
  const endHours = currTime.getHours() + (Math.floor(minsLeft / 60) % 12);
  const endMinutes = (currTime.getMinutes() + (minsLeft % 60))
    .toString()
    .padStart(2, "0");
  endTime.textContent = `Be Back at ${endHours}:${endMinutes}`;
  if (intervalId) clearInterval(intervalId);
  timeLeft.textContent = `${minsLeft}:${seconds}`;
  intervalId = setInterval(() => {
    if (seconds <= 0) {
      if (minsLeft === 0) clearInterval(intervalId);
      minsLeft--;
      seconds = 59;
      return;
    }
    timeLeft.textContent = `${minsLeft}:${--seconds}`;
  }, 1000);
}

timers.forEach((btn) =>
  btn.addEventListener("click", function () {
    setTimer(this.dataset.time);
  })
);

customForm.addEventListener("submit", function (e) {
  e.preventDefault();
  setTimer(parseInt(customForm.minutes.value) * 60);
});
// notes in final script
