(function() {
    // SVG Icon for the sidebar (A grid/layout icon)
    const iconPath = `
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="3" x2="9" y2="21"></line>
    `;

    function renderTemplateUI() {
        const canvas = window.CoreUI.getCanvas();
        window.CoreUI.clearCanvas();

        // Container built with pure JS using the Monochrome Theme CSS variables
        const container = document.createElement('div');
        container.style.maxWidth = '800px';
        container.style.margin = '0 auto';
        container.style.padding = '24px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '24px';
        
        // Define internal layout structure
        container.innerHTML = `
            <div>
                <h1 style="margin-bottom: 8px;">Template Module</h1>
                <p style="color: var(--text-secondary);">Dynamically injected form environment using the CoreUI API.</p>
            </div>

            <!-- Modern Search Field -->
            <div style="display: flex; gap: 12px; align-items: center;">
                <div style="flex: 1; position: relative;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--text-secondary);">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" placeholder="Search templates..." style="width: 100%; padding: 12px 12px 12px 42px; border-radius: 8px; border: 1px solid var(--border-color); background-color: var(--bg-primary); color: var(--text-primary); outline: none; font-size: var(--font-size); transition: all 0.2s; box-shadow: var(--shadow);">
                </div>
                <button style="padding: 12px 24px; background-color: var(--text-primary); color: var(--bg-primary); border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: opacity 0.2s;">
                    Search
                </button>
            </div>

            <!-- Two-Column Grid for Forms and Settings -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                
                <!-- Text Fields Component -->
                <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; box-shadow: var(--shadow);">
                    <h3 style="margin-bottom: 16px;">Record Details</h3>
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <div>
                            <label style="display: block; font-size: 0.9em; font-weight: 600; margin-bottom: 6px; color: var(--text-secondary);">Title / Subject</label>
                            <input type="text" placeholder="Enter title..." style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-secondary); color: var(--text-primary); outline: none; transition: border-color 0.2s;" class="hover-input">
                        </div>
                        
                        <div>
                            <label style="display: block; font-size: 0.9em; font-weight: 600; margin-bottom: 6px; color: var(--text-secondary);">Detailed Description</label>
                            <textarea placeholder="Add specifications or notes..." rows="5" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-secondary); color: var(--text-primary); outline: none; resize: vertical; transition: border-color 0.2s;" class="hover-input"></textarea>
                        </div>
                    </div>
                </div>
                
                <!-- Actions / Templates Component -->
                <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; box-shadow: var(--shadow);">
                    <h3 style="margin-bottom: 12px;">Quick Load Templates</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 0.9em;">Click to inject pre-configured data into the active canvas fields.</p>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button class="list-btn" style="padding: 12px; background-color: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 8px; cursor: pointer; text-align: left; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s;">
                            <span>Customer Feedback Preset</span>
                            <span style="font-size: 0.8em; color: var(--text-secondary);">Load</span>
                        </button>
                        <button class="list-btn" style="padding: 12px; background-color: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 8px; cursor: pointer; text-align: left; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s;">
                            <span>System Error Report</span>
                            <span style="font-size: 0.8em; color: var(--text-secondary);">Load</span>
                        </button>
                        <button class="list-btn" style="padding: 12px; background-color: var(--bg-secondary); border: 1px dashed var(--border-color); color: var(--text-secondary); border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s; margin-top: 10px;">
                            + Create New Preset
                        </button>
                    </div>
                </div>

                <!-- Template Settings Component -->
                <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; box-shadow: var(--shadow);">
                    <h3 style="margin-bottom: 12px;">Template Preferences</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 0.9em;">Local module behavior.</p>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <label style="display: flex; align-items: center; gap: 8px; font-size: 0.9em; cursor: pointer;">
                            <input type="checkbox" checked style="accent-color: var(--text-primary); width: 16px; height: 16px;"> 
                            Auto-save drafts locally
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; font-size: 0.9em; cursor: pointer;">
                            <input type="checkbox" style="accent-color: var(--text-primary); width: 16px; height: 16px;"> 
                            Strict schema validation
                        </label>
                    </div>
                </div>
            </div>
        `;

        canvas.appendChild(container);
        
        // We inject a local style tag so these elements react cleanly when hovered/focused
        const style = document.createElement('style');
        style.innerHTML = `
            input.hover-input:focus, textarea.hover-input:focus { 
                border-color: var(--text-primary) !important; 
            }
            .list-btn:hover { 
                background-color: var(--hover-bg) !important; 
                border-color: var(--text-primary) !important;
            }
        `;
        canvas.appendChild(style);
    }

    // Immediately register this module into the Monochrome Core UI sidebar
    window.CoreUI.addSidebarItem('module-template', 'Templates', iconPath, renderTemplateUI);

    // Register a global setting entry into the CoreUI Settings Modal
    if (window.CoreUI.addSettingToggle) {
        window.CoreUI.addSettingToggle('global-template-logging', 'Template: Enable Verbose Logging', false, (state) => {
            console.log('Template verbose logging set to:', state);
        });
    }

    // React to Debug Mode
    if (window.CoreUI.isDebugMode && window.CoreUI.isDebugMode()) {
        renderTemplateUI();
    }
    
    // Listen for Debug Mode being toggled on dynamically
    document.addEventListener('debugToggled', (e) => {
        if (e.detail) {
            renderTemplateUI();
        }
    });

})();
