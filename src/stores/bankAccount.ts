import { defineStore } from 'pinia';

type Transaction = {
    id: number;
    type: 'charge' | 'refund' | 'payment';
    amount: number;
    status: 'pending' | 'processed'
};

type BankDetails = {
    balance: number;
    transactions: Transaction[]
};

export const useBankAccountStore = defineStore('bankAccount', {
    state: () => {
        return {
            balance: 0,
            transactions: []
        } as BankDetails
    },
    actions: {
        charge(amount: number): number {
            const id = Date.now();
            this.transactions.push({
                id,
                type: 'charge',
                amount,
                status: 'pending'
            });
            return id; 
        },
        pay(amount: number): number {
            const id = Date.now();
            this.transactions.push({
                id,
                type: 'payment',
                amount: -amount,
                status: 'pending'
            });
            return id; 
        },
        processTransaction(transactionId: number) {
            setTimeout(() => {
                this.transactions = this.transactions.map((t) => {
                    if(t.id === transactionId) {
                        return {...t, status: 'processed'}
                    }
                    return t;
                })
            }, 5000)
        }
    },
    getters: {
        // use arrow functions for simple getters like this
        processedTransactions: (state) => state.transactions.filter(t => t.status === 'processed'),
        pendingTransactions: (state) => state.transactions.filter(t => t.status === 'pending'),
        // use regular function definition syntax if you want to compose getters together
        runningBalance(state): number {
            return (
                this.balance +
                this.processedTransactions
                    .map((t) => t.amount)
                    .reduce((acc, curr) => acc + curr, 0)
            )
        }

    }
});