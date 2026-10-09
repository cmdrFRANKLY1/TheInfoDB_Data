// modules/search/search.js
// Search module: indexing (via GitHub API), ranking, suggestions, Google-style results.

import { renderPinnedList, makePinButton, syncPinButtonsInWall } from '../pins/pins.js';
import { pickRandomGoogleColor, buildTermColorMap, generateGroupColors } from '../colorapi/colorApi.js';

// ─────────────────────────────────────────────────────────────
// GitHub source configuration
//   Pulled from window.__APP_CONFIG__.github (set in index.html).
//   Falls back to sensible defaults if the config isn't present.
// ─────────────────────────────────────────────────────────────
function getGhConfig() {
    const cfg = (typeof window !== 'undefined' && window.__APP_CONFIG__ && window.__APP_CONFIG__.github) || {};
    return {
        owner:  cfg.owner  || 'cmdrFRANKLY1',
        repo:   cfg.repo   || 'TheInfoDB_Data',
        branch: cfg.branch || 'main',
        token:  (typeof window !== 'undefined' && window.__GITHUB_TOKEN__) || cfg.token || null
    };
}

// Root folder inside the repo where all .md documents live.
const GITHUB_PAGES_ROOT = 'pages';

function ghHeaders() {
    const h = { 'Accept': 'application/vnd.github+json' };
    const { token } = getGhConfig();
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
}

function ghTreeUrl() {
    const { owner, repo, branch } = getGhConfig();
    return `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
}

function ghRawBase() {
    const { owner, repo, branch } = getGhConfig();
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;
}

function ghJsDelivrBase() {
    const { owner, repo, branch } = getGhConfig();
    return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/`;
}

function encodePathForUrl(path) {
    return String(path).split('/').map(encodeURIComponent).join('/');
}

// Public URL used as the page's `path` (for breadcrumbs, pinning, mindmap).
function publicUrlForRepoPath(repoPath) {
    return ghRawBase() + encodePathForUrl(repoPath);
}

// ─────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────
let indexedPages = [];
let hierarchicalStructure = [];
let hasSearched = false;
let isTransitioning = false;
let titleData = null;
let subtitleData = null;

let suggestions = [];
let activeSuggestionIndex = -1;
let currentQuery = '';
let currentlyExpanded = null;

// DOM references
let searchInput, resultsWall, searchWrapper, searchContainer, suggestionsBox;
let appMainTitle, appMainSubtitle, pageTitleTag, headerDisplayContainer;
let viewSearchWrapper, sidebar, hamburgerIcon, closeIcon, pinSidebar;

// ─────────────────────────────────────────────────────────────
// SVG constants
// ─────────────────────────────────────────────────────────────
const COPY_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
const CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
const CHEVRON_DOWN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
const CHEVRON_UP_SVG   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 15 12 9 18 15"></polyline></svg>';
const MINDMAP_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.5"></circle><circle cx="6" cy="18" r="2.5"></circle><circle cx="18" cy="12" r="2.5"></circle><line x1="8.2" y1="7.2" x2="15.8" y2="10.8"></line><line x1="8.2" y1="16.8" x2="15.8" y2="13.2"></line></svg>';

// ─────────────────────────────────────────────────────────────
// Title / subtitle rendering
// ─────────────────────────────────────────────────────────────
function renderTitleText(textStr) {
    appMainTitle.innerHTML = '';
    pageTitleTag.textContent = textStr;

    for (let i = 0; i < textStr.length; i++) {
        const char = textStr[i];
        const span = document.createElement('span');
        span.textContent = char;
        if (char.trim() !== '') {
            span.style.color = pickRandomGoogleColor();
        }
        appMainTitle.appendChild(span);
    }
}

function buildSafeSubtitleGenerators() {
    if (!subtitleData) return [];

    const subjects   = subtitleData.subjects || [];
    const verbs      = subtitleData.verbs || [];
    const objects    = subtitleData.objects || [];
    const adjectives = subtitleData.adjectives || [];
    const adverbs    = subtitleData.adverbs || [];
    const preps      = subtitleData.prepositionalPhrases || [];
    const connectors = subtitleData.connectors || [];

    const auxiliaries = (subtitleData.auxiliaries && subtitleData.auxiliaries.length)
        ? subtitleData.auxiliaries
        : ["will", "can", "must", "should", "may", "might", "could", "would", "shall", "always", "often", "typically"];

    if (!subjects.length || !verbs.length || !objects.length) return [];

    return [
        () => `${window.pickRandom(subjects)} ${window.pickRandom(auxiliaries)} ${window.pickRandom(verbs)} ${window.pickRandom(objects)}`,
        () => `${window.pickRandom(subjects)} ${window.pickRandom(auxiliaries)} ${window.pickRandom(adverbs)} ${window.pickRandom(verbs)} ${window.pickRandom(objects)}`,
        () => `${window.pickRandom(subjects)} ${window.pickRandom(auxiliaries)} ${window.pickRandom(verbs)} ${window.pickRandom(adjectives)} ${window.pickRandom(objects)}`,
        () => `${window.pickRandom(subjects)} ${window.pickRandom(auxiliaries)} ${window.pickRandom(verbs)} ${window.pickRandom(objects)} ${window.pickRandom(preps)}`,
        () => `${window.pickRandom(subjects)} ${window.pickRandom(auxiliaries)} ${window.pickRandom(verbs)} ${window.pickRandom(adjectives)} ${window.pickRandom(objects)} ${window.pickRandom(preps)}`,
        () => `${window.pickRandom(subjects)} ${window.pickRandom(auxiliaries)} ${window.pickRandom(verbs)} ${window.pickRandom(objects)}, ${window.pickRandom(connectors)} ${window.pickRandom(subjects).toLowerCase()} ${window.pickRandom(auxiliaries)} ${window.pickRandom(verbs)} ${window.pickRandom(objects)}`,
    ];
}

