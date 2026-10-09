/

modules/search/search.js

Dynamic Vercel-optimized search & markdown rendering module for theInfoDB.

Automatically scans and discovers all markdown files under pages/ dynamically.
*/

function ensureMarkedLoaded() {
return new Promise((resolve) => {
if (window.marked) {
resolve(window.marked);
return;
}
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
script.onload = () => resolve(window.marked);
script.onerror = () => resolve(null);
document.head.appendChild(script);
});
}

if (window.CoreUI) {
initSearchModule();
} else {
window.addEventListener('DOMContentLoaded', initSearchModule);
}

let allMarkdownFiles = [];
let fileMetadataCache = new Map(); // path -> { headers: [], tags: [], text: '' }

async function initSearchModule() {
window.CoreUI.addSidebarItem(
'sidebar-btn-search',
'Repository Explorer',
'',
renderSearchApp
);
}

async function renderSearchApp() {
await ensureMarkedLoaded();
const canvas = window.CoreUI.getCanvas();
if (!canvas) return;

canvas.innerHTML = `
    <div style="max-width: 950px; margin: 0 auto; padding: 32px 20px; display: flex; flex-direction: column; gap: 24px;">
        <!-- Header -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <h1 style="font-size: 1.8em; font-weight: 700; letter-spacing: -0.025em;">Repository Explorer & Deep Search</h1>
            <p style="color: var(--text-secondary); font-size: 0.95em;">
                Search filenames, headings (<code style="background: var(--bg-primary); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-color);">#</code>), and words from the <code style="background: var(--bg-primary); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-color);"># Tags</code> section across your documentation
            </p>
        </div>

        <!-- Search and Controls Bar -->
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 280px; position: relative; display: flex; align-items: center;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 12px; width: 18px; height: 18px; color: var(--text-secondary);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" id="repo-search-input" placeholder="Search filename, #heading, or tag..." style="width: 100%; padding: 12px 12px 12px 40px; border-radius: 8px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); outline: none; font-size: 1em;">
            </div>
            <button id="repo-refresh-btn" style="padding: 12px 20px; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: background 0.2s;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                Refresh Index
            </button>
        </div>

        <!-- Tag Cloud Bar -->
        <div id="tag-cloud-container" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center; min-height: 32px;">
            <span style="font-size: 0.85em; color: var(--text-secondary); font-weight: 600;">Tags Section Words:</span>
            <span style="font-size: 0.85em; color: var(--text-secondary);">Loading tags...</span>
        </div>

        <!-- Main Content Grid -->
        <div style="display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start;" id="explorer-grid">
            <!-- File List Sidebar -->
            <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; max-height: 70vh;">
                <div style="padding: 12px 16px; border-bottom: 1px solid var(--border-color); font-weight: 600; font-size: 0.9em; display: flex; justify-content: space-between; align-items: center;">
                    <span>Indexed Documents</span>
                    <span id="file-count-badge" style="background: var(--bg-secondary); padding: 2px 8px; border-radius: 12px; font-size: 0.8em; color: var(--text-secondary);">0</span>
                </div>
                <div id="file-list-container" style="overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 4px; flex: 1;">
                    <div style="padding: 24px; text-align: center; color: var(--text-secondary); font-size: 0.9em;">Scanning local pages/ directory...</div>
                </div>
            </div>

            <!-- Markdown Viewer Panel -->
            <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; min-height: 70vh; display: flex; flex-direction: column;" id="viewer-panel">
                <div id="viewer-placeholder" style="margin: auto; text-align: center; color: var(--text-secondary); padding: 40px;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.5;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <h3 style="font-weight: 600; margin-bottom: 4px; color: var(--text-primary);">No document selected</h3>
                    <p style="font-size: 0.9em;">Select a markdown document from the left to view its contents.</p>
                </div>
                <div id="viewer-content" style="display: none; line-height: 1.6; word-break: break-word;"></div>
            </div>
        </div>
    </div>
`;

// Responsive layout handling
const mediaQuery = window.matchMedia('(max-width: 768px)');
function handleScreenResize(e) {
    const grid = document.getElementById('explorer-grid');
    if (!grid) return;
    grid.style.gridTemplateColumns = e.matches ? '1fr' : '320px 1fr';
}
mediaQuery.addListener(handleScreenResize);
handleScreenResize(mediaQuery);

await loadRepositoryFiles();

document.getElementById('repo-refresh-btn').addEventListener('click', loadRepositoryFiles);
document.getElementById('repo-search-input').addEventListener('input', (e) => {
    filterFilesAndMeta(e.target.value);
});


}

