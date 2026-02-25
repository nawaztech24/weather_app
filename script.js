/* =========================================================
   WEATHER APP MAIN SCRIPT
   - Auto load default city
   - Search functionality
   - Desktop / Mobile toggle
   - Dynamic weather background
   - Error handling with scroll focus
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ===================== CONFIG ===================== */
  const apiKey = "YOUR_OPENWEATHER_API_KEY"; // Replace with your OpenWeather API key

  /* ===================== ELEMENT SELECTORS ===================== */
  const searchBtn = document.getElementById("searchBtn");
  const cityInput = document.getElementById("cityInput");
  const errorMsg = document.getElementById("error");
  const desktopBtn = document.getElementById("desktopBtn");
  const mobileBtn = document.getElementById("mobileBtn");
  const app = document.getElementById("appContainer");
  const heroSection = document.querySelector(".hero");
  const iconElement = document.getElementById("icon");

  /* ===================== AUTO LOAD DEFAULT CITY ===================== */
  getWeather("Delhi");

  /* ===================== SEARCH EVENTS ===================== */
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

  /* ===================== VIEW TOGGLE ===================== */
  desktopBtn.addEventListener("click", () => {
    app.classList.remove("mobile-mode");
    heroSection.scrollIntoView({ behavior: "smooth" });
  });

  mobileBtn.addEventListener("click", () => {
    app.classList.add("mobile-mode");
    heroSection.scrollIntoView({ behavior: "smooth" });
  });

  /* ===================== MAIN WEATHER FUNCTION ===================== */
  async function getWeather(city) {

    try {

      errorMsg.innerText = "";

      /* -------- FETCH CURRENT WEATHER -------- */
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      const current = await currentRes.json();

      if (current.cod !== 200) throw new Error();

      /* -------- UPDATE CURRENT UI -------- */
      document.getElementById("cityName").innerText =
        current.name + ", " + current.sys.country;

      document.getElementById("date").innerText =
        new Date().toDateString();

      document.getElementById("temp").innerText =
        Math.round(current.main.temp) + "°C";

      document.getElementById("desc").innerText =
        current.weather[0].description;

      document.getElementById("humidity").innerText =
        current.main.humidity + "%";

      document.getElementById("wind").innerText =
        (current.wind.speed * 3.6).toFixed(1) + " km/h";

      document.getElementById("pressure").innerText =
        current.main.pressure + " hPa";

      /* -------- WEATHER ICON FIXED -------- */
      const iconCode = current.weather[0].icon;

      iconElement.src =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      iconElement.style.display = "block";

      /* -------- DYNAMIC BACKGROUND -------- */
      const weatherType = current.weather[0].main.toLowerCase();

      heroSection.classList.remove(
        "clear",
        "clouds",
        "rain",
        "snow",
        "thunderstorm"
      );

      if (weatherType.includes("clear"))
        heroSection.classList.add("clear");

      else if (weatherType.includes("cloud"))
        heroSection.classList.add("clouds");

      else if (weatherType.includes("rain") || weatherType.includes("drizzle"))
        heroSection.classList.add("rain");

      else if (weatherType.includes("snow"))
        heroSection.classList.add("snow");

      else if (weatherType.includes("thunder"))
        heroSection.classList.add("thunderstorm");

      /* -------- FETCH FORECAST -------- */
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );

      const forecast = await forecastRes.json();
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

    } catch {

      /* -------- ERROR HANDLING -------- */
      errorMsg.innerText = "City not found ❌";

      iconElement.style.display = "none";

      heroSection.classList.remove(
        "clear",
        "clouds",
        "rain",
        "snow",
        "thunderstorm"
      );

      heroSection.scrollIntoView({ behavior: "smooth" });
    }
  }

});