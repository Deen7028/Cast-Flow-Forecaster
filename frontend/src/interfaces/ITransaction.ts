export interface ITransaction {
    nTransactionsId: number;
    sDescription: string;
    nAmount: number;
    sType: string;
    dDate: string;
    sStatus?: string;
    nCategoryId?: number;
    sCategoryName?: string;
    nTagsId: number;
    sTagName?: string;
    sTagColor?: string;
}

export interface ITransactionForm {
    nTransactionsId: number;
    sDescription: string;
    nAmount: number;
    sType: string;
    dDate: string;
    nTagsId: number | null;
    sStatus: string;
}