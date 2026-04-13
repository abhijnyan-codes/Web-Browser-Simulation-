// server.cpp — C++ HTTP Backend

#define CPPHTTPLIB_NO_SSL

#ifdef _WIN32
#define _WIN32_WINNT 0x0A00
#define WIN32_LEAN_AND_MEAN
#define NOMINMAX
#include <windows.h>
#endif

#include "httplib.h"
#include "Tab.h"
#include <map>
#include <string>
#include <iostream>

// One Tab object per browser tab (keyed by tab id)
std::map<int, Tab*> tabs;
int tabCounter = 0;

// Helper to add CORS headers
void addCORS(httplib::Response& res) {
    res.set_header("Access-Control-Allow-Origin",  "*");
    res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set_header("Access-Control-Allow-Headers", "Content-Type");
    res.set_header("Content-Type", "application/json");
}

// Get tab
Tab* getTab(int id) {
    auto it = tabs.find(id);
    if (it == tabs.end()) return nullptr;
    return it->second;
}

int main() {
    httplib::Server server;

    server.Get("/new-tab", [](const httplib::Request& req,
                             httplib::Response& res) {
        addCORS(res);
        int id = tabCounter++;
        tabs[id] = new Tab(id);

        res.set_content("{\"tabId\":" + std::to_string(id) + "}", "application/json");
    });

    server.Get("/close-tab", [](const httplib::Request& req,
                               httplib::Response& res) {
        addCORS(res);

        int id = std::stoi(req.get_param_value("id"));
        Tab* tab = getTab(id);

        if (!tab) {
            res.set_content("{\"error\":\"Tab not found\"}", "application/json");
            return;
        }

        delete tab;
        tabs.erase(id);

        res.set_content("{\"success\":true}", "application/json");
    });

    server.Get("/navigate", [](const httplib::Request& req,
                              httplib::Response& res) {
        addCORS(res);

        int id = std::stoi(req.get_param_value("id"));
        std::string url = req.get_param_value("url");

        Tab* tab = getTab(id);

        if (!tab) {
            res.set_content("{\"error\":\"Tab not found\"}", "application/json");
            return;
        }

        std::string pageJSON = tab->loadURL(url);

        std::string merged =
            pageJSON.substr(0, pageJSON.size() - 1)
            + ",\"canGoBack\":"    + (tab->canGoBack()    ? "true" : "false")
            + ",\"canGoForward\":" + (tab->canGoForward() ? "true" : "false")
            + "}";

        res.set_content(merged, "application/json");
    });

    server.Get("/back", [](const httplib::Request& req,
                          httplib::Response& res) {
        addCORS(res);

        int id = std::stoi(req.get_param_value("id"));
        Tab* tab = getTab(id);

        if (!tab) {
            res.set_content("{\"error\":\"Tab not found\"}", "application/json");
            return;
        }

        std::string pageJSON = tab->goBack();

        std::string merged =
            pageJSON.substr(0, pageJSON.size() - 1)
            + ",\"canGoBack\":"    + (tab->canGoBack()    ? "true" : "false")
            + ",\"canGoForward\":" + (tab->canGoForward() ? "true" : "false")
            + ",\"currentURL\":\"" + tab->getCurrentURL() + "\""
            + "}";

        res.set_content(merged, "application/json");
    });

    server.Get("/forward", [](const httplib::Request& req,
                             httplib::Response& res) {
        addCORS(res);

        int id = std::stoi(req.get_param_value("id"));
        Tab* tab = getTab(id);

        if (!tab) {
            res.set_content("{\"error\":\"Tab not found\"}", "application/json");
            return;
        }

        std::string pageJSON = tab->goForward();

        std::string merged =
            pageJSON.substr(0, pageJSON.size() - 1)
            + ",\"canGoBack\":"    + (tab->canGoBack()    ? "true" : "false")
            + ",\"canGoForward\":" + (tab->canGoForward() ? "true" : "false")
            + ",\"currentURL\":\"" + tab->getCurrentURL() + "\""
            + "}";

        res.set_content(merged, "application/json");
    });

    server.Get("/reload", [](const httplib::Request& req,
                            httplib::Response& res) {
        addCORS(res);

        int id = std::stoi(req.get_param_value("id"));
        Tab* tab = getTab(id);

        if (!tab) {
            res.set_content("{\"error\":\"Tab not found\"}", "application/json");
            return;
        }

        std::string pageJSON = tab->reload();

        std::string merged =
            pageJSON.substr(0, pageJSON.size() - 1)
            + ",\"canGoBack\":"    + (tab->canGoBack()    ? "true" : "false")
            + ",\"canGoForward\":" + (tab->canGoForward() ? "true" : "false")
            + ",\"currentURL\":\"" + tab->getCurrentURL() + "\""
            + "}";

        res.set_content(merged, "application/json");
    });

    server.Get("/history", [](const httplib::Request& req,
                             httplib::Response& res) {
        addCORS(res);

        int id = std::stoi(req.get_param_value("id"));
        Tab* tab = getTab(id);

        if (!tab) {
            res.set_content("{\"history\":[]}", "application/json");
            return;
        }

        res.set_content(tab->getHistoryJSON(), "application/json");
    });

    server.Get("/clear-history", [](const httplib::Request& req,
                                   httplib::Response& res) {
        addCORS(res);

        int id = std::stoi(req.get_param_value("id"));
        Tab* tab = getTab(id);

        if (!tab) {
            res.set_content("{\"error\":\"Tab not found\"}", "application/json");
            return;
        }

        tab->clearHistory();
        res.set_content("{\"success\":true}", "application/json");
    });

    server.Options(".*", [](const httplib::Request&,
                           httplib::Response& res) {
        addCORS(res);
        res.set_content("", "text/plain");
    });

    std::cout << "Server running at http://localhost:8080\n";

    server.listen("localhost", 8080);

    for (auto& pair : tabs) delete pair.second;

    return 0;
}