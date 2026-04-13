#ifndef HTMLPAGE_H
#define HTMLPAGE_H

#include "WebPage.h"
#include <string>

class HTMLPage : public WebPage {
public:
    HTMLPage(const std::string& url) : WebPage(url) {}

    std::string render() override {
    return "{"
        "\"type\":\"html\","
        "\"url\":\"" + url + "\","
        "\"body\":\"<h1>Page Loaded</h1><p>URL: " + url + "</p>\""
        "}";
}
};

#endif