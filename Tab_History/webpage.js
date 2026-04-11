class WebPage {
  constructor(url) {
    this.url = url;
  }

  getURL() {
    return this.url;
  }

  render() {
    return "<p>Loading page...</p>";
  }
}

class HTMLPage extends WebPage {
  constructor(url) {
    super(url);
  }

  render() {
    return `
      <div style="padding: 24px;">
        <h2 style="margin-bottom: 8px;">HTML Page</h2>
        <p style="color: gray;">URL: ${this.url}</p>
        <hr style="margin: 16px 0;">
        <p>This is a simulated HTML page. Actual content would appear here.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    `;
  }
}

class ImagePage extends WebPage {
  constructor(url) {
    super(url);
  }

  render() {
    return `
      <div style="padding: 24px;">
        <h2 style="margin-bottom: 8px;">Image Page</h2>
        <p style="color: gray;">URL: ${this.url}</p>
        <hr style="margin: 16px 0;">
        <div style="
          width: 300px;
          height: 200px;
          background: #c8d8e8;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #555;
        ">
          [ Image: ${this.url} ]
        </div>
      </div>
    `;
  }
}

class VideoPage extends WebPage {
  constructor(url) {
    super(url);
  }

  render() {
    return `
      <div style="padding: 24px;">
        <h2 style="margin-bottom: 8px;">Video Page</h2>
        <p style="color: gray;">URL: ${this.url}</p>
        <hr style="margin: 16px 0;">
        <div style="
          width: 400px;
          height: 225px;
          background: #1a1a2e;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
        ">
          ▶ [ Video: ${this.url} ]
        </div>
      </div>
    `;
  }
}