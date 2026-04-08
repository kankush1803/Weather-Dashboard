



//API

const API_KEY = 'd9e96341ba7cad233889194049247724';
const BASE    = 'https://api.openweathermap.org/data/2.5';

//DOM References
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locateBtn = document.getElementById('locateBtn');
const loaderOverlay = document.getElementById('loaderOverlay');
const errorBanner = document.getElementById('errorBanner');
const errorText = document.getElementById('errorText');
const errorClose = document.getElementById('errorClose');
const dashboard = document.getElementById('dashboard');
const clock = document.getElementById('clock');

// clock
function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

// Show / Hide helpers
function showLoader()  { loaderOverlay.hidden = false; dashboard.hidden = true; }
function hideLoader()  { loaderOverlay.hidden = true; }
function showDashboard() { dashboard.hidden = false; }
 
function showError(msg) {
  errorText.textContent = msg;
  errorBanner.hidden = false;
}
function hideError() { errorBanner.hidden = true; }
 
errorClose.addEventListener('click', hideError);

// Weather icon mapper (emoji based on OWM icon codes)
function getWeatherEmoji(iconCode) {
  const map = {
    '01d': '☀️',  '01n': '🌙',
    '02d': '🌤️',  '02n': '🌤️',
    '03d': '☁️',  '03n': '☁️',
    '04d': '☁️',  '04n': '☁️',
    '09d': '🌧️',  '09n': '🌧️',
    '10d': '🌦️',  '10n': '🌦️',
    '11d': '⛈️',  '11n': '⛈️',
    '13d': '❄️',  '13n': '❄️',
    '50d': '🌫️',  '50n': '🌫️',
  };
  return map[iconCode] || '🌡️';
}
 

// Theme changer based on temperature
function applyTheme(tempC) {
  const body = document.body;
  body.classList.remove('theme-cold', 'theme-moderate', 'theme-hot');
  if      (tempC < 15)  body.classList.add('theme-cold');
  else if (tempC < 28)  body.classList.add('theme-moderate');
  else                  body.classList.add('theme-hot');
}

// "What to Wear" advisory logic
function buildWearAdvice(temp, humidity, windSpeed, rainChance, condition) {
  const tips = [];
 
  // Rain / umbrella
  if (rainChance > 20 || condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle')) {
    tips.push({ emoji: '☂️', text: 'Bring an umbrella! Rain is likely today.' });
  }
  // Thunderstorm
  if (condition.toLowerCase().includes('thunderstorm')) {
    tips.push({ emoji: '⛈️', text: 'Thunderstorm alert — avoid open areas & stay indoors if possible.' });
  }
  // Snow
  if (condition.toLowerCase().includes('snow')) {
    tips.push({ emoji: '🧥', text: 'Snowfall expected — wear a heavy coat, boots & gloves.' });
  }
  // Cold
  if (temp < 5) {
    tips.push({ emoji: '🧣', text: 'Freezing cold! Layer up with thermal wear, scarf & hat.' });
  } else if (temp < 15) {
    tips.push({ emoji: '🧥', text: 'It\'s chilly — wear a jacket or sweater.' });
  }
  // Moderate
  if (temp >= 15 && temp <= 25) {
    tips.push({ emoji: '👕', text: 'Pleasant weather — light layers will keep you comfortable.' });
  }
  // Hot
  if (temp > 30) {
    tips.push({ emoji: '🌞', text: 'It\'s hot outside! Stay hydrated & wear light, breathable clothes.' });
  }
  if (temp > 38) {
    tips.push({ emoji: '🚨', text: 'Extreme heat alert — limit outdoor exposure, drink water frequently.' });
  }
  // Humid
  if (humidity > 75) {
    tips.push({ emoji: '💧', text: 'High humidity — choose moisture-wicking fabrics if going out.' });
  }
  // Windy
  if (windSpeed > 40) {
    tips.push({ emoji: '💨', text: 'Strong winds expected — secure loose items & be cautious outdoors.' });
  }
  // Foggy
  if (condition.toLowerCase().includes('fog') || condition.toLowerCase().includes('mist')) {
    tips.push({ emoji: '🌫️', text: 'Low visibility — drive slowly and use fog lights if commuting.' });
  }
  // Default pleasant
  if (tips.length === 0) {
    tips.push({ emoji: '✅', text: 'Great day outside — enjoy the weather!' });
  }
 
  return tips;
}

