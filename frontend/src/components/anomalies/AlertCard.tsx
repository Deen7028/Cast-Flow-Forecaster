"use client";

import React from 'react';
import { Box, Typography, Paper, Chip, Stack, Button, Grid } from '@mui/material';

interface ActionButton {
  label: string;
  variant: 'contained' | 'outlined';
  icon?: React.ReactNode;
}

interface AlertCardProps {
  title: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM';
  tags: { label: string; icon?: React.ReactNode }[];
  date: string;
  accentColor: string;
  actions?: ActionButton[];
}

const AlertCard = ({ title, description, severity, tags, date, accentColor, actions }: AlertCardProps) => (
  <Paper
    elevation={0}
    sx={{
      p: 3, mb: 1.5, bgcolor: '#0f172a', borderLeft: `4px solid ${accentColor}`,
      borderRadius: '8px', border: '1px solid #1e293b',
    }}
  >
    <Grid container spacing={2} sx={{display:'flex',flexDirection:'row'}} >
      <Grid size={{ xs: 12, md: 9 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>

          <Box>
            <Typography variant="subtitle1" sx={{ color: '#f8fafc', fontWeight: 'bold' }}>{title}</Typography>

            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5, mb: 2 }}>{description}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>

              <Chip
                label={`${severity} SEVERITY`}
                size="small"
              />
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag.label}
                  size="small"
                  sx={{ bgcolor: '#334155', color: '#94a3b8', fontSize: '10px', border: '1px solid #475569' }}
                />
              ))}
              <Typography variant="caption" sx={{ color: '#64748b', pt: 0.5 }}>
                Detected: {date}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
          {actions?.map((action, index) => (
            <Button
              key={index}
              size="small"
              variant={action.variant}
              startIcon={action.icon}
              sx={{
                minWidth: 100, fontSize: '11px', textTransform: 'none',
                ...(action.variant === 'contained' && { bgcolor: '#00dc82', color: '#020617', '&:hover': { bgcolor: '#00bb6d' } }),
                ...(action.variant === 'outlined' && { borderColor: '#334155', color: '#94a3b8', '&:hover': { borderColor: '#475569' } }),
              }}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      </Grid>
    </Grid>Detection
  </Paper>
);

export default AlertCard;