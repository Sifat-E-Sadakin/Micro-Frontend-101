import "./styles.css";
import { API_KEY, BASE_URL } from "./config";

class WeatherWidget extends HTMLElement {
  constructor() {
    super();
    this.city = "Dhaka"; // Default city
    this.renderLoading();
  }

  renderLoading() {
    this.innerHTML = `
      <div class="container">
        <div class="weather-status text-white d-flex justify-content-center align-items-center">
          <div class="spinner-grow" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    `;
  }

  async fetchWeather() {
    try {
      const response = await fetch(
        `${BASE_URL}?q=${this.city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Weather data not available");
      }
      const data = await response.json();
      this.renderWeather(data);
    } catch (error) {
      this.renderError(error.message);
    }
  }

  renderError(message) {
    this.innerHTML = `
      <div class="container">
        <div class="weather-status text-white text-center">
          <h2 class="mb-4">Error</h2>
          <p class="lead mb-4">${message}</p>
          <button class="btn btn-light" onclick="this.closest('weather-widget').fetchWeather()">
            Try Again
          </button>
        </div>
      </div>
    `;
  }

  renderWeather(data) {
    const { main, weather, wind, name, sys } = data;
    const temperature = Math.round(main.temp);
    const feelsLike = Math.round(main.feels_like);
    const humidity = main.humidity;
    const windSpeed = Math.round(wind.speed * 3.6); // Convert m/s to km/h
    const description = weather[0].description;
    const country = sys.country;
    const iconCode = weather[0].icon;

    this.innerHTML = `
      <div class="container">
        <p class="text-white text-center mb-4">Weather Forecast</p>
        
        <form class="col-md-6 m-auto py-3" onsubmit="event.preventDefault();">
          <div class="input-group">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Enter a location for Weather ..."
              value="${this.city}"
            >
            <button 
              type="submit"
              class="btn btn-danger"
            >
              Search
            </button>
          </div>
        </form>

        <div class="weather-status text-white d-flex justify-content-around align-items-center my-5">
          <div class="text-center">
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}">
            <h1 class="display-4">${name}</h1>
          </div>
          <div>
            <h3>Current Temperature <span class="fw-bold">${temperature}</span>&deg;C</h3>
            <h3>Feels Like <span class="fw-bold">${feelsLike}</span>&deg;C</h3>
          </div>
        </div>

        <div class="weather-status text-white text-center p-5">
          <h3>Humidity <span class="fw-bold">${humidity}</span>%</h3>
          <h3>Wind Speed <span class="fw-bold">${windSpeed}</span> Km/h</h3>
          <h1 class="lead display-6 text-capitalize">${description}</h1>
          <h1 class="lead">${country}</h1>
        </div>
      </div>
    `;

    // Add event listener for the search form
    const form = this.querySelector("form");
    const input = this.querySelector("input");

    form.addEventListener("submit", () => {
      const newCity = input.value.trim();
      if (newCity) {
        this.city = newCity;
        this.renderLoading();
        this.fetchWeather();
      }
    });
  }

  connectedCallback() {
    this.fetchWeather();
  }
}

customElements.define("weather-widget", WeatherWidget);

export default WeatherWidget;
