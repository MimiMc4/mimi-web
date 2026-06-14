class MimiSidebar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const active = this.getAttribute('active') || '';

        const pages = [
            { href: 'home',         label: 'home' },
            { href: 'about',        label: 'about' },
            { href: 'projects',     label: 'projects' },
            { href: 'reviews',      label: 'reviews' },
            { href: 'achievements', label: 'achievements' },
        ];

        const mobileLinks = pages.map(p =>
            `<a href="${p.href}"${p.href === active ? ' class="active"' : ''}>${p.label}</a>`
        ).join('\n            ');

        const sidebarLinks = pages.map(p =>
            `<div><a href="${p.href}"${p.href === active ? ' class="active"' : ''}>• ${p.label}</a></div>`
        ).join('\n            ');

        this.innerHTML = `
            <div id="mobile-bar" class="madoka-div">
                ${mobileLinks}
            </div>
            <div id="left-bar" class="madoka-div">
                <div>hell yeah</div>
                <div>hell yeah</div>
                <div>hell yeah</div>
                ${sidebarLinks}
                <div class="sidebar-status-divider"></div>
                <div class="sidebar-status-block">
                    <div class="sidebar-status-title">currently reading</div>
                    <div id="sidebar-reading" class="sidebar-status-value">···</div>
                </div>
                <div class="sidebar-status-block">
                    <div class="sidebar-status-title">random thought</div>
                    <div id="sidebar-message" class="sidebar-status-value">···</div>
                </div>
                <div style="cursor: pointer;" id="left-bottom" onclick="nipah()">
                    - nipah~☆ -
                </div>
            </div>
        `;

        this._loadStatus();
    }

    async _loadStatus() {
        try {
            const response = await fetch('/api/status');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            const readingEl = this.querySelector('#sidebar-reading');
            const messageEl = this.querySelector('#sidebar-message');

            if (readingEl) readingEl.textContent = data.Reading ?? '---';
            if (messageEl) messageEl.textContent = data.Message  ?? '---';

            const mainReading = document.getElementById('status-reading');
            const mainMessage = document.getElementById('status-message');
            if (mainReading) mainReading.textContent = data.Reading ?? '---';
            if (mainMessage) mainMessage.textContent = data.Message  ?? '---';

        } catch (err) {
            console.error('Error loading status:', err);
            const readingEl = this.querySelector('#sidebar-reading');
            const messageEl = this.querySelector('#sidebar-message');
            if (readingEl) readingEl.textContent = '---';
            if (messageEl) messageEl.textContent = '---';
        }
    }
}

customElements.define('mimi-sidebar', MimiSidebar);