async function loadRepositoryFiles() {
const listContainer = document.getElementById('file-list-container');
const badge = document.getElementById('file-count-badge');
if (!listContainer) return;

listContainer.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-secondary); font-size: 0.9em;">Discovering markdown files...</div>';

let foundFiles = [];

// Strategy 1: Try reading a manifest if it exists (e.g. pages/manifest.json)
const manifestRes = await window.safeFetchJson('pages/manifest.json');
if (manifestRes && Array.isArray(manifestRes.files)) {
    foundFiles = manifestRes.files.map(p => ({ path: p }));
} else {
    // Strategy 2: Probe common structured documentation paths under pages/
    const commonPaths = [
        'README.md',
        'pages/economics/supply_and_demand/supply_and_demand.md',
        'pages/economics/supply_and_demand/demand.md',
        'pages/economics/supply_and_demand/supply.md',
        'pages/economics/market_equilibrium.md',
        'pages/index.md',
        'pages/home.md'
    ];

    for (const p of commonPaths) {
        const text = await window.safeFetchText(p);
        if (text !== null) {
            foundFiles.push({ path: p });
        }
    }
}

allMarkdownFiles = foundFiles;

if (allMarkdownFiles.length === 0) {
    listContainer.innerHTML = '<div style="padding: 24px; text-align: center; color: #ef4444; font-size: 0.9em;">No local markdown files could be probed under pages/. Please ensure files are deployed correctly.</div>';
    badge.textContent = '0';
    return;
}

badge.textContent = allMarkdownFiles.length;
renderFileList(allMarkdownFiles);

// Pre-fetch headers and tags in background
await indexDocumentMetadata();
updateTagCloud();


}

