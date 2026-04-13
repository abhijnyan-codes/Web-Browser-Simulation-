#ifndef VIDEOPAGE_H
#define VIDEOPAGE_H

#include "WebPage.h"
#include <string>

class VideoPage : public WebPage {
public:
    VideoPage(const std::string& url) : WebPage(url) {}

    std::string render() override {
        return "{"
               "\"type\":\"video\","
               "\"url\":\"" + url + "\","
              "\"body\":\"" + url + "\""
               "}";
    }
};

#endif