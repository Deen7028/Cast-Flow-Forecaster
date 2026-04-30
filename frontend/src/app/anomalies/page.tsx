"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Grid, CircularProgress, Alert as MuiAlert, Snackbar } from '@mui/material';
import { Add, Lightbulb, Settings, History } from '@mui/icons-material';

// Import Components ที่เราแยกไว้
import StatsCard from '@/components/anomalies/StatsCard';
import AlertCard from '@/components/anomalies/AlertCard';
import RuleSwitch from '@/components/anomalies/RuleSwitch';
import RuleSettingsModal from '@/components/anomalies/RuleSettingsModal';
import CheckIcon from '@mui/icons-material/Check';

import { anomalyService, AnomalyAlert, DetectionRule } from '@/services/anomaly.service';

import { useRouter } from 'next/navigation';

export default function AnomaliesPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
  const [rules, setRules] = useState<DetectionRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<DetectionRule | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const [fetchedAlerts, fetchedRules] = await Promise.all([
        anomalyService.getAlerts(),
        anomalyService.getRules()
      ]);
      setAlerts(fetchedAlerts);
      setRules(fetchedRules);
      window.dispatchEvent(new CustomEvent('refreshAnomalyCount'));
    } catch (error: any) {
      console.error("Failed to fetch anomalies", error);
      setErrorMsg(error.message || "Failed to load anomalies data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchData();
      // Auto-run detection in background on load
      handleRunDetection();
    };
    init();
  }, []);

  const handleToggleRule = async (id: string, newStatus: boolean) => {
    try {
      await anomalyService.toggleRule(id, newStatus);
      setSuccessMsg("Rule updated successfully");
    } catch (error) {
      console.error("Failed to toggle rule", error);
      throw error; // ให้ RuleSwitch จับ Error เพื่อ Rollback Switch
    }
  };

  const handleMarkAsReviewed = async (id: string) => {
    try {
      await anomalyService.markAsReviewed(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
      window.dispatchEvent(new CustomEvent('refreshAnomalyCount'));
      setSuccessMsg("Alert marked as reviewed");
    } catch (error) {
      console.error("Failed to mark as reviewed", error);
      setErrorMsg("Failed to update alert status.");
    }
  };

  const handleViewTransaction = (txId: number) => {
    router.push(`/transactions?highlight=${txId}`);
  };

  const handleEditRule = (rule: DetectionRule) => {
    setSelectedRule(rule);
    setIsSettingsOpen(true);
  };

  const handleSaveRuleParameters = async (id: string, params: { threshold?: number }) => {
    try {
      await anomalyService.updateRuleParameters(id, params);
      setSuccessMsg("Rule settings updated successfully");
      await fetchData(); // Refresh data to get new descriptions
    } catch (error) {
      console.error("Failed to save rule parameters", error);
      setErrorMsg("Failed to save rule settings.");
    }
  };

  const handleRunDetection = async () => {
    try {
      setIsDetecting(true);
      await anomalyService.triggerDetection();
      await fetchData();
      setSuccessMsg("Detection completed. New anomalies identified if any.");
    } catch (error) {
      console.error("Failed to run detection", error);
      setErrorMsg("Failed to run detection process.");
    } finally {
      setIsDetecting(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#020617' }}>
        <CircularProgress sx={{ color: '#00dc82' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#020617', minHeight: '100vh', p: { xs: 2, md: 4 } }}>
      
      {/* 1. Header และปุ่ม Add Rule */}
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 'bold' }}>
          Alerts
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            size="small"
            sx={{ bgcolor: '#1e293b', color: '#94a3b8', textTransform: 'none', fontSize: '11px', border: '1px solid #334155', '&:hover': { bgcolor: '#334155' } }}
          >
            Add Rule
          </Button>
          <Button 
            variant="outlined" 
            startIcon={isDetecting ? <CircularProgress size={16} sx={{ color: '#94a3b8' }} /> : <History />} 
            size="small"
            onClick={handleRunDetection}
            disabled={isDetecting}
            sx={{ borderColor: '#334155', color: '#94a3b8', textTransform: 'none', fontSize: '11px', '&:hover': { borderColor: '#475569' } }}
          >
            {isDetecting ? "Detecting..." : "Scan Now"}
          </Button>
        </Box>
      </Box>

      {/* 2. Stats Cards */}
      <Grid container spacing={1} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard label="TOTAL ALERTS" value={alerts.length} description="This period" borderColor="#334155" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard label="HIGH SEVERITY" value={alerts.filter(a => a.severity === 'HIGH').length} description="Requires action" borderColor="#f43f5e" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard label="MEDIUM SEVERITY" value={alerts.filter(a => a.severity === 'MEDIUM').length} description="Review suggested" borderColor="#f59e0b" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ bgcolor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', p: 3, height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Typography variant="caption" sx={{ color: '#64748b' }}>SYSTEM STATUS</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
               <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: isDetecting ? '#f59e0b' : '#00dc82', boxShadow: isDetecting ? '0 0 10px #f59e0b' : '0 0 10px #00dc82' }} />
               <Typography variant="h5"  sx={{ color: isDetecting ? '#f59e0b' : '#00dc82', fontWeight:"bold" }}>{isDetecting ? "Analyzing..." : "Live"}</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#64748b' }}>{isDetecting ? "Processing data..." : "Monitoring Cash Flow"}</Typography>
            {isDetecting && <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', bgcolor: '#f59e0b', animation: 'scan 2s infinite linear' }} />}
          </Paper>
        </Grid>
      </Grid>
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* 3. Alerts List */}
      <Box sx={{ mb: 5 }}>
        {alerts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#0f172a', borderRadius: '12px', border: '1px dashed #1e293b' }}>
            <CheckIcon sx={{ fontSize: 48, color: '#1e293b', mb: 2 }} />
            <Typography sx={{ color: '#94a3b8' }}>No anomalies detected recently.</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>Everything looks normal in your cash flow.</Typography>
          </Box>
        ) : (
          alerts.map((alert) => (
            <AlertCard 
              key={alert.id}
              accentColor={alert.severity === 'HIGH' ? '#f43f5e' : (alert.severity === 'MEDIUM' ? '#f59e0b' : '#3b82f6')}
              severity={alert.severity}
              title={alert.title}
              description={alert.description}
              date={alert.date}
              tags={alert.tags.map(t => ({ label: t.label, icon: <Lightbulb fontSize="small" /> }))}
              actions={[
                { 
                  label: alert.severity === 'HIGH' ? "Record Now" : "View TX", 
                  variant: alert.severity === 'HIGH' ? 'contained' : 'outlined', 
                  icon: alert.severity === 'HIGH' ? <Add /> : undefined,
                  onClick: alert.transactionId ? () => handleViewTransaction(alert.transactionId!) : undefined
                },
                { 
                  label: alert.severity === 'HIGH' ? "Dismiss" : "Mark Reviewed", 
                  variant: 'outlined', 
                  icon: <CheckIcon fontSize="small" />,
                  onClick: () => handleMarkAsReviewed(alert.id)
                },
              ]}
            />
          ))
        )}
      </Box>

      {/* 4. Detection Rules Section */}
      <Paper elevation={0} sx={{ bgcolor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #1e293b' }}>
          <Typography variant="body1" sx={{ color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 'bold' }}>
            <Settings fontSize="small" />
            Detection Rules (Logic-based AI)
          </Typography>
        </Box>

        {rules.map((rule) => (
          <RuleSwitch 
            key={rule.id}
            title={rule.title} 
            description={rule.description} 
            checked={rule.isActive}
            onChange={(newVal) => handleToggleRule(rule.id, newVal)}
            onEdit={() => handleEditRule(rule)}
          />
        ))}
      </Paper>

      {/* 5. Modals */}
      <RuleSettingsModal 
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        rule={selectedRule}
        onSave={handleSaveRuleParameters}
      />
      
      <Snackbar 
        open={!!errorMsg} 
        autoHideDuration={6000} 
        onClose={() => setErrorMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setErrorMsg(null)} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </MuiAlert>
      </Snackbar>

      <Snackbar 
        open={!!successMsg} 
        autoHideDuration={4000} 
        onClose={() => setSuccessMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setSuccessMsg(null)} severity="success" sx={{ width: '100%', bgcolor: '#00dc82', color: '#020617' }}>
          {successMsg}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}