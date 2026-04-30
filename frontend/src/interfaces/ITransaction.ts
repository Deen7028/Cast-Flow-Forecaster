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
    sRecurringRuleName?: string;
    nRecurringRuleId?: number;
    sTitleSub?: string;
    isAnomaly?: boolean;
}

export interface ITransactionForm {
    nTransactionsId: number;
    sDescription: string;
    nAmount: number | null;
    sType: string;
    dDate: string;
    nTagId: number | null;
    nCategoryId: number | null;
    sStatus: string;
    nRecurringRuleId: number | null;
    isRecurring: boolean;
    sRecurringRuleName?: string;
}

export interface IRecurringRule {
    nRecurringRulesId: number;
    sName: string;
    nAmount: number;
    sFrequency: string;
}

export interface ICategory {
    nCategoriesId: number;
    sName: string;
    sType: string;
}

export interface IApiResponse<T = unknown> {
    status: string;
    message?: string;
    data?: T;
}