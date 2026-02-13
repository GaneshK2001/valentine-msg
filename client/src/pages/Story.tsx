import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FORWARDER_URL = "https://kind-eggs-camp.loca.lt";

const questions = [
    { id: 1, question: "Do you know where i met you first?" },
    { id: 2, question: "Do you remember the first date ?" },
    { id: 3, question: "Do you remember the first time we talked?" }
];

const Story = () => {
    const navigate = useNavigate();
    const [activeId, setActiveId] = useState<number | null>(null);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [sending, setSending] = useState<{ [key: number]: boolean }>({});
    const [sent, setSent] = useState<{ [key: number]: boolean }>({});

    const handleSend = async (id: number, question: string) => {
        const answer = answers[id]?.trim();
        if (!answer) return;

        setSending(prev => ({ ...prev, [id]: true }));

        const now = new Date();
        const ts = now.toLocaleString();
        const pageTitle = document.title || window.location.pathname;
        const pageUrl = window.location.href;
        const msg = `Page: ${pageTitle} (${pageUrl})\nQuestion: ${question}\nAnswer: ${answer}\nTime: ${ts}`;

        try {
            const res = await fetch(`${FORWARDER_URL.replace(/\/$/, '')}/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Bypass-Tunnel-Reminder': 'true'
                },
                body: JSON.stringify({ pageTitle, pageUrl, question, answer, time: ts })
            });

            if (res.ok) {
                setSent(prev => ({ ...prev, [id]: true }));
                setTimeout(() => {
                    setSent(prev => ({ ...prev, [id]: false }));
                    setAnswers(prev => ({ ...prev, [id]: '' }));
                    setActiveId(null);
                }, 1200);
            } else {
                // error
                try { await navigator.clipboard.writeText(msg); alert('Copied to clipboard because server failed'); } catch (e) { }
            }
        } catch (err) {
            console.error(err);
            try { await navigator.clipboard.writeText(msg); alert('Copied to clipboard because server failed'); } catch (e) { }
        } finally {
            setSending(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#080010] [background-image:radial-gradient(circle_at_10%_20%,_#ff758c33,_transparent_40%),_radial-gradient(circle_at_90%_80%,_#ff7eb333,_transparent_40%)] text-white">
            <div className="flex flex-col items-center gap-6 w-full max-w-md">
                <div className="backdrop-blur-[14px] bg-white/[0.12] border border-white/[0.22] flex flex-col gap-4 p-6 rounded-2xl text-white w-full shadow-xl">
                    <h2 className="text-2xl md:text-3xl text-center text-pink-300 font-semibold mb-2">Do you remember?</h2>

                    <div className="flex flex-col gap-4">
                        {questions.map((q) => (
                            <div
                                key={q.id}
                                onClick={() => setActiveId(activeId === q.id ? null : q.id)}
                                className={`story-card group backdrop-blur-[14px] bg-white/[0.12] border border-white/[0.22] p-4 rounded-xl relative flex flex-col transition-all duration-300 cursor-pointer overflow-hidden hover:bg-[#ff4d6d22] hover:border-[#ff4d6d55] hover:-translate-y-1 hover:shadow-lg ${activeId === q.id ? 'active scale-[1.02] shadow-xl ring-1 ring-pink-500/50' : ''}`}
                            >
                                <div className="question text-lg font-medium select-none">{q.question}</div>
                                <div
                                    className={`answer-row flex flex-col sm:flex-row gap-2 mt-2 transition-all duration-300 overflow-hidden ${activeId === q.id ? 'max-h-[200px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <input
                                        className="answer-input flex-1 px-3 py-2 rounded text-black focus:ring-2 focus:ring-pink-500 outline-none"
                                        placeholder="Your answer"
                                        value={answers[q.id] || ''}
                                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend(q.id, q.question)}
                                    />
                                    <button
                                        onClick={() => handleSend(q.id, q.question)}
                                        disabled={sending[q.id]}
                                        className="bg-pink-500 hover:bg-pink-600 disabled:bg-pink-400 transition px-4 py-2 rounded text-white font-medium"
                                    >
                                        {sending[q.id] ? '...' : sent[q.id] ? 'Sent' : 'Send'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            document.body.style.opacity = '0';
                            setTimeout(() => navigate('/final'), 400); // Wait, story.html navigated to final.html? Let me check.
                            // The original story.html navigate to final.html on button click.
                            // Actually wait, let's double check.
                        }}
                        className="bg-pink-500 hover:bg-pink-400 px-6 py-3 rounded-full transition duration-300 transform hover:scale-105 w-full mt-4 font-bold text-lg shadow-lg"
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Story;