// Render advisory tips
function renderWearAdvice(tips) {
  const list = document.getElementById('wearList');
  list.innerHTML = '';
  tips.forEach((tip, i) => {
    const item = document.createElement('div');
    item.className = 'wear-item';
    item.style.animationDelay = `${i * 0.08}s`;
    item.innerHTML = `<span class="wear-emoji">${tip.emoji}</span><span>${tip.text}</span>`;
    list.appendChild(item);
  });
}

// Render 5-day forecast
function renderForecast(forecastList) {
  const grid = document.getElementById('forecastGrid');
  grid.innerHTML = '';
 
  // OWM returns 3-hour slots; pick one per day at ~12:00 UTC
  const dailyMap = {};
  forecastList.forEach(item => {
    const date   = new Date(item.dt * 1000);
    const dayKey = date.toDateString();
    const hour   = date.getUTCHours();
    // prefer noon slot, otherwise first seen
    if (!dailyMap[dayKey] || Math.abs(hour - 12) < Math.abs(new Date(dailyMap[dayKey].dt * 1000).getUTCHours() - 12)) {
      dailyMap[dayKey] = item;
    }
  });

  // up to 5 days
  const days  = Object.keys(dailyMap).slice(0, 5);
  const today = new Date().toDateString();
 
  days.forEach((dayKey, idx) => {
    const item     = dailyMap[dayKey];
    const date     = new Date(item.dt * 1000);
    const label    = dayKey === today ? 'TODAY'
                     : date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const emoji    = getWeatherEmoji(item.weather[0].icon);
    const desc     = item.weather[0].main;
    const high     = Math.round(item.main.temp_max);
    const low      = Math.round(item.main.temp_min);
    const rain     = Math.round((item.pop || 0) * 100);
 
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.style.animationDelay = `${idx * 0.1}s`;
    card.innerHTML = `
      <div class="forecast-day">${label}</div>
      <div class="forecast-icon">${emoji}</div>
      <div class="forecast-desc">${desc}</div>
      <div class="forecast-temps">
        <span class="forecast-high">${high}°</span>
        <span class="forecast-low">${low}°</span>
      </div>
      <div class="forecast-rain">💧 ${rain}%</div>
    `;
    grid.appendChild(card);
  });
}

 // Format Unix timestamp to time string
function unixToTime(unix, offset = 0) {
  const date = new Date((unix + offset) * 1000);
  return date.toUTCString().slice(17, 22); // "HH:MM"
}

 // Animate sun position on the arc
function animateSun(sunriseUnix, sunsetUnix) {
  const now     = Math.floor(Date.now() / 1000);
  const total   = sunsetUnix - sunriseUnix;
  const elapsed = now - sunriseUnix;
  let pct       = Math.max(0, Math.min(1, elapsed / total));
  // position along an arc; 0% = left, 100% = right, 50% = top
  const sunBall = document.getElementById('sunBall');
  sunBall.style.left = `${pct * 100}%`;
  sunBall.style.top  = `${Math.sin(pct * Math.PI) * -28}px`;
}

 // Main render function
