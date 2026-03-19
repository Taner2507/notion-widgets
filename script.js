const prompts = [
  "Pick one meaningful task and finish it before opening anything new.",
  "Make the next 25 minutes distraction-free.",
  "Ship the smallest complete version, not the biggest idea.",
  "Clear one stubborn task you have been postponing.",
  "Protect your energy by doing the hard part first."
];

const clockElement = document.getElementById("clock");
const periodElement = document.getElementById("period");
const dateTextElement = document.getElementById("dateText");
const todayLabelElement = document.getElementById("todayLabel");
const focusTextElement = document.getElementById("focusText");
const shuffleButton = document.getElementById("shuffleButton");

function padTime(value) {
  return String(value).padStart(2, "0");
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const isAfternoon = hours >= 12;
  const displayHour = hours % 12 || 12;

  clockElement.textContent = `${padTime(displayHour)}:${padTime(minutes)}`;
  periodElement.textContent = isAfternoon ? "PM" : "AM";

  dateTextElement.textContent = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  todayLabelElement.textContent = now.toLocaleDateString(undefined, {
    weekday: "long"
  });
}

function shufflePrompt() {
  const currentPrompt = focusTextElement.textContent;
  const availablePrompts = prompts.filter((prompt) => prompt !== currentPrompt);
  const nextPrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
  focusTextElement.textContent = nextPrompt;
}

shuffleButton.addEventListener("click", shufflePrompt);

updateClock();
setInterval(updateClock, 1000);