export interface IAnomaly {
    nIAnomaliesId: number;
    sTitle: string;
    sDescription: string;
    sSeverity: string;
    sType: string;
    nTransactionId?: number;
    dDetectedAt?: string;
    isReviewed: boolean;
}
