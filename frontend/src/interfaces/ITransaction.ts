import { TransactionType } from '@/enum';

export interface ITransaction {
    nId: number;
    sDescription: string;
    nAmount: number;
    sType: TransactionType;
    dTransactionDate: Date;
    isIsAnomaly: boolean;
}