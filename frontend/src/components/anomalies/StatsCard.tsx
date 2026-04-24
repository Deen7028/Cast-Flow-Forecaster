"use client";

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface StatsCardProps {
  label: string;
  value: string | number;
  description: string;
  borderColor: string;
}

const StatsCard = ({ label, value, description, borderColor }: StatsCardProps) => (
  <Paper 
    elevation={0}
    sx={{ 
      p: { xs: 2, md: 3 }, 
      bgcolor: '#0f172a', 
      borderLeft: `3px solid ${borderColor}`,
      borderRadius: '8px', 
      borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b', borderRight: '1px solid #1e293b',
      height: '100%', display: 'flex', flexDirection: 'column'
    }}
  >
    <Typography variant="overline" sx={{ color: '#94a3b8', fontSize: '11px', display: 'flex', alignItems: 'center', gap: 1 }}>
      {label}
    </Typography>
    <Typography variant="h3"  sx={{ color: '#f8fafc', mt: 1, fontWeight:"bold"}}>{value}</Typography>
    <Typography variant="caption" sx={{ color: '#64748b', mt: 'auto', pt: 1 }}>{description}</Typography>
  </Paper>
);

export default StatsCard;