function generateAndApplyRandomHeader() {
    let titleStr = '';
    if (titleData && Array.isArray(titleData.prefixes) && Array.isArray(titleData.suffixes)
        && titleData.prefixes.length && titleData.suffixes.length) {
        titleStr = `${window.pickRandom(titleData.prefixes)}${window.pickRandom(titleData.suffixes)}`;
    }
    if (!titleStr) {
        const fallbackPrefixes = ["Search", "Find", "Query", "Discover"];
        const fallbackSuffixes = ["Hub", "Nest", "Wise", "Base"];
        titleStr = `${window.pickRandom(fallbackPrefixes)}${window.pickRandom(fallbackSuffixes)}`;
    }

    let subtitleStr = '';
    const gens = buildSafeSubtitleGenerators();
    if (gens.length) {
        subtitleStr = window.pickRandom(gens)();
        if (subtitleStr) {
            subtitleStr = subtitleStr.charAt(0).toUpperCase() + subtitleStr.slice(1);
            if (!subtitleStr.endsWith('.')) subtitleStr += '.';
        }
    }

    renderTitleText(titleStr);

    if (subtitleStr) {
        appMainSubtitle.textContent = subtitleStr;
        appMainSubtitle.classList.remove('hidden');
    } else {
        appMainSubtitle.classList.add('hidden');
    }
}

async function loadTitleAndSubtitleGenerators() {
    const titleUrl = window.resolveUrl('resources/index/titles/indexTitle.json');
    const subUrl = window.resolveUrl('resources/index/titles/indexSubtitles.json');
    titleData = await window.safeFetchJson(titleUrl);
    subtitleData = await window.safeFetchJson(subUrl);
    generateAndApplyRandomHeader();
}

