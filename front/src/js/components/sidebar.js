import API from '../api.js';

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
                    <div class="status-reading sidebar-status-value">···</div>
                </div>
                <div class="sidebar-status-block">
                    <div class="sidebar-status-title">random thought</div>
                    <div class="status-message sidebar-status-value">···</div>
                </div>
                <div style="cursor: pointer;" id="left-bottom" onclick="nipah()">
                    - nipah~☆ -
                </div>
            </div>
        `;

        this._loadStatus();
    }

    async _loadStatus() {
        console.log('loadStatus called');
        console.log('elements found:', document.querySelectorAll('.status-reading').length);

        try {
            const data = await API.getStatus();
            document.querySelectorAll('.status-reading').forEach(el => el.textContent = data.Reading ?? '---');
            document.querySelectorAll('.status-message').forEach(el => el.textContent = data.Message  ?? '---');
        } catch (err) {
            console.error('Error cargando status:', err);
            document.querySelectorAll('.status-reading').forEach(el => el.textContent = '---');
            document.querySelectorAll('.status-message').forEach(el => el.textContent = '---');
        }
    }
}

customElements.define('mimi-sidebar', MimiSidebar);