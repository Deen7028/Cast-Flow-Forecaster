'use client';

import React, { useState } from 'react';
import { Paper, Typography, Box, Slider, Button, Chip } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';

export const ScenarioPanel = () => {
    const [nDaysOffset, setNDaysOffset] = useState(12);
    const [nInvoiceAmount, setNInvoiceAmount] = useState(350);
    const [nExchangeRate, setNExchangeRate] = useState(35.50);

    const nBalanceImpact = nInvoiceAmount * nExchangeRate * 1000; // rough calc
    const isPositive = nBalanceImpact >= 0;

    return (
        <Paper sx={{ p: 3, bgcolor: '#0e1117', border: '1px solid #1c2233', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScienceIcon sx={{ color: '#fff', fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ color: '#fff' }}>Scenario (Quick)</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip label="Active" size="small" sx={{ bgcolor: 'rgba(0, 229, 160, 0.1)', color: '#00e5a0', height: 20, fontSize: '0.7rem' }} />
                    <Typography variant="caption" sx={{ color: '#7a8499', cursor: 'pointer', '&:hover': { color: '#fff' } }}>Full →</Typography>
                </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="caption" sx={{ color: '#7a8499', letterSpacing: 1 }}>BALANCE IMPACT</Typography>
                <Typography variant="h4" sx={{ color: isPositive ? '#00e5a0' : '#ff4d6d', fontWeight: 700, mt: 0.5, fontFamily: "'Syne', sans-serif" }}>
                    {isPositive ? '+' : '-'}฿{(Math.abs(nBalanceImpact)).toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: '#7a8499' }}>Runway +{nDaysOffset} days</Typography>
            </Box>

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#dde3f0' }}>Client A - Payment date</Typography>
                        <Typography variant="body2" sx={{ color: '#00e5a0', fontWeight: 'bold' }}>Aug {Math.max(1, 8 + Math.floor(nDaysOffset / 3))}</Typography>
                    </Box>
                    <Slider 
                        value={nDaysOffset}
                        onChange={(_, val) => setNDaysOffset(val as number)}
                        min={0}
                        max={30}
                        sx={{ 
                            color: '#00e5a0',
                            '& .MuiSlider-thumb': { bgcolor: '#00e5a0', width: 14, height: 14 },
                            '& .MuiSlider-rail': { bgcolor: '#1c2233' }
                        }} 
                    />
                </Box>

                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#dde3f0' }}>Invoice Amount (฿)</Typography>
                        <Typography variant="body2" sx={{ color: '#00e5a0', fontWeight: 'bold' }}>฿{nInvoiceAmount}K</Typography>
                    </Box>
                    <Slider 
                        value={nInvoiceAmount}
                        onChange={(_, val) => setNInvoiceAmount(val as number)}
                        min={100}
                        max={1000}
                        step={10}
                        sx={{ 
                            color: '#00e5a0',
                            '& .MuiSlider-thumb': { bgcolor: '#00e5a0', width: 14, height: 14 },
                            '& .MuiSlider-rail': { bgcolor: '#1c2233' }
                        }} 
                    />
                </Box>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: '#111520', borderRadius: 2, border: '1px solid #1c2233' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#f5c542' }} />
                        <Typography variant="body2" sx={{ color: '#7a8499' }}>Net Change</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#00e5a0', fontWeight: 'bold' }}>{isPositive ? '+' : '-'}฿{(Math.abs(nBalanceImpact) / 1000).toLocaleString()}K</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: '#111520', borderRadius: 2, border: '1px solid #1c2233' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderBottom: '7px solid #f5c542' }} />
                        <Typography variant="body2" sx={{ color: '#7a8499' }}>Risk</Typography>
                    </Box>
                    <Chip label={nDaysOffset < 10 ? 'HIGH' : (nDaysOffset < 20 ? 'MEDIUM' : 'LOW')} size="small" sx={{ bgcolor: 'rgba(0, 229, 160, 0.1)', color: '#00e5a0', border: '1px solid #00e5a0', height: 20, fontSize: '0.7rem', fontWeight: 'bold' }} />
                </Box>

                <Button variant="contained" fullWidth sx={{ bgcolor: '#00e5a0', color: '#000', fontWeight: 'bold', mt: 1, '&:hover': { bgcolor: '#00c78a' } }}>
                    💾 Save Scenario
                </Button>
            </Box>
        </Paper>
    );
};
