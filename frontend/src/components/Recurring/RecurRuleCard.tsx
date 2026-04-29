"use client";

import React from 'react';
import {
  Box, Typography, Paper, Chip, Button, IconButton, Stack, Checkbox
} from '@mui/material';
import { Edit, Pause, Dns, Delete, PlayArrow, History as HistoryIcon, SkipNext as SkipNextIcon } from '@mui/icons-material';
import { RuleCardProps } from '@/interfaces/Irecurring';

const RuleCard = ({
  title,
  status,
  isActive,
  isSelected,
  amount,
  type,
  categoryType,
  frequency,
  date,
  nextRunDate,
  color,
  onEdit,
  onDelete,
  onToggleActive,
  onSelect,
  onViewHistory,
}: RuleCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: isSelected ? '1px solid' : '1px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
        <Checkbox 
          checked={isSelected} 
          onChange={onSelect}
          sx={{ color: '#334155', '&.Mui-checked': { color: '#00dc82' } }}
        />
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main'
          }}
        >
          <Dns />
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
          {nextRunDate && (
            <Typography variant="caption" sx={{ color: 'primary.main', ml: 2, bgcolor: 'primary.light', px: 1, borderRadius: 1 }}>
              Next: {nextRunDate}
            </Typography>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, mt: 0.5 }}>
            <Chip label={type} size="small" variant="outlined" sx={{ borderColor: 'divider', color: 'text.secondary', fontSize: '10px' }} />
            <Chip label="THB" size="small" sx={{ bgcolor: 'action.selected', color: 'text.primary', fontSize: '10px' }} />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center', justifyContent: 'space-between', width: { xs: '100%', md: 'auto' } }}>
        <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: categoryType?.toLowerCase() === 'income' ? '#10b981' : '#ef4444',
              fontWeight: 700
            }}
          >
            {categoryType?.toLowerCase() === 'income' ? '+' : '-'} {amount}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
            Per {frequency.toLowerCase().replace('ly', '').replace('i', 'y')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
          <IconButton 
            size="small" 
            title="View History"
            onClick={onViewHistory}
            sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary', bgcolor: 'action.hover' } }}
          >
            <HistoryIcon fontSize="small" />
          </IconButton>
          
          <Button
            size="small"
            variant="contained"
            title="Edit Rule"
            startIcon={<Edit />}
            onClick={onEdit}
            sx={{ 
              bgcolor: 'background.default', 
              color: 'text.primary', 
              borderColor: 'divider',
              '&:hover': { bgcolor: 'action.hover' },
              textTransform: 'none'
            }}
          >
            Edit
          </Button>



          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748b', mr: 0.5 }}>{isActive ? 'ON' : 'OFF'}</Typography>
            <Checkbox 
              size="small"
              checked={isActive}
              onChange={onToggleActive}
              sx={{ color: 'divider', '&.Mui-checked': { color: 'primary.main' } }}
            />
          </Box>

          <IconButton 
            size="small" 
            title="Delete Rule"
            onClick={onDelete}
            sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
          >
            <Delete fontSize="small" />
          </IconButton>

        </Box>


      </Box>
    </Paper>
  );
};

export default RuleCard;