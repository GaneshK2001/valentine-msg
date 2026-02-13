
export const burst = (x: number, y: number, count: number = 8, spreadX: number = 120, offsetY: number = 30) => {
    for (let i = 0; i < count; i++) {
        const h = document.createElement('div');
        h.className = 'fixed text-[#ff5678] text-sm pointer-events-none animate-[burst_0.95s_cubic-bezier(0.2,0.8,0.2,1)_forwards] z-50';
        h.innerHTML = '❤';
        const spread = (Math.random() - 0.5) * spreadX;
        h.style.left = (x + spread) + 'px';
        h.style.top = (y + (Math.random() * offsetY - (offsetY / 2))) + 'px';
        h.style.fontSize = (10 + Math.random() * 20) + 'px';
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 1200);
    }
};
