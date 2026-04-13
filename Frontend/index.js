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

    pageContent.classList.remove('visible');
    pageContent.classList.add('hidden');

    searchInput.value = '';
}

// Called with the JSON response from C++ server
function showPage(data) {
    centerLayout.style.display    = 'none';
    bottomDashboard.style.display = 'none';

    pageContent.classList.remove('hidden');
    pageContent.classList.add('visible');

    // Extract hostname
    let hostname = data.url || '';
    try { hostname = new URL(data.url).hostname; } catch {}
    let domain = hostname.replace('www.', '');
    let siteName = domain.split('.')[0].toLowerCase();

    document.getElementById('urlBadge').textContent = '🔒 ' + hostname;
    document.getElementById('pageTitle').textContent = '';
    document.getElementById('pageTime').textContent =
        'Loaded at ' + new Date().toLocaleTimeString();

    // Route to the right mockup
    if (data.type === 'image') {
        document.getElementById('pageDesc').innerHTML = renderImagePage(data.url);

    } else if (data.type === 'video') {
        document.getElementById('pageDesc').innerHTML = renderVideoPage(data.url);

    } else if (siteName.includes('google')) {
        document.getElementById('pageDesc').innerHTML = renderGoogle(data.url);

    } else if (siteName.includes('youtube')) {
        document.getElementById('pageDesc').innerHTML = renderYoutube();

    } else if (siteName.includes('github')) {
        document.getElementById('pageDesc').innerHTML = renderGithub();

    } else if (siteName.includes('claude')) {
        document.getElementById('pageDesc').innerHTML = renderClaude();

    } else if (siteName.includes('chatgpt') || siteName.includes('openai')) {
        document.getElementById('pageDesc').innerHTML = renderChatGPT();

    } else if (siteName.includes('leetcode')) {
        document.getElementById('pageDesc').innerHTML = renderLeetcode();

    } else {
        document.getElementById('pageDesc').innerHTML = renderGeneric(domain, data.url);
    }
}

// ============================================================
//  PAGE MOCKUP RENDERERS
//  Each returns an HTML string for a simulated page
// ============================================================

