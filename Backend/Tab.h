#ifndef TAB_H
#define TAB_H

#include <string>
#include <vector>
#include <cctype>   // for tolower
#include "History.h"
#include "WebPage.h"
#include "HTMLPage.h"
#include "ImagePage.h"
#include "VideoPage.h"

class Tab {
private:
    int         id;
    std::string title;
    WebPage*    currentPage;
    History     history;

    std::string detectPageType(const std::string& url) {
        std::string lower = url;
        for (char& c : lower) c = std::tolower(c);

        if (lower.find(".jpg")  != std::string::npos ||
            lower.find(".jpeg") != std::string::npos ||
            lower.find(".png")  != std::string::npos ||
            lower.find(".gif")  != std::string::npos ||
            lower.find(".webp") != std::string::npos)
            return "image";

        if (lower.find(".mp4")  != std::string::npos ||
            lower.find(".webm") != std::string::npos ||
            lower.find(".avi")  != std::string::npos ||
            lower.find(".mov")  != std::string::npos)
            return "video";

        return "html";
    }

    WebPage* createPage(const std::string& url) {

    if (url.find(".jpg") != std::string::npos || url.find(".png") != std::string::npos) {
        return new ImagePage(url);
    }
    else if (url.find(".mp4") != std::string::npos) {
        return new VideoPage(url);
    }
    else {
        return new HTMLPage(url);
    }
}

public:
    Tab(int id) : id(id), title("New Tab"), currentPage(nullptr) {}

    ~Tab() {
        delete currentPage;
    }

    std::string loadURL(const std::string& url) {
        delete currentPage;

        currentPage = createPage(url);
        history.push(url);
        title = url;

        return currentPage->render();
    }

    std::string goBack() {
        std::string url = history.back();

        if (url.empty())
            return "{\"error\":\"Cannot go back further\"}";

        delete currentPage;
        currentPage = createPage(url);
        title = url;

        return currentPage->render();
    }

    std::string goForward() {
        std::string url = history.forward();

        if (url.empty())
            return "{\"error\":\"Cannot go forward\"}";

        delete currentPage;
        currentPage = createPage(url);
        title = url;

        return currentPage->render();
    }

    std::string reload() {
        if (currentPage == nullptr)
            return "{\"error\":\"Nothing to reload\"}";

        return currentPage->render();
    }

    std::string getStatus() const {
        std::string canBack    = history.canGoBack()    ? "true" : "false";
        std::string canForward = history.canGoForward() ? "true" : "false";
        std::string currentURL = history.getCurrent();

        return
            "{\"canGoBack\":"    + canBack    + ","
            "\"canGoForward\":" + canForward + ","
            "\"currentURL\":\""  + currentURL + "\","
            "\"title\":\""       + title       + "\"}";
    }

    std::string getHistoryJSON() const {
        std::vector<std::string> all = history.getAll();
        int currentIndex = history.getCurrentIndex();

        std::string json = "{\"history\":[";
        for (int i = 0; i < (int)all.size(); i++) {
            json += "\"" + all[i] + "\"";
            if (i < (int)all.size() - 1) json += ",";
        }

        json += "],\"currentIndex\":" + std::to_string(currentIndex) + "}";

        return json;
    }

    void clearHistory() {
        history.clear();
        history.push("home");

        delete currentPage;
        currentPage = nullptr;

        title = "New Tab";
    }

    int         getId()         const { return id; }
    std::string getTitle()      const { return title; }
    std::string getCurrentURL() const { return history.getCurrent(); }
    bool        canGoBack()     const { return history.canGoBack(); }
    bool        canGoForward()  const { return history.canGoForward(); }
};

#endif