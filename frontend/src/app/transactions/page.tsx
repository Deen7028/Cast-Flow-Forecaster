"use client";
import { Suspense } from 'react';
import { TransactionsContainer } from '@/components/transactions/TransactionsContainer';

export default function TransactionsPage() {
    return (
        <main>
            <Suspense fallback={null}>
                <TransactionsContainer />
            </Suspense>
        </main>
    );
}