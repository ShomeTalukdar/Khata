import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Zap, Shield, Smartphone, ArrowRight, Star } from 'lucide-react';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-shop-bg text-white font-sans">
            {/* Hero Section */}
            <header className="px-6 py-12 text-center space-y-6 bg-gradient-to-b from-emerald-900/20 to-shop-bg">
                <div className="inline-flex items-center gap-2 bg-emerald-900/30 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold border border-emerald-500/20">
                    <Star size={16} fill="currentColor" />
                    Designed for Indian Shop Owners
                </div>
                <h1 className="text-5xl font-black tracking-tight text-white">
                    Vyapari <span className="text-shop-primary">Plus</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-sm mx-auto leading-relaxed">
                    The conversational AI assistant **"Billu"** that manages your shop just by talking.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="w-full max-w-xs btn-large bg-shop-primary text-slate-900 shadow-xl shadow-emerald-500/20"
                >
                    Try the Prototype <ArrowRight size={24} />
                </button>
            </header>

            {/* Feature Grid */}
            <section className="px-6 py-16 space-y-12">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-white">Why Vyapari?</h2>
                    <p className="text-slate-400">Conversational, Smart, and Fast</p>
                </div>

                <div className="grid gap-8">
                    <FeatureCard
                        icon={<Mic className="text-emerald-400" size={32} />}
                        title="Voice Billing"
                        desc="Just say 'Aloo 5 kilo' and the app records it. No typing needed."
                    />
                    <FeatureCard
                        icon={<Zap className="text-yellow-400" size={32} />}
                        title="Hinglish Support"
                        desc="Understands Hindi and English terms naturally."
                    />
                    <FeatureCard
                        icon={<Shield className="text-emerald-400" size={32} />}
                        title="Fully Offline"
                        desc="Works without internet. Your data stays on your phone."
                    />
                    <FeatureCard
                        icon={<Smartphone className="text-purple-400" size={32} />}
                        title="Zero Learning"
                        desc="If you can talk, you can use the app. No technical skill required."
                    />
                </div>
            </section>

            {/* Demo Section Illustration */}
            <section className="bg-shop-surface text-white px-6 py-16 rounded-t-[3rem] border-t border-white/5">
                <div className="space-y-8 max-w-sm mx-auto">
                    <h3 className="text-3xl font-bold text-center">See it in Action</h3>
                    <div className="bg-black/20 p-4 rounded-3xl border border-white/10">
                        <div className="flex gap-4 items-center border-b border-white/10 pb-4 mb-4">
                            <div className="w-12 h-12 bg-shop-primary/20 rounded-full flex items-center justify-center text-shop-primary">
                                <Mic size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-200">You say:</p>
                                <p className="text-slate-400 italic">"Cheeni 2 kilo, 45 rupaye kilo"</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-sm font-bold text-slate-200">App Records:</p>
                            <div className="bg-white/5 p-3 rounded-xl flex justify-between">
                                <span>Sugar (2 kg)</span>
                                <span className="font-bold text-shop-primary">₹90</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-5 bg-shop-primary text-slate-900 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20"
                    >
                        Start Demo Now <ArrowRight size={24} />
                    </button>
                </div>
            </section>

            <footer className="py-12 px-6 text-center text-slate-500 text-sm">
                Built for the Bharat Prototype Challenge 2026
            </footer>
        </div>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
    <div className="p-8 bg-black/20 rounded-[2.5rem] space-y-4 border border-white/5 backdrop-blur-sm">
        <div className="bg-shop-primary/10 w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner border border-white/5">
            {icon}
        </div>
        <h4 className="text-xl font-bold text-white">{title}</h4>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;
