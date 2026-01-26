import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Calendar, X } from 'lucide-react';
import { db } from '../utils/db';

const Summary: React.FC = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const summary = db.getDailySummary(date);
    const bills = db.getBills().filter(b => b.date.startsWith(date));

    const exportCSV = () => {
        const headers = ['ID', 'Date', 'Customer', 'Total', 'Status'];
        const rows = bills.map(b => [
            b.id,
            new Date(b.date).toLocaleString(),
            b.customerName,
            b.total,
            b.isUdhaar ? 'Udhaar' : 'Paid'
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `billing-summary-${date}.csv`;
        a.click();
    };

    return (
        <div className="flex flex-col gap-6 py-2">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-black text-white leading-none">Total Hisaab</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">कुल हिसाब</p>
                </div>
                <button onClick={() => navigate('/')} className="bg-shop-surface p-3 rounded-2xl text-slate-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Date Picker */}
            <div className="flex items-center gap-4 bg-shop-surface p-5 rounded-[2rem] border border-white/5 shadow-xl">
                <Calendar className="text-shop-primary" size={24} />
                <div className="flex flex-col flex-1">
                    <span className="text-[8px] text-slate-500 font-bold uppercase mb-1">Select Date / तारीख चुनें</span>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-transparent font-black text-white focus:outline-none text-lg"
                    />
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="card-shop flex flex-col gap-1 p-5 leading-none">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Sales</p>
                    <p className="text-[8px] text-slate-600 font-bold uppercase">कुल बिक्री</p>
                    <p className="text-3xl font-black text-shop-primary mt-3">₹{summary.totalSales}</p>
                </div>
                <div className="card-shop flex flex-col gap-1 p-5 leading-none">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Bills</p>
                    <p className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">कुल बिल</p>
                    <p className="text-3xl font-black text-white mt-3">{summary.billCount}</p>
                </div>
                <div className="card-shop flex flex-col gap-1 p-5 border-green-500/10 leading-none">
                    <p className="text-[10px] text-green-500/60 font-black uppercase tracking-widest">Cash In</p>
                    <p className="text-[8px] text-green-500/30 font-bold uppercase">नकद आया</p>
                    <p className="text-3xl font-black text-green-400 mt-3">₹{summary.cashReceived}</p>
                </div>
                <div className="card-shop flex flex-col gap-1 p-5 border-red-500/10 leading-none">
                    <p className="text-[10px] text-red-500/60 font-black uppercase tracking-widest">Credit</p>
                    <p className="text-[8px] text-red-500/30 font-bold uppercase">उधार</p>
                    <p className="text-3xl font-black text-red-400 mt-3">₹{summary.pendingCredit}</p>
                </div>
            </div>

            {/* Export Action */}
            <button
                onClick={exportCSV}
                className="w-full py-6 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-lg flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition-all shadow-xl"
            >
                <div className="flex items-center gap-4">
                    <Download size={28} />
                    <span>EXPORT TO EXCEL</span>
                </div>
                <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">एक्सेल फाइल में निकालें (CSV)</span>
            </button>

            {/* Bill List for Day */}
            <div className="mt-4 px-1 pb-20">
                <div className="mb-6">
                    <h3 className="font-black text-xl text-white leading-none uppercase tracking-wider">Reports for {date}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">दिन की रिपोर्ट</p>
                </div>
                <div className="space-y-4">
                    {bills.length > 0 ? bills.reverse().map(bill => (
                        <div key={bill.id} className="flex justify-between items-center p-6 bg-shop-surface/50 rounded-[2rem] shadow-lg border border-white/5 hover:border-shop-primary/30 transition-all">
                            <div className="flex gap-4 items-center">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${bill.isUdhaar ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                    {bill.customerName ? bill.customerName[0].toUpperCase() : 'C'}
                                </div>
                                <div>
                                    <p className="font-bold text-white text-lg leading-none mb-1">{bill.customerName || 'Cash Customer'}</p>
                                    <p className="text-[10px] text-slate-500 font-medium uppercase">{new Date(bill.date).toLocaleTimeString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-shop-primary text-xl leading-none">₹{bill.total}</p>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter inline-block mt-2 ${bill.isUdhaar ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {bill.isUdhaar ? 'CREDIT / उधार' : 'CASH / नकद'}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 text-slate-600 border-2 border-dashed border-white/5 rounded-[3rem] bg-shop-surface/30">
                            <Calendar size={48} className="mx-auto opacity-10 mb-4" />
                            <p className="font-bold text-lg italic">No business recorded this day</p>
                            <p className="text-[10px] font-bold uppercase text-slate-700 mt-1">आज कोई गतिविधि नहीं हुई</p>
                        </div>
                    )}
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to reset all reports and bills? / क्या आप सारी रिपोर्ट और बिल मिटाना चाहते हैं?')) {
                                db.resetData();
                            }
                        }}
                        className="text-[10px] font-bold text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-colors"
                    >
                        Reset Report / रिपोर्ट रीसेट करें
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Summary;
