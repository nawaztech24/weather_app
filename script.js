document.addEventListener("DOMContentLoaded", function () {

  const apiKey = "Your_API_Key_Here"; 
  const searchBtn = document.getElementById("searchBtn");
  const cityInput = document.getElementById("cityInput");
  const errorMsg = document.getElementById("error");
  const heroSection = document.querySelector(".hero");
  const iconElement = document.getElementById("icon");

  /* ===================== LOAD CURRENT LOCATION ===================== */

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        getWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      () => {
        errorMsg.innerText = "Location permission denied ❌";
      }
    );
  } else {
    errorMsg.innerText = "Geolocation not supported ❌";
  }

  /* ===================== SEARCH ===================== */

  searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
  });

  cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const city = cityInput.value.trim();
      if (city) getWeather(city);
    }
  });

  /* ===================== WEATHER BY CITY ===================== */

  async function getWeather(city) {
    try {
      errorMsg.innerText = "";

      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      if (!currentRes.ok) throw new Error();

      const current = await currentRes.json();
      updateUI(current);

      getForecastByCity(city);

    } catch {
      errorMsg.innerText = "City not found ❌";
    }
  }

  /* ===================== WEATHER BY COORDS ===================== */

  async function getWeatherByCoords(lat, lon) {
    try {
      errorMsg.innerText = "";

      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      if (!currentRes.ok) throw new Error();

      const current = await currentRes.json();
      updateUI(current);

      getForecastByCoords(lat, lon);

    } catch {
      errorMsg.innerText = "Weather not available ❌";
    }
  }

  /* ===================== FORECAST BY CITY ===================== */

  async function getForecastByCity(city) {

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    const forecast = await forecastRes.json();
    renderForecast(forecast);
  }

  /* ===================== FORECAST BY COORDS ===================== */

  async function getForecastByCoords(lat, lon) {

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    const forecast = await forecastRes.json();
    renderForecast(forecast);
  }

  /* ===================== RENDER FORECAST ===================== */

  function renderForecast(forecast) {

    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";

    for (let i = 0; i < forecast.list.length; i += 8) {

      const item = forecast.list[i];
      const date = new Date(item.dt * 1000);

      forecastDiv.innerHTML += `
        <div>
          <p>${date.toDateString().slice(0,3)}</p>
          <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">
          <p>${Math.round(item.main.temp)}°C</p>
        </div>
      `;
    }
  }

  /* ===================== UPDATE UI ===================== */

  function updateUI(current) {

    document.getElementById("cityName").innerText =
      `${current.name}, ${current.sys.country}`;

    document.getElementById("date").innerText =
      new Date().toDateString();

    document.getElementById("temp").innerText =
      `${Math.round(current.main.temp)}°C`;

    document.getElementById("desc").innerText =
      current.weather[0].description;

    document.getElementById("humidity").innerText =
      `${current.main.humidity}%`;

    document.getElementById("wind").innerText =
      `${(current.wind.speed * 3.6).toFixed(1)} km/h`;

    document.getElementById("pressure").innerText =
      `${current.main.pressure} hPa`;

    const iconCode = current.weather[0].icon;
    iconElement.src =
      `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconElement.style.display = "block";

    const weatherType = current.weather[0].main.toLowerCase();

    heroSection.classList.remove(
      "clear","clouds","rain","snow","thunderstorm"
    );

    if (weatherType.includes("clear")) heroSection.classList.add("clear");
    else if (weatherType.includes("cloud")) heroSection.classList.add("clouds");
    else if (weatherType.includes("rain")) heroSection.classList.add("rain");
    else if (weatherType.includes("snow")) heroSection.classList.add("snow");
    else if (weatherType.includes("thunder")) heroSection.classList.add("thunderstorm");
  }

});