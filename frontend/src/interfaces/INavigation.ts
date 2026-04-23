export interface INavigationItem {
    sLabel: string;
    sRoute: string;
    sIcon: string;
    sGroup: 'Overview' | 'Transactions' | 'Analytics' | 'System';
    nBadgeCount?: number;
}