
import { useNavigate } from 'react-router-dom';

const reasons = [
    { title: "Your Smile", desc: "It makes my worst days better" },
    { title: "Your Voice", desc: "My favorite sound" },
    { title: "Your Heart", desc: "Purest soul I know" }
];

const Reasons = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#080010] text-white gap-8 [background-image:radial-gradient(circle_at_10%_20%,_#ff758c33,_transparent_40%),_radial-gradient(circle_at_90%_80%,_#ff7eb333,_transparent_40%)]">
            <h1 className="text-4xl md:text-5xl text-pink-300 font-bold text-center font-['Dancing_Script']">Why I Love You 💘</h1>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                {reasons.map((r, i) => (
                    <div key={i} className="group w-64 h-40 perspective-[1000px]">
                        <div className="relative w-full h-full transition-all duration-500 transform-style-3d group-hover:rotate-y-180">
                            {/* Front */}
                            <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-xl border border-white/20 backface-hidden shadow-lg">
                                <h2 className="text-xl font-bold">{r.title}</h2>
                            </div>
                            {/* Back */}
                            <div className="absolute inset-0 flex items-center justify-center bg-pink-500/80 backdrop-blur-md rounded-xl border border-pink-500/20 rotate-y-180 backface-hidden shadow-lg">
                                <p className="text-center px-4 font-medium">{r.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => navigate('/gallery')}
                className="mt-12 bg-white/10 hover:bg-white/20 transition px-8 py-3 rounded-full border border-white/30 text-lg font-medium"
            >
                More →
            </button>
        </div>
    );
};

export default Reasons;