// ─────────────────────────────────────────────────────────────
// Markdown parsing helpers
// ─────────────────────────────────────────────────────────────
function extractMdTitle(text) {
    const m = text.match(/^#\s+(.+)$/m);
    return m ? m[1].trim() : 'Document';
}

function extractSection(mdText, sectionName) {
    if (!mdText) return [];
    const escaped = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`^#\\s+${escaped}\\s*$([\\s\\S]*?)(?=^#{1,6}\\s|(?![\\s\\S]))`, 'im');
    const match = mdText.match(re);
    if (!match) return [];
    const items = [];
    for (const line of match[1].split('\n')) {
        const t = line.trim();
        if (!t) continue;
        const cleaned = t.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
        for (const part of cleaned.split(',')) {
            const item = part.replace(/[*_`]/g, '').trim();
            if (item) items.push(item);
        }
    }
    return items;
}

function extractKeyValueSection(mdText, sectionName) {
    if (!mdText) return [];
    const escaped = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`^#\\s+${escaped}\\s*$([\\s\\S]*?)(?=^#{1,6}\\s|(?![\\s\\S]))`, 'im');
    const match = mdText.match(re);
    if (!match) return [];
    const out = [];
    for (const line of match[1].split('\n')) {
        const t = line.trim().replace(/^[-*]\s+/, '');
        if (!t) continue;
        if (/^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?$/.test(t)) continue;

        if (/^\|/.test(t)) {
            const cells = t.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
            if (cells.length >= 2 && cells[0]) {
                const term = cells[0].replace(/[*_`]/g, '').trim();
                const url = cells[1].replace(/[*_`]/g, '').trim();
                if (term && url &&
                    term.toLowerCase() !== 'term' &&
                    term.toLowerCase() !== 'word') {
                    out.push({ term, url });
                }
                continue;
            }
        }

        const m = t.match(/^(.+?)\s*(?:->|=>|\|)\s*(.+)$/);
        if (m) {
            const term = m[1].replace(/[*_`]/g, '').trim();
            const url = m[2].replace(/[*_`]/g, '').trim();
            if (term && url) out.push({ term, url });
        }
    }
    return out;
}

function extractMouseOverSection(mdText) {
    if (!mdText) return [];
    const re = /^#\s+Mouse\s+Over\s+Information\s*$([\s\S]*?)(?=^#{1,6}\s|(?![\s\S]))/im;
    const match = mdText.match(re);
    if (!match) return [];
    const out = [];
    let pendingTerm = null;

    for (const rawLine of match[1].split('\n')) {
        const line = rawLine.trim().replace(/^[-*]\s+/, '');
        if (!line) continue;
        if (/^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?$/.test(line)) continue;

        if (/^\|/.test(line)) {
            const cells = line.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
            if (cells.length >= 2) {
                const term = cells[0].replace(/[*_`]/g, '').trim();
                const tooltip = cells[1].replace(/[*_`]/g, '').trim();
                if (term && tooltip &&
                    term.toLowerCase() !== 'term' &&
                    term.toLowerCase() !== 'command' &&
                    term.toLowerCase() !== 'word' &&
                    tooltip.toLowerCase() !== 'information') {
                    out.push({ term, tooltip });
                }
                continue;
            }
        }

        const kv = line.match(/^\*\*\s*([^:*]+?)\s*:\s*\*\*(.+)$/);
        if (kv) {
            const key = kv[1].trim().toLowerCase();
            const val = kv[2].replace(/[*_`]/g, '').trim();
            if (key === 'command' || key === 'term' || key === 'word' || key === 'keyword') {
                pendingTerm = val;
            } else if (key === 'hover tooltip' || key === 'tooltip' || key === 'description' || key === 'info') {
                if (pendingTerm && val) {
                    out.push({ term: pendingTerm, tooltip: val });
                    pendingTerm = null;
                }
            }
            continue;
        }

        const m = line.match(/^(.+?)\s*(?:->|=>)\s*(.+)$/);
        if (m) {
            const term = m[1].replace(/[*_`]/g, '').trim();
            const tooltip = m[2].replace(/[*_`]/g, '').trim();
            if (term && tooltip) out.push({ term, tooltip });
        }
    }
    return out;
}

/**
 * "pages/economics/supply_and_demand/foo.md" → "Economics"
 * "pages/information_technology/networking/osi_model.md" → "Information Technology"
 */
function deriveTopFolder(repoPath) {
    if (typeof repoPath !== 'string') return 'Uncategorized';
    const cleaned = repoPath.replace(/^\/+/, '');
    const match = cleaned.match(new RegExp(`^${GITHUB_PAGES_ROOT}/([^/]+)/`));
    if (match && match[1]) {
        return match[1]
            .split(/[_\-\s]+/)
            .filter(Boolean)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }
    return 'Uncategorized';
}

// The "group key" for a repo path — everything up to the last '/'.
function parentDirOf(repoPath) {
    const idx = repoPath.lastIndexOf('/');
    return idx >= 0 ? repoPath.slice(0, idx) : '';
}

// ─────────────────────────────────────────────────────────────
// GitHub-backed indexing
// ─────────────────────────────────────────────────────────────
async function fetchGithubTree() {
    const url = ghTreeUrl();
    const res = await fetch(url, { headers: ghHeaders() });

    if (res.status === 403 || res.status === 429) {
        const remaining = res.headers.get('x-ratelimit-remaining');
        throw new Error(
            `GitHub API rate-limited (${res.status}). ` +
            `Remaining: ${remaining}. Set window.__GITHUB_TOKEN__ to raise the limit.`
        );
    }
    if (res.status === 404) {
        const { owner, repo, branch } = getGhConfig();
        throw new Error(
            `GitHub tree 404. Check that repo "${owner}/${repo}" exists, is public, ` +
            `and has a branch named "${branch}".`
        );
    }
    if (!res.ok) {
        throw new Error(`GitHub tree fetch failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.tree)) {
        throw new Error('GitHub tree response had no `tree` array.');
    }
    if (data.truncated) {
        console.warn('[Index] GitHub tree was truncated; some files may be missing.');
    }
    return data.tree;
}

function selectMarkdownBlobs(tree) {
    const prefix = GITHUB_PAGES_ROOT.replace(/\/+$/, '') + '/';
    return tree.filter(node =>
        node.type === 'blob' &&
        typeof node.path === 'string' &&
        node.path.startsWith(prefix) &&
        node.path.toLowerCase().endsWith('.md')
    );
}

async function fetchRawMarkdown(repoPath) {
    // Try raw.githubusercontent.com first — it has no per-IP rate limit and
    // serves with the correct CORS headers. Fall back to jsDelivr if the
    // raw host is unreachable for some reason.
    const attempts = [
        ghRawBase() + encodePathForUrl(repoPath),
        ghJsDelivrBase() + encodePathForUrl(repoPath)
    ];
    let lastErr = null;
    for (const url of attempts) {
        try {
            const res = await fetch(url, { cache: 'no-cache' });
            if (res.ok) return await res.text();
            lastErr = new Error(`${res.status} ${res.statusText} for ${url}`);
        } catch (e) {
            lastErr = e;
        }
    }
    throw lastErr || new Error(`Could not fetch ${repoPath}`);
}

/**
 * Group markdown blobs by top-level folder under pages/ (e.g. "economics",
 * "information_technology"). Within each group, sort by repo path so the
 * shallowest / alphabetically-first file becomes the "parent".
 */
function groupBlobsByTopFolder(blobs) {
    const groups = new Map();
    for (const blob of blobs) {
        const topFolder = deriveTopFolder(blob.path); // "Economics", "Information Technology"
        const key = topFolder;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(blob);
    }
    for (const arr of groups.values()) {
        // Shallow files first, then alphabetical.
        arr.sort((a, b) => {
            const aDepth = a.path.split('/').length;
            const bDepth = b.path.split('/').length;
            if (aDepth !== bDepth) return aDepth - bDepth;
            return a.path.localeCompare(b.path);
        });
    }
    return groups;
}

async function loadIndexedPages() {
    try {
        const tree = await fetchGithubTree();
        const blobs = selectMarkdownBlobs(tree);

        if (blobs.length === 0) {
            const { owner, repo, branch } = getGhConfig();
            console.warn(
                `[Index] No .md files found under "${GITHUB_PAGES_ROOT}/" in ` +
                `${owner}/${repo}@${branch}. ` +
                `Check the folder name, branch, and repo visibility.`
            );
            window.__appState.indexedPages = indexedPages;
            window.__appState.hierarchicalStructure = hierarchicalStructure;
            renderPinnedList();
            window.dispatchEvent(new CustomEvent('pages-indexed'));
            return;
        }

        console.info(`[Index] Found ${blobs.length} markdown file(s); fetching contents…`);

        // Fetch every markdown file in parallel.
        const results = await Promise.all(blobs.map(async blob => {
            try {
                const raw = await fetchRawMarkdown(blob.path);
                return { blob, raw };
            } catch (err) {
                console.warn(`[Index] Skipping ${blob.path}:`, err.message);
                return null;
            }
        }));

        const loaded = results.filter(Boolean);

        // Build page objects.
        const pageByPath = new Map();
        for (const { blob, raw } of loaded) {
            const pageObj = {
                path: publicUrlForRepoPath(blob.path),
                githubPath: blob.path,
                raw,
                title: extractMdTitle(raw),
                tags: extractSection(raw, 'Tags'),
                dependencies: extractSection(raw, 'Dependencies'),
                hyperlinks: extractKeyValueSection(raw, 'Hyperlinks'),
                mouseOvers: extractMouseOverSection(raw),
                content: raw
            };
            pageByPath.set(blob.path, pageObj);
            indexedPages.push(pageObj);
        }

        // Group into hierarchical structure (parent + children per top folder).
        hierarchicalStructure = [];
        const groups = groupBlobsByTopFolder(loaded.map(l => l.blob));

        for (const [topFolder, dirBlobs] of groups.entries()) {
            const pages = dirBlobs.map(b => pageByPath.get(b.path)).filter(Boolean);
            if (pages.length === 0) continue;

            const [parentPage, ...childrenPages] = pages;
            const colors = generateGroupColors(topFolder);

            hierarchicalStructure.push({
                parent: parentPage,
                children: childrenPages,
                registryPath: topFolder,   // kept for API compatibility
                topFolder,
                colors
            });
        }

        console.info(
            `[Index] Loaded ${indexedPages.length} document(s) in ` +
            `${hierarchicalStructure.length} group(s).`
        );

        window.__appState.indexedPages = indexedPages;
        window.__appState.hierarchicalStructure = hierarchicalStructure;

        renderPinnedList();
        window.dispatchEvent(new CustomEvent('pages-indexed'));
    } catch (err) {
        console.error('[Index] Fatal:', err);
        window.__appState.indexedPages = indexedPages;
        window.__appState.hierarchicalStructure = hierarchicalStructure;
        try { renderPinnedList(); } catch { /* ignore */ }
        window.dispatchEvent(new CustomEvent('pages-indexed'));
    }
}

// ─────────────────────────────────────────────────────────────
// Markdown rendering
// ─────────────────────────────────────────────────────────────
function renderInline(text) {
    let s = window.escapeHtml(text);
    s = s.replace(/`([^`]+)`/g, (m, code) => `<code>${code}</code>`);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
    s = s.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, '$1<em>$2</em>');
    s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, href) => {
        const safe = href.replace(/"/g, '%22');
        return `<a href="${safe}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    });
    s = s.replace(/(^|\s)(https?:\/\/[^\s<]+)/g,
        (m, pre, url) => `${pre}<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
    return s;
}

export function stripInternalSections(md) {
    if (!md) return '';
    let s = md.replace(/\r\n?/g, '\n');

    const sectionNames = ['Tags', 'Dependencies', 'Hyperlinks', 'Mouse Over Information'];

    for (const name of sectionNames) {
        const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(
            `^#{1,6}\\s+${escaped}\\s*$[\\s\\S]*?(?=^#{1,6}\\s|(?![\\s\\S]))`,
            'im'
        );
        s = s.replace(re, '');
    }

    s = s.replace(/^#\s+.+\n?/, '');
    s = s.replace(/\n{3,}/g, '\n\n').trim();
    return s;
}

export function renderMarkdown(md) {
    if (!md) return '';
    md = md.replace(/\r\n?/g, '\n');

    const codeBlocks = [];
    md = md.replace(/```([^\n`]*)\n([\s\S]*?)```/g, (m, lang, code) => {
        const idx = codeBlocks.length;
        codeBlocks.push({ lang: lang.trim(), code });
        return `\u0000CODEBLOCK_${idx}\u0000`;
    });

    const lines = md.split('\n');
    const out = [];
    let i = 0;

    const isBlank = (s) => /^\s*$/.test(s);
    const listStart = (s) => /^\s*([-*+]|\d+\.)\s+/.test(s);

    while (i < lines.length) {
        let line = lines[i];

        const cbMatch = line.match(/^\u0000CODEBLOCK_(\d+)\u0000\s*$/);
        if (cbMatch) {
            const { lang, code } = codeBlocks[+cbMatch[1]];
            const cls = lang ? ` class="language-${window.escapeHtml(lang)}"` : '';
            out.push(`<pre><code${cls}>${window.escapeHtml(code)}</code></pre>`);
            i++; continue;
        }

        if (isBlank(line)) { i++; continue; }

        if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
            out.push('<hr>');
            i++; continue;
        }

        const hMatch = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
        if (hMatch) {
            const level = hMatch[1].length;
            out.push(`<h${level}>${renderInline(hMatch[2])}</h${level}>`);
            i++; continue;
        }

        if (/^\s*>\s?/.test(line)) {
            const buf = [];
            while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
                buf.push(lines[i].replace(/^\s*>\s?/, ''));
                i++;
            }
            out.push(`<blockquote>${renderMarkdown(buf.join('\n'))}</blockquote>`);
            continue;
        }

        if (line.includes('|') && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(lines[i + 1])) {
            const header = line.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
            i += 2;
            const rows = [];
            while (i < lines.length && lines[i].includes('|') && !isBlank(lines[i])) {
                rows.push(lines[i].trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()));
                i++;
            }
            const th = header.map(h => `<th>${renderInline(h)}</th>`).join('');
            const trs = rows.map(r => `<tr>${r.map(c => `<td>${renderInline(c)}</td>`).join('')}</tr>`).join('');
            out.push(`<div class="table-wrap"><table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table></div>`);
            continue;
        }

        if (listStart(line)) {
            const ordered = /^\s*\d+\.\s+/.test(line);
            const items = [];
            const baseIndent = line.match(/^(\s*)/)[1].length;

            while (i < lines.length) {
                const cur = lines[i];
                if (isBlank(cur)) {
                    let j = i + 1;
                    while (j < lines.length && isBlank(lines[j])) j++;
                    if (j < lines.length && listStart(lines[j]) &&
                        lines[j].match(/^(\s*)/)[1].length >= baseIndent) {
                        i = j;
                        continue;
                    }
                    break;
                }
                const indentMatch = cur.match(/^(\s*)/);
                const indent = indentMatch[1].length;
                const itemMatch = cur.match(/^\s*([-*+]|\d+\.)\s+(.*)$/);
                if (!itemMatch || indent < baseIndent) break;

                if (indent === baseIndent) {
                    items.push(itemMatch[2]);
                    i++;
                } else {
                    const nested = [];
                    const nestedIndent = indent;
                    while (i < lines.length) {
                        const nline = lines[i];
                        if (isBlank(nline)) break;
                        const nIndent = nline.match(/^(\s*)/)[1].length;
                        if (nIndent < nestedIndent) break;
                        nested.push(nline.slice(nestedIndent));
                        i++;
                    }
                    if (items.length) {
                        items[items.length - 1] += '\n' + nested.join('\n');
                    }
                }
            }

            const tag = ordered ? 'ol' : 'ul';
            const body = items.map(it => {
                if (it.includes('\n')) {
                    return `<li>${renderMarkdown(it)}</li>`;
                }
                return `<li>${renderInline(it)}</li>`;
            }).join('');
            out.push(`<${tag}>${body}</${tag}>`);
            continue;
        }

        const para = [line];
        i++;
        while (i < lines.length && !isBlank(lines[i]) &&
               !/^(#{1,6})\s+/.test(lines[i]) &&
               !listStart(lines[i]) &&
               !/^\s*>\s?/.test(lines[i]) &&
               !/^\u0000CODEBLOCK_\d+\u0000\s*$/.test(lines[i])) {
            para.push(lines[i]);
            i++;
        }
        out.push(`<p>${renderInline(para.join(' '))}</p>`);
    }

    return out.join('\n');
}

// ─────────────────────────────────────────────────────────────
// Auto-annotations
// ─────────────────────────────────────────────────────────────
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeTerm(t) {
    return String(t).replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
}

function collectEligibleTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName;
            if (tag === 'A' || tag === 'PRE' || tag === 'SCRIPT' || tag === 'STYLE') {
                return NodeFilter.FILTER_REJECT;
            }
            if (tag === 'CODE' && parent.closest('pre')) {
                return NodeFilter.FILTER_REJECT;
            }
            if (parent.closest('[data-no-term]')) return NodeFilter.FILTER_REJECT;
            if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
        }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
}

export function applyAutoAnnotations(root, page) {
    const mouseOvers = (page && page.mouseOvers) || [];
    const hyperlinks = (page && page.hyperlinks) || [];

    const annotations = new Map();

    for (const m of mouseOvers) {
        const term = normalizeTerm(m.term);
        if (!term || !m.tooltip) continue;
        const key = term.toLowerCase();
        const existing = annotations.get(key) || { term, tooltip: null, url: null };
        existing.tooltip = m.tooltip;
        annotations.set(key, existing);
    }
    for (const h of hyperlinks) {
        const term = normalizeTerm(h.term);
        if (!term || !h.url) continue;
        const key = term.toLowerCase();
        const existing = annotations.get(key) || { term, tooltip: null, url: null };
        existing.url = h.url;
        annotations.set(key, existing);
    }

    if (annotations.size === 0) return;

    const entries = [...annotations.values()].sort((a, b) => b.term.length - a.term.length);
    const termColors = buildTermColorMap(entries.map(e => e.term));

    const alternatives = entries.map(e => escapeRegex(e.term).replace(/\\?\s+/g, '\\s+'));

    const re = new RegExp(
        `(^|[^\\w])(${alternatives.join('|')})(?=$|[^\\w])`,
        'gi'
    );

    const byLower = new Map();
    for (const e of entries) byLower.set(e.term.toLowerCase(), e);

    const used = new Set();
    const textNodes = collectEligibleTextNodes(root);

    for (const textNode of textNodes) {
        if (!textNode.parentNode) continue;
        const text = textNode.nodeValue;
        if (!text) continue;

        const frag = document.createDocumentFragment();
        let lastIndex = 0;
        let anyMatch = false;

        re.lastIndex = 0;
        let m;
        while ((m = re.exec(text)) !== null) {
            const prefix = m[1] || '';
            const matchedText = m[2];
            const matchStart = m.index + prefix.length;
            const matchEnd = matchStart + matchedText.length;

            const key = matchedText.replace(/\s+/g, ' ').toLowerCase();
            const entry = byLower.get(key);
            if (!entry) continue;
            if (used.has(key)) continue;

            const before = text.slice(lastIndex, matchStart);
            if (before) frag.appendChild(document.createTextNode(before));

            let el;
            if (entry.url) {
                el = document.createElement('a');
                el.className = 'auto-link';
                el.href = entry.url;
                el.target = '_blank';
                el.rel = 'noopener noreferrer';
                if (entry.tooltip) el.title = entry.tooltip;
            } else {
                el = document.createElement('span');
                el.className = 'has-tooltip';
                if (entry.tooltip) el.title = entry.tooltip;
            }
            el.textContent = matchedText;

            const tColor = termColors.get(key);
            if (tColor) {
                el.style.color = tColor;
                el.style.fontWeight = '600';
                el.style.textDecorationColor = tColor;
            }

            frag.appendChild(el);

            used.add(key);
            anyMatch = true;
            lastIndex = matchEnd;
        }

        if (!anyMatch) continue;

        const after = text.slice(lastIndex);
        if (after) frag.appendChild(document.createTextNode(after));

        textNode.parentNode.replaceChild(frag, textNode);
    }
}

// ─────────────────────────────────────────────────────────────
// Copy buttons
// ─────────────────────────────────────────────────────────────
function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            resolve();
        } catch (err) { reject(err); }
    });
}

function makeCopyButton(getText, ariaLabel) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'action-btn';
    btn.setAttribute('aria-label', ariaLabel || 'Copy to clipboard');
    btn.title = ariaLabel || 'Copy to clipboard';
    btn.innerHTML = COPY_SVG;
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const text = getText();
        copyText(text).then(() => {
            btn.classList.add('copied');
            btn.innerHTML = CHECK_SVG;
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.innerHTML = COPY_SVG;
            }, 1200);
        }).catch(() => { /* silent */ });
    });
    return btn;
}

export function attachCellAndCodeCopyButtons(root) {
    root.querySelectorAll('td').forEach(td => {
        if (td.dataset.hasCopy === '1') return;
        td.dataset.hasCopy = '1';
        const text = td.textContent.trim();
        const btn = makeCopyButton(() => text, 'Copy cell');
        td.appendChild(btn);
    });

    root.querySelectorAll('code').forEach(code => {
        if (code.parentElement && code.parentElement.tagName === 'PRE') return;
        if (code.dataset.hasCopy === '1') return;
        code.dataset.hasCopy = '1';
        const text = code.textContent;
        const btn = makeCopyButton(() => text, 'Copy code');
        code.appendChild(btn);
    });
}

// ─────────────────────────────────────────────────────────────
// "Open in Mindmap" button
// ─────────────────────────────────────────────────────────────
function makeMindmapButton(page) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'action-btn mindmap-btn';
    btn.setAttribute('aria-label', 'Open in mindmap');
    btn.title = 'Open in Mindmap';
    btn.innerHTML = MINDMAP_SVG;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const detail = { path: page.path, page };
        window.dispatchEvent(new CustomEvent('open-in-mindmap', { detail }));
    });

    return btn;
}

// ─────────────────────────────────────────────────────────────
// Matching / ranking / suggestions
// ─────────────────────────────────────────────────────────────
function normalizeTitleForMatch(title) {
    if (!title) return '';
    let s = title.replace(/\([^)]*\)/g, '');
    s = s.split(':')[0];
    return s.toLowerCase().trim();
}

function findExactTitleMatch(query) {
    const q = query.toLowerCase().trim();
    if (!q) return null;
    for (const page of indexedPages) {
        if (normalizeTitleForMatch(page.title) === q) return page;
        if ((page.title || '').toLowerCase().trim() === q) return page;
    }
    return null;
}

function buildSuggestions(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const seen = new Set();
    const out = [];

    const push = (text, kind, page, score) => {
        const key = kind + '::' + text.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        out.push({ text, kind, page, score });
    };

    for (const page of indexedPages) {
        const title = (page.title || '').trim();
        const titleLc = title.toLowerCase();

        if (titleLc === q) push(title, 'title', page, 100);
        else if (titleLc.startsWith(q)) push(title, 'title', page, 90);
        else if (titleLc.includes(q)) push(title, 'title', page, 80);

        for (const tag of page.tags) {
            const tagLc = tag.toLowerCase();
            if (tagLc === q) push(tag, 'tag', page, 70);
            else if (tagLc.startsWith(q)) push(tag, 'tag', page, 60);
            else if (tagLc.includes(q)) push(tag, 'tag', page, 50);
        }
        for (const dep of page.dependencies) {
            const depLc = dep.toLowerCase();
            if (depLc === q) push(dep, 'tag', page, 40);
            else if (depLc.startsWith(q)) push(dep, 'tag', page, 30);
        }
    }

    out.sort((a, b) => b.score - a.score);
    return out.slice(0, 8);
}

function renderSuggestions() {
    if (suggestions.length === 0) { hideSuggestions(); return; }
    suggestionsBox.innerHTML = '';
    suggestions.forEach((s, i) => {
        const el = document.createElement('div');
        el.className = 'suggestion-item' + (i === activeSuggestionIndex ? ' active' : '');
        el.dataset.index = i;
        el.innerHTML = `
            <span class="truncate flex-1">${window.escapeHtml(s.text)}</span>
            <span class="sug-kind">${s.kind === 'title' ? 'Title' : 'Tag'}</span>
        `;
        el.addEventListener('mousedown', (ev) => {
            ev.preventDefault();
            applySuggestion(i);
        });
        suggestionsBox.appendChild(el);
    });
    suggestionsBox.classList.remove('hidden');
}

function hideSuggestions() {
    suggestionsBox.classList.add('hidden');
    suggestionsBox.innerHTML = '';
    suggestions = [];
    activeSuggestionIndex = -1;
}

function applySuggestion(i) {
    const s = suggestions[i];
    if (!s) return;
    searchInput.value = s.text;
    hideSuggestions();
    runSearch(s.text);
}

function rankPage(page, q) {
    const exactTitle = normalizeTitleForMatch(page.title);
    const title = (page.title || '').toLowerCase().trim();
    const tags = page.tags || [];
    const deps = page.dependencies || [];
    const raw = (page.raw || '').toLowerCase();

    if (exactTitle === q) return 5;
    if (title === q) return 5;
    if (title.includes(q)) return 4;
    if (tags.some(t => t.toLowerCase().includes(q))) return 3;
    if (deps.some(d => d.toLowerCase().includes(q))) return 2;
    if (raw.includes(q)) return 1;
    return 0;
}

function rankLabel(rank) {
    switch (rank) {
        case 5: return { text: 'Exact match', cls: 'rank-exact' };
        case 4: return { text: 'Title match', cls: 'rank-partial' };
        case 3: return { text: 'Tag match', cls: 'rank-tag' };
        case 2: return { text: 'Dependency', cls: 'rank-dep' };
        case 1: return { text: 'Content', cls: 'rank-content' };
        default: return { text: '—', cls: 'rank-content' };
    }
}

// ─────────────────────────────────────────────────────────────
// Google-style snippet generation
// ─────────────────────────────────────────────────────────────
function toPlainText(md) {
    if (!md) return '';
    let s = String(md);

    s = s.replace(/```[\s\S]*?```/g, ' ');
    s = s.replace(/`([^`]+)`/g, '$1');
    s = s.replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1');
    s = s.replace(/https?:\/\/[^\s<>"')]+/g, ' ');
    s = s.replace(/^#{1,6}\s+/gm, '');
    s = s.replace(/^>\s?/gm, '');
    s = s.replace(/^\s*([-*_])(\s*\1){2,}\s*$/gm, ' ');
    s = s.replace(/\|/g, ' ');
    s = s.replace(/^\s*:?-{2,}:?\s*(\s*:?-{2,}:?\s*)+\s*$/gm, ' ');
    s = s.replace(/^\s*([-*+]|\d+\.)\s+/gm, '');
    s = s.replace(/<[^>]+>/g, '');
    s = s.replace(/\*\*([^*]+)\*\*/g, '$1');
    s = s.replace(/__([^_]+)__/g, '$1');
    s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1$2');
    s = s.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, '$1$2');
    s = s.replace(/~~([^~]+)~~/g, '$1');
    s = s.replace(/\s+/g, ' ').trim();

    return s;
}

function buildSnippet(page, query, maxLen = 260) {
    const q = (query || '').toLowerCase().trim();
    const cleaned = stripInternalSections(page.raw || '');

    const blocks = cleaned
        .split(/\n{2,}/)
        .map(b => toPlainText(b))
        .filter(b => b.length > 0);

    if (blocks.length === 0) return '';

    let chosen = '';
    if (q) {
        chosen = blocks.find(b => b.toLowerCase().includes(q)) || '';
    }
    if (!chosen) chosen = blocks[0];

    if (chosen.length > maxLen) {
        let cut = chosen.slice(0, maxLen);
        const lastSpace = cut.lastIndexOf(' ');
        if (lastSpace > maxLen * 0.6) cut = cut.slice(0, lastSpace);
        chosen = cut.trim() + '…';
    }

    return chosen;
}

function highlightMatches(escapedText, query) {
    const q = (query || '').trim();
    if (!q) return escapedText;

    const parts = q.split(/\s+/).filter(Boolean).map(escapeRegex);
    if (parts.length === 0) return escapedText;

    const re = new RegExp(`(${parts.join('|')})`, 'gi');
    return escapedText.replace(re, '<mark>$1</mark>');
}

function buildBreadcrumb(page) {
    try {
        const url = new URL(page.path);
        const segments = url.pathname.split('/').filter(Boolean);
        // Drop the owner/branch prefix from the breadcrumb for readability.
        const parent = segments.slice(0, -1);
        return `${url.host}${parent.length ? ' › ' + parent.map(decodeURIComponent).join(' › ') : ''}`;
    } catch {
        return page.path;
    }
}

// ─────────────────────────────────────────────────────────────
// Result item construction
// ─────────────────────────────────────────────────────────────
function buildResultItem(page, rank, query) {
    const badge = rankLabel(rank);

    const item = document.createElement('article');
    item.className = 'google-result-item';
    item.title = page.path;

    const crumb = document.createElement('div');
    crumb.className = 'google-result-breadcrumb';
    crumb.textContent = buildBreadcrumb(page);

    const titleRow = document.createElement('div');
    titleRow.className = 'google-result-title-row';

    const titleEl = document.createElement('span');
    titleEl.className = 'google-result-title';
    titleEl.textContent = page.title;

    const badgeEl = document.createElement('span');
    badgeEl.className = `rank-badge ${badge.cls} google-rank-inline`;
    badgeEl.textContent = badge.text;

    const actions = document.createElement('div');
    actions.className = 'google-result-actions';

    const mindmapBtn = makeMindmapButton(page);
    const pinBtn = makePinButton(page.path);
    const copyBtn = makeCopyButton(() => page.raw, 'Copy markdown');

    actions.appendChild(badgeEl);
    actions.appendChild(mindmapBtn);
    actions.appendChild(pinBtn);
    actions.appendChild(copyBtn);

    titleRow.appendChild(titleEl);
    titleRow.appendChild(actions);

    const snippetRow = document.createElement('div');
    snippetRow.className = 'google-result-snippet-row';

    const snippet = document.createElement('p');
    snippet.className = 'google-result-snippet';
    const rawSnippet = buildSnippet(page, query);
    const escaped = window.escapeHtml(rawSnippet);
    snippet.innerHTML = highlightMatches(escaped, query);

    const chevronBtn = document.createElement('button');
    chevronBtn.type = 'button';
    chevronBtn.className = 'google-result-chevron';
    chevronBtn.setAttribute('aria-label', 'Expand document');
    chevronBtn.title = 'Expand';
    chevronBtn.innerHTML = CHEVRON_DOWN_SVG;

    snippetRow.appendChild(snippet);
    snippetRow.appendChild(chevronBtn);

    const expander = document.createElement('div');
    expander.className = 'google-result-expander md';
    expander.hidden = true;

    const cleaned = stripInternalSections(page.raw);
    expander.innerHTML = renderMarkdown(cleaned);
    try { attachCellAndCodeCopyButtons(expander); } catch { /* ignore */ }
    try { applyAutoAnnotations(expander, page); } catch { /* ignore */ }

    let expanded = false;
    function setExpanded(next) {
        if (next && currentlyExpanded && currentlyExpanded !== item) {
            const prev = currentlyExpanded;
            if (typeof prev._mindmapCollapse === 'function') {
                prev._mindmapCollapse();
            }
            currentlyExpanded = null;
        }

        expanded = next;
        expander.hidden = !expanded;
        item.classList.toggle('expanded', expanded);
        chevronBtn.innerHTML = expanded ? CHEVRON_UP_SVG : CHEVRON_DOWN_SVG;
        chevronBtn.setAttribute('aria-label', expanded ? 'Collapse document' : 'Expand document');
        chevronBtn.title = expanded ? 'Collapse' : 'Expand';

        currentlyExpanded = expanded ? item : null;
    }

    item._mindmapCollapse = () => {
        expanded = false;
        expander.hidden = true;
        item.classList.remove('expanded');
        chevronBtn.innerHTML = CHEVRON_DOWN_SVG;
        chevronBtn.setAttribute('aria-label', 'Expand document');
        chevronBtn.title = 'Expand';
    };

    snippet.addEventListener('click', () => setExpanded(!expanded));
    chevronBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setExpanded(!expanded);
    });

    item.appendChild(crumb);
    item.appendChild(titleRow);
    item.appendChild(snippetRow);
    item.appendChild(expander);

    return item;
}

// ─────────────────────────────────────────────────────────────
// Search execution
// ─────────────────────────────────────────────────────────────
function performSearch(query) {
    const q = query.toLowerCase().trim();
    if (!q) return;

    currentQuery = q;
    currentlyExpanded = null;

    const scored = [];
    for (const page of indexedPages) {
        const r = rankPage(page, q);
        if (r > 0) scored.push({ page, rank: r });
    }

    const exactMatches = scored.filter(s => s.rank === 5);
    const queryMatches = scored.filter(s => s.rank < 5);

    const byTitle = (a, b) => (a.page.title || '').localeCompare(b.page.title || '');
    exactMatches.sort(byTitle);

    let relatedMatches = [];
    let relatedReason = 'query';

    if (exactMatches.length > 0) {
        const exactPages = exactMatches.map(s => s.page);
        const exactPaths = new Set(exactPages.map(p => p.path));

        const sharedTags = new Set();
        for (const p of exactPages) {
            for (const t of (p.tags || [])) {
                const tag = String(t).toLowerCase().trim();
                if (tag) sharedTags.add(tag);
            }
        }

        if (sharedTags.size > 0) {
            const relatedSet = new Map();

            for (const page of indexedPages) {
                if (exactPaths.has(page.path)) continue;
                const overlap = (page.tags || [])
                    .map(t => String(t).toLowerCase().trim())
                    .filter(t => t && sharedTags.has(t));
                if (overlap.length === 0) continue;
                relatedSet.set(page.path, { page, overlap });
            }

            relatedMatches = [...relatedSet.values()]
                .sort((a, b) => {
                    if (b.overlap.length !== a.overlap.length) {
                        return b.overlap.length - a.overlap.length;
                    }
                    return (a.page.title || '').localeCompare(b.page.title || '');
                })
                .map(({ page, overlap }) => ({
                    page,
                    rank: 3,
                    sharedTags: overlap
                }));

            relatedReason = 'tags';
        }
    }

    if (relatedMatches.length === 0) {
        relatedMatches = queryMatches.sort((a, b) => {
            if (b.rank !== a.rank) return b.rank - a.rank;
            return byTitle(a, b);
        });
        relatedReason = 'query';
    }

    resultsWall.innerHTML = '';
    resultsWall.classList.add('google-results');

    if (exactMatches.length === 0 && relatedMatches.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'text-center py-16';
        empty.style.color = 'var(--lm-muted)';
        empty.innerHTML = `
            <svg class="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <p class="text-sm font-medium">Your search did not match any documents.</p>
            <p class="text-xs mt-2">Try different keywords${indexedPages.length ? ` · ${indexedPages.length} documents indexed` : ''}.</p>
        `;
        resultsWall.appendChild(empty);
        resultsWall.classList.remove('hidden');
        return;
    }

    const total = exactMatches.length + relatedMatches.length;
    const meta = document.createElement('div');
    meta.className = 'google-results-meta';
    meta.textContent = `About ${total} result${total === 1 ? '' : 's'}`;
    resultsWall.appendChild(meta);

    if (exactMatches.length > 0) {
        const exactSection = document.createElement('div');
        exactSection.className = 'google-results-section';

        const exactHeading = document.createElement('div');
        exactHeading.className = 'google-results-section-heading exact-heading';
        exactHeading.textContent = 'Exact match';
        exactSection.appendChild(exactHeading);

        exactMatches.forEach(({ page, rank }) => {
            exactSection.appendChild(buildResultItem(page, rank, q));
        });

        resultsWall.appendChild(exactSection);
    }

    if (relatedMatches.length > 0) {
        const relatedSection = document.createElement('div');
        relatedSection.className = 'google-results-section';

        const relatedHeading = document.createElement('div');
        relatedHeading.className = 'google-results-section-heading related-heading';
        relatedHeading.textContent = relatedReason === 'tags'
            ? 'Related by tags'
            : 'Related';
        relatedSection.appendChild(relatedHeading);

        relatedMatches.forEach((entry) => {
            const item = buildResultItem(entry.page, entry.rank, q);

            if (entry.sharedTags && entry.sharedTags.length > 0) {
                const chipRow = document.createElement('div');
                chipRow.className = 'google-result-shared-tags';
                entry.sharedTags.slice(0, 5).forEach(tag => {
                    const chip = document.createElement('span');
                    chip.className = 'google-result-shared-tag';
                    chip.textContent = tag;
                    chipRow.appendChild(chip);
                });
                const expander = item.querySelector('.google-result-expander');
                if (expander) {
                    item.insertBefore(chipRow, expander);
                } else {
                    item.appendChild(chipRow);
                }
            }

            relatedSection.appendChild(item);
        });

        resultsWall.appendChild(relatedSection);
    }

    resultsWall.classList.remove('hidden');
}

export function runSearch(rawQuery) {
    const query = rawQuery.trim().toLowerCase();
    if (!query) return;

    if (!hasSearched) {
        hasSearched = true;
        isTransitioning = true;

        headerDisplayContainer.style.transition = 'opacity 0.4s ease';
        headerDisplayContainer.style.opacity = '0';
        appMainSubtitle.style.transition = 'opacity 0.3s ease';
        appMainSubtitle.style.opacity = '0';
        searchContainer.style.transition = 'opacity 0.4s ease';
        searchContainer.style.opacity = '0';

        setTimeout(() => {
            headerDisplayContainer.classList.add('hidden');
            appMainSubtitle.classList.add('hidden');

            viewSearchWrapper.style.justifyContent = 'flex-start';
            viewSearchWrapper.style.paddingTop = '60px';

            searchWrapper.style.position = 'fixed';
            searchWrapper.style.top = '16px';
            searchWrapper.style.left = '50%';
            searchWrapper.style.transform = 'translateX(-50%)';
            searchWrapper.style.width = '100%';
            searchWrapper.style.maxWidth = '900px';
            searchWrapper.style.zIndex = '30';
            searchWrapper.style.pointerEvents = 'auto';

            searchContainer.classList.add('search-bar-compact');
            void searchContainer.offsetHeight;
            searchContainer.style.opacity = '1';

            document.body.classList.add('results-view');

            setTimeout(() => {
                performSearch(query);
                resultsWall.classList.remove('hidden');
                void resultsWall.offsetWidth;
                resultsWall.classList.remove('opacity-0');
                resultsWall.classList.add('opacity-100');
                isTransitioning = false;
            }, 400);
        }, 450);
        return;
    }

    performSearch(query);
}

// ─────────────────────────────────────────────────────────────
// Event wiring
// ─────────────────────────────────────────────────────────────
function wireSearchEvents() {
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            if (suggestions.length) {
                e.preventDefault();
                activeSuggestionIndex = (activeSuggestionIndex + 1) % suggestions.length;
                renderSuggestions();
            }
            return;
        }
        if (e.key === 'ArrowUp') {
            if (suggestions.length) {
                e.preventDefault();
                activeSuggestionIndex = (activeSuggestionIndex - 1 + suggestions.length) % suggestions.length;
                renderSuggestions();
            }
            return;
        }
        if (e.key === 'Escape') { hideSuggestions(); return; }
        if (e.key === 'Enter') {
            if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
                e.preventDefault();
                applySuggestion(activeSuggestionIndex);
                return;
            }
            hideSuggestions();
            const query = searchInput.value.trim().toLowerCase();
            if (!query) return;
            if (isTransitioning) return;
            runSearch(query);
        }
    });

    searchInput.addEventListener('input', (e) => {
        const q = e.target.value.trim();
        if (!q) {
            hideSuggestions();
            if (hasSearched) {
                resultsWall.classList.add('opacity-0');
                setTimeout(() => resultsWall.classList.add('hidden'), 700);
                resultsWall.innerHTML = '';
            }
            return;
        }

        if (findExactTitleMatch(q)) {
            hideSuggestions();
        } else {
            suggestions = buildSuggestions(q);
            activeSuggestionIndex = -1;
            renderSuggestions();
        }

        if (hasSearched) performSearch(q.toLowerCase());
    });

    searchInput.addEventListener('blur', () => {
        setTimeout(hideSuggestions, 120);
    });
    searchInput.addEventListener('focus', () => {
        const q = searchInput.value.trim();
        if (q && findExactTitleMatch(q)) {
            hideSuggestions();
            return;
        }
        if (q && suggestions.length === 0) {
            suggestions = buildSuggestions(q);
            activeSuggestionIndex = -1;
        }
        if (suggestions.length) renderSuggestions();
    });
}

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────
export function getIndexedPages() {
    return indexedPages;
}

export function getHierarchicalStructure() {
    return hierarchicalStructure;
}

export function getHasSearched() {
    return hasSearched;
}

export async function initSearch() {
    searchInput = document.getElementById('search-input');
    resultsWall = document.getElementById('results-wall');
    searchWrapper = document.getElementById('search-wrapper');
    searchContainer = document.getElementById('search-container');
    suggestionsBox = document.getElementById('suggestions');
    appMainTitle = document.getElementById('app-main-title');
    appMainSubtitle = document.getElementById('app-main-subtitle');
    pageTitleTag = document.getElementById('page-title-tag');
    headerDisplayContainer = document.getElementById('header-display-container');
    viewSearchWrapper = document.getElementById('view-search-wrapper');
    sidebar = document.getElementById('sidebar');
    hamburgerIcon = document.getElementById('hamburger-icon');
    closeIcon = document.getElementById('close-icon');
    pinSidebar = document.getElementById('pin-sidebar');

    await Promise.all([
        loadTitleAndSubtitleGenerators(),
        loadIndexedPages()
    ]);

    wireSearchEvents();

    window.addEventListener('pins-changed', () => {
        syncPinButtonsInWall();
    });
}