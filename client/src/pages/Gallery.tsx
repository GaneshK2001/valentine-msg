import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { burst } from '../utils/animations';

const images = [
    '/assets/p1.png',
    '/assets/p2.png',
    '/assets/p3.png',
    '/assets/p4.png',
    '/assets/p5.png',
    '/assets/p6.png'
];

const Gallery = () => {
    const navigate = useNavigate();
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    return (
        <div className="min-h-screen flex flex-col items-center justify-between gap-6 px-4 py-20 bg-[#080010] [background-image:radial-gradient(circle_at_10%_20%,_#ff758c33,_transparent_40%),_radial-gradient(circle_at_90%_80%,_#ff7eb333,_transparent_40%)] text-white relative">

            <div className="backdrop-blur-[14px] bg-white/[0.12] border border-white/[0.22] flex flex-col items-center gap-3 p-6 rounded-3xl shadow-xl z-20">
                <h1 className="text-3xl text-pink-300 text-center font-bold font-['Dancing_Script']">Our Little Universe ✨</h1>
                <p className="text-white text-center opacity-90">
                    Every photo has a heartbeat, every memory smells like you
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl p-4 z-20">
                {images.map((src, i) => (
                    <div
                        key={i}
                        className="relative group cursor-pointer overflow-hidden rounded-xl border border-white/10 aspect-[4/5]"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = rect.left + rect.width / 2;
                            const y = rect.top + rect.height / 2;
                            burst(x, y);

                            // Add animation class
                            const img = e.currentTarget.querySelector('img');
                            if (img) {
                                img.classList.add('animate-[romance_0.85s_cubic-bezier(0.22,0.9,0.29,1)_forwards]', 'pointer-events-none');
                                setTimeout(() => {
                                    img.classList.remove('animate-[romance_0.85s_cubic-bezier(0.22,0.9,0.29,1)_forwards]', 'pointer-events-none');
                                }, 1000);
                            }

                            // Add a small delay for animation before opening modal
                            setTimeout(() => setSelectedImg(src), 700);
                        }}
                    >
                        <img
                            src={src}
                            alt={`Memories ${i}`}
                            className="w-full h-full object-cover transition transform duration-500 group-hover:scale-110 group-hover:brightness-110 active:scale-95 active:rotate-1"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedImg && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn"
                    onClick={() => setSelectedImg(null)}
                >
                    <div className="relative max-w-full max-h-full">
                        <button
                            onClick={() => setSelectedImg(null)}
                            className="absolute -top-12 right-0 text-white text-3xl hover:text-pink-500 transition"
                        >
                            &times;
                        </button>
                        <img
                            src={selectedImg}
                            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border border-white/10"
                            alt="Full View"
                        />
                    </div>
                </div>
            )}

            <button
                onClick={() => navigate('/')}
                className="bg-pink-500 hover:bg-pink-400 transition px-5 py-2 rounded-full text-white font-medium z-20 shadow-lg hover:shadow-pink-500/30"
            >
                🏠 Go to Home
            </button>
        </div>
    );
};

export default Gallery;
