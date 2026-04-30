'use client';

import React from 'react';
import { Paper, Typography, Box, Chip, Avatar } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import BusinessIcon from '@mui/icons-material/Business';
import CloudIcon from '@mui/icons-material/Cloud';
import GroupsIcon from '@mui/icons-material/Groups';

const data = [
    { id: 1, title: 'Engineering Payroll', freq: 'MONTHLY', next: 'Next: Sep 01', amount: '-฿680K', icon: <GroupsIcon />, iconBg: 'rgba(167, 139, 250, 0.1)', iconColor: '#a78bfa' },
    { id: 2, title: 'Office Rent', freq: 'MONTHLY', issue: 'Missing', issueColor: '#ff4d6d', amount: '-฿85K', icon: <BusinessIcon />, iconBg: 'rgba(0, 229, 160, 0.1)', iconColor: '#00e5a0' },
    { id: 3, title: 'AWS / GCP Stack', freq: 'MONTHLY', issue: 'Spike', issueColor: '#f5c542', amount: '-฿38K', icon: <CloudIcon />, iconBg: 'rgba(245, 197, 66, 0.1)', iconColor: '#f5c542' },
];

export const RecurringEngine = () => {
    return (
        <Paper sx={{ p: 3, bgcolor: '#0e1117', border: '1px solid #1c2233', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutorenewIcon sx={{ color: '#3d9eff', fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ color: '#fff' }}>Recurring Engine</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Chip label="5 Active" size="small" sx={{ bgcolor: 'rgba(0, 229, 160, 0.1)', color: '#00e5a0', height: 20, fontSize: '0.7rem', fontWeight: 'bold' }} />
                    <Typography variant="caption" sx={{ color: '#7a8499', cursor: 'pointer', '&:hover': { color: '#fff' } }}>Manage →</Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {data.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: item.iconBg, color: item.iconColor, width: 40, height: 40, borderRadius: 2 }}>
                                {item.icon}
                            </Avatar>
                            <Box>
                                <Typography variant="body2" sx={{ color: '#dde3f0', fontWeight: 600 }}>{item.title}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: '#3d4560', fontWeight: 'bold' }}>{item.freq}</Typography>
                                    
                                    {item.next && (
                                        <Typography variant="caption" sx={{ color: '#7a8499' }}>{item.next}</Typography>
                                    )}
                                    
                                    {item.issue && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            {item.issue === 'Missing' ? (
                                                <ErrorOutlineIcon sx={{ color: item.issueColor, fontSize: 14 }} />
                                            ) : (
                                                <WarningAmberIcon sx={{ color: item.issueColor, fontSize: 14 }} />
                                            )}
                                            <Typography variant="caption" sx={{ color: item.issueColor, fontWeight: 'bold' }}>{item.issue}</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#ff4d6d', fontWeight: 'bold' }}>
                            {item.amount}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};
