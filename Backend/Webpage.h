#ifndef WEBPAGE_H
#define WEBPAGE_H

#include <string>

class WebPage {
protected:
    std::string url;

public:
    WebPage(const std::string& url) : url(url) {}

    virtual std::string render() = 0;

    virtual ~WebPage() {}
};

#endif