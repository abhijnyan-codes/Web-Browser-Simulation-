#ifndef IMAGEPAGE_H
#define IMAGEPAGE_H

#include "WebPage.h"
#include <string>

class ImagePage : public WebPage {
public:
    ImagePage(const std::string& url) : WebPage(url) {}

    std::string render() override {
        return "{"
       "\"type\":\"image\","
       "\"url\":\"" + url + "\","
       "\"body\":\"" + url + "\""
       "}";
    }
};

#endif