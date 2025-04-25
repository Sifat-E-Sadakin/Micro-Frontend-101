class NewsWidget extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = "<h2>Latest News</h2><ul><li>Loading...</li></ul>";
    this.fetchNews();
  }

  async fetchNews() {
    // Simulate fetching news headlines
    await new Promise(resolve => setTimeout(resolve, 2000));
    const headlines = [
      "Breaking: Local Traffic Improves",
      "New Park Opens Downtown",
      "Tech Startup Receives Funding",
    ];
    this.innerHTML = `<h2>Latest News</h2><ul>${headlines
      .map(headline => `<li>${headline}</li>`)
      .join("")}</ul>`;
  }
}

customElements.define("news-widget", NewsWidget);

export default NewsWidget;
