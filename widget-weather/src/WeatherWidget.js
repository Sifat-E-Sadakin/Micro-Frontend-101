class WeatherWidget extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = "<h2>Weather Widget</h2><p>Loading weather...</p>";
    this.fetchWeather();
  }

  async fetchWeather() {
    // Simulate fetching weather data
    await new Promise(resolve => setTimeout(resolve, 1500));
    const temperature = Math.floor(Math.random() * 30) + 15; // Random temperature
    this.innerHTML = `<h2>Weather Widget</h2><p>Current Temperature: ${temperature}°C in Dhaka</p>`;
  }
}

customElements.define("weather-widget", WeatherWidget);

export default WeatherWidget;
