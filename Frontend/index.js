// ============================================================
//  index.js — Frontend only, all logic handled by C++ backend
//  Backend must be running at http://localhost:8080
// ============================================================

const SERVER = "http://localhost:8080";
// ✅ SAFE FETCH FIX
async function safeFetch(url) {
    const res = await fetch(url);
    const text = await res.text();

    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Invalid JSON from server:", text);
        throw new Error("Server returned invalid JSON");
    }
}

// ── DOM References ──────────────────────────────────────────
const tabsContainer   = document.getElementById('tabs');
const addTabBtn       = document.getElementById('addTab');
const addressBar      = document.getElementById('addressBar');
const backBtn         = document.getElementById('back');
const forwardBtn      = document.getElementById('forward');
const refreshBtn      = document.getElementById('refresh');
const centerLayout    = document.getElementById('centerLayout');
const bottomDashboard = document.getElementById('bottomDashboard');
const pageContent     = document.getElementById('pageContent');
const searchInput     = document.getElementById('searchInput');
const shortcutsEl     = document.getElementById('shortcuts');
const editBtn         = document.getElementById('editBtn');
const modalOverlay    = document.getElementById('modalOverlay');
const historyBtn      = document.getElementById('historyBtn');
const historyPanel    = document.getElementById('historyPanel');
const historyList     = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// ── Tab state (UI only — no logic here) ─────────────────────
// tabs array only stores id and title for rendering the tab bar
// ALL actual logic (history, page type etc) lives in C++ server
let tabs        = [];
let activeTabId = null;

// ── Shortcuts data ───────────────────────────────────────────
let shortcuts = [
    { name: 'YouTube',    url: 'https://youtube.com',         icon: '▶️' },
    { name: 'ChatGPT',   url: 'https://chatgpt.com',          icon: '🤖' },
    { name: 'Claude',    url: 'https://claude.ai',            icon: '✦'  },
    { name: 'GitHub',    url: 'https://github.com',           icon: '🐙' },
    { name: 'LeetCode',  url: 'https://leetcode.com',         icon: '💻' },
    { name: 'HackerNews',url: 'https://news.ycombinator.com', icon: '📰' },
];

let editMode     = false;
let editingIndex = null;


// ============================================================
//  VIEW SWITCHING
// ============================================================

function showNewTab() {
    centerLayout.style.display    = 'flex';
    bottomDashboard.style.display = 'flex';
    pageContent.style.display     = 'none';
    searchInput.value = '';
}

// Called with the JSON response from C++ server
function showPage(data) {
    console.log("DATA RECEIVED:", data);
    centerLayout.style.display    = 'none';
    bottomDashboard.style.display = 'none';
    pageContent.style.display     = 'block';

    // URL badge
    let hostname = data.url;
    try { hostname = new URL(data.url).hostname; } catch {}
    document.getElementById('urlBadge').textContent = '🔒 ' + hostname;

    // Page title — use domain name
    let domain = hostname.replace('www.', '');
    document.getElementById('pageTitle').textContent = domain;

   // Body content — comes from C++ render()

if (data.type === 'image') {
    document.getElementById('pageDesc').innerHTML =
        `<img src="${data.url}" style="max-width:100%; border-radius:8px; margin-top:16px;">`;
}
else if (data.type === 'video') {
    document.getElementById('pageDesc').innerHTML =
        `<video controls style="max-width:100%; border-radius:8px; margin-top:16px;">
            <source src="${data.url}" type="video/mp4">
        </video>`;
}
else {
    document.getElementById('pageDesc').innerHTML = data.body;
}

    document.getElementById('pageTime').textContent =
        'Loaded at ' + new Date().toLocaleTimeString();
}


// ============================================================
//  UPDATE NAV BUTTONS + ADDRESS BAR
// ============================================================

function updateUI(data) {
    // data comes from C++ server response
    backBtn.disabled    = !data.canGoBack;
    forwardBtn.disabled = !data.canGoForward;

    if (data.currentURL && data.currentURL !== '') {
        addressBar.value = data.currentURL;
    }
}


// ============================================================
//  TAB BAR RENDERING
// ============================================================

