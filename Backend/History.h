#ifndef HISTORY_H
#define HISTORY_H

#include <stack>
#include <string>
#include <vector>
#include <algorithm>
#include <ctime>

class History {
private:
    std::stack<std::string> backStack;
    std::stack<std::string> forwardStack;
    std::string current;
    std::string getTimeStamp() const {
        time_t now = time(nullptr);
        tm* t = localtime(&now);

        char buffer[9];
        strftime(buffer, sizeof(buffer), "%H:%M:%S", t);

        return std::string(buffer);
    }

public:
    History() : current("") {}

   void push(const std::string& url) {
    if (!current.empty()) {
        backStack.push(current);
    }
    current = url;

    while (!forwardStack.empty())
        forwardStack.pop();
    }

    std::string back() {
        if (backStack.empty()) return "";
        forwardStack.push(current);
        current = backStack.top();
        backStack.pop();
        return current;
    }

    std::string forward() {
        if (forwardStack.empty()) return "";
        backStack.push(current);
        current = forwardStack.top();
        forwardStack.pop();
        return current;
    }

    bool canGoBack()    const { return !backStack.empty(); }
    bool canGoForward() const { return !forwardStack.empty(); }
    std::string getCurrent() const { return current; }

    std::vector<std::string> getAll() const {
        std::vector<std::string> result;
        std::stack<std::string> temp = backStack;
        std::vector<std::string> back;
        while (!temp.empty()) { back.push_back(temp.top()); temp.pop(); }
        std::reverse(back.begin(), back.end());
        for (auto& u : back) result.push_back(u);
        if (!current.empty()) result.push_back(current);
        temp = forwardStack;
        while (!temp.empty()) { result.push_back(temp.top()); temp.pop(); }
        return result;
    }

    int getCurrentIndex() const {
        std::stack<std::string> temp = backStack;
        int count = 0;
        while (!temp.empty()) { count++; temp.pop(); }
        return current.empty() ? -1 : count;
    }

    void clear() {
        while (!backStack.empty())    backStack.pop();
        while (!forwardStack.empty()) forwardStack.pop();
        current = "";
    }
};

#endif