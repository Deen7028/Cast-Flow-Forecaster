"use client";

import React from 'react';
import { Box, Typography, Button, Stack, Tab, Tabs, Grid } from '@mui/material';
import { Add } from '@mui/icons-material';

import RuleCard from '@/components/Recurring/RecurRuleCard';

export default function DashboardPage() {
  return (
    <Box sx={{ bgcolor: '#020617', minHeight: '100vh', p: { xs: 2, md: 4 } }}>

      <Grid container spacing={2} sx={{ mb: 4, textAlign: 'center' }}>
        <Grid size={4}>
          <Typography variant="overline" sx={{ color: '#64748b' }}>MONTHLY FIXED COST</Typography>
          <Typography variant="h6">827,000</Typography>
        </Grid>
        <Grid size={4}>
          <Typography variant="overline" sx={{ color: '#64748b' }}>ACTIVE RULES</Typography>
          <Typography variant="h6">5</Typography>
        </Grid>
        <Grid size={4}>
          <Typography variant="overline" sx={{ color: '#64748b' }}>NEXT GENERATION</Typography>
          <Typography variant="h6">Aug 10</Typography>
        </Grid>
      </Grid>

      {/* 2. Controls */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // จอมือถือแนวตั้ง จอคอมแนวนอน
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2, // ใช้ gap แทน spacing
          mb: 3
        }}
      >
        <Tabs value={0} sx={{
          bgcolor: '#0f172a', borderRadius: 2, p: 0.5,
          '& .MuiTabs-indicator': { display: 'none' },
          '& .Mui-selected': { bgcolor: '#1e293b', borderRadius: 1.5, color: '#f8fafc !important' }
        }}>
          <Tab label="All Rules" sx={{ color: '#64748b', textTransform: 'none', minWidth: 80 }} />
          <Tab label="Payroll" sx={{ color: '#64748b', textTransform: 'none', minWidth: 80 }} />
          <Tab label="SaaS" sx={{ color: '#64748b', textTransform: 'none', minWidth: 80 }} />
        </Tabs>
        <Button variant="contained" startIcon={<Add />} sx={{ bgcolor: '#00dc82', color: '#020617', fontWeight: 'bold', '&:hover': { bgcolor: '#00bb6d' } }}>
          New Rule
        </Button>
      </Box>

      {/* 3. List of Cards */}
      <Box>
        <RuleCard
          title="Engineering Payroll"
          status="Active"
          amount="฿680,000"
          type="Internal"
          date="MONTHLY • Day 31 | Started: Jan 2024"
          color="#8b5cf6"
        />
        <RuleCard
          title="Office Rent"
          status="Missing"
          amount="฿85,000"
          type="Office"
          date="MONTHLY • Day 15 | Started: Mar 2023"
          color="#f43f5e"
        />
        <RuleCard
          title="AWS / GCP Infrastructure"
          status="Spike"
          amount="฿38,000"
          type="SaaS"
          date="MONTHLY • Day 1 | Avg: ฿35,400"
          color="#f59e0b"
        />
      </Box>
    </Box>
  );
}