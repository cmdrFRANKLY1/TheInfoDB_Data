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

    // Inject 'marked.js' dynamically if not present
    if (typeof marked === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        document.head.appendChild(script);
    }

    function renderSearchUI() {
        const canvas = window.CoreUI.getCanvas();
        window.CoreUI.clearCanvas();

        const container = document.createElement('div');
        container.style.maxWidth = '800px';
        container.style.margin = '0 auto';
        container.style.padding = '24px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '24px';
        container.style.height = '100%';

        container.innerHTML = `
            <div>
                <h1 style="margin-bottom: 8px;">Knowledge Base</h1>
                <p style="color: var(--text-secondary); font-size: 0.9em;">Search and browse Google-style indexed markdown pages from GitHub.</p>
            </div>

            <!-- Google-style Search Bar -->
            <div style="position: relative; width: 100%;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: var(--text-secondary);">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" id="kb-search-input" placeholder="Search pages by title, tags, or content..." style="width: 100%; padding: 16px 16px 16px 48px; border-radius: 12px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); outline: none; font-size: 1.1em; transition: all 0.2s; box-shadow: var(--shadow);">
            </div>

            <!-- Results / Content Area -->
            <div id="kb-content-area" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; padding-bottom: 40px;">
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
                border-radius: 12px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.2s;
                box-shadow: var(--shadow);
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .kb-result-card:hover {
                border-color: var(--text-primary);
                transform: translateY(-2px);
            }
            .kb-tag-pill {
                display: inline-block;
                background-color: var(--bg-secondary);
                border: 1px solid var(--border-color);
                padding: 2px 8px;
                border-radius: 6px;
                font-size: 0.75em;
                color: var(--text-secondary);
                margin-right: 6px;
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
            .kb-tooltip {
                border-bottom: 1px dashed var(--text-primary);
                cursor: help;
                position: relative;
            }
        `;
        canvas.appendChild(style);

        const searchInput = document.getElementById('kb-search-input');
        searchInput.addEventListener('input', (e) => renderResults(e.target.value));

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
                const mdFiles = items.filter(item => item.type === 'file' && item.name.endsWith('.md'));
                
                // Fetch each markdown file to parse tags/metadata for Google-style searching
                pagesCache = await Promise.all(mdFiles.map(async (file) => {
                    let tags = [];
                    let dependencies = [];
                    let mouseOvers = {};
                    let hyperlinks = {};
                    let rawText = '';
                    
                    try {
                        const fileRes = await fetch(file.download_url);
                        if (fileRes.ok) {
                            rawText = await fileRes.text();
                            
                            // Parse # Tags
                            const tagsMatch = rawText.match(/#\s*Tags\s*\n([\s\S]*?)(?=\n#|$)/i);
                            if (tagsMatch) {
                                tags = tagsMatch[1].split(/[\n,]+/).map(t => t.trim().replace(/^[-*]\s*/, '')).filter(Boolean);
                            }

                            // Parse # Dependencies
                            const depMatch = rawText.match(/#\s*Dependencies\s*\n([\s\S]*?)(?=\n#|$)/i);
                            if (depMatch) {
                                dependencies = depMatch[1].split(/[\n,]+/).map(d => d.trim().replace(/^[-*]\s*/, '')).filter(Boolean);
                            }

                            // Parse # Mouse Over Information
                            const moMatch = rawText.match(/#\s*Mouse Over Information\s*\n([\s\S]*?)(?=\n#|$)/i);
                            if (moMatch) {
                                moMatch[1].split('\n').forEach(line => {
                                    const parts = line.split(/[:|-]/);
                                    if (parts.length >= 2) {
                                        mouseOvers[parts[0].trim().toLowerCase()] = parts.slice(1).join(':').trim();
                                    }
                                });
                            }

                            // Parse # Hyperlinks
                            const hypMatch = rawText.match(/#\s*Hyperlinks\s*\n([\s\S]*?)(?=\n#|$)/i);
                            if (hypMatch) {
                                hypMatch[1].split('\n').forEach(line => {
                                    const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
                                    if (match) {
                                        hyperlinks[match[1].toLowerCase()] = match[2];
                                    }
                                });
                            }
                        }
                    } catch (err) {
                        console.warn("Could not parse file metadata:", file.name);
                    }

                    return {
                        ...file,
                        cleanTitle: file.name.replace('.md', '').replace(/-/g, ' '),
                        tags,
                        dependencies,
                        mouseOvers,
                        hyperlinks,
                        rawText
                    };
                }));

                hasFetchedPages = true;
                if (contentArea) renderResults(document.getElementById('kb-search-input').value);
            } else {
                throw new Error("GitHub API Error: " + res.statusText);
            }
        } catch (e) {
            console.warn("Failed to fetch /pages/ directory:", e);
            if (contentArea) {
                contentArea.innerHTML = `
                    <div style="color: #ef4444; padding: 24px; border: 1px solid #ef4444; border-radius: 8px; background: rgba(239, 68, 68, 0.1);">
                        <strong>Error loading pages:</strong> Unable to fetch repository data. You may have hit a rate limit.
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

        contentArea.innerHTML = '';
        
        if (pagesCache.length === 0) {
            contentArea.innerHTML = `<div style="color: var(--text-secondary); text-align: center; padding: 40px;">No markdown pages found in repository.</div>`;
            return;
        }

        const lowerQuery = query.toLowerCase();
        
        // Google-style relevance algorithm matching Title, Tags, Dependencies, or Content
        const scored = pagesCache.map(page => {
            let score = 0;
            const titleMatch = page.cleanTitle.toLowerCase().includes(lowerQuery);
            const tagMatch = page.tags.some(t => t.toLowerCase().includes(lowerQuery));
            const depMatch = page.dependencies.some(d => d.toLowerCase().includes(lowerQuery));
            const contentMatch = page.rawText.toLowerCase().includes(lowerQuery);

            if (titleMatch) score += 10;
            if (tagMatch) score += 8;
            if (depMatch) score += 5;
            if (contentMatch) score += 2;

            return { page, score };
        }).filter(item => query === "" || item.score > 0);

        scored.sort((a, b) => b.score - a.score);

        if (scored.length === 0) {
            contentArea.innerHTML = `<div style="color: var(--text-secondary); text-align: center; padding: 40px;">No results match your query.</div>`;
            return;
        }

        scored.forEach(({ page }) => {
            const card = document.createElement('div');
            card.className = 'kb-result-card';
            
            const tagsHTML = page.tags.map(t => `<span class="kb-tag-pill">${t}</span>`).join('');
            const depsHTML = page.dependencies.length > 0 ? `<div style="font-size: 0.8em; color: var(--text-secondary);">Dependencies: ${page.dependencies.join(', ')}</div>` : '';

            card.innerHTML = `
                <div style="font-size: 0.8em; color: var(--text-secondary);">${page.path}</div>
                <div style="font-weight: 600; font-size: 1.1em; text-transform: capitalize; color: var(--text-primary);">${page.cleanTitle}</div>
                <div>${tagsHTML}</div>
                ${depsHTML}
            `;
            
            card.addEventListener('click', () => loadAndRenderPage(page));
            contentArea.appendChild(card);
        });
    }

    async function loadAndRenderPage(page) {
        const contentArea = document.getElementById('kb-content-area');
        if (!contentArea) return;

        contentArea.innerHTML = `
            <button class="kb-back-btn" id="kb-btn-back">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Back to Search
            </button>
            <div style="color: var(--text-secondary); padding: 40px; text-align: center;">Rendering document...</div>
        `;

        document.getElementById('kb-btn-back').addEventListener('click', () => {
            renderResults(document.getElementById('kb-search-input').value);
        });

        try {
            const res = await fetch(page.download_url);
            if (res.ok) {
                let markdownText = await res.text();
                
                // Apply Marked.js compilation
                let htmlContent = (typeof marked !== 'undefined') 
                    ? marked.parse(markdownText) 
                    : `<pre style="white-space: pre-wrap; font-family: inherit;">${markdownText}</pre>`;

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlContent;

                // Process Mouse Over Information tooltips
                if (page.mouseOvers && Object.keys(page.mouseOvers).length > 0) {
                    let innerHTML = tempDiv.innerHTML;
                    for (const [word, info] of Object.entries(page.mouseOvers)) {
                        const regex = new RegExp(`\\b(${word})\\b`, 'gi');
                        innerHTML = innerHTML.replace(regex, `<span class="kb-tooltip" title="${info}">$1</span>`);
                    }
                    tempDiv.innerHTML = innerHTML;
                }

                contentArea.innerHTML = `
                    <button class="kb-back-btn" id="kb-btn-back-loaded">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Back to Search
                    </button>
                    <div class="kb-markdown-container">
                        ${tempDiv.innerHTML}
                    </div>
                `;

                document.getElementById('kb-btn-back-loaded').addEventListener('click', () => {
                    renderResults(document.getElementById('kb-search-input').value);
                });

            } else {
                throw new Error("Failed to load markdown content.");
            }
        } catch (e) {
            contentArea.innerHTML = `
                <button class="kb-back-btn" id="kb-btn-back-error">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back to Search
                </button>
                <div style="color: #ef4444; padding: 24px; border: 1px solid #ef4444; border-radius: 8px; background: rgba(239, 68, 68, 0.1);">
                    <strong>Error:</strong> Could not render document content.
                </div>
            `;
            document.getElementById('kb-btn-back-error').addEventListener('click', () => {
                renderResults(document.getElementById('kb-search-input').value);
            });
        }
    }

    if (window.CoreUI && typeof window.CoreUI.addSidebarItem === 'function') {
        window.CoreUI.addSidebarItem('module-search', 'Search', iconPath, renderSearchUI);
    } else {
        console.error("CoreUI API not found.");
    }

})();
