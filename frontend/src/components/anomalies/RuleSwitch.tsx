"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Switch, styled, CircularProgress, IconButton } from '@mui/material';
import { Settings } from '@mui/icons-material';

const NeonSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#00dc82',
    '&:hover': {
      backgroundColor: 'rgba(0, 220, 130, 0.08)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#00dc82',
  },
}));

interface RuleSwitchProps {
  title: string;
  description: string;
  checked?: boolean;
  onChange?: (newVal: boolean) => Promise<void>;
  onEdit?: () => void;
}

const RuleSwitch = ({ title, description, checked = false, onChange, onEdit }: RuleSwitchProps) => {
  const [isChecked, setIsChecked] = useState(checked);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.checked;
    setIsChecked(newVal); // optimistic update
    
    if (onChange) {
      setIsUpdating(true);
      try {
        await onChange(newVal);
      } catch (error) {
        // revert on failure
        setIsChecked(!newVal);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2, 
        borderBottom: '1px solid #1e293b' 
      }}
    >
      <Box sx={{ pr: 2 }}>
        <Typography variant="body1" sx={{ color: '#f8fafc', fontWeight: 'bold' }}>{title}</Typography>
        <Typography variant="caption" sx={{ color: '#64748b' }}>{description}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isUpdating && <CircularProgress size={16} sx={{ color: '#00dc82' }} />}
        
        {onEdit && (
          <IconButton 
            size="small" 
            onClick={onEdit} 
            sx={{ color: '#94a3b8', '&:hover': { color: '#00dc82', bgcolor: '#1e293b' } }}
          >
            <Settings sx={{ fontSize: 18 }} />
          </IconButton>
        )}

        <NeonSwitch 
          size="small" 
          checked={isChecked} 
          onChange={handleChange}
          disabled={isUpdating}
        />
      </Box>
    </Box>
  );
};

export default RuleSwitch;