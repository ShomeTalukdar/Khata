import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X } from 'lucide-react';
import { db } from '../utils/db';
import type { Bill } from '../utils/db';

const PaperToDigital: React.FC = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mockData, setMockData] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                simulateOCR();
            };
            reader.readAsDataURL(file);
        }
    };

    const simulateOCR = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setMockData({
                items: [
                    { name: 'Doodh', qty: 2, unit: 'packet', price: 28, total: 56 },
                    { name: 'Bread', qty: 1, unit: 'nag', price: 40, total: 40 }
                ],
                total: 96
            });
        }, 2000);
    };

    const savePaperBill = () => {
        const bill: Bill = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            items: mockData.items,
            total: mockData.total,
            customerName: 'Paper Bill',
            isUdhaar: false,
            image: image || undefined
        };
        db.saveBill(bill);
        navigate('/');
    };

    return (
        <div className="flex flex-col gap-6 py-2">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-white">Paper Link</h2>
                <button onClick={() => navigate('/')} className="bg-shop-surface p-3 rounded-2xl text-slate-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            {!image ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-8 py-20 border-2 border-dashed border-white/10 rounded-[3rem] bg-shop-surface/30 shadow-inner">
                    <div className="w-24 h-24 bg-orange-500/10 text-orange-400 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.1)]">
                        <Camera size={48} />
                    </div>
                    <div className="text-center space-y-2 px-8">
                        <h3 className="font-black text-2xl text-white">Upload Handwritten Bill</h3>
                        <p className="text-sm text-slate-500 font-medium">Capture your notebook entry to digitize it</p>
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-large shadow-sky-500/10"
                    >
                        TAKE PHOTO
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        ref={fileInputRef}
                        onChange={handleCapture}
                        className="hidden"
                    />
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in">
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/5 aspect-[3/4] bg-black/40">
                        <img src={image} alt="captured" className="w-full h-full object-cover" />
                        {isProcessing && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                                <div className="w-16 h-16 border-4 border-shop-primary border-t-transparent rounded-full animate-spin mb-6" />
                                <p className="font-black text-xl tracking-widest uppercase">Reading Bill...</p>
                            </div>
                        )}
                    </div>

                    {mockData && !isProcessing && (
                        <div className="bg-green-500/10 p-8 rounded-[2.5rem] border border-green-500/20 space-y-6 animate-in slide-in-from-bottom-4 shadow-xl">
                            <div className="flex justify-between items-center pb-4 border-b border-green-500/10">
                                <h4 className="font-black text-green-400 text-xl tracking-wider uppercase">Detected Items</h4>
                                <p className="font-black text-green-400 text-3xl">₹{mockData.total}</p>
                            </div>
                            <div className="space-y-4">
                                {mockData.items.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between text-lg">
                                        <span className="font-bold text-slate-100 capitalize">{item.name} <span className="text-slate-500 text-sm font-medium ml-2">({item.qty} {item.unit})</span></span>
                                        <span className="font-black text-white">₹{item.total}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setImage(null)}
                                    className="flex-1 py-5 rounded-2xl bg-white/5 text-slate-400 font-black text-sm border border-white/10 uppercase tracking-widest"
                                >
                                    RETAKE
                                </button>
                                <button
                                    onClick={savePaperBill}
                                    className="flex-[2] py-5 rounded-2xl bg-shop-primary text-slate-900 font-black text-lg shadow-xl shadow-sky-500/20 active:scale-95 transition-all"
                                >
                                    CONFIRM & SAVE
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="card-shop bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-blue-900/10">
                <h4 className="font-black text-lg flex items-center gap-3 uppercase tracking-wider">
                    <span className="bg-blue-500/20 p-2 rounded-lg">💡</span> Note
                </h4>
                <p className="text-sm font-medium mt-4 leading-relaxed text-slate-400">
                    Handwritten entries are processed using high-precision OCR technology to minimize manual entry. (Prototype Simulation)
                </p>
            </div>
        </div>
    );
};

export default PaperToDigital;
