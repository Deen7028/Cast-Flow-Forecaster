"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Typography, Box, Slider, InputAdornment 
} from '@mui/material';
import { DetectionRule } from '@/services/anomaly.service';

interface RuleSettingsModalProps {
  open: boolean;
  onClose: () => void;
  rule: DetectionRule | null;
  onSave: (id: string, parameters: { threshold?: number, fixedCostAlertDay?: number }) => Promise<void>;
}

const RuleSettingsModal = ({ open, onClose, rule, onSave }: RuleSettingsModalProps) => {
  const [threshold, setThreshold] = useState<number>(2.5);
  const [alertDay, setAlertDay] = useState<number>(10);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (rule) {
      if (rule.threshold !== undefined) setThreshold(rule.threshold);
      if (rule.fixedCostAlertDay !== undefined) setAlertDay(rule.fixedCostAlertDay);
    }
  }, [rule, open]);

  const handleSave = async () => {
    if (!rule) return;
    setIsSaving(true);
    try {
      await onSave(rule.id, { 
        threshold: rule.id === 'rule_spike' ? threshold : undefined,
        fixedCostAlertDay: rule.id === 'rule_fixed' ? alertDay : undefined
      });
      onClose();
    } catch (error) {
      console.error("Failed to save rule settings", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!rule) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { bgcolor: '#0f172a', color: '#f8fafc', backgroundImage: 'none', border: '1px solid #1e293b', borderRadius: '12px', minWidth: '400px' }
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #1e293b', fontWeight: 'bold' }}>
        Settings: {rule.title}
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
          {rule.description}
        </Typography>

        {rule.id === 'rule_spike' && (
          <Box sx={{ px: 1 }}>
            <Typography variant="subtitle2" sx={{ color: '#f8fafc', mb: 2 }}>
              Sensitivity Threshold (เท่าของค่าเฉลี่ย)
            </Typography>
            <Slider
              value={threshold}
              min={1.1}
              max={10.0}
              step={0.1}
              onChange={(_, val) => setThreshold(val as number)}
              valueLabelDisplay="auto"
              sx={{ color: '#00dc82', mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Low (1.1x)</Typography>
              <Typography variant="h6" sx={{ color: '#00dc82', fontWeight: 'bold' }}>{threshold.toFixed(1)}x</Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>High (10x)</Typography>
            </Box>
            
            <TextField
              fullWidth
              label="Manual Value"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              size="small"
              slotProps={{
                input: {
                    endAdornment: <InputAdornment position="end">x</InputAdornment>,
                    sx: { color: '#f8fafc', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1e293b' } }
                }
              }}
              sx={{ 
                '& .MuiInputLabel-root': { color: '#64748b' },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }
              }}
            />
          </Box>
        )}

        {rule.id === 'rule_fixed' && (
          <Box sx={{ px: 1 }}>
            <Typography variant="subtitle2" sx={{ color: '#f8fafc', mb: 2 }}>
              ระยะเวลาผ่อนผัน (แจ้งเตือนหลังจากวันครบกำหนดกี่วัน)
            </Typography>
            <Slider
              value={alertDay}
              min={0}
              max={15}
              step={1}
              onChange={(_, val) => setAlertDay(val as number)}
              valueLabelDisplay="auto"
              sx={{ color: '#00dc82', mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>ทันที (0 วัน)</Typography>
              <Typography variant="h6" sx={{ color: '#00dc82', fontWeight: 'bold' }}>{alertDay} วัน</Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>15 วัน</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: -1 }}>
              * ระบบจะเริ่มแจ้งเตือนหากไม่พบรายการบันทึกหลังจากวันครบกำหนดไปแล้วตามจำนวนวันที่ระบุ
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #1e293b' }}>
        <Button onClick={onClose} sx={{ color: '#94a3b8', textTransform: 'none' }}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={isSaving}
          sx={{ bgcolor: '#00dc82', color: '#020617', textTransform: 'none', px: 4, '&:hover': { bgcolor: '#00bb6d' } }}
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RuleSettingsModal;
