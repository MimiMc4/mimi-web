const API = {
    async getStatus() {
        const res = await fetch('/api/status');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    },
};

export default API;
