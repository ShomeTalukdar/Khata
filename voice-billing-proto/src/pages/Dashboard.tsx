import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Users, Camera, PieChart, ArrowRight } from 'lucide-react';
import { db } from '../utils/db';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];
    const summary = db.getDailySummary(today);

    return (
        <div className="flex flex-col gap-6 py-4">
            {/* Quick Stats Card */}
            <div className="card-shop bg-gradient-to-br from-shop-primary/20 to-shop-secondary/20 border-shop-primary/20 ring-1 ring-white/5 shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-shop-primary/80 text-[10px] font-black uppercase tracking-widest">Today's Sales</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">आज की बिक्री</p>
                        <h2 className="text-5xl font-black text-white mt-2">₹{summary.totalSales}</h2>
                    </div>
                    <div className="bg-shop-primary/20 p-3 rounded-2xl text-shop-primary">
                        <PieChart size={32} />
                    </div>
                </div>
                <div className="flex gap-4 text-[10px] font-bold">
                    <div className="bg-white/5 px-4 py-2 rounded-xl text-slate-300 border border-white/5 flex flex-col items-center">
                        <span>{summary.billCount} BILLS</span>
                        <span className="text-[10px] opacity-60 font-bold">बिल</span>
                    </div>
                    <div className="bg-red-500/10 px-4 py-2 rounded-xl text-red-400 border border-red-500/20 flex flex-col items-center">
                        <span>₹{summary.pendingCredit} CREDIT</span>
                        <span className="text-[10px] opacity-60 font-bold">उधार</span>
                    </div>
                </div>
            </div>

            {/* Main Actions */}
            <button
                onClick={() => navigate('/billing')}
                className="btn-large hover:scale-[1.02] active:scale-95 transition-all flex flex-col items-center py-8"
            >
                <div className="flex items-center gap-4">
                    <Mic size={32} />
                    <span>NEW BILL (Bol Kar)</span>
                </div>
                <span className="text-sm font-bold text-white/90 uppercase mt-1 tracking-widest drop-shadow-md">नया बिल (बोल कर)</span>
            </button>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => navigate('/udhaar')}
                    className="bg-shop-surface p-6 rounded-[2.5rem] shadow-xl border border-white/5 flex flex-col items-center gap-1 text-slate-200 active:scale-95 transition-all hover:bg-slate-800"
                >
                    <div className="bg-indigo-500/20 p-4 rounded-[1.5rem] text-indigo-400 mb-2">
                        <Users size={32} />
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest">Credit Khata</span>
                    <span className="text-[10px] text-slate-400 font-bold">उधार खाता</span>
                </button>

                <button
                    onClick={() => navigate('/paper')}
                    className="bg-shop-surface p-6 rounded-[2.5rem] shadow-xl border border-white/5 flex flex-col items-center gap-1 text-slate-200 active:scale-95 transition-all hover:bg-slate-800"
                >
                    <div className="bg-orange-500/20 p-4 rounded-[1.5rem] text-orange-400 mb-2">
                        <Camera size={32} />
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest">Paper Link</span>
                    <span className="text-[10px] text-slate-400 font-bold">पर्ची जोड़ें</span>
                </button>
            </div>

            {/* Recent Activity */}
            <div className="mt-4">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h3 className="font-black text-xl text-white leading-none">Recent Activity</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">हाल की गतिविधि</p>
                    </div>
                    <button onClick={() => navigate('/summary')} className="text-shop-primary text-[10px] font-black flex items-center gap-2 hover:translate-x-1 transition-transform uppercase tracking-widest">
                        SEE ALL / सब देखें <ArrowRight size={16} />
                    </button>
                </div>
                <div className="space-y-4">
                    {db.getBills().slice(-3).reverse().map((bill) => (
                        <div key={bill.id} className="bg-shop-surface/50 p-5 rounded-[2rem] border border-white/5 flex justify-between items-center shadow-lg hover:border-shop-primary/30 transition-colors">
                            <div className="flex gap-4 items-center">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${bill.isUdhaar ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                    {bill.customerName ? bill.customerName[0].toUpperCase() : 'C'}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-100 text-lg">{bill.customerName || 'Cash Customer'}</p>
                                    <p className="text-[10px] text-slate-500 font-black flex items-center gap-1 uppercase">
                                        <span>Today</span>
                                        <span className="opacity-30">•</span>
                                        <span>{new Date(bill.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-shop-primary text-xl">₹{bill.total}</p>
                                <p className={`text-[8px] uppercase font-black tracking-widest mt-1 ${bill.isUdhaar ? 'text-red-500' : 'text-green-500'}`}>
                                    {bill.isUdhaar ? 'CREDIT / उधार' : 'PAID / नकद'}
                                </p>
                            </div>
                        </div>
                    ))}
                    {db.getBills().length === 0 && (
                        <div className="text-center py-12 text-slate-600 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                            <p className="italic font-bold">No bills today</p>
                            <p className="text-[10px] uppercase mt-1">आज कोई बिल नहीं है</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 mb-4 text-center">
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to reset all data? / क्या आप सारा डेटा मिटाना चाहते हैं?')) {
                                db.resetData();
                            }
                        }}
                        className="text-[10px] font-bold text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-colors"
                    >
                        Reset Data / डेटा रीसेट करें
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
