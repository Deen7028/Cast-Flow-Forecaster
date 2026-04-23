// src/components/dashboard/KpiCard.tsx
'use client';

import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { IKpiCardProps } from '@/interfaces';

export const KpiCard = ({ sTitle, nValue, isPositive }: IKpiCardProps) => {
    return (
        <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                {sTitle.toUpperCase()}
            </Typography>
            <Typography variant="h5" sx={{ mt: 1, color: isPositive ? 'primary.main' : 'error.main' }}>
                ฿{nValue.toLocaleString()}
            </Typography>
        </Paper>
    );
};