function renderGoogle(url) {
    let query = '';
    try {
        const u = new URL(url);
        query = u.searchParams.get('q') || '';
    } catch {}

    // ── Image search keywords ──────────────────────────────
    const imageKeywords = {
        cat: {
            label: 'cat',
            emojis: ['🐱','😺','🐈','😸','🐾','😻','🐱','😹','🐈‍⬛','😼','🐾','😺','🐱','🐈','😸'],
            captions: [
                'Happy cat Images – Freepik',
                'Cute Baby Cat Stock Photos – Vecteezy',
                '500+ Beautiful Cat Pictures [HD] – Unsplash',
                '200+ Cat Pictures – Unsplash',
                'Cat Stock Photos – Vecteezy',
                'Tabby cat – Wikipedia',
                '20,000+ Free Cat Images – Pixabay',
                'Kitten Photos – Pexels',
                'Cute Cat Wallpapers – WallpaperCave',
                'Cat Breeds Guide – PetMD',
                'Orange Cat Images – Shutterstock',
                'Black Cat Photos – iStock',
            ]
        },
        dog: {
            label: 'dog',
            emojis: ['🐶','🐕','🦮','🐩','🐾','🐕‍🦺','🐶','🦴','🐕','🐾','🐩','🐶'],
            captions: [
                'Cute Dog Photos – Unsplash',
                'Dog Breed Stock Images – Shutterstock',
                '500+ Puppy Pictures [HD] – Pexels',
                'Golden Retriever Photos – Freepik',
                'Dog Images Free Download – Pixabay',
                'Labrador Pictures – iStock',
                'Funny Dog Memes – Reddit',
                'Puppy Wallpapers – WallpaperCave',
                'Dog Breeds A-Z – AKC',
                'Husky Photos – Vecteezy',
                'German Shepherd Images – Getty',
                'Bulldog Stock Photos – Adobe Stock',
            ]
        },
        ocean: {
            label: 'ocean',
            emojis: ['🌊','🐋','🐬','🐠','🦈','🐙','🌊','🐚','🦀','🐡','🪸','🐳'],
            captions: [
                'Ocean Waves Photos – Unsplash',
                'Deep Sea Images [HD] – Pexels',
                'Beautiful Ocean Pictures – Shutterstock',
                'Underwater Photography – Getty',
                'Ocean Sunset Photos – Freepik',
                'Sea Animals Stock Images – iStock',
                'Coral Reef Photos – National Geographic',
                'Blue Ocean Wallpapers – WallpaperCave',
                'Ocean Surface Aerial – Adobe Stock',
                'Tropical Sea Photos – Vecteezy',
                'Stormy Ocean Images – Pixabay',
                'Ocean Floor Pictures – Smithsonian',
            ]
        }
    };

    // Check if query matches any image keyword
    const queryLower = query.toLowerCase();
    let matchedTheme = null;
    for (const [keyword, theme] of Object.entries(imageKeywords)) {
        if (queryLower.includes(keyword)) {
            matchedTheme = theme;
            break;
        }
    }

    // ── Render image search page ───────────────────────────
    if (matchedTheme) {
        return `
            <div class="mockup-google">
                <div class="mockup-google-header">
                    <span class="mockup-google-logo">Google</span>
                    <div class="mockup-google-searchbar">
                        <span class="mockup-search-icon">🔍</span>
                        <span class="mockup-search-text">${query}</span>
                    </div>
                </div>
                <div class="mockup-image-tabs">
                    <span class="mockup-image-tab">AI Mode</span>
                    <span class="mockup-image-tab">All</span>
                    <span class="mockup-image-tab mockup-image-tab-active">Images</span>
                    <span class="mockup-image-tab">Shopping</span>
                    <span class="mockup-image-tab">Videos</span>
                    <span class="mockup-image-tab">Forums</span>
                </div>
                <div class="mockup-image-grid">
                    ${matchedTheme.emojis.map((emoji, i) => `
                        <div class="mockup-image-cell">
                            <div class="mockup-image-thumb">${emoji}</div>
                            <div class="mockup-image-caption">${matchedTheme.captions[i] || ''}</div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }

    // ── Normal search results ──────────────────────────────
    const results = query ? [
        { title: query + ' - Wikipedia',       desc: 'From Wikipedia, the free encyclopedia. ' + query + ' is a widely known topic with many references.' },
        { title: 'Everything about ' + query,  desc: 'A comprehensive guide covering all aspects of ' + query + '. Updated regularly with latest information.' },
        { title: query + ' | Official Site',    desc: 'The official resource for ' + query + '. Find documentation, guides, and community support.' },
        { title: query + ' explained simply',   desc: 'Learn about ' + query + ' in simple terms. Beginner friendly with examples and diagrams.' },
        { title: 'Latest news on ' + query,     desc: 'Stay up to date with the latest developments and news related to ' + query + '.' },
    ] : [];

    return `
        <div class="mockup-google">
            <div class="mockup-google-header">
                <span class="mockup-google-logo">Google</span>
                <div class="mockup-google-searchbar">
                    <span class="mockup-search-icon">🔍</span>
                    <span class="mockup-search-text">${query || 'Search Google...'}</span>
                </div>
            </div>
            ${query ? `
            <div class="mockup-google-results">
                <p class="mockup-result-count">About 4,32,00,000 results (0.48 seconds)</p>
                ${results.map(r => `
                    <div class="mockup-result-item">
                        <span class="mockup-result-url">https://www.${r.title.toLowerCase().replace(/ /g,'-').substring(0,20)}.com</span>
                        <div class="mockup-result-title">${r.title}</div>
                        <div class="mockup-result-desc">${r.desc}</div>
                    </div>
                `).join('')}
            </div>
            ` : `
            <div class="mockup-google-home">
                <div class="mockup-google-big-logo">Google</div>
                <div class="mockup-google-home-search">
                    <span>🔍</span>
                    <span style="color:#888">Search Google or type a URL</span>
                </div>
            </div>
            `}
        </div>`;
}
function renderYoutube() {
    const videos = [
        { title: 'How to Build a Web Browser in C++',     channel: 'CodeWithMe',      views: '1.2M views',  time: '2 days ago',    thumb: '🎬' },
        { title: 'OOP Concepts Explained Simply',          channel: 'ProgrammingHub',  views: '890K views',  time: '1 week ago',    thumb: '💻' },
        { title: 'Data Structures Full Course 2024',       channel: 'TechAcademy',     views: '3.4M views',  time: '3 months ago',  thumb: '📚' },
        { title: 'Building REST APIs from Scratch',        channel: 'DevMaster',       views: '560K views',  time: '5 days ago',    thumb: '🔧' },
        { title: 'Linux Terminal for Beginners',           channel: 'LinuxWorld',      views: '2.1M views',  time: '2 weeks ago',   thumb: '🖥️' },
        { title: 'C++ Full Course — Zero to Hero',         channel: 'CppPro',          views: '4.7M views',  time: '6 months ago',  thumb: '⚡' },
    ];

    return `
        <div class="mockup-youtube">
            <div class="mockup-youtube-header">
                <span class="mockup-youtube-logo">▶ YouTube</span>
                <div class="mockup-youtube-search">
                    <span>🔍</span>
                    <span style="color:#aaa">Search</span>
                </div>
            </div>
            <div class="mockup-youtube-grid">
                ${videos.map(v => `
                    <div class="mockup-video-card">
                        <div class="mockup-video-thumb">${v.thumb}</div>
                        <div class="mockup-video-info">
                            <div class="mockup-video-title">${v.title}</div>
                            <div class="mockup-video-channel">${v.channel}</div>
                            <div class="mockup-video-meta">${v.views} • ${v.time}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;
}