function formatTabTitle(url) {
    try {
        const u = new URL(url);
        if (u.hostname.includes('google') && u.searchParams.get('q')) {
            const q = u.searchParams.get('q');
            return q.charAt(0).toUpperCase() + q.slice(1);
        }
        let name = u.hostname.replace('www.', '').split('.')[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
    } catch {
        return 'New Tab';
    }
}

function renderTabs() {
    [...tabsContainer.querySelectorAll('.tab')].forEach(t => t.remove());
    tabs.forEach(tab => {
        const el = document.createElement('div');
        el.className = 'tab' + (tab.id === activeTabId ? ' active' : '');
        el.innerHTML =
            `<span class="tab-title">${tab.title}</span>
             <span class="tab-close">×</span>`;
        el.addEventListener('click', e => {
            if (e.target.classList.contains('tab-close')) closeTab(tab.id);
            else switchTab(tab.id);
        });
        tabsContainer.insertBefore(el, addTabBtn);
    });
}


// ============================================================
//  TAB OPERATIONS — each one calls C++ server
// ============================================================

// Creates a new tab — asks C++ server for a tab id
async function createTab() {
    try {
        const data = await safeFetch(`${SERVER}/new-tab`);
        const id   = data.tabId;

        tabs.push({ id: id, title: 'New Tab' });
        activeTabId = id;
        renderTabs();
        showNewTab();
        addressBar.value    = '';
        backBtn.disabled    = true;
        forwardBtn.disabled = true;

        console.log('[Tab created] C++ tab id:', id);
    } catch (err) {
        alert('Cannot connect to C++ server.\nMake sure server.exe is running.\n\n' + err);
    }
}

// Switch to an existing tab
function switchTab(id) {
    activeTabId = id;
    const tab = tabs.find(t => t.id === id);
    if (!tab) return;
    renderTabs();
    // If tab has a URL, show its page — otherwise show new tab screen
    if (tab.url) {
        showPage({ type: tab.pageType || 'html', url: tab.url, body: tab.body || '' });
        addressBar.value    = tab.url;
        backBtn.disabled    = !tab.canGoBack;
        forwardBtn.disabled = !tab.canGoForward;
    } else {
        showNewTab();
        addressBar.value    = '';
        backBtn.disabled    = true;
        forwardBtn.disabled = true;
    }
}

// Close a tab — tells C++ server to destroy it
async function closeTab(id) {
    try {
        await fetch(`${SERVER}/close-tab?id=${id}`);
    } catch {}

    tabs = tabs.filter(t => t.id !== id);

    if (tabs.length === 0) {
        createTab();
        return;
    }
    if (activeTabId === id) {
        activeTabId = tabs[tabs.length - 1].id;
    }
    switchTab(activeTabId);
}

// Navigate to a URL — core function, calls C++ server
async function navigate(url) {
    if (!url) return;
    if (!url.startsWith('http')) url = 'https://' + url;

    const tab = tabs.find(t => t.id === activeTabId);
    if (!tab) return;

    try {
        const data = await safeFetch(
    `${SERVER}/navigate?id=${activeTabId}&url=${encodeURIComponent(url)}`
);

        if (data.error) {
            console.error('Server error:', data.error);
            return;
        }

        // Save state in tab object for when user switches back
        tab.url         = data.url;
        tab.title       = formatTabTitle(data.url);
        tab.pageType    = data.type;
        tab.body        = data.body;
        tab.canGoBack   = data.canGoBack;
        tab.canGoForward= data.canGoForward;

        renderTabs();
        showPage(data);
        updateUI(data);

        console.log('[Navigate] C++ response:', data);
    } catch (err) {
        alert('Cannot connect to C++ server.\nMake sure server.exe is running.\n\n' + err);
    }
}


// ============================================================
//  BACK / FORWARD / RELOAD — all call C++ server
// ============================================================
async function goBack() {
    const tab = tabs.find(t => t.id === activeTabId);
    if (!tab) return;

    try {
        const data = await safeFetch(`${SERVER}/back?id=${activeTabId}`);

        // If backend says cannot go back further
        if (data.error) {

            tab.url          = '';
            tab.title        = 'New Tab';
            tab.canGoBack    = false;
            tab.canGoForward = true;

            renderTabs();
            showNewTab();

            addressBar.value    = '';

            backBtn.disabled    = true;
            forwardBtn.disabled = false;

            return;
        }

        // Get URL returned from backend
        tab.url = data.url || data.currentURL;

        // If returning to HOME
        if (tab.url === "home") {

            tab.url          = '';
            tab.title        = 'New Tab';
            tab.canGoBack    = false;
            tab.canGoForward = data.canGoForward;

            renderTabs();
            showNewTab();

            addressBar.value = '';

            // ⭐ Correct button logic
            backBtn.disabled    = true;
            forwardBtn.disabled = !data.canGoForward;

            return;
        }

        // Normal page navigation
        tab.title        = formatTabTitle(tab.url);
        tab.pageType     = data.type;
        tab.body         = data.body;
        tab.canGoBack    = data.canGoBack;
        tab.canGoForward = data.canGoForward;

        renderTabs();
        showPage(data);

        // ⭐ Correct button logic
        backBtn.disabled    = !data.canGoBack;
        forwardBtn.disabled = !data.canGoForward;

        addressBar.value = tab.url;

    } catch (err) {
        console.error('Back error:', err);
    }
}

async function goForward() {
    const tab = tabs.find(t => t.id === activeTabId);
    if (!tab) return;

    try {
       const data = await safeFetch(`${SERVER}/forward?id=${activeTabId}`);

        if (data.error) {
            console.log('Cannot go forward:', data.error);
            return;
        }

        tab.url          = data.url || data.currentURL;
        tab.title        = formatTabTitle(tab.url);
        tab.pageType     = data.type;
        tab.body         = data.body;
        tab.canGoBack    = data.canGoBack;
        tab.canGoForward = data.canGoForward;

        renderTabs();
        showPage(data);
        updateUI(data);
    } catch (err) {
        console.error('Forward error:', err);
    }
}

async function doReload() {

    const tab = tabs.find(t => t.id === activeTabId);

    // Nothing to reload if no page
    if (!tab || !tab.url) return;

    try {

       const data = await safeFetch(`${SERVER}/reload?id=${activeTabId}`);

        if (data.error) {
            console.log("Reload error:", data.error);
            return;
        }

        // Update tab state from server
        tab.url          = data.url || tab.url;
        tab.title        = formatTabTitle(tab.url);
        tab.pageType     = data.type;
        tab.body         = data.body;
        tab.canGoBack    = data.canGoBack;
        tab.canGoForward = data.canGoForward;

        renderTabs();
        showPage(data);

        // ⭐ CRITICAL — keep correct button state
        backBtn.disabled    = !data.canGoBack;
        forwardBtn.disabled = !data.canGoForward;

        addressBar.value = tab.url;

    } catch (err) {
        console.error("Reload failed:", err);
    }
}

// ============================================================
//  HISTORY PANEL — fetches from C++ server
// ============================================================

async function renderHistory() {
    try {
        const data = await safeFetch(`${SERVER}/history?id=${activeTabId}`);

        historyList.innerHTML = '';

        if (!data.history || data.history.length === 0) {
            historyList.innerHTML =
                '<li style="padding:12px 16px;color:#999;font-size:13px;">No history yet</li>';
            return;
        }

        data.history.forEach((entry, index) => {
            const li = document.createElement('li');
            li.className = 'history-item';
            if (index === data.currentIndex) li.classList.add('history-current');

            // Make a readable label from the URL
            let label = entry;
            try {
                const u = new URL(entry);
                if (u.hostname.includes('google') && u.searchParams.get('q')) {
                    label = 'Search: ' + u.searchParams.get('q');
                } else {
                    label = u.hostname.replace('www.', '');
                    label = label.split('.')[0];
                    label = label.charAt(0).toUpperCase() + label.slice(1);
                }
            } catch {
                label = entry; // fallback for non-standard URLs like photo.jpg
            }

            // Show page type icon
            let icon = '🌐';
            const lower = entry.toLowerCase();
            if (/\.(jpg|jpeg|png|gif|webp)/.test(lower)) icon = '🖼️';
            else if (/\.(mp4|webm|avi|mov)/.test(lower)) icon = '▶️';

            li.innerHTML =
                `<span>${icon} ${label}</span>
                 <span class="history-time">${new Date().toLocaleTimeString()}</span>`;

            historyList.appendChild(li);
        });

    } catch {
        historyList.innerHTML =
            '<li style="padding:12px 16px;color:#999;font-size:13px;">Server not connected</li>';
    }
}

async function clearHistory() {
    try {
        await fetch(`${SERVER}/clear-history?id=${activeTabId}`);
        renderHistory();
    } catch {}
}


// ============================================================
//  SHORTCUTS
// ============================================================

function renderShortcuts() {
    shortcutsEl.innerHTML = '';
    shortcuts.forEach((s, i) => {
        const el = document.createElement('div');
        el.className = 'shortcut';
        el.innerHTML =
            `<div class="shortcut-icon">
                <span style="pointer-events:none">${s.icon}</span>
                <span class="delete-badge" style="display:${editMode?'flex':'none'}">✕</span>
                <span class="edit-badge"   style="display:${editMode?'flex':'none'}">✎</span>
             </div>
             <span class="shortcut-label">${s.name}</span>`;

        if (!editMode) {
            el.querySelector('.shortcut-icon').addEventListener('click', () => navigate(s.url));
        }
        el.querySelector('.delete-badge').addEventListener('click', e => {
            e.stopPropagation(); shortcuts.splice(i, 1); renderShortcuts();
        });
        el.querySelector('.edit-badge').addEventListener('click', e => {
            e.stopPropagation(); openModal(i);
        });
        shortcutsEl.appendChild(el);
    });

    const add = document.createElement('div');
    add.className = 'shortcut shortcut-add';
    add.innerHTML = `<div class="shortcut-icon">+</div><span class="shortcut-label">Add</span>`;
    add.addEventListener('click', () => openModal(null));
    shortcutsEl.appendChild(add);
}

editBtn.addEventListener('click', () => {
    editMode = !editMode;
    editBtn.textContent = editMode ? '✓ Done' : '✎ Edit';
    editBtn.classList.toggle('active', editMode);
    renderShortcuts();
});


// ============================================================
//  MODAL
// ============================================================

function openModal(index) {
    editingIndex = index;
    document.getElementById('modalTitle').textContent =
        index !== null ? 'Edit Shortcut' : 'Add Shortcut';
    document.getElementById('modalName').value =
        index !== null ? shortcuts[index].name : '';
    document.getElementById('modalUrl').value  =
        index !== null ? shortcuts[index].url  : '';
    document.getElementById('modalIcon').value =
        index !== null ? shortcuts[index].icon : '';
    modalOverlay.style.display = 'flex';
    setTimeout(() => document.getElementById('modalName').focus(), 50);
}

function closeModal() {
    modalOverlay.style.display = 'none';
    editingIndex = null;
}

function saveShortcut() {
    const name = document.getElementById('modalName').value.trim();
    let   url  = document.getElementById('modalUrl').value.trim();
    const icon = document.getElementById('modalIcon').value.trim() || '🔗';
    if (!name || !url) return;
    if (!url.startsWith('http')) url = 'https://' + url;
    if (editingIndex !== null) shortcuts[editingIndex] = { name, url, icon };
    else shortcuts.push({ name, url, icon });
    closeModal();
    renderShortcuts();
}

document.getElementById('modalCancel').addEventListener('click', closeModal);
document.getElementById('modalSave').addEventListener('click', saveShortcut);
modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});


