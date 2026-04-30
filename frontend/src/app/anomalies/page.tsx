"use client";

import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { Add, Lightbulb, Settings } from '@mui/icons-material';

// Import Components ที่เราแยกไว้
import StatsCard from '@/components/anomalies/StatsCard';
import AlertCard from '@/components/anomalies/AlertCard';
import RuleSwitch from '@/components/anomalies/RuleSwitch';
import CheckIcon from '@mui/icons-material/Check';

export default function AnomaliesPage() {
  return (
    <Box sx={{ bgcolor: '#020617', minHeight: '100vh', p: { xs: 2, md: 4 } }}>
      
      {/* 1. Header และปุ่ม Add Rule */}
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 'bold' }}>
          Alerts
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          size="small"
          sx={{ bgcolor: '#1e293b', color: '#94a3b8', textTransform: 'none', fontSize: '11px', border: '1px solid #334155' }}
        >
          Add Rule
        </Button>
      </Box>

      {/* 2. Stats Cards */}
      <Grid container spacing={1} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard label="TOTAL ALERTS" value={3} description="This period" borderColor="#334155" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard label="HIGH SEVERITY" value={1} description="Requires action" borderColor="#f43f5e" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard label="MEDIUM SEVERITY" value={2} description="Review suggested" borderColor="#f59e0b" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ bgcolor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', p: 3, height: '100%' }}>
            <Typography variant="caption" sx={{ color: '#64748b' }}>DISMISSED (300)</Typography>
            <Typography variant="h3"  sx={{ color: '#64748b', mt: 1, fontWeight:"bold" }}>7</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>Historical</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 3. Alerts List */}
      <Box sx={{ mb: 5 }}>
        {/* Alert 1 */}
        <AlertCard 
          accentColor="#f43f5e"
          severity="HIGH"
          title="Missing Fixed Cost: Office Rent (August)"
          description="Recurring rule &quot;Office Rent&quot; กำหนดจ่ายวันที่ 15 ของทุกเดือน แต่ยังไม่มีรายการบันทึกในระบบสำหรับเดือนสิงหาคม ฿85,000 อาจส่งผลกระทบต่อ Cash Flow Projection"
          date="Aug 10, 2025"
          tags={[
            { label: "Missing Fixed Cost", icon: <Lightbulb fontSize="small" /> }
          ]}
          actions={[
            { label: "Record Now", variant: 'contained', icon:  <Add /> },
            { label: "Dismiss", variant: 'outlined' },
          ]}
        />
        
        {/* Alert 2 */}
        <AlertCard 
          accentColor="#f59e0b"
          severity="MEDIUM"
          title="Expense Spike: AWS Infrastructure 3.2x Average"
          description="รายจ่าย Cloud Infrastructure เดือนสิงหาคมอยู่ที่ ฿113,600 ซึ่งสูงกว่าค่าเฉลี่ย 6 เดือนย้อนหลัง (฿35,400) ถึง 3.2 เท่า แนะนำให้ตรวจสอบ cost breakdown และ resource usage"
          date="Aug 02, 2025"
          tags={[
            { label: "Expense Spike", icon: <Lightbulb fontSize="small" /> },
            { label: "SaaS Tag", icon: <Lightbulb fontSize="small" /> }
          ]}
          actions={[
            { label: "View TX", variant: 'outlined' },
            { label: "Mark Reviewed", variant: 'outlined', icon: <CheckIcon fontSize="small" /> },
          ]}
        />

        {/* Alert 3 */}
        <AlertCard 
          accentColor="#f59e0b"
          severity="MEDIUM"
          title="Low Balance Warning: Projected below ฿3M in 45 days"
          description="จากการคำนวณ Burn Rate ปัจจุบัน (฿41,500/วัน) และรายรับที่คาดการณ์ หากไม่มีรายได้เพิ่มภายใน 45 วัน ยอดเงินคงเหลืออาจต่ำกว่า Safety Buffer ที่กำหนด (฿3,000,000)"
          date="Aug 10, 2025"
          tags={[
            { label: "Low Balance Warning", icon: <Lightbulb fontSize="small" /> }
          ]}
          actions={[
            { label: "Run Scenario", variant: 'outlined' },
            { label: "Dismiss", variant: 'outlined' },
          ]}
        />
      </Box>

      {/* 4. Detection Rules Section */}
      <Paper elevation={0} sx={{ bgcolor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #1e293b' }}>
          <Typography variant="body1" sx={{ color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 'bold' }}>
            <Settings fontSize="small" />
            Detection Rules (Logic-based AI)
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            size="small"
            sx={{ bgcolor: '#1e293b', color: '#94a3b8', textTransform: 'none', fontSize: '11px', border: '1px solid #334155' }}
          >
            Add Rule
          </Button>
        </Box>

        <RuleSwitch 
          title="Expense Spike Detection" 
          description="แจ้งเตือนเมื่อมีรายจ่ายสูงกว่าค่าเฉลี่ย N เดือนย้อนหลัง x threshold" 
          checked={true}
        />
        <RuleSwitch 
          title="Missing Fixed Cost Alert" 
          description="ตรวจสอบ Recurring Rules ทุกวัน หากไม่พบรายการตรงกัน = แจ้งเตือน" 
          checked={true}
        />
        <RuleSwitch 
          title="Low Balance Warning" 
          description="จำลองเงินคงเหลือหน้า 30/60/90 วัน แจ้งเตือนหากต่ำกว่า Safety Buffer" 
          checked={true}
        />
        <RuleSwitch 
          title="Unusual Income Pattern" 
          description="แจ้งเตือนเมื่อรายรับหายไปนานกว่าปกติ (เช่น ไม่มี Invoice ใน 4 สัปดาห์)" 
          checked={false}
        />
      </Paper>
    </Box>
  );
}