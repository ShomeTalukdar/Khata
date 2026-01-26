import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, X, Check, Save } from 'lucide-react';
import { useVoice } from '../hooks/useVoice';
import { parseConversationalCommand } from '../utils/parser';
import { db } from '../utils/db';
import type { BillItem, Bill } from '../utils/db';

const VoiceBilling: React.FC = () => {
    const navigate = useNavigate();
    const [customerName, setCustomerName] = useState('');
    const [isUdhaar, setIsUdhaar] = useState(false);
    const [items, setItems] = useState<BillItem[]>([]);
    const [latestReply, setLatestReply] = useState('Tap to Speak / बोलने के लिए दबाएं');
    const [transcript, setTranscript] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const timerRef = useRef<any>(null);

    const { isListening, startListening, stopListening, speak } = useVoice((text: string) => {
        setTranscript(text);
        setIsThinking(true);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            const result = parseConversationalCommand(text);
            setIsThinking(false);

            if (result.intent === 'remove' && items.length > 0) {
                setItems(prev => prev.slice(0, -1));
            } else if (result.items && result.items.length > 0) {
                const newItems = result.items as BillItem[];
                setItems(prev => [...prev, ...newItems]);
            }

            setLatestReply(result.conversationalReply);
            speak(result.conversationalReply);
        }, 1200); // Increased to 1.2s to wait for full sentence
    });

    const total = items.reduce((sum: number, item: BillItem) => sum + ((item.qty || 1) * (item.price || 0)), 0);

    const saveBill = async () => {
        const bill: Bill = {
            id: Date.now().toString(),
            customerName: customerName || 'Cash Customer',
            items,
            total,
            isUdhaar,
            date: new Date().toISOString()
        };
        await db.saveBill(bill);
        navigate('/summary');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-0 py-0 relative overflow-hidden">
            {/* 1. TOP SECTION: AI & Controls */}
            <div className="bg-shop-bg-surface/50 backdrop-blur-md border-b border-white/10 p-6 z-10 sticky top-0 flex flex-col items-center gap-6 shadow-2xl">

                {/* Header Row */}
                <div className="w-full flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-black text-white leading-none tracking-tight">Billu AI</h2>
                        <div className="flex items-center gap-2 mt-1.5">
                            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${isListening ? 'bg-red-500 text-red-500 animate-pulse' : 'bg-emerald-500 text-emerald-500'}`} />
                            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest leading-none">
                                {isListening ? 'Listening / सुन रहा हूँ...' : 'Ready / तैयार'}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/')} className="bg-white/10 p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/20 transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* AI Status */}
                <div className="w-full text-center space-y-3 min-h-[80px] flex flex-col justify-center">
                    <p className={`text-xl font-black transition-all duration-300 drop-shadow-lg ${isThinking ? 'text-shop-primary animate-pulse' : 'text-white'}`}>
                        {isThinking ? 'Thinking / सोच रहा हूँ...' : `"${latestReply}"`}
                    </p>
                    {transcript && isListening && (
                        <div className="bg-black/40 px-4 py-2 rounded-lg inline-block border border-white/10">
                            <p className="text-sm font-bold text-slate-300 italic truncate max-w-[280px]">
                                You: {transcript}
                            </p>
                        </div>
                    )}
                </div>

                {/* Main Mic Button */}
                <button
                    onClick={isListening ? stopListening : startListening}
                    className={`h-24 w-full rounded-3xl flex items-center justify-center gap-4 transition-all duration-200 shadow-2xl active:scale-[0.98] border border-white/10 ${isListening ? 'bg-red-600 text-white shadow-red-600/30 ring-4 ring-red-500/20' : 'bg-emerald-500 text-white shadow-emerald-500/30 ring-4 ring-emerald-500/20'}`}
                >
                    <Mic size={36} strokeWidth={2.5} />
                    <span className="text-xl font-black uppercase tracking-widest drop-shadow-sm">
                        {isListening ? 'Stop / रुकिए' : 'Tap to Speak / बोलें'}
                    </span>
                </button>
            </div>


            {/* 2. BOTTOM SECTION: The Bill (Scrollable) */}
            <div className="flex-1 bg-shop-bg relative flex flex-col overflow-hidden">
                {items.length === 0 ? (
                    // Empty State
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-600 opacity-40 p-8 text-center">
                        <div className="w-16 h-16 border-4 border-dashed border-slate-600 rounded-xl mb-4 flex items-center justify-center">
                            <span className="text-2xl font-black">₹</span>
                        </div>
                        <p className="font-bold text-sm uppercase tracking-widest">Your Bill / आपका बिल</p>
                        <p className="text-xs mt-1">Speak to add items / आइटम जोड़ने के लिए बोलें</p>
                    </div>
                ) : (
                    // The Digital Slip (Integral Part of Page)
                    <div className="flex-1 overflow-y-auto p-4 pb-32">
                        <div className="bg-white text-slate-900 rounded-2xl shadow-xl overflow-hidden min-h-full flex flex-col border-t-8 border-shop-primary">
                            {/* Slip Header */}
                            <div className="bg-slate-50 px-6 py-4 border-b border-dashed border-slate-300 flex justify-between items-center sticky top-0 z-10">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Digital Parchi</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">डिजिटल पर्ची</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-2xl font-black text-slate-900 leading-none">₹{total}</span>
                                    <span className="text-[9px] font-bold text-shop-primary uppercase">Total / कुल</span>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="p-6 space-y-4 flex-1">
                                {items.map((item, i) => (
                                    <div key={i} className="flex justify-between items-start text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0 animate-in slide-in-from-bottom-2">
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-800 capitalize text-lg">{item.name}</p>
                                            <p className="text-[11px] text-slate-500 font-bold mt-0.5">
                                                {item.qty} {item.unit} x {item.price}
                                            </p>
                                        </div>
                                        <p className="font-black text-xl text-slate-900">₹{(item.qty || 1) * (item.price || 0)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Slip Footer Actions */}
                            <div className="bg-slate-900 p-4 gap-3 flex flex-col">
                                <input
                                    type="text"
                                    placeholder="Customer Name / ग्राहक का नाम"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full bg-slate-800 text-white text-sm font-bold px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-shop-primary placeholder:text-slate-500"
                                />
                                <div className="flex gap-2">
                                    <div className="flex bg-slate-800 rounded-xl p-1 shrink-0">
                                        <button
                                            onClick={() => setIsUdhaar(false)}
                                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all flex flex-col items-center leading-none gap-1 ${!isUdhaar ? 'bg-green-500 text-slate-900' : 'text-slate-500 hover:text-white'}`}
                                        >
                                            <span>CASH</span>
                                            <span className="text-[8px] opacity-80">नकद</span>
                                        </button>
                                        <button
                                            onClick={() => setIsUdhaar(true)}
                                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all flex flex-col items-center leading-none gap-1 ${isUdhaar ? 'bg-red-500 text-white' : 'text-slate-500 hover:text-white'}`}
                                        >
                                            <span>UDHAAR</span>
                                            <span className="text-[8px] opacity-80">उधार</span>
                                        </button>
                                    </div>
                                    <button
                                        onClick={saveBill}
                                        className="flex-1 bg-emerald-500 text-white rounded-xl font-black text-xs uppercase flex flex-col items-center justify-center leading-none gap-1 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                                    >
                                        <span>Save Bill</span>
                                        <span className="text-[10px] opacity-90 font-bold">बिल सेव करें</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoiceBilling;
