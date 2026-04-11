class Tab {

  constructor(id) {
    this.id = id;
    this.history = new History();
    this.currentPage = null;
    this.title = "New Tab";
  }

  // Looks at the URL ending to figure out what type of page it is
  _detectPageType(url) {
    const lower = url.toLowerCase();

    if (/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/.test(lower)) {
      return "image";
    }
    if (/\.(mp4|webm|avi|mov|mkv)(\?.*)?$/.test(lower)) {
      return "video";
    }
    return "html";
  }

  // Creates the right type of page object based on URL
  _createPage(url) {
    const type = this._detectPageType(url);

    if (type === "image") {
      return new ImagePage(url);
    } else if (type === "video") {
      return new VideoPage(url);
    } else {
      return new HTMLPage(url);
    }
  }

  // Main method — called when user types a URL and presses Enter
  loadURL(url) {
    this.currentPage = this._createPage(url);
    this.history.push(url);
    this.title = url;
  }

  // Called when user clicks Back button
  goBack() {
    const url = this.history.back();
    if (url !== null) {
      this.currentPage = this._createPage(url);
      this.title = url;
      return true;
    }
    return false;
  }

  // Called when user clicks Forward button
  goForward() {
    const url = this.history.forward();
    if (url !== null) {
      this.currentPage = this._createPage(url);
      this.title = url;
      return true;
    }
    return false;
  }

  // Returns HTML string to display in the browser content area
  renderContent() {
    if (this.currentPage === null) {
      return `
        <div style="padding: 40px; text-align: center; color: gray;">
          <h2>New Tab</h2>
          <p>Type a URL in the address bar and press Enter.</p>
        </div>
      `;
    }
    return this.currentPage.render();
  }

  canGoBack() {
    return this.history.canGoBack();
  }

  canGoForward() {
    return this.history.canGoForward();
  }

  getCurrentURL() {
    return this.history.current || "";
  }

  getTitle() {
    return this.title;
  }
}