function renderGithub() {
    const repos = [
        { name: 'browser-simulation',  lang: 'C++',        stars: '1.2k',  desc: 'A console and web based browser simulation using OOP' },
        { name: 'data-structures',     lang: 'C++',        stars: '3.4k',  desc: 'Implementation of all major data structures in C++' },
        { name: 'web-portfolio',       lang: 'JavaScript', stars: '234',   desc: 'Personal portfolio website built with HTML CSS JS' },
        { name: 'algo-visualizer',     lang: 'Python',     stars: '890',   desc: 'Algorithm visualization tool for learning purposes' },
    ];

    const langColors = { 'C++': '#f34b7d', 'JavaScript': '#f1e05a', 'Python': '#3572A5' };

    return `
        <div class="mockup-github">
            <div class="mockup-github-header">
                <span class="mockup-github-logo">🐙 GitHub</span>
                <div class="mockup-github-search">
                    <span>🔍</span>
                    <span style="color:#aaa">Search or jump to...</span>
                </div>
            </div>
            <div class="mockup-github-body">
                <div class="mockup-github-sidebar">
                    <div class="mockup-github-profile">
                        <div class="mockup-github-avatar">👤</div>
                        <div class="mockup-github-username">student-dev</div>
                        <div class="mockup-github-bio">CSE Student @ NIT Silchar</div>
                    </div>
                </div>
                <div class="mockup-github-repos">
                    <h3 class="mockup-section-title">Repositories</h3>
                    ${repos.map(r => `
                        <div class="mockup-repo-card">
                            <div class="mockup-repo-name">🔗 ${r.name}</div>
                            <div class="mockup-repo-desc">${r.desc}</div>
                            <div class="mockup-repo-meta">
                                <span class="mockup-repo-lang">
                                    <span class="mockup-lang-dot" style="background:${langColors[r.lang]}"></span>
                                    ${r.lang}
                                </span>
                                <span>⭐ ${r.stars}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;
}

