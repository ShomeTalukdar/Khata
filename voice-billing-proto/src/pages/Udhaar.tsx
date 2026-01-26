import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search, ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';
import { db } from '../utils/db';
import type { Customer } from '../utils/db';

const Udhaar: React.FC = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<Customer[]>(db.getCustomers());
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState('');

    const filteredCustomers = customers.filter((c: Customer) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalUdhaar = customers.reduce((sum: number, c: Customer) => sum + c.balance, 0);

    const addCustomer = () => {
        if (!newCustomerName) return;
        const newCustomer: Customer = {
            id: Date.now().toString(),
            name: newCustomerName,
            balance: 0,
            lastUpdated: new Date().toISOString()
        };
        db.saveCustomer(newCustomer);
        setCustomers(db.getCustomers());
        setNewCustomerName('');
        setShowAddModal(false);
    };

    const updateBalance = (id: string, amount: number) => {
        const customer = customers.find((c: Customer) => c.id === id);
        if (customer) {
            const updated = {
                ...customer,
                balance: customer.balance + amount,
                lastUpdated: new Date().toISOString()
            };
            db.saveCustomer(updated);
            setCustomers(db.getCustomers());
        }
    };

    return (
        <div className="flex flex-col gap-6 py-2">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-black text-white leading-none">Credit Khata</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">उधार खाता</p>
                </div>
                <button onClick={() => navigate('/')} className="bg-shop-surface p-3 rounded-2xl text-slate-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Stats Card */}
            <div className="card-shop bg-red-500/10 border-red-500/20 flex justify-between items-center shadow-red-900/10 p-8">
                <div>
                    <p className="text-red-400 text-[10px] font-black uppercase tracking-widest leading-none">Total Pending Credit</p>
                    <p className="text-[8px] text-red-500/60 font-bold uppercase mt-1">कुल बकाया उधार</p>
                    <h2 className="text-4xl font-black text-red-500 mt-3">₹{totalUdhaar}</h2>
                </div>
                <Users className="text-red-500/40" size={48} />
            </div>

            {/* Search and Add */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search Customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 rounded-[2rem] border border-white/5 focus:border-shop-primary/50 focus:outline-none bg-shop-surface text-white placeholder:text-slate-600 transition-all shadow-xl"
                    />
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-shop-primary text-slate-900 p-5 rounded-[1.5rem] shadow-xl shadow-sky-500/20 active:scale-95 transition-all hover:scale-105"
                >
                    <Plus size={28} strokeWidth={3} />
                </button>
            </div>

            {/* Customer List */}
            <div className="space-y-4">
                {filteredCustomers.map((customer: Customer) => (
                    <div key={customer.id} className="card-shop group hover:border-shop-primary/30 transition-all p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="font-black text-2xl text-white capitalize leading-none">{customer.name}</h4>
                                <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-widest leading-none">Last Activity: {new Date(customer.lastUpdated).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className={`text-3xl font-black leading-none ${customer.balance > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    ₹{customer.balance}
                                </p>
                                <p className="text-[8px] text-slate-500 font-black mt-1 uppercase">TOTAL DUE / बकाया</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => updateBalance(customer.id, 100)}
                                className="flex-1 flex flex-col items-center justify-center gap-1 py-4 rounded-2xl bg-red-500/10 text-red-400 font-black text-sm border border-red-500/20 active:bg-red-500/20 hover:border-red-500/40 transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <ArrowUpRight size={18} />
                                    <span>ADD CREDIT</span>
                                </div>
                                <span className="text-[10px] font-bold opacity-60">उधार लिखें</span>
                            </button>
                            <button
                                onClick={() => updateBalance(customer.id, -100)}
                                className="flex-1 flex flex-col items-center justify-center gap-1 py-4 rounded-2xl bg-green-500/10 text-green-400 font-black text-sm border border-green-500/20 active:bg-green-500/20 hover:border-green-500/40 transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <ArrowDownLeft size={18} />
                                    <span>GOT CASH</span>
                                </div>
                                <span className="text-[10px] font-bold opacity-60">मले पैसे</span>
                            </button>
                        </div>
                    </div>
                ))}
                {filteredCustomers.length === 0 && (
                    <div className="text-center py-16 text-slate-600 border-2 border-dashed border-white/5 rounded-[3rem] bg-shop-surface/30">
                        <Users size={48} className="mx-auto opacity-20 mb-4" />
                        <p className="font-bold text-lg italic">No customers found</p>
                        <p className="text-[10px] uppercase font-bold text-slate-500 mt-1">कोई ग्राहक नहीं मिला</p>
                    </div>
                )}
            </div>

            {/* Add Customer Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in">
                    <div className="bg-shop-surface rounded-[3rem] p-8 w-full max-w-sm space-y-8 border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]">
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black text-white px-1">New Customer</h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-1">नया ग्राहक जोड़ें</p>
                        </div>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            value={newCustomerName}
                            onChange={(e) => setNewCustomerName(e.target.value)}
                            className="w-full bg-black/20 p-5 rounded-2xl border border-white/10 focus:border-shop-primary focus:outline-none text-white font-bold placeholder:text-slate-700 transition-all"
                            autoFocus
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 py-5 text-slate-500 font-black tracking-widest"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={addCustomer}
                                className="flex-[2] py-5 bg-shop-primary text-slate-900 rounded-[1.5rem] font-black shadow-lg shadow-sky-500/20 active:scale-95 transition-all text-lg"
                            >
                                SAVE / जोड़ें
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Udhaar;
