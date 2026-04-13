#ifndef HTMLPAGE_H
#define HTMLPAGE_H

#include "WebPage.h"
#include <string>

class HTMLPage : public WebPage {
public:
    HTMLPage(const std::string& url) : WebPage(url) {}

    std::string render() override {
        // Extract a simple domain name for display
        std::string display = url;

        // Simple domain extraction without HTML tags in JSON
        std::string body = "Simulated page loaded for: " + url;

        return
            "{"
            "\"type\":\"html\","
            "\"url\":\"" + url + "\","
            "\"body\":\"" + body + "\""
            "}";
    }
};

#endif