function renderClaude() {
    return `
        <div class="mockup-claude">
            <div class="mockup-claude-header">
                <span class="mockup-claude-logo">✦ Claude</span>
            </div>
            <div class="mockup-claude-body">
                <div class="mockup-claude-greeting">Good afternoon.</div>
                <div class="mockup-claude-sub">How can I help you today?</div>
                <div class="mockup-claude-inputbar">
                    <span style="color:#888">Reply to Claude...</span>
                    <span class="mockup-claude-send">➤</span>
                </div>
                <div class="mockup-claude-suggestions">
                    <div class="mockup-claude-chip">✍️ Help me write</div>
                    <div class="mockup-claude-chip">💻 Code something</div>
                    <div class="mockup-claude-chip">📊 Analyze data</div>
                    <div class="mockup-claude-chip">🧠 Explain a concept</div>
                </div>
            </div>
        </div>`;
}

function renderChatGPT() {
    return `
        <div class="mockup-chatgpt">
            <div class="mockup-chatgpt-header">
                <span class="mockup-chatgpt-logo">🤖 ChatGPT</span>
            </div>
            <div class="mockup-chatgpt-body">
                <div class="mockup-chatgpt-greeting">How can I help you today?</div>
                <div class="mockup-chatgpt-inputbar">
                    <span style="color:#888">Message ChatGPT...</span>
                </div>
                <div class="mockup-chatgpt-suggestions">
                    <div class="mockup-chatgpt-chip">📝 Summarize text</div>
                    <div class="mockup-chatgpt-chip">💡 Brainstorm ideas</div>
                    <div class="mockup-chatgpt-chip">🔍 Research a topic</div>
                    <div class="mockup-chatgpt-chip">🐛 Debug my code</div>
                </div>
            </div>
        </div>`;
}

function renderLeetcode() {
    const problems = [
        { id: 1,    title: 'Two Sum',                    diff: 'Easy',   diff_class: 'easy',   acceptance: '52.3%' },
        { id: 2,    title: 'Add Two Numbers',            diff: 'Medium', diff_class: 'medium', acceptance: '41.7%' },
        { id: 3,    title: 'Longest Substring',          diff: 'Medium', diff_class: 'medium', acceptance: '34.1%' },
        { id: 4,    title: 'Median of Two Arrays',       diff: 'Hard',   diff_class: 'hard',   acceptance: '38.9%' },
        { id: 5,    title: 'Longest Palindrome',         diff: 'Medium', diff_class: 'medium', acceptance: '32.8%' },
        { id: 20,   title: 'Valid Parentheses',          diff: 'Easy',   diff_class: 'easy',   acceptance: '40.2%' },
        { id: 21,   title: 'Merge Two Sorted Lists',     diff: 'Easy',   diff_class: 'easy',   acceptance: '63.5%' },
        { id: 206,  title: 'Reverse Linked List',        diff: 'Easy',   diff_class: 'easy',   acceptance: '75.1%' },
    ];

    return `
        <div class="mockup-leetcode">
            <div class="mockup-leetcode-header">
                <span class="mockup-leetcode-logo">💻 LeetCode</span>
                <span class="mockup-leetcode-streak">🔥 7 day streak</span>
            </div>
            <div class="mockup-leetcode-table">
                <div class="mockup-leetcode-thead">
                    <span>Status</span>
                    <span>Title</span>
                    <span>Difficulty</span>
                    <span>Acceptance</span>
                </div>
                ${problems.map(p => `
                    <div class="mockup-leetcode-row">
                        <span class="mockup-leetcode-status">○</span>
                        <span class="mockup-leetcode-title">${p.id}. ${p.title}</span>
                        <span class="mockup-diff mockup-diff-${p.diff_class}">${p.diff}</span>
                        <span class="mockup-leetcode-acc">${p.acceptance}</span>
                    </div>
                `).join('')}
            </div>
        </div>`;
}

