'use client';

import React from 'react';
import { Box, Typography, Button, IconButton, Stack } from '@mui/material';
import { 
    WarningAmber as WarningAmberIcon, 
    ErrorOutline as ErrorOutlineIcon, 
    Close as CloseIcon 
} from '@mui/icons-material';
import { IAnomaly } from '@/interfaces';

interface AnomalyAlertsProps {
    lstAnomalies: IAnomaly[];
    onReview: (nId: number) => void;
}

export const AnomalyAlerts = ({ lstAnomalies, onReview }: AnomalyAlertsProps) => {
    if (lstAnomalies.length === 0) return null;

    return (
        <Stack spacing={1.5} sx={{ mb: 2 }}>
            {lstAnomalies.map((objAnomaly) => {
                const isCritical = objAnomaly.sSeverity === 'Critical' || objAnomaly.sType === 'Missing';
                const sMainColor = isCritical ? '#ff4d6d' : '#f5c542';
                const sBgColor = isCritical ? 'rgba(255, 77, 109, 0.08)' : 'rgba(245, 197, 66, 0.08)';

                return (
                    <Box
                        key={objAnomaly.nIAnomaliesId}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            borderRadius: '12px',
                            border: `1px solid ${sMainColor}`,
                            bgcolor: sBgColor,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '4px',
                                bgcolor: sMainColor,
                            }
                        }}
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: sMainColor
                                }}
                            >
                                {isCritical ? <ErrorOutlineIcon fontSize="medium" /> : <WarningAmberIcon fontSize="medium" />}
                            </Box>
                            
                            <Box>
                                <Typography 
                                    variant="subtitle2" 
                                    sx={{ 
                                        color: sMainColor, 
                                        fontWeight: 600,
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    {objAnomaly.sTitle}
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    {objAnomaly.sDescription}
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => onReview(objAnomaly.nIAnomaliesId)}
                                sx={{
                                    borderColor: sMainColor,
                                    color: sMainColor,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 2,
                                    borderRadius: '8px',
                                    '&:hover': {
                                        bgcolor: sMainColor,
                                        color: '#000',
                                        borderColor: sMainColor,
                                    }
                                }}
                            >
                                {objAnomaly.sType === 'Missing' ? 'Add Now' : 'Review'}
                            </Button>
                            
                            <IconButton 
                                size="small" 
                                onClick={() => onReview(objAnomaly.nIAnomaliesId)}
                                sx={{ color: 'rgba(255, 255, 255, 0.3)' }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Box>
                );
            })}
        </Stack>
    );
};
