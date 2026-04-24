'use client';
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { KpiCard } from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <KpiCard sTitle="ยอดคงเหลือ" nValue={150250.50} isPositive={true} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <KpiCard sTitle="รายรับเดือนนี้" nValue={45000} isPositive={true} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <KpiCard sTitle="รายจ่ายเดือนนี้" nValue={12500.75} isPositive={false} />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4, p: 4, bgcolor: 'background.paper', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>ยินดีต้อนรับสู่ระบบ CashFlow Forecaster</Typography>
        <Typography color="text.secondary">
          กำลังเตรียมข้อมูลกราฟและรายการธุรกรรมล่าสุด...
        </Typography>
      </Box>
    </Box>
  );
}
