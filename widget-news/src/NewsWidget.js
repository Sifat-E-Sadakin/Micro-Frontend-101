import "./tailwind.css";

class NewsWidget extends HTMLElement {
  constructor() {
    super();
    this.API_KEY = "f3b4bfa31c1d418cb4863890dcc5eba4";
    this.API_URL = "https://newsapi.org/v2/everything";
    this.attachShadow({ mode: "open" });
    this.renderLoading();
    this.fetchNews();
  }

  connectedCallback() {
    this.renderLoading();
    this.fetchNews();
  }

  static get observedAttributes() {
    return ["from-date", "to-date", "company-name"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.fetchNews();
      // Update text inputs when date picker changes
      const textInput = this.shadowRoot.querySelector(
        `input[data-date-field="${name}"]`
      );
      if (textInput) {
        textInput.value = newValue;
      }
    }
  }

  getFromDate() {
    return this.getAttribute("from-date") || "2025-05-09";
  }

  getToDate() {
    return this.getAttribute("to-date") || "2025-05-09";
  }

  getCompanyName() {
    return this.getAttribute("company-name") || "samsung";
  }

  handleDateChange(event) {
    const { name, value } = event.target;
    this.setAttribute(name, value);
  }

  handleManualDateChange(event) {
    const input = event.target;
    const name = input.dataset.dateField;
    const value = input.value.trim();

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(value)) {
      // Validate date is valid
      const date = new Date(value);
      if (date.toString() !== "Invalid Date") {
        this.setAttribute(name, value);
        // Update date picker
        const datePicker = this.shadowRoot.querySelector(
          `input[name="${name}"]`
        );
        if (datePicker) {
          datePicker.value = value;
        }
      } else {
        // Reset to current value if invalid
        input.value = this.getAttribute(name);
      }
    } else {
      // Reset to current value if format is invalid
      input.value = this.getAttribute(name);
    }
  }

  handleCompanyChange(event) {
    const value = event.target.value.trim();
    if (value) {
      this.setAttribute("company-name", value);
    }
  }

  handleFetchNews() {
    this.renderLoading();
    this.fetchNews();
  }

  renderLoading() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
      </style>
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Samsung News</h2>
            <div class="animate-pulse bg-blue-500 h-2 w-2 rounded-full"></div>
          </div>
          <div class="space-y-4">
            ${Array(3)
              .fill()
              .map(
                () => `
              <div class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  async fetchNews() {
    try {
      const fromDate = this.getFromDate();
      const toDate = this.getToDate();
      const companyName = this.getCompanyName();
      const response = await fetch(
        `${this.API_URL}?q=${companyName}&from=${fromDate}&to=${toDate}&sortBy=popularity&apiKey=${this.API_KEY}`
      );
      const data = await response.json();

      if (data.status === "ok" && data.articles.length > 0) {
        this.renderNews(data.articles);
      } else {
        this.renderError("No news articles found");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      this.renderError("Failed to load news");
    }
  }

  renderNews(articles) {
    const fromDate = this.getFromDate();
    const toDate = this.getToDate();
    const companyName = this.getCompanyName();
    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
      </style>
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800 tracking-tight">${
              companyName.charAt(0).toUpperCase() + companyName.slice(1)
            } Tech News</h2>
            <div class="flex items-center space-x-2">
              <div class="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <div class="flex flex-col gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input 
                  type="text" 
                  value="${companyName}"
                  placeholder="Enter company name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  id="company-name-input"
                />
              </div>
              <div class="flex flex-col gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <div class="flex gap-2">
                    <input 
                      type="date" 
                      name="from-date" 
                      value="${fromDate}"
                      max="${toDate}"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input 
                      type="text" 
                      placeholder="YYYY-MM-DD"
                      value="${fromDate}"
                      class="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      data-date-field="from-date"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <div class="flex gap-2">
                    <input 
                      type="date" 
                      name="to-date" 
                      value="${toDate}"
                      min="${fromDate}"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input 
                      type="text" 
                      placeholder="YYYY-MM-DD"
                      value="${toDate}"
                      class="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      data-date-field="to-date"
                    />
                  </div>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <div class="text-xs text-gray-500">
                  Enter dates in YYYY-MM-DD format or use the date picker
                </div>
                <button 
                  class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  id="fetch-news-btn"
                >
                  Fetch News
                </button>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            ${articles
              .slice(0, 5)
              .map(
                (article, index) => `
              <div class="group">
                <div class="flex items-start space-x-3 p-3 rounded-lg transition-colors duration-200 hover:bg-gray-50">
                  <div class="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                  <div class="flex-1">
                    <h3 class="text-gray-800 font-medium group-hover:text-blue-600 transition-colors duration-200">
                      <a href="${
                        article.url
                      }" target="_blank" rel="noopener noreferrer" class="hover:underline">
                        ${article.title}
                      </a>
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">
                      ${article.source.name} • ${new Date(
                  article.publishedAt
                ).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                ${
                  index < Math.min(articles.length, 5) - 1
                    ? '<div class="border-b border-gray-100 my-2"></div>'
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;

    // Add event listeners to date inputs
    const dateInputs = this.shadowRoot.querySelectorAll('input[type="date"]');
    dateInputs.forEach((input) => {
      input.addEventListener("change", this.handleDateChange.bind(this));
    });

    // Add event listeners to text inputs
    const textInputs = this.shadowRoot.querySelectorAll(
      'input[type="text"][data-date-field]'
    );
    textInputs.forEach((input) => {
      input.addEventListener("change", this.handleManualDateChange.bind(this));
      input.addEventListener("blur", this.handleManualDateChange.bind(this));
    });

    // Add event listener to company name input
    const companyInput = this.shadowRoot.getElementById("company-name-input");
    if (companyInput) {
      companyInput.addEventListener(
        "change",
        this.handleCompanyChange.bind(this)
      );
      companyInput.addEventListener(
        "blur",
        this.handleCompanyChange.bind(this)
      );
    }

    // Add event listener to fetch button
    const fetchButton = this.shadowRoot.getElementById("fetch-news-btn");
    if (fetchButton) {
      fetchButton.addEventListener("click", this.handleFetchNews.bind(this));
    }
  }

  renderError(message) {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
      </style>
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Samsung News</h2>
          </div>
          <div class="text-center py-4">
            <p class="text-red-500">${message}</p>
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get("news-widget")) {
  customElements.define("news-widget", NewsWidget);
}

export default NewsWidget;
