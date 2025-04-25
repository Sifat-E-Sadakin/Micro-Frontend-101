async function loadWidgets() {
  try {
    // Dynamically import the exposed modules from the remote microfrontends
    const WeatherWidget = await import("weather/WeatherWidget");
    const NewsWidget = await import("news/NewsWidget");

    const weatherContainer = document.getElementById("weather-container");
    const newsContainer = document.getElementById("news-container");

    if (weatherContainer && WeatherWidget.default) {
      weatherContainer.appendChild(new WeatherWidget.default());
    } else {
      console.error("Weather widget not loaded.");
    }

    if (newsContainer && NewsWidget.default) {
      newsContainer.appendChild(new NewsWidget.default());
    } else {
      console.error("News widget not loaded.");
    }
  } catch (error) {
    console.error("Error loading remote modules:", error);
  }
}

loadWidgets();
