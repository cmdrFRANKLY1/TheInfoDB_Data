/**
 * modules/search/search.js
 * 
 * A fully self-contained search & markdown rendering module designed for 
 * your theInfoDB app. It registers itself in the sidebar, provides a clean
 * full-screen UI, queries your GitHub repository's content tree (via jsDelivr
 * or raw.githubusercontent.com), and renders markdown documents dynamically.
 */

// Ensure marked.js is available (load it if missing)
function ensureMarkedLoaded() {
    return new Promise((resolve) => {
        if (window.marked) {
            resolve(window.marked);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        script.onload = () => resolve(window.marked);
        script.onerror = () => {
            console.warn('[SearchModule] Failed to load marked.js via CDN, falling back to basic preformatted text.');
            resolve(null);
        };
        document.head.appendChild(script);
    });
}

// Register in sidebar as soon as the script executes
if (window.CoreUI) {
    initSearchModule();
} else {
    window.addEventListener('DOMContentLoaded', initSearchModule);
}

function initSearchModule() {
    // Add the search/explorer button to the sidebar
    // Icon: Folder/Search icon
    const iconPath = '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>';
    window.CoreUI.addSidebarItem('nav-search-module', 'Explore & Search', iconPath, renderSearchApp);
}

async function renderSearchApp() {
    await ensureMarkedLoaded();
    const canvas = window.CoreUI.getCanvas();
    if (!canvas) return;

    canvas.innerHTML = `
        <div style="max-width: 900px; margin: 0 auto; padding: 32px 20px; display: flex; flex-direction: column; gap: 24px;">
            <!-- Header -->
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <h1 style="font-size: 1.8em; font-weight: 700; letter-spacing: -0.025em;">Repository Explorer & Search</h1>
                <p style="color: var(--text-secondary); font-size: 0.95em;">
                    Fetching markdown files directly from <code style="background: var(--bg-primary); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-color); font-family: monospace;">cmdrFRANKLY1/TheInfoDB_Data</code>
                </p>
            </div>

            <!-- Search and Controls Bar -->
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 260px; position: relative; display: flex; align-items: center;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 12px; width: 18px; height: 18px; color: var(--text-secondary);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" id="repo-search-input" placeholder="Search filenames or keywords..." style="width: 100%; padding: 12px 12px 12px 40px; border-radius: 8px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); outline: none; font-size: 1em;">
                </div>
                <button id="repo-refresh-btn" style="padding: 12px 20px; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: background 0.2s;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                    Refresh File List
                </button>
            </div>

            <!-- Main Content Grid -->
            <div style="display: grid; grid-template-columns: 280px 1fr; gap: 24px; align-items: start;" id="explorer-grid">
                <!-- File List Sidebar -->
                <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; max-height: 70vh;">
                    <div style="padding: 12px 16px; border-bottom: 1px solid var(--border-color); font-weight: 600; font-size: 0.9em; display: flex; justify-content: space-between; align-items: center;">
                        <span>Markdown Files</span>
                        <span id="file-count-badge" style="background: var(--bg-secondary); padding: 2px 8px; border-radius: 12px; font-size: 0.8em; color: var(--text-secondary);">0</span>
                    </div>
                    <div id="file-list-container" style="overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 4px; flex: 1;">
                        <div style="padding: 24px; text-align: center; color: var(--text-secondary); font-size: 0.9em;">Loading repository files...</div>
                    </div>
                </div>

                <!-- Markdown Viewer Panel -->
                <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; min-height: 70vh; display: flex; flex-direction: column;" id="viewer-panel">
                    <div id="viewer-placeholder" style="margin: auto; text-align: center; color: var(--text-secondary); padding: 40px;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.5;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <h3 style="font-weight: 600; margin-bottom: 4px; color: var(--text-primary);">No file selected</h3>
                        <p style="font-size: 0.9em;">Select a markdown file from the left sidebar to view its content.</p>
                    </div>
                    <div id="viewer-content" style="display: none; line-height: 1.6; word-break: break-word;"></div>
                </div>
            </div>
        </div>
    `;

    // Responsive grid adjustment for mobile
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    function handleScreenResize(e) {
        const grid = document.getElementById('explorer-grid');
        if (!grid) return;
        if (e.matches) {
            grid.style.gridTemplateColumns = '1fr';
        } else {
            grid.style.gridTemplateColumns = '280px 1fr';
        }
    }
    mediaQuery.addListener(handleScreenResize);
    handleScreenResize(mediaQuery);

    // Load file list
    await loadRepositoryFiles();

    // Attach event listeners
    document.getElementById('repo-refresh-btn').addEventListener('click', loadRepositoryFiles);
    document.getElementById('repo-search-input').addEventListener('input', (e) => {
        filterFileList(e.target.value);
    });
}

let allMarkdownFiles = [];

async function loadRepositoryFiles() {
    const listContainer = document.getElementById('file-list-container');
    const badge = document.getElementById('file-count-badge');
    if (!listContainer) return;

    listContainer.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-secondary); font-size: 0.9em;">Fetching file tree from GitHub...</div>';

    const cfg = window.__APP_CONFIG__.github;
    // GitHub Git Trees API recursively fetches the full repository tree
    const apiUrl = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/git/trees/${cfg.branch}?recursive=1`;

    try {
        const headers = { 'Accept': 'application/vnd.github+json' };
        if (window.__GITHUB_TOKEN__) {
            headers['Authorization'] = `Bearer ${window.__GITHUB_TOKEN__}`;
        }

        const res = await fetch(apiUrl, { headers });
        if (!res.ok) {
            throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        if (!data || !Array.isArray(data.tree)) {
            throw new Error('Invalid tree response format from GitHub');
        }

        // Filter for markdown (.md) files across all folders (including pages/economics/supply_and_demand/demand.md)
        allMarkdownFiles = data.tree.filter(item => item.type === 'blob' && item.path.toLowerCase().endsWith('.md'));
        badge.textContent = allMarkdownFiles.length;

        renderFileList(allMarkdownFiles);

    } catch (err) {
        console.warn('[SearchModule] Failed to fetch git tree API, falling back to known paths and discovery:', err);
        
        // Fallback: Expanded known preset files and standard directories
        allMarkdownFiles = [
            { path: 'pages/economics/supply_and_demand/demand.md' },
            { path: 'README.md' },
            { path: 'modules/search/README.md' }
        ];
        badge.textContent = allMarkdownFiles.length;
        renderFileList(allMarkdownFiles);
    }
}

function renderFileList(files) {
    const listContainer = document.getElementById('file-list-container');
    if (!listContainer) return;

    if (files.length === 0) {
        listContainer.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-secondary); font-size: 0.9em;">No markdown files found.</div>';
        return;
    }

    listContainer.innerHTML = '';
    files.forEach(file => {
        const item = document.createElement('div');
        item.style.cssText = `
            padding: 10px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9em;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: background 0.15s;
            word-break: break-all;
        `;
        item.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; flex-shrink: 0; color: var(--text-secondary);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            <span style="flex: 1;">${window.escapeHtml(file.path)}</span>
        `;
        
        item.addEventListener('mouseenter', () => item.style.backgroundColor = 'var(--hover-bg)');
        item.addEventListener('mouseleave', () => item.style.backgroundColor = 'transparent');
        item.addEventListener('click', () => {
            // Highlight selected
            document.querySelectorAll('#file-list-container > div').forEach(el => el.style.background = 'transparent');
            item.style.background = 'var(--hover-bg)';
            fetchAndRenderMarkdown(file.path);
        });

        listContainer.appendChild(item);
    });
}

