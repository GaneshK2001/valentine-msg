import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Game = () => {
    const navigate = useNavigate();
    const [result, setResult] = useState('');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#080010] [background-image:radial-gradient(circle_at_10%_20%,_#ff758c33,_transparent_40%),_radial-gradient(circle_at_90%_80%,_#ff7eb333,_transparent_40%)] text-white gap-8">
            <h1 className="text-3xl md:text-5xl text-pink-300 font-bold text-center">How Well You Know Us? 😄</h1>
            <div className="flex flex-col gap-6 items-center bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 w-full max-w-md">
                <p className="text-xl text-center">Who fell in love first?</p>
                <div className="flex gap-4 w-full justify-center">
                    <button
                        onClick={() => setResult('Correct! ❤️')}
                        className="px-6 py-2 bg-pink-500 rounded-full hover:bg-pink-600 transition w-32"
                    >
                        Ganesh
                    </button>
                    <button
                        onClick={() => setResult('Wrong! 😜')}
                        className="px-6 py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition w-32"
                    >
                        Arathy
                    </button>
                </div>
                {result && <p className="text-lg font-bold animate-pulse text-pink-200">{result}</p>}
            </div>
            <button
                onClick={() => navigate('/final')}
                className="mt-8 px-8 py-3 bg-white/10 border border-white/30 rounded-full hover:bg-white/20 transition font-medium text-lg"
            >
                Final Surprise →
            </button>
        </div>
    );
};

export default Game;