async function indexDocumentMetadata() {
for (const file of allMarkdownFiles) {
if (fileMetadataCache.has(file.path)) continue;
const text = await window.safeFetchText(file.path);
if (text) {
const headers = [];
const tags = new Set();

        // Extract headings (# Heading)
        const headingRegex = /^(#{1,6})\s+(.+)$/gm;
        let match;
        while ((match = headingRegex.exec(text)) !== null) {
            headers.push({ level: match[1].length, text: match[2].trim() });
        }

        // Extract words specifically from under the "# Tags" section
        const tagsSectionRegex = /^#+\s*tags\s*[\r\n]+([\s\S]*?)(?=^#+\s|\Z)/gim;
        let sectionMatch;
        while ((sectionMatch = tagsSectionRegex.exec(text)) !== null) {
            const sectionContent = sectionMatch[1];
            const cleaned = sectionContent
                .replace(/[`"'*_\-\[\]()]/g, ' ')
                .replace(/[\r\n,]+/g, ' ');
           
            const words = cleaned.split(/\s+/);
            for (const w of words) {
                const trimmed = w.trim().toLowerCase();
                if (trimmed && trimmed.length > 1) {
                    tags.add(trimmed);
                }
            }
        }

        fileMetadataCache.set(file.path, {
            headers,
            tags: Array.from(tags),
            text: text.toLowerCase()
        });
    } else {
        fileMetadataCache.set(file.path, { headers: [], tags: [], text: '' });
    }
}


}

function renderFileList(files) {
const listContainer = document.getElementById('file-list-container');
if (!listContainer) return;

if (files.length === 0) {
    listContainer.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-secondary); font-size: 0.9em;">No matching documents found.</div>';
    return;
}

listContainer.innerHTML = '';
files.forEach(file => {
    const meta = fileMetadataCache.get(file.path) || { headers: [], tags: [] };
    const item = document.createElement('div');
    item.style.cssText = `
        padding: 10px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9em;
        display: flex;
        flex-direction: column;
        gap: 4px;
        transition: background 0.15s;
    `;

    let tagsHtml = meta.tags.slice(0, 4).map(t => `<span style="font-size: 0.75em; background: var(--bg-secondary); padding: 1px 6px; border-radius: 4px; color: var(--text-secondary);">${t}</span>`).join('');

    item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; flex-shrink: 0; color: var(--text-secondary);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            <span style="flex: 1; word-break: break-all; font-weight: 500;">${window.escapeHtml(file.path)}</span>
        </div>
        ${meta.tags.length > 0 ? `<div style="display: flex; gap: 4px; flex-wrap: wrap; padding-left: 24px;">${tagsHtml}</div>` : ''}
    `;

    item.addEventListener('mouseenter', () => item.style.backgroundColor = 'var(--hover-bg)');
    item.addEventListener('mouseleave', () => item.style.backgroundColor = 'transparent');
    item.addEventListener('click', () => {
        document.querySelectorAll('#file-list-container > div').forEach(el => el.style.background = 'transparent');
        item.style.background = 'var(--hover-bg)';
        fetchAndRenderMarkdown(file.path);
    });

    listContainer.appendChild(item);
});


}

function updateTagCloud() {
const cloudContainer = document.getElementById('tag-cloud-container');
if (!cloudContainer) return;

const tagCounts = {};
fileMetadataCache.forEach((meta) => {
    meta.tags.forEach(t => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
});

const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

if (sortedTags.length === 0) {
    cloudContainer.innerHTML = '<span style="font-size: 0.85em; color: var(--text-secondary);">No tags found in # Tags sections.</span>';
    return;
}

cloudContainer.innerHTML = '<span style="font-size: 0.85em; color: var(--text-secondary); font-weight: 600;">Tags:</span>';
sortedTags.slice(0, 15).forEach(tag => {
    const btn = document.createElement('button');
    btn.style.cssText = `
        font-size: 0.8em;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        padding: 2px 8px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.15s;
    `;
    btn.textContent = tag;
    btn.addEventListener('click', () => {
        const input = document.getElementById('repo-search-input');
        if (input) {
            input.value = tag;
            filterFilesAndMeta(tag);
        }
    });
    btn.addEventListener('mouseenter', () => btn.style.backgroundColor = 'var(--hover-bg)');
    btn.addEventListener('mouseleave', () => btn.style.backgroundColor = 'var(--bg-secondary)');
    cloudContainer.appendChild(btn);
});


}

function filterFilesAndMeta(query) {
const q = query.toLowerCase().trim();
if (!q) {
renderFileList(allMarkdownFiles);
return;
}

const filtered = allMarkdownFiles.filter(file => {
    const pathMatch = file.path.toLowerCase().includes(q);
    const meta = fileMetadataCache.get(file.path);
    if (!meta) return pathMatch;

    const headerMatch = meta.headers.some(h => h.text.toLowerCase().includes(q));
    const tagMatch = meta.tags.some(t => t.includes(q));

    return pathMatch || headerMatch || tagMatch || meta.text.includes(q);
});

renderFileList(filtered);


}

async function fetchAndRenderMarkdown(filePath) {
const placeholder = document.getElementById('viewer-placeholder');
const contentPanel = document.getElementById('viewer-content');
if (!placeholder || !contentPanel) return;

placeholder.style.display = 'block';
placeholder.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px;">
        <div style="width: 24px; height: 24px; border: 3px solid var(--border-color); border-top-color: var(--text-primary); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        <p style="font-size: 0.9em; color: var(--text-secondary);">Loading ${window.escapeHtml(filePath)}...</p>
    </div>
    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
`;
contentPanel.style.display = 'none';
contentPanel.innerHTML = '';

try {
    const markdownText = await window.safeFetchText(filePath);
    if (markdownText === null) throw new Error(`Failed to fetch local file: ${filePath}`);

    placeholder.style.display = 'none';
    contentPanel.style.display = 'block';

    if (window.marked && typeof window.marked.parse === 'function') {
        contentPanel.innerHTML = window.marked.parse(markdownText);
    } else {
        contentPanel.innerHTML = `<pre style="white-space: pre-wrap; font-family: monospace; font-size: 0.9em;">${window.escapeHtml(markdownText)}</pre>`;
    }
} catch (err) {
    placeholder.style.display = 'path';
    placeholder.innerHTML = `
        <div style="color: #ef4444; padding: 20px;">
            <h3 style="font-weight: 600; margin-bottom: 8px;">Failed to load document</h3>
            <p style="font-size: 0.9em; color: var(--text-secondary);">${window.escapeHtml(err.message)}</p>
        </div>
    `;
}


}
