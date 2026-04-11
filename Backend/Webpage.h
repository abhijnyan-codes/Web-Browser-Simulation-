#ifndef WEBPAGE_H
#define WEBPAGE_H

#include <string>

// Abstract base class
class WebPage {
protected:
    std::string url;

public:
    WebPage(const std::string& url) : url(url) {}

    // Pure virtual — WebPage cannot be instantiated directly
    virtual std::string render() = 0;

    std::string getURL() const { return url; }

    virtual ~WebPage() {}
};


class HTMLPage : public WebPage {
public:
    HTMLPage(const std::string& url) : WebPage(url) {}

    std::string render() override {
        return
            "{"
            "\"type\":\"html\","
            "\"url\":\"" + url + "\","
            "\"title\":\"" + url + "\","
            "\"body\":\"Simulated HTML page loaded successfully.\""
            "}";
    }
};


class ImagePage : public WebPage {
public:
    ImagePage(const std::string& url) : WebPage(url) {}

    std::string render() override {
        return
            "{"
            "\"type\":\"image\","
            "\"url\":\"" + url + "\","
            "\"title\":\"" + url + "\","
            "\"body\":\"Simulated image page.\""
            "}";
    }
};


class VideoPage : public WebPage {
public:
    VideoPage(const std::string& url) : WebPage(url) {}

    std::string render() override {
        return
            "{"
            "\"type\":\"video\","
            "\"url\":\"" + url + "\","
            "\"title\":\"" + url + "\","
            "\"body\":\"Simulated video page.\""
            "}";
    }
};

#endif