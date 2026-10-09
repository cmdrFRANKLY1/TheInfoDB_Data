(function() {
    // SVG Icon for the sidebar (Magnifying Glass)
    const iconPath = `
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    `;

    // Local state for the search module
    let pagesCache = [];
    let isFetchingPages = false;
    let hasFetchedPages = false;

    // Inject 'marked.js' dynamically to parse the markdown files beautifully
    if (typeof marked === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        document.head.appendChild(script);
    }

    function renderSearchUI() {
        const canvas = window.CoreUI.getCanvas();
        window.CoreUI.clearCanvas();

        // Main Container
        const container = document.createElement('div');
        container.style.maxWidth = '800px';
        container.style.margin = '0 auto';
        container.style.padding = '24px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '24px';
        container.style.height = '100%';

        // Header and Search Input
        container.innerHTML = `
            <div>
                <h1 style="margin-bottom: 8px;">Knowledge Base</h1>
                <p style="color: var(--text-secondary); font-size: 0.9em;">Search and browse markdown pages from the repository.</p>
            </div>

            <!-- Big Search Bar -->
            <div style="position: relative; width: 100%;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: var(--text-secondary);">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" id="kb-search-input" placeholder="Search pages by title..." style="width: 100%; padding: 16px 16px 16px 48px; border-radius: 12px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); outline: none; font-size: 1.1em; transition: all 0.2s; box-shadow: var(--shadow);">
            </div>

            <!-- Results / Content Area -->
            <div id="kb-content-area" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-bottom: 40px;">
                <div style="color: var(--text-secondary); text-align: center; padding: 40px; font-size: 0.9em;">
                    Loading repository data...
                </div>
            </div>
        `;

        canvas.appendChild(container);

        const style = document.createElement('style');
        style.innerHTML = `
            #kb-search-input:focus {
                border-color: var(--text-primary) !important;
            }
            .kb-result-card {
                background-color: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 16px;
                cursor: pointer;
                transition: all 0.2s;
                box-shadow: var(--shadow);
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .kb-result-card:hover {
                border-color: var(--text-primary);
                transform: translateY(-2px);
            }
            .kb-result-icon {
                color: var(--text-secondary);
            }
            .kb-markdown-container {
                background-color: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 32px;
                line-height: 1.6;
                box-shadow: var(--shadow);
            }
            .kb-markdown-container h1, .kb-markdown-container h2, .kb-markdown-container h3 {
                margin-top: 1.5em;
                margin-bottom: 0.5em;
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 0.3em;
            }
            .kb-markdown-container code {
                background-color: var(--bg-secondary);
                padding: 2px 6px;
                border-radius: 4px;
                font-family: monospace;
                font-size: 0.9em;
            }
            .kb-markdown-container pre {
                background-color: var(--bg-secondary);
                padding: 16px;
                border-radius: 8px;
                overflow-x: auto;
                border: 1px solid var(--border-color);
            }
            .kb-markdown-container a {
                color: var(--text-primary);
                text-decoration: underline;
            }
            .kb-back-btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                background-color: var(--bg-secondary);
                color: var(--text-primary);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9em;
                font-weight: 600;
                margin-bottom: 16px;
                transition: opacity 0.2s;
            }
            .kb-back-btn:hover {
                opacity: 0.8;
            }
        `;
        canvas.appendChild(style);

        // Bind event listeners
        const searchInput = document.getElementById('kb-search-input');
        searchInput.addEventListener('input', (e) => renderResults(e.target.value));

        // Start fetching data
        fetchPagesData();
    }

    async function fetchPagesData() {
        if (hasFetchedPages) {
            renderResults(document.getElementById('kb-search-input').value);
            return;
        }
        
        if (isFetchingPages) return;
        isFetchingPages = true;

        const contentArea = document.getElementById('kb-content-area');
        
        try {
            const repoApiUrl = 'https://api.github.com/repos/cmdrFRANKLY1/TheInfoDB_Data/contents/pages';
            const res = await fetch(repoApiUrl);
            
            if (res.ok) {
                const items = await res.json();
                
                // Filter only markdown files
                pagesCache = items.filter(item => item.type === 'file' && item.name.endsWith('.md'));
                hasFetchedPages = true;
                
                if(contentArea) renderResults(document.getElementById('kb-search-input').value);
            } else {
                throw new Error("GitHub API Error: " + res.statusText);
            }
        } catch (e) {
            console.warn("Failed to fetch /pages/ directory:", e);
            if (contentArea) {
                contentArea.innerHTML = `
                    <div style="color: #ef4444; padding: 24px; border: 1px solid #ef4444; border-radius: 8px; background: rgba(239, 68, 68, 0.1);">
                        <strong>Error loading pages:</strong> Unable to fetch data from GitHub. You may have hit a rate limit.
                    </div>
                `;
            }
        } finally {
            isFetchingPages = false;
        }
    }

    function renderResults(query = "") {
        const contentArea = document.getElementById('kb-content-area');
        if (!contentArea) return;

        contentArea.innerHTML = ''; // Clear current
        
        if (pagesCache.length === 0) {
            contentArea.innerHTML = `<div style="color: var(--text-secondary); text-align: center; padding: 40px;">No markdown pages found in the repository.</div>`;
            return;
        }

        const lowerQuery = query.toLowerCase();
        
        // Filter by filename (removing the .md extension for cleanliness)
        const filtered = pagesCache.filter(page => {
            const cleanName = page.name.replace('.md', '').toLowerCase();
            return cleanName.includes(lowerQuery);
        });

        if (filtered.length === 0) {
            contentArea.innerHTML = `<div style="color: var(--text-secondary); text-align: center; padding: 40px;">No pages match your search.</div>`;
            return;
        }

        // Render Cards
        filtered.forEach(page => {
            const card = document.createElement('div');
            card.className = 'kb-result-card';
            
            const cleanTitle = page.name.replace('.md', '').replace(/-/g, ' ');
            
            card.innerHTML = `
                <svg class="kb-result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <div style="flex: 1;">
                    <div style="font-weight: 600; text-transform: capitalize;">${cleanTitle}</div>
                    <div style="font-size: 0.8em; color: var(--text-secondary);">${page.path}</div>
                </div>
            `;
            
            card.addEventListener('click', () => loadAndRenderPage(page));
            contentArea.appendChild(card);
        });
    }

    async function loadAndRenderPage(page) {
        const contentArea = document.getElementById('kb-content-area');
        if (!contentArea) return;

        // Show loading state
        contentArea.innerHTML = `
            <button class="kb-back-btn" id="kb-btn-back">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Back to Search
            </button>
            <div style="color: var(--text-secondary); padding: 40px; text-align: center;">Fetching document...</div>
        `;

        document.getElementById('kb-btn-back').addEventListener('click', () => {
            renderResults(document.getElementById('kb-search-input').value);
        });

        try {
            // Using jsDelivr to bypass raw.githubusercontent limits/MIME issues easily if needed,
            // but standard download_url works well for raw text.
            const res = await fetch(page.download_url);
            
            if (res.ok) {
                const markdownText = await res.text();
                
                // Parse markdown if library loaded, otherwise raw text
                const htmlContent = (typeof marked !== 'undefined') 
                    ? marked.parse(markdownText) 
                    : `<pre style="white-space: pre-wrap; font-family: inherit;">${markdownText}</pre>`;

                contentArea.innerHTML = `
                    <button class="kb-back-btn" id="kb-btn-back-loaded">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Back to Search
                    </button>
                    <div class="kb-markdown-container">
                        ${htmlContent}
                    </div>
                `;

                document.getElementById('kb-btn-back-loaded').addEventListener('click', () => {
                    renderResults(document.getElementById('kb-search-input').value);
                });

            } else {
                throw new Error("Failed to load markdown.");
            }
        } catch (e) {
            contentArea.innerHTML = `
                <button class="kb-back-btn" id="kb-btn-back-error">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back to Search
                </button>
                <div style="color: #ef4444; padding: 24px; border: 1px solid #ef4444; border-radius: 8px; background: rgba(239, 68, 68, 0.1);">
                    <strong>Error:</strong> Could not load document content.
                </div>
            `;
            document.getElementById('kb-btn-back-error').addEventListener('click', () => {
                renderResults(document.getElementById('kb-search-input').value);
            });
        }
    }

    // Immediately register this module into the Monochrome Core UI sidebar
    if (window.CoreUI && typeof window.CoreUI.addSidebarItem === 'function') {
        const sidebarBtn = window.CoreUI.addSidebarItem('module-search', 'Search', iconPath, renderSearchUI);
        
        // Example: Add a setting for this module if needed in the future
        if (window.CoreUI.addSettingToggle) {
            window.CoreUI.addSettingToggle('setting-search-preload', 'Search: Preload Markdown (Beta)', false, (state) => {
                console.log('Search preload toggled:', state);
                // Implementation for preloading could go here
            });
        }
    } else {
        console.error("CoreUI API not found. Cannot mount Search module.");
    }

})();
