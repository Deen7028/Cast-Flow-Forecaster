export interface ITransaction {
    nId: number;
    sDescription: string;
    nAmount: number;
    sType: string;
    dDate: string;
    sStatus?: string;
    nCategoryId?: number;
    sCategoryName?: string;
    nTagId: number;
    sTagName?: string;
    sTagColor?: string;
}

export interface ITransactionForm {
    nId: number;
    sDescription: string;
    nAmount: number;
    sType: string;
    dDate: string;
    nTagId: number | null;
}