// ============================================================
//  CLOCK
// ============================================================

function updateClock() {
    const now  = new Date();
    let   h    = now.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const m      = String(now.getMinutes()).padStart(2, '0');
    const days   = ['Sunday','Monday','Tuesday','Wednesday',
                    'Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
    document.getElementById('clockTime').textContent =
        `${String(h).padStart(2,'0')}:${m}`;
    document.getElementById('clockAmpm').textContent = ampm;
    document.getElementById('clockDate').textContent =
        `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}


// ============================================================
//  QUOTES
// ============================================================

const quotes = [
    "Small steps lead to big results.",
    "Focus on being productive instead of busy.",
    "Your future is created by what you do today.",
    "Don't stop until you're proud.",
    "The secret of getting ahead is getting started.",
    "Do something today that your future self will thank you for."
];

function updateQuote() {
    document.getElementById('quote').textContent =
        `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
}


// ============================================================
//  EVENT LISTENERS
// ============================================================

addTabBtn.addEventListener('click', () => createTab());

addressBar.addEventListener('keydown', e => {
    if (e.key === 'Enter') navigate(addressBar.value.trim());
});

searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const q = searchInput.value.trim();
        if (q) navigate('https://google.com/search?q=' + encodeURIComponent(q));
    }
});

backBtn.addEventListener('click',    () => goBack());
forwardBtn.addEventListener('click', () => goForward());
refreshBtn.addEventListener('click', () => doReload());

