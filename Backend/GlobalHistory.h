#ifndef GLOBALHISTORY_H
#define GLOBALHISTORY_H

#include <string>
#include <vector>
#include <ctime>

struct HistoryEntry {
    std::string url;
    int tabId;
    std::string timestamp;
};

class GlobalHistory {
private:
    std::vector<HistoryEntry> entries;

    std::string getTimestamp() const {
        time_t now = time(nullptr);
        tm* t = localtime(&now);
        char buf[20];
        strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", t);
        return std::string(buf);
    }

public:
    void record(const std::string& url, int tabId) {
        entries.push_back({url, tabId, getTimestamp()});
    }

    void clear() { entries.clear(); }

    std::string toJSON() const {
        std::string json = "{\"history\":[";
        for (int i = 0; i < (int)entries.size(); i++) {
            json += "{\"url\":\"" + entries[i].url + "\","
                    "\"tabId\":" + std::to_string(entries[i].tabId) + ","
                    "\"time\":\"" + entries[i].timestamp + "\"}";
            if (i < (int)entries.size() - 1) json += ",";
        }
        json += "]}";
        return json;
    }
};

#endif