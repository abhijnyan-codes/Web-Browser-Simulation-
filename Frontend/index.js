const addressBar = document.getElementById("addressBar");
const content = document.getElementById("content");
const tabsContainer = document.getElementById("tabs");

const backBtn = document.getElementById("back");
const forwardBtn = document.getElementById("forward");
const refreshBtn = document.getElementById("refresh");

let tabs = [
    {
        history: [],
        forward: [],
        current: null
    }
];

let currentTab = 0;

// ---------- Render Page ----------
function renderPage(url) {
    let type = "html";

    if (url.match(/\.(jpg|png|gif)$/)) type = "image";
    else if (url.match(/\.(mp4|mkv|avi)$/)) type = "video";

    if (type === "html") {
        content.innerHTML = `
            <div class="page">
                <h1>HTML PAGE</h1>
                <p>Loading: ${url}</p>
            </div>
        `;
    } else if (type === "image") {
        content.innerHTML = `
            <div class="page image">
                <h2>[IMAGE PAGE]</h2>
                <p>${url}</p>
            </div>
        `;
    } else {
        content.innerHTML = `
            <div class="page video">
                <h2>[VIDEO PAGE]</h2>
                <p>${url}</p>
            </div>
        `;
    }
}

// ---------- Open URL ----------
function openURL(url) {
    if (!url) return;

    let tab = tabs[currentTab];

    if (tab.current) {
        tab.history.push(tab.current);
    }

    tab.current = url;
    tab.forward = [];

    renderPage(url);
    addressBar.value = "";
}

// ---------- Back ----------
function goBack() {
    let tab = tabs[currentTab];

    if (tab.history.length === 0) return;

    tab.forward.push(tab.current);
    tab.current = tab.history.pop();

    renderPage(tab.current);
}

// ---------- Forward ----------
function goForward() {
    let tab = tabs[currentTab];

    if (tab.forward.length === 0) return;

    tab.history.push(tab.current);
    tab.current = tab.forward.pop();

    renderPage(tab.current);
}

// ---------- Refresh ----------
function refreshPage() {
    let tab = tabs[currentTab];
    if (tab.current) {
        renderPage(tab.current);
    }
}

// ---------- Switch Tab ----------
function switchTab(index) {
    currentTab = index;
    updateTabs();

    let tab = tabs[currentTab];

    if (tab.current) {
        renderPage(tab.current);
    } else {
        content.innerHTML = "";
    }
}

// ---------- Tabs ----------
function updateTabs() {
    tabsContainer.innerHTML = "";

    tabs.forEach((t, i) => {
        let tab = document.createElement("div");
        tab.className = "tab" + (i === currentTab ? " active" : "");

        // Title
        let title = document.createElement("span");
        title.innerText = "Tab " + (i + 1);
        title.onclick = () => switchTab(i);

        // Close button
        let close = document.createElement("span");
        close.innerText = " ✕";
        close.style.marginLeft = "8px";
        close.style.cursor = "pointer";

        close.onclick = (e) => {
            e.stopPropagation(); // IMPORTANT

            if (tabs.length === 1) {
                alert("At least one tab must remain!");
                return;
            }

            tabs.splice(i, 1);

            // Fix current tab index
            if (currentTab >= tabs.length) {
                currentTab = tabs.length - 1;
            }

            updateTabs();

            if (tabs[currentTab].current) {
                renderPage(tabs[currentTab].current);
            } else {
                content.innerHTML = "";
            }
        };

        tab.appendChild(title);
        tab.appendChild(close);

        tabsContainer.appendChild(tab);
    });

    // Add tab button
    let add = document.createElement("div");
    add.className = "add-tab";
    add.innerText = "+";

    add.onclick = () => {
        tabs.push({
            history: [],
            forward: [],
            current: null
        });

        currentTab = tabs.length - 1;
        updateTabs();
        content.innerHTML = "";
    };

    tabsContainer.appendChild(add);
}

// ---------- Events ----------
addressBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        openURL(addressBar.value);
    }
});

backBtn.onclick = goBack;
forwardBtn.onclick = goForward;
refreshBtn.onclick = refreshPage;

// ---------- Init ----------
updateTabs();