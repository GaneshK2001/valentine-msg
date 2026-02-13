import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { burst } from '../utils/animations';

const Final = () => {
    const navigate = useNavigate();
    const noBtnRef = useRef<HTMLButtonElement>(null);

    const handleNoHover = () => {
        if (noBtnRef.current) {
            noBtnRef.current.style.position = 'absolute';
            noBtnRef.current.style.left = Math.random() * 80 + '%';
            noBtnRef.current.style.top = Math.random() * 80 + '%';
        }
    };

    const handleYesClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        burst(x, y);

        btn.classList.add('animate-[yesClick_0.85s_cubic-bezier(0.22,0.9,0.29,1)_forwards]', 'pointer-events-none');

        setTimeout(() => {
            navigate('/gallery');
        }, 900);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#080010] [background-image:radial-gradient(circle_at_10%_20%,_#ff758c33,_transparent_40%),_radial-gradient(circle_at_90%_80%,_#ff7eb333,_transparent_40%)] text-white overflow-hidden relative">
            <div className="flex flex-col items-center gap-6 w-full max-w-lg z-10 relative">
                <div className="backdrop-blur-[14px] bg-white/[0.12] border border-white/[0.22] flex flex-col items-center gap-6 p-8 rounded-3xl text-white w-full shadow-2xl transition hover:scale-[1.02] duration-500">
                    <h1 className="text-3xl md:text-5xl text-pink-300 font-bold text-center drop-shadow-lg">Dear Arathy</h1>

                    <p className="text-center leading-relaxed text-lg md:text-xl font-light">
                        You are my safest place,<br />
                        my favorite notification,<br />
                        the best part of my life.<br /><br />

                        In every universe,<br />
                        I would choose you again ❤️<br />
                        <span className="block mt-4 font-semibold text-pink-200 text-2xl animate-pulse">Will you be mine, forever and always?</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center mt-8 relative h-20 sm:h-auto">
                        <button
                            onClick={handleYesClick}
                            className="bg-pink-500 hover:bg-pink-400 text-white font-bold text-xl px-10 py-4 rounded-full transition-all w-full sm:w-auto shadow-[0_6px_18px_rgba(255,77,109,0.18),0_2px_6px_rgba(0,0,0,0.25)] hover:-translate-y-[4px] hover:scale-[1.05] hover:shadow-[0_12px_28px_rgba(255,77,109,0.28)] active:scale-[0.98] z-20"
                        >
                            YES 💍
                        </button>

                        <button
                            ref={noBtnRef}
                            onMouseOver={handleNoHover}
                            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold text-lg px-8 py-3 rounded-full transition-all w-full sm:w-auto absolute sm:relative sm:top-auto sm:left-auto"
                        >
                            NO
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Final;
