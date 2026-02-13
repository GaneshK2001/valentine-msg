import { useEffect } from 'react';

const FloatingHearts = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            const h = document.createElement("div");
            h.className = "fixed text-[#ff4d6d] animate-[fly_linear_infinite] z-0 pointer-events-none"; // Added z-0 and pointer-events-none
            h.innerHTML = "❤";

            // Use tailwind arbitrary values for animation if not defined in config, or standard style
            // The keyframe 'fly' is defined in index.css
            h.style.animationName = 'fly';
            h.style.animationTimingFunction = 'linear';
            h.style.animationIterationCount = 'infinite';

            h.style.left = Math.random() * 95 + "vw";
            h.style.fontSize = 12 + Math.random() * 16 + "px";
            h.style.animationDuration = 6 + Math.random() * 5 + "s";

            // Random opacity for diversity
            h.style.opacity = (0.5 + Math.random() * 0.5).toString();

            document.body.appendChild(h);

            setTimeout(() => {
                h.remove();
            }, 11000);
        }, 500); // Slightly slower than 300ms to avoid too many elements, can adjust

        return () => clearInterval(interval);
    }, []);

    return null; // This component renders nothing itself, just effects
};

export default FloatingHearts;
