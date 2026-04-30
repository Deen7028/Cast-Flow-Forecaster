'use client';

import React from 'react';
import { Paper, Typography, Box, LinearProgress } from '@mui/material';
import { IKpiCardProps } from '@/interfaces';

export const KpiCard = (props: IKpiCardProps) => {
    return (
        <Paper 
            sx={{ 
                p: 2.5, 
                bgcolor: '#0e1117', 
                border: '1px solid #1c2233', 
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            {/* Top Border Indicator */}
            <Box 
                sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    height: 3, 
                    bgcolor: props.sTopBorderColor,
                    boxShadow: `0 0 10px ${props.sTopBorderColor}`,
                    opacity: 0.8
                }} 
            />

            <Typography variant="caption" sx={{ color: '#7a8499', fontWeight: 600, letterSpacing: 1, fontFamily: 'monospace' }}>
                {props.sTitle.toUpperCase()}
            </Typography>

            <Typography variant="h4" sx={{ mt: 1, color: props.sValueColor, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>
                {props.sValue}
            </Typography>

            {(props.sSubtextPrefix || props.sSubtextSuffix) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    {props.sSubtextPrefix && (
                        <Typography variant="body2" sx={{ color: props.sSubtextPrefixColor, fontWeight: 600 }}>
                            {props.sSubtextPrefix}
                        </Typography>
                    )}
                    {props.sSubtextSuffix && (
                        <Typography variant="body2" sx={{ color: '#7a8499' }}>
                            {props.sSubtextSuffix}
                        </Typography>
                    )}
                </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: '#7a8499' }}>
                        {props.sBottomLeftText}
                    </Typography>
                    <Typography variant="caption" sx={{ color: props.sBottomRightColor || '#7a8499', fontWeight: props.sBottomRightColor ? 700 : 400 }}>
                        {props.sBottomRightText}
                    </Typography>
                </Box>
                {props.nProgress !== undefined && (
                    <LinearProgress 
                        variant="determinate" 
                        value={props.nProgress} 
                        sx={{ 
                            height: 4, 
                            borderRadius: 2,
                            bgcolor: '#1c2233',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: props.sProgressColor || props.sValueColor,
                                borderRadius: 2
                            }
                        }} 
                    />
                )}
            </Box>
        </Paper>
    );
};
