
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#080010] [background-image:radial-gradient(circle_at_10%_20%,_#ff758c33,_transparent_40%),_radial-gradient(circle_at_90%_80%,_#ff7eb333,_transparent_40%)] text-white overflow-hidden relative z-10">

            <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md relative z-20">
                <div className="backdrop-blur-[14px] bg-white/[0.07] border border-white/[0.13] flex flex-col items-center gap-4 p-8 rounded-3xl text-white shadow-2xl w-full">
                    <h1 className="text-4xl md:text-5xl font-['Dancing_Script'] text-pink-300 text-center font-bold">
                        Hey Arathy 💖
                    </h1>
                    <p className="text-center opacity-90 text-lg md:text-xl">
                        I built a tiny universe<br />
                        only for you & me
                    </p>
                    <button
                        onClick={() => {
                            document.body.style.opacity = '0';
                            setTimeout(() => navigate('/story'), 400);
                        }}
                        className="bg-pink-500 hover:bg-pink-400 transition px-6 py-3 rounded-full text-lg w-full md:w-auto font-medium shadow-lg hover:shadow-pink-500/30"
                    >
                        Enter Our World ✨
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
