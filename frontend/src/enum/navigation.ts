import { INavigationItem } from '@/interfaces';
export const lstNavItems: INavigationItem[] = [
    { sLabel: 'Dashboard', sRoute: '/dashboard', sIcon: '📊', sGroup: 'Overview' },
    { sLabel: 'Scenarios', sRoute: '/scenarios', sIcon: '🔮', sGroup: 'Overview' },
    { sLabel: 'All Transactions', sRoute: '/transactions', sIcon: '↕️', sGroup: 'Transactions' },
    { sLabel: 'Recurring Rules', sRoute: '/recurring', sIcon: '🔄', sGroup: 'Transactions' },
    { sLabel: 'Tags & Projects', sRoute: '/tags', sIcon: '🏷️', sGroup: 'Transactions' },
    { sLabel: 'Anomaly Alerts', sRoute: '/anomalies', sIcon: '⚠️', sGroup: 'Analytics', nBadgeCount: 3 },
    { sLabel: 'Settings', sRoute: '/settings', sIcon: '⚙️', sGroup: 'System' },
];