function renderImagePage(url) {
    return `
        <div class="mockup-image-page">
            <div class="page-image-placeholder">🖼️ Image: ${url}</div>
        </div>`;
}

function renderVideoPage(url) {
    return `
        <div class="mockup-video-page">
            <div class="page-video-placeholder">▶ Video: ${url}</div>
        </div>`;
}

function renderGeneric(domain, url) {
    const name = domain.charAt(0).toUpperCase() + domain.slice(1);
    return `
        <div class="mockup-generic">
            <div class="mockup-generic-icon">🌐</div>
            <div class="mockup-generic-name">${name}</div>
            <div class="mockup-generic-url">${url}</div>
            <div class="mockup-generic-note">Simulated page — no real internet connection</div>
        </div>`;
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

    // Known site names that should go directly to their website
    const knownSites = [
        'google', 'youtube', 'github', 'claude', 'chatgpt',
        'leetcode', 'facebook', 'instagram', 'twitter', 'reddit',
        'netflix', 'amazon', 'wikipedia', 'stackoverflow', 'hackerrank',
        'linkedin', 'openai', 'hackernews'
    ];

    const trimmed = url.trim().toLowerCase();

    // Check if it's a known site name
    const isKnownSite = knownSites.some(site => trimmed === site);

    // Check if it looks like a URL (has a dot like google.com)
    const looksLikeURL =
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(url);

    if (isKnownSite) {
        // Go directly to the site
        url = 'https://' + trimmed + '.com';
    } else if (!looksLikeURL) {
        // Treat as Google search
        url = 'https://google.com/search?q=' + encodeURIComponent(url);
    } else if (!url.startsWith('http')) {
        url = 'https://' + url;
    }

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

        tab.url          = data.url;
        tab.title        = formatTabTitle(data.url);
        tab.pageType     = data.type;
        tab.body         = data.body;
        tab.canGoBack    = data.canGoBack;
        tab.canGoForward = data.canGoForward;

        renderTabs();
        showPage(data);
        updateUI(data);

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

        tab.url = data.url || data.currentURL;

        // If forward takes us to "home"
        if (tab.url === 'home' || tab.url === '') {
            tab.url          = '';
            tab.title        = 'New Tab';
            tab.canGoBack    = data.canGoBack;
            tab.canGoForward = false;
            renderTabs();
            showNewTab();
            addressBar.value    = '';
            backBtn.disabled    = !data.canGoBack;
            forwardBtn.disabled = true;
            return;
        }

        tab.title        = formatTabTitle(tab.url);
        tab.pageType     = data.type;
        tab.body         = data.body;
        tab.canGoBack    = data.canGoBack;
        tab.canGoForward = data.canGoForward;

        renderTabs();
        showPage(data);
        backBtn.disabled    = !data.canGoBack;
        forwardBtn.disabled = !data.canGoForward;
        addressBar.value    = tab.url;

    } catch (err) {
        console.error('Forward error:', err);
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
    if (e.key !== 'Enter') return;

    const q = searchInput.value.trim();
    if (!q) return;

    // Check if it's a known site name
    const knownSites = [
        'google', 'youtube', 'github', 'claude', 'chatgpt',
        'leetcode', 'facebook', 'instagram', 'twitter', 'reddit',
        'netflix', 'amazon', 'wikipedia', 'stackoverflow', 'hackerrank',
        'linkedin', 'openai', 'hackernews'
    ];

    const specialDomains = {
        'claude':     'https://claude.ai',
        'hackernews': 'https://news.ycombinator.com',
        'chatgpt':    'https://chatgpt.com',
    };

    const lower = q.toLowerCase();
    const isKnownSite = knownSites.some(site => lower === site);

    if (isKnownSite) {
        // Go directly to the site
        const url = specialDomains[lower] || 'https://' + lower + '.com';
        navigate(url);
    } else {
        // Treat as Google search
        navigate('https://google.com/search?q=' + encodeURIComponent(q));
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