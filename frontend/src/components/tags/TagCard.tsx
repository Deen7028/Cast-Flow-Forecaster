'use client';
import React from 'react';
import { Paper, Typography, Box, Button, Chip } from '@mui/material';
import { ITag } from '@/interfaces';

interface ITagCardProps {
    objTag: ITag;
    onEdit: () => void;
}

export const TagCard = ({ objTag, onEdit }: ITagCardProps) => {
    return (
        <Paper sx={{
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            transition: 'all 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 6 },
            opacity: objTag.isActive ? 1 : 0.5,

            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            width: '100%',
            minHeight: "100%",

        }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box sx={{
                    width: 12, height: 12, borderRadius: 0.5,
                    bgcolor: objTag.sColorCode || 'primary.main',
                    boxShadow: `0 0 8px ${objTag.sColorCode || '#00e5a0'}`
                }} />
                <Typography variant="subtitle1" sx={{ flex: 1, fontFamily: 'Syne', fontWeight: 700 }}>
                    {objTag.sName}
                </Typography>
                <Chip
                    label={objTag.isActive ? 'Active' : 'Hidden'}
                    color={objTag.isActive ? 'success' : 'default'}
                    size="small"
                    sx={{ height: 20, fontSize: 10, fontFamily: 'monospace' }}
                />
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Total Income</Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
                        {objTag.nTotalIncome > 0 ? '+' : ''}฿{objTag.nTotalIncome.toLocaleString()}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Total Expense</Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'error.main' }}>
                        -฿{objTag.nTotalExpense.toLocaleString()}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Net</Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: objTag.nNet >= 0 ? 'primary.main' : 'error.main' }}>
                        {objTag.nNet >= 0 ? '+' : ''}฿{objTag.nNet.toLocaleString()}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Transactions</Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{objTag.nTransactionCount}</Typography>
                </Box>
            </Box>

            {/* Actions */}
            <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                <Button variant="outlined" size="small" sx={{ flex: 1, borderColor: 'divider', color: 'text.secondary' }}>
                    {objTag.isActive ? 'Filter View' : 'Show'}
                </Button>
                <Button variant="outlined" sx={{ minWidth: 46, borderRadius: 2 }} onClick={onEdit}>
                    ✏️
                </Button>
            </Box>
        </Paper>
    );
};