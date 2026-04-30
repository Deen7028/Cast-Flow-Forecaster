import React from 'react';
import { INavigationItem } from '@/interfaces';
import { 
    Dashboard, 
    AutoGraph, 
    SwapVert, 
    Category, 
    Sync, 
    Label, 
    Warning, 
    Settings 
} from '@mui/icons-material';

export const lstNavItems: INavigationItem[] = [
    { sLabel: 'Dashboard', sRoute: '/dashboard', sIcon: <Dashboard fontSize="small" />, sGroup: 'Overview' },
    { sLabel: 'Scenarios', sRoute: '/scenarios', sIcon: <AutoGraph fontSize="small" />, sGroup: 'Overview' },
    { sLabel: 'All Transactions', sRoute: '/transactions', sIcon: <SwapVert fontSize="small" />, sGroup: 'Transactions' },
    { sLabel: 'Categories', sRoute: '/categories', sIcon: <Category fontSize="small" />, sGroup: 'Transactions' },
    { sLabel: 'Recurring Rules', sRoute: '/recurring', sIcon: <Sync fontSize="small" />, sGroup: 'Transactions' },
    { sLabel: 'Tags & Projects', sRoute: '/tags', sIcon: <Label fontSize="small" />, sGroup: 'Transactions' },
    { sLabel: 'Anomaly Alerts', sRoute: '/anomalies', sIcon: <Warning fontSize="small" />, sGroup: 'Analytics' },
    { sLabel: 'Settings', sRoute: '/settings', sIcon: <Settings fontSize="small" />, sGroup: 'System' },
];