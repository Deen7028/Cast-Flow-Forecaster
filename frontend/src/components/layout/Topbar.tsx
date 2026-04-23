'use client';
import React from 'react';
import { Box, Typography, Button, Breadcrumbs, Link } from '@mui/material';

export const Topbar = () => {
    return (
        <Box sx={{ height: 54, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', px: 3, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontFamily: 'Syne' }}>
                    Overview
                </Typography>
                <Typography sx={{ color: 'text.disabled', fontSize: 11, fontFamily: 'monospace' }}>
                    Q3 2025 · Jul–Sep
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" size="small" sx={{ color: '#000', fontWeight: 700, borderRadius: 1.5 }}>
                    ＋ Add Transaction
                </Button>
            </Box>
        </Box>
    );
};