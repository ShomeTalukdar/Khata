// LocalStorage Utilities for Billing App

export interface BillItem {
    name: string;
    qty: number;
    unit: string;
    price: number;
    total: number;
}

export interface Bill {
    id: string;
    date: string;
    items: BillItem[];
    total: number;
    customerName?: string;
    isUdhaar: boolean;
    image?: string; // For paper-to-digital
}

export interface Customer {
    id: string;
    name: string;
    balance: number;
    lastUpdated: string;
}

const STORAGE_KEYS = {
    BILLS: 'shop_bills',
    CUSTOMERS: 'shop_customers',
    SUMMARY: 'shop_daily_summary'
};

export const db = {
    getBills: (): Bill[] => {
        const data = localStorage.getItem(STORAGE_KEYS.BILLS);
        return data ? JSON.parse(data) : [];
    },

    saveBill: (bill: Bill) => {
        const bills = db.getBills();
        bills.push(bill);
        localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));

        // Update summary
        db.updateDailySummary(bill);
    },

    getCustomers: (): Customer[] => {
        const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
        return data ? JSON.parse(data) : [];
    },

    saveCustomer: (customer: Customer) => {
        const customers = db.getCustomers();
        const index = customers.findIndex(c => c.id === customer.id);
        if (index > -1) {
            customers[index] = customer;
        } else {
            customers.push(customer);
        }
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    },

    updateDailySummary: (bill: Bill) => {
        const date = new Date().toISOString().split('T')[0];
        const summary = db.getDailySummary(date);

        summary.totalSales += bill.total;
        if (bill.isUdhaar) {
            summary.pendingCredit += bill.total;
        } else {
            summary.cashReceived += bill.total;
        }
        summary.billCount += 1;

        const summaries = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUMMARY) || '{}');
        summaries[date] = summary;
        localStorage.setItem(STORAGE_KEYS.SUMMARY, JSON.stringify(summaries));
    },

    getDailySummary: (date: string) => {
        const summaries = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUMMARY) || '{}');
        return summaries[date] || {
            totalSales: 0,
            cashReceived: 0,
            pendingCredit: 0,
            billCount: 0
        };
    },

    resetData: () => {
        localStorage.removeItem(STORAGE_KEYS.BILLS);
        localStorage.removeItem(STORAGE_KEYS.SUMMARY);
        localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
        // Force reload to reflect changes
        window.location.reload();
    }
};
