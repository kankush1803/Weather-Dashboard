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
    function loader() {

      document.getElementById("locationName").innerHTML = "";
      document.getElementById("temperatureValue").innerHTML = "";
      document.getElementById("weatherType").innerHTML = "";

      const img1 = document.createElement("img");
      const img2 = document.createElement("img");
      const img3 = document.createElement("img");

      img1.id = "loader1";
      img2.id = "loader2";
      img3.id = "loader3";

      img1.src = "icons/loader.gif";
      img2.src = "icons/loader.gif";
      img3.src = "icons/loader.gif";

      const parentElement1 = document.getElementById("locationName");
      const parentElement2 = document.getElementById("temperatureValue");
      const parentElement3 = document.getElementById("weatherType");

      parentElement1.appendChild(img1);
      parentElement2.appendChild(img2);
      parentElement3.appendChild(img3);

      // document.getElementById("loader1").src = "icons/loader.gif";
      // document.getElementById("loader2").src = "icons/loader.gif";
      // document.getElementById("loader3").src = "icons/loader.gif";
    }

    


          document.getElementById("locationName").innerHTML = location;
          document.getElementById("temperatureValue").innerHTML = temperature + "<sup>o</sup>C";
          document.getElementById("weatherType").innerHTML = weatherType;
          document.getElementById("realFeelAdditionalValue").innerHTML = realFeel + "<sup>o</sup>C";
          document.getElementById("windSpeedAdditionalValue").innerHTML = windSpeed + " km/h";
          document.getElementById("windDirectionAdditionalValue").innerHTML = windDirection;
          document.getElementById("visibilityAdditionalValue").innerHTML = visibility + " km";
          document.getElementById("pressureAdditionalValue").innerHTML = pressure;
          document.getElementById("maxTemperatureAdditionalValue").innerHTML = maxTemperature + "<sup>o</sup>C";
          document.getElementById("minTemperatureAdditionalValue").innerHTML = minTemperature + "<sup>o</sup>C";
          document.getElementById("humidityAdditionalValue").innerHTML = humidity;
          document.getElementById("sunriseAdditionalValue").innerHTML = sunrise;
          document.getElementById("sunsetAdditionalValue").innerHTML = sunset;
        }
        else {
          document.getElementById("locationName").innerHTML = "City Not Found";
          document.getElementById("temperatureValue").innerHTML = "";
          document.getElementById("weatherType").innerHTML = "";
        }
      }

      getWeather();
    }
    else document.getElementById("locationName").innerHTML = "Enter a city name...";
  }
});


document.getElementById("resetBtn").addEventListener("click", function (event) {
  event.preventDefault(); // Prevents page reload if reset button is <a>

  // Clear input field (correct ID is "searchCity")
  document.getElementById("searchCity").value = "";

  // Reset main weather display
  document.getElementById("locationName").innerHTML = "";
  document.getElementById("temperatureValue").innerHTML = "";
  document.getElementById("weatherType").innerHTML = "";

  // Reset additional weather details
  document.getElementById("realFeelAdditionalValue").innerHTML = "";
  document.getElementById("windSpeedAdditionalValue").innerHTML = "";
  document.getElementById("windDirectionAdditionalValue").innerHTML = "";
  document.getElementById("visibilityAdditionalValue").innerHTML = "";
  document.getElementById("pressureAdditionalValue").innerHTML = "";
  document.getElementById("maxTemperatureAdditionalValue").innerHTML = "";
  document.getElementById("minTemperatureAdditionalValue").innerHTML = "";
  document.getElementById("humidityAdditionalValue").innerHTML = "";
  document.getElementById("sunriseAdditionalValue").innerHTML = "";
  document.getElementById("sunsetAdditionalValue").innerHTML = "";

  // Clear forecast cards
  document.getElementById("forecast-container").innerHTML = "";

  // Optionally show default message
  document.getElementById("locationName").innerHTML = "Enter a city to get weather details";
});