historyBtn.addEventListener('click', () => {
    if (historyPanel.style.display === 'none' ||
        historyPanel.style.display === '') {
        renderHistory();
        historyPanel.style.display = 'block';
    } else {
        historyPanel.style.display = 'none';
    }
});

clearHistoryBtn.addEventListener('click', clearHistory);

document.getElementById('newQuoteBtn').addEventListener('click', updateQuote);

// ============================================================
//  WEATHER + LOCATION FIX
// ============================================================

function updateWeather() {

    console.log("Weather function running...");

    if (!navigator.geolocation) {
        console.log("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        console.log("Lat:", lat, "Lon:", lon);

        try {
            const res = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
            );
            const data = await res.json();

            console.log("Weather data:", data);

            const temp = data.current_weather.temperature;

            const tempEl = document.querySelector('#weatherTemp');
            if (tempEl) {
                tempEl.textContent = `${temp}°C`;
            } else {
                console.log("weatherTemp element NOT FOUND");
            }

            const geo = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            const geoData = await geo.json();

            console.log("Geo data:", geoData);

            const city =
                geoData.address.city ||
                geoData.address.town ||
                geoData.address.village ||
                "Unknown";

            const cityEl = document.querySelector('#weatherCity');
            if (cityEl) {
                cityEl.textContent = city;
            } else {
                console.log("weatherCity element NOT FOUND");
            }

        } catch (err) {
            console.error("Weather error:", err);
        }

    }, (err) => {
        console.error("Location denied:", err);
    });
}

// ============================================================
//  INIT — runs on page load
// ============================================================

createTab();
renderShortcuts();
updateClock();
updateQuote();
updateWeather();
setInterval(updateClock, 1000);
setInterval(updateWeather, 300000); // Update weather every 5 minutes