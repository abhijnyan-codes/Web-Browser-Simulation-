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
 
// ── Shortcuts data ──
let shortcuts = [
    { name: 'YouTube',    url: 'https://youtube.com',          icon: '▶️' },
    { name: 'ChatGPT',   url: 'https://chatgpt.com',           icon: '🤖' },
    { name: 'Claude',    url: 'https://claude.ai',             icon: '✦'  },
    { name: 'GitHub',    url: 'https://github.com',            icon: '🐙' },
    { name: 'LeetCode',  url: 'https://leetcode.com',          icon: '💻' },
    { name: 'HackerNews',url: 'https://news.ycombinator.com',  icon: '📰' },
];
 
let editMode = false;
let editingIndex = null;
 
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
            e.stopPropagation(); shortcuts.splice(i,1); renderShortcuts();
        });
        el.querySelector('.edit-badge').addEventListener('click', e => {
            e.stopPropagation(); openModal(i);
        });
        shortcutsEl.appendChild(el);
    });
 
    // Add tile
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
 
// ── Modal ──
function openModal(index) {
    editingIndex = index;
    document.getElementById('modalTitle').textContent = index !== null ? 'Edit Shortcut' : 'Add Shortcut';
    document.getElementById('modalName').value = index !== null ? shortcuts[index].name : '';
    document.getElementById('modalUrl').value  = index !== null ? shortcuts[index].url  : '';
    document.getElementById('modalIcon').value = index !== null ? shortcuts[index].icon : '';
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
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
 
// ── View switching ──
function showNewTab() {
    centerLayout.style.display  = 'flex';
    bottomDashboard.style.display = 'flex';
    pageContent.style.display   = 'none';
}
 
function showPage(url) {
    centerLayout.style.display    = 'none';
    bottomDashboard.style.display = 'none';
    pageContent.style.display     = 'block';
    let domain;
    try { domain = new URL(url).hostname.replace('www.',''); } catch { domain = url; }
    document.getElementById('urlBadge').textContent  = '🔒 ' + (new URL(url).hostname || url);
    document.getElementById('pageTitle').textContent = domain;
    document.getElementById('pageDesc').textContent  = `Simulated page for ${url}`;
    document.getElementById('pageTime').textContent  = 'Loaded at ' + new Date().toLocaleTimeString();
}
 
// ── Tabs ──
let tabs = [];
let activeTabId = null;
 
function createTab(title = 'New Tab', url = '') {
    const id = Date.now() + Math.random(); // avoid collision
    tabs.push({ id, title, url, history: url ? [url] : [], historyIndex: url ? 0 : -1 });
    renderTabs();
    switchTab(id);
    return id;
}
 
function renderTabs() {
    // remove all except add button
    [...tabsContainer.querySelectorAll('.tab')].forEach(t => t.remove());
    tabs.forEach(tab => {
        const el = document.createElement('div');
        el.className = 'tab' + (tab.id === activeTabId ? ' active' : '');
        el.innerHTML = `<span class="tab-title">${tab.title}</span><span class="tab-close">×</span>`;
        el.addEventListener('click', e => {
            if (e.target.classList.contains('tab-close')) closeTab(tab.id);
            else switchTab(tab.id);
        });
        tabsContainer.insertBefore(el, addTabBtn);
    });
}
 
function switchTab(id) {
    activeTabId = id;
    const tab = tabs.find(t => t.id === id);
    if (!tab) return;
    addressBar.value = tab.url || '';
    renderTabs();
    if (tab.url) showPage(tab.url); else showNewTab();
    updateNavBtns();
}
 
function closeTab(id) {
    const idx = tabs.findIndex(t => t.id === id);
    if (idx === -1) return;
    tabs.splice(idx, 1);
    if (tabs.length === 0) { createTab(); return; }
    switchTab(tabs[Math.min(idx, tabs.length - 1)].id);
}
 
function navigate(url) {
    if (!url) return;
    if (!url.startsWith('http')) url = 'https://' + url;
    const tab = tabs.find(t => t.id === activeTabId);
    if (!tab) return;
    tab.url = url;
    try { tab.title = new URL(url).hostname.replace('www.',''); } catch { tab.title = url; }
    tab.history = tab.history.slice(0, tab.historyIndex + 1);
    tab.history.push(url);
    tab.historyIndex = tab.history.length - 1;
    addressBar.value = url;
    renderTabs();
    showPage(url);
    updateNavBtns();
}
 
function updateNavBtns() {
    const tab = tabs.find(t => t.id === activeTabId);
    backBtn.disabled    = !tab || tab.historyIndex <= 0;
    forwardBtn.disabled = !tab || tab.historyIndex >= tab.history.length - 1;
}
 
// ── Clock ──
function updateClock() {
    const now  = new Date();
    let   h    = now.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const m  = String(now.getMinutes()).padStart(2, '0');
    const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
 
    document.getElementById('clockTime').textContent = `${String(h).padStart(2,'0')}:${m}`;
    document.getElementById('clockAmpm').textContent = ampm;
    document.getElementById('clockDate').textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}
 
// ── Quotes ──
const quotes = [
    "Small steps lead to big results.",
    "Focus on being productive instead of busy.",
    "Your future is created by what you do today.",
    "Don't stop until you're proud.",
    "The secret of getting ahead is getting started.",
    "Do something today that your future self will thank you for."
];
function updateQuote() {
    document.getElementById('quote').textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
}
 
// ── Events ──
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
 
backBtn.addEventListener('click', () => {
    const tab = tabs.find(t => t.id === activeTabId);
    if (!tab || tab.historyIndex <= 0) return;
    tab.historyIndex--;
    tab.url = tab.history[tab.historyIndex];
    try { tab.title = new URL(tab.url).hostname.replace('www.',''); } catch {}
    addressBar.value = tab.url;
    renderTabs();
    showPage(tab.url);
    updateNavBtns();
});
 
forwardBtn.addEventListener('click', () => {
    const tab = tabs.find(t => t.id === activeTabId);
    if (!tab || tab.historyIndex >= tab.history.length - 1) return;
    tab.historyIndex++;
    tab.url = tab.history[tab.historyIndex];
    try { tab.title = new URL(tab.url).hostname.replace('www.',''); } catch {}
    addressBar.value = tab.url;
    renderTabs();
    showPage(tab.url);
    updateNavBtns();
});
 
refreshBtn.addEventListener('click', () => {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab && tab.url) showPage(tab.url);
});
 
document.getElementById('newQuoteBtn').addEventListener('click', updateQuote);
 
// ── Init ──
createTab();
renderShortcuts();
updateClock();
updateQuote();
setInterval(updateClock, 1000);