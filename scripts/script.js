var cityInput = document.getElementById("searchCity");

var backgroundsList = [
  "day1.jpg",
  "day2.jpg",
  "day3.jpg",
  "day4.jpg",
  "day5.jpg",
  // "night1.jpg",
  // "night2.jpg",
  // "night3.jpg",
  // "night4.jpg",
  // "night5.jpg",
  "cloudy1.jpg",
  "cloudy2.jpg",
  "cloudy3.jpg",
  "cloudy4.jpg",
  "cloudy5.jpg",
  // "rainy1.jpg",
  // "rainy2.jpg",
  // "rainy3.jpg",
  // "rainy4.jpg",
  // "rainy5.jpg",
];

var randomBackground = backgroundsList[Math.floor(Math.random() * backgroundsList.length)];

document.body.style.background = "linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)) , url('media/" + randomBackground + "')";

cityInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    loader();
  }
});