function filterFileList(query) {
    const q = query.toLowerCase();
    const filtered = allMarkdownFiles.filter(f => f.path.toLowerCase().includes(q));
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

    // Construct reliable jsDelivr CDN URL (bypasses CORS entirely and serves fast cached assets)
    const fileUrl = window.resolveUrl(filePath);

    try {
        const markdownText = await window.safeFetchText(fileUrl);
        if (markdownText === null) {
            throw new Error(`Failed to fetch file content from ${fileUrl}`);
        }

        placeholder.style.display = 'none';
        contentPanel.style.display = 'block';

        if (window.marked && typeof window.marked.parse === 'function') {
            contentPanel.innerHTML = window.marked.parse(markdownText);
        } else {
            // Fallback if marked didn't load
            contentPanel.innerHTML = `<pre style="white-space: pre-wrap; font-family: monospace; font-size: 0.9em;">${window.escapeHtml(markdownText)}</pre>`;
        }

    } catch (err) {
        placeholder.style.display = 'block';
        placeholder.innerHTML = `
            <div style="color: #ef4444; padding: 20px;">
                <h3 style="font-weight: 600; margin-bottom: 8px;">Failed to load file</h3>
                <p style="font-size: 0.9em; color: var(--text-secondary);">${window.escapeHtml(err.message)}</p>
                <p style="font-size: 0.8em; margin-top: 12px; font-family: monospace; color: var(--text-secondary);">URL: ${window.escapeHtml(fileUrl)}</p>
            </div>
        `;
    }
}