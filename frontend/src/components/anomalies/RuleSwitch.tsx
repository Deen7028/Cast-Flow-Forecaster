"use client";

import React, { useState } from 'react';
import { Box, Typography, Switch, styled } from '@mui/material';

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
}

const RuleSwitch = ({ title, description, checked = false }: RuleSwitchProps) => {
  const [isChecked, setIsChecked] = useState(checked);

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
      <Box>
        <Typography variant="body1" sx={{ color: '#f8fafc', fontWeight: 'bold' }}>{title}</Typography>
        <Typography variant="caption" sx={{ color: '#64748b' }}>{description}</Typography>
      </Box>
      <NeonSwitch 
        size="small" 
        checked={isChecked} 
        onChange={(e) => setIsChecked(e.target.checked)}
      />
    </Box>
  );
};

export default RuleSwitch;