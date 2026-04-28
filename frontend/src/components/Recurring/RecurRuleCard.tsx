"use client";

import React from 'react';
import {
  Box, Typography, Paper, Chip, Button, IconButton
} from '@mui/material';
import { Edit, Pause, Dns } from '@mui/icons-material';

interface RuleCardProps {
  title: string;
  status?: string;
  amount: string;
  type: string;
  date: string;
  color: string;
  warning?: boolean;
}

const RuleCard = ({
  title,
  status,
  amount,
  type,
  date,
  color
}: RuleCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2, mb: 1.5, bgcolor: '#0f172a', borderLeft: `4px solid ${color}`,
        display: 'flex', flexDirection: { xs: 'column', md: 'row' },
        alignItems: { md: 'center' }, justifyContent: 'space-between', gap: 2,
        borderRadius: '8px', border: '1px solid #1e293b'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', flexGrow: 1 }}>
        <Box sx={{ p: 1, bgcolor: '#1e293b', borderRadius: 1.5, color: color }}>
          <Dns fontSize="small" />
        </Box>
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
            <Typography variant="subtitle1">
              {title}
            </Typography>
            {status && (
              <Chip
                label={status}
                size="small"
                sx={{ height: 20, fontSize: '10px' }}
              />
            )}
          </Box>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>{date}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, mt: 0.5 }}>
            <Chip label={type} size="small" variant="outlined" sx={{ borderColor: '#334155', color: '#94a3b8', fontSize: '10px' }} />
            <Chip label="THB" size="small" sx={{ bgcolor: '#334155', color: '#f8fafc', fontSize: '10px' }} />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center', justifyContent: 'space-between', width: { xs: '100%', md: 'auto' } }}>
        <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Typography variant="h6">
            {amount}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Per month</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<Edit />}
          >
            Edit
          </Button>
          <IconButton size="small">
            <Pause fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default RuleCard;