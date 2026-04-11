class History {
  constructor() {
    this.backStack = [];
    this.forwardStack = [];
    this.current = null;
  }

  push(url) {
    if (this.current !== null) {
      this.backStack.push(this.current);
    }
    this.current = url;
    this.forwardStack = [];
  }

  back() {
    if (this.backStack.length === 0) return null;
    this.forwardStack.push(this.current);
    this.current = this.backStack.pop();
    return this.current;
  }

  forward() {
    if (this.forwardStack.length === 0) return null;
    this.backStack.push(this.current);
    this.current = this.forwardStack.pop();
    return this.current;
  }

  canGoBack() {
    return this.backStack.length > 0;
  }

  canGoForward() {
    return this.forwardStack.length > 0;
  }

  getHistory() {
    let all = [...this.backStack];
    if (this.current) all.push(this.current);
    all = all.concat(this.forwardStack);
    return all;
  }
}