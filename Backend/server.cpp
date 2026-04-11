// server.cpp — C++ HTTP Backend
// Compile: g++ server.cpp -o server -lws2_32
// Run:     ./server
// Then open index.html in browser
#define _WIN32_WINNT 0x0A00
#define WIN32_LEAN_AND_MEAN
#define NOMINMAX
#define CPPHTTPLIB_NO_SSL

#include <windows.h>
#include "httplib.h"
#include "Tab.h"
#include <map>
#include <string>
#include <iostream>

// One Tab object per browser tab (keyed by tab id)
std::map<int, Tab*> tabs;
int tabCounter = 0;

// Helper to add CORS headers so browser can talk to server
void addCORS(httplib::Response& res) {
    res.set_header("Access-Control-Allow-Origin",  "*");
    res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set_header("Access-Control-Allow-Headers", "Content-Type");
    res.set_header("Content-Type", "application/json");
}

// Helper to get tab by id, returns nullptr if not found
Tab* getTab(int id) {
    auto it = tabs.find(id);
    if (it == tabs.end()) return nullptr;
    return it->second;
}

int main() {
    httplib::Server server;

    // ── Create a new tab ──────────────────────────────────────
    // GET /new-tab
    // Returns: { "tabId": 0 }
    server.Get("/new-tab", [](const httplib::Request& req,
                                    httplib::Response& res) {
        addCORS(res);
        int id = tabCounter++;
        tabs[id] = new Tab(id);
        std::cout << "[Server] New tab created: " << id << std::endl;
        res.set_content(
            "{\"tabId\":" + std::to_string(id) + "}",
            "application/json"
        );
    });

    // ── Close a tab ───────────────────────────────────────────
    // GET /close-tab?id=0
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
        std::cout << "[Server] Tab closed: " << id << std::endl;
        res.set_content("{\"success\":true}", "application/json");
    });

    // ── Navigate to URL ───────────────────────────────────────
    // GET /navigate?id=0&url=https://google.com
    // Returns the rendered page JSON + tab status
    server.Get("/navigate", [](const httplib::Request& req,
                                     httplib::Response& res) {
        addCORS(res);
        int         id  = std::stoi(req.get_param_value("id"));
        std::string url = req.get_param_value("url");
        Tab* tab = getTab(id);
        if (!tab) {
            res.set_content("{\"error\":\"Tab not found\"}", "application/json");
            return;
        }
        std::cout << "[Server] Tab " << id << " navigating to: " << url << std::endl;
        std::string pageJSON   = tab->loadURL(url);
        std::string statusJSON = tab->getStatus();

        // Merge page + status into one response
        // Remove closing } from pageJSON, add status fields
        std::string merged = pageJSON.substr(0, pageJSON.size() - 1)
            + ",\"canGoBack\":"    + (tab->canGoBack()    ? "true" : "false")
            + ",\"canGoForward\":" + (tab->canGoForward() ? "true" : "false")
            + "}";

        res.set_content(merged, "application/json");
    });

    // ── Go back ───────────────────────────────────────────────
    // GET /back?id=0
    server.Get("/back", [](const httplib::Request& req,
                                 httplib::Response& res) {
        addCORS(res);
        int id = std::stoi(req.get_param_value("id"));
        Tab* tab = getTab(id);
        if (!tab) {
            res.set_content("{\"error\":\"Tab not found\"}", "application/json");
            return;
        }
        std::cout << "[Server] Tab " << id << " going back" << std::endl;
        std::string pageJSON = tab->goBack();
        std::string merged = pageJSON.substr(0, pageJSON.size() - 1)
            + ",\"canGoBack\":"    + (tab->canGoBack()    ? "true" : "false")
            + ",\"canGoForward\":" + (tab->canGoForward() ? "true" : "false")
            + ",\"currentURL\":\"" + tab->getCurrentURL() + "\""
            + "}";
        res.set_content(merged, "application/json");
    });

    // ── Go forward ────────────────────────────────────────────
    // GET /forward?id=0
    server.Get("/forward", [](const httplib::Request& req,
                                    httplib::Response& res) {
        addCORS(res);
        int id = std::stoi(req.get_param_value("id"));
        Tab* tab = getTab(id);
        if (!tab) {
            res.set_content("{\"error\":\"Tab not found\"}", "application/json");
            return;
        }
        std::cout << "[Server] Tab " << id << " going forward" << std::endl;
        std::string pageJSON = tab->goForward();
        std::string merged = pageJSON.substr(0, pageJSON.size() - 1)
            + ",\"canGoBack\":"    + (tab->canGoBack()    ? "true" : "false")
            + ",\"canGoForward\":" + (tab->canGoForward() ? "true" : "false")
            + ",\"currentURL\":\"" + tab->getCurrentURL() + "\""
            + "}";
        res.set_content(merged, "application/json");
    });

    // ── Reload ────────────────────────────────────────────────
    // GET /reload?id=0
    server.Get("/reload", [](const httplib::Request& req,
                               httplib::Response& res) {
    addCORS(res);

    int id = std::stoi(req.get_param_value("id"));
    Tab* tab = getTab(id);

    if (!tab) {
        res.set_content(
            "{\"error\":\"Tab not found\"}",
            "application/json"
        );
        return;
    }

    std::cout << "[Server] Tab " << id << " reloading" << std::endl;

    // Get page content
    std::string pageJSON = tab->reload();

    // Merge navigation status
    std::string merged =
        pageJSON.substr(0, pageJSON.size() - 1)
        + ",\"canGoBack\":"    + (tab->canGoBack()    ? "true" : "false")
        + ",\"canGoForward\":" + (tab->canGoForward() ? "true" : "false")
        + ",\"currentURL\":\"" + tab->getCurrentURL() + "\""
        + "}";

    res.set_content(merged, "application/json");
    });

    // ── Handle OPTIONS preflight (browser sends this before fetch) ──
    server.Options(".*", [](const httplib::Request&,
                                  httplib::Response& res) {
        addCORS(res);
        res.set_content("", "text/plain");
    });

    // ── Start server ──────────────────────────────────────────
    std::cout << "======================================" << std::endl;
    std::cout << " C++ Browser Backend running"          << std::endl;
    std::cout << " http://localhost:8080"                << std::endl;
    std::cout << " Press Ctrl+C to stop"                 << std::endl;
    std::cout << "======================================" << std::endl;

    // ── Get history for a tab ─────────────────────────────────
// GET /history?id=0
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

// ── Clear history for a tab ───────────────────────────────
// GET /clear-history?id=0
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

    server.listen("localhost", 8080);

    // Cleanup on exit
    for (auto& pair : tabs) delete pair.second;

    return 0;
}