function renderWeather(current, forecastData) {
  const temp        = Math.round(current.main.temp);
  const feelsLike   = Math.round(current.main.feels_like);
  const humidity    = current.main.humidity;
  const windKmh     = Math.round(current.wind.speed * 3.6);
  const visKm       = (current.visibility / 1000).toFixed(1);
  const pressure    = current.main.pressure;
  const condition   = current.weather[0].main;
  const desc        = current.weather[0].description;
  const iconCode    = current.weather[0].icon;
  const cityName    = current.name;
  const country     = current.sys.country;
  const tzOffset    = current.timezone; // in seconds
 
  // Estimate rain chance from forecast
  const nextSlot    = forecastData.list[0];
  const rainChance  = Math.round((nextSlot?.pop || 0) * 100);
 
  // UV index — not in free current weather, display N/A
  document.getElementById('uvIndex').textContent = 'N/A';
 
  // Populate DOM
  document.getElementById('cityName').textContent    = cityName;
  document.getElementById('cityMeta').textContent    = `${country} • LAT ${current.coord.lat.toFixed(2)} LON ${current.coord.lon.toFixed(2)}`;
  document.getElementById('weatherDesc').textContent = desc.toUpperCase();
  document.getElementById('weatherIcon').textContent = getWeatherEmoji(iconCode);
  document.getElementById('tempValue').textContent   = temp;
  document.getElementById('humidity').textContent    = `${humidity}%`;
  document.getElementById('wind').textContent        = `${windKmh} km/h`;
  document.getElementById('feelsLike').textContent   = `${feelsLike}°C`;
  document.getElementById('visibility').textContent  = `${visKm} km`;
  document.getElementById('pressure').textContent    = `${pressure} hPa`;
 
  // Sun times
  const srTime = unixToTime(current.sys.sunrise, tzOffset);
  const ssTime = unixToTime(current.sys.sunset,  tzOffset);
  document.getElementById('sunrise').textContent = srTime;
  document.getElementById('sunset').textContent  = ssTime;
  animateSun(current.sys.sunrise, current.sys.sunset);
 
  // Apply theme
  applyTheme(temp);
 
  // Advisory
  const tips = buildWearAdvice(temp, humidity, windKmh, rainChance, condition);
  renderWearAdvice(tips);
 
  // Forecast
  renderForecast(forecastData.list);
 
  // Show dashboard
  showDashboard();
}

/* ── API Calls ── */

/**
 * Fetch current weather and 5-day forecast for a city name.
 * @param {string} city
 */
// The function has a parameter jo name de  city 
// string me hoga 


async function fetchByCity(city) {
  hideError();
  showLoader();
 
  try {
    // Current weather
    const currRes = await fetch(
      `${BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    if (!currRes.ok) {
      if (currRes.status === 404) throw new Error(`City "${city}" not found. Please check the spelling.`);
      if (currRes.status === 401) throw new Error('Invalid API key. Please add your key in app.js.');
      throw new Error(`Weather API error (${currRes.status}). Please try again.`);
    }
    const currentData = await currRes.json();
 
    // 5-day forecast
    const foreRes = await fetch(
      `${BASE}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    if (!foreRes.ok) throw new Error(`Forecast data unavailable (${foreRes.status}).`);
    const forecastData = await foreRes.json();
 
    renderWeather(currentData, forecastData);
 
  } catch (err) {
    console.error('NexaWeather error:', err);
    showError(err.message || 'Network error. Please check your connection.');
  } finally {
    hideLoader();
  }
}
 
/**
 * Fetch weather by geographic coordinates.
 * @param {number} lat
 * @param {number} lon
 */

// lat = latitude -must be a number
// lon = longitude - must be a number



async function fetchByCoords(lat, lon) {
  hideError();
  showLoader();
 
  try {
    const currRes = await fetch(
      `${BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!currRes.ok) {
      if (currRes.status === 401) throw new Error('Invalid API key. Please add your key in app.js.');
      throw new Error(`Weather API error (${currRes.status}).`);
    }
    const currentData = await currRes.json();
 
    const foreRes = await fetch(
      `${BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!foreRes.ok) throw new Error(`Forecast data unavailable (${foreRes.status}).`);
    const forecastData = await foreRes.json();
 
    renderWeather(currentData, forecastData);
 
  } catch (err) {
    console.error('NexaWeather error:', err);
    showError(err.message || 'Network error. Please check your connection.');
  } finally {
    hideLoader();
  }
}

// Geolocation
function autoLocate() {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser.');
    return;
  }
  showLoader();
  navigator.geolocation.getCurrentPosition(
    pos => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
    err => {
      hideLoader();
      const msgs = {
        1: 'Location access denied. Please allow location or search manually.',
        2: 'Location unavailable. Try searching by city name.',
        3: 'Location request timed out.',
      };
      showError(msgs[err.code] || 'Could not determine your location.');
    },
    { timeout: 10000 }
  );
}

// Event Listeners

// Search button
searchBtn.addEventListener('click', () => {
  const val = cityInput.value.trim();
  if (val) fetchByCity(val);
  else cityInput.focus();
});
 
// Enter key
cityInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const val = cityInput.value.trim();
    if (val) fetchByCity(val);
  }
});
 
// Auto-locate button
locateBtn.addEventListener('click', autoLocate);

// Auto-locate on page load
window.addEventListener('DOMContentLoaded', () => {
  autoLocate();
});
 
