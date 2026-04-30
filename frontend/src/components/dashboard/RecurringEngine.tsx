'use client';

import React from 'react';
import { Paper, Typography, Box, Chip, Avatar } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import SyncIcon from '@mui/icons-material/Sync';
import { useRouter } from 'next/navigation';
import { IRecurringRule } from '@/interfaces';

interface Props {
    lstRecurringRules?: IRecurringRule[];
}

export const RecurringEngine = ({ lstRecurringRules = [] }: Props) => {
    const router = useRouter();

    return (
        <Paper sx={{ p: 3, bgcolor: '#0e1117', border: '1px solid #1c2233', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutorenewIcon sx={{ color: '#3d9eff', fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ color: '#fff' }}>Recurring Engine</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Chip label={`${lstRecurringRules.length} Active`} size="small" sx={{ bgcolor: 'rgba(0, 229, 160, 0.1)', color: '#00e5a0', height: 20, fontSize: '0.7rem', fontWeight: 'bold' }} />
                    <Typography 
                        variant="caption" 
                        onClick={() => router.push('/recurring')}
                        sx={{ color: '#7a8499', cursor: 'pointer', transition: 'color 0.2s', '&:hover': { color: '#fff' } }}
                    >
                        Manage →
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {lstRecurringRules.length === 0 ? (
                    <Typography variant="body2" sx={{ color: '#7a8499', textAlign: 'center', py: 2 }}>
                        No recurring rules configured
                    </Typography>
                ) : (
                    lstRecurringRules.map((item) => (
                        <Box key={item.nRecurringRulesId} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'rgba(167, 139, 250, 0.1)', color: '#a78bfa', width: 40, height: 40, borderRadius: 2 }}>
                                    <SyncIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#dde3f0', fontWeight: 600 }}>{item.sName}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <Typography variant="caption" sx={{ color: '#3d4560', fontWeight: 'bold' }}>{item.sFrequency}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#ff4d6d', fontWeight: 'bold' }}>
                                -฿{item.nAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </Typography>
                        </Box>
                    ))
                )}
            </Box>
        </Paper>
    );
};
