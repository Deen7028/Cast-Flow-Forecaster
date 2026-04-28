"use client";

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Grid,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { Category } from '@/interfaces/Icategory';
import { RecurringRule, IRecurRuleForm } from '@/interfaces/Irecurring';
import dayjs from 'dayjs';



interface RecurRuleFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: RecurringRule | null;
}

const RecurRuleForm = ({ open, onClose, onSave, initialData }: RecurRuleFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset, watch } = useForm<IRecurRuleForm>({
    defaultValues: {
      nRecurringRulesId: 0,
      sName: '',
      nAmount: 0,
      sFrequency: 'Monthly',
      nDayOfMonth: 1,
      dStartDate: dayjs().format('YYYY-MM-DD'),
      dEndDate: '',
      nCategoryId: '',
      nSpikeThreshold: 1.5,
      isActive: true,
    }
  });

  const sFrequency = watch('sFrequency');

  useEffect(() => {
    fetchCategories();
  }, []);

  const normalizeFrequency = (freq: string) => {
    if (!freq) return 'Monthly';
    const f = freq.toLowerCase();
    if (f === 'daily') return 'Daily';
    if (f === 'weekly') return 'Weekly';
    if (f === 'monthly') return 'Monthly';
    if (f === 'yearly') return 'Yearly';
    return 'Monthly';
  };

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          nRecurringRulesId: initialData.nRecurringRulesId,
          sName: initialData.sName || '',
          nAmount: initialData.nAmount || 0,
          sFrequency: normalizeFrequency(initialData.sFrequency),
          nDayOfMonth: initialData.nDayOfMonth || 1,
          dStartDate: dayjs(initialData.dStartDate).format('YYYY-MM-DD'),
          dEndDate: initialData.dEndDate ? dayjs(initialData.dEndDate).format('YYYY-MM-DD') : '',
          nCategoryId: initialData.nCategoryId != null ? initialData.nCategoryId.toString() : '',
          nSpikeThreshold: initialData.nSpikeThreshold || 1.5,
          isActive: initialData.isActive ?? true,
        });
      } else {
        reset({
          nRecurringRulesId: 0,
          sName: '',
          nAmount: 0,
          sFrequency: 'Monthly',
          nDayOfMonth: 1,
          dStartDate: dayjs().format('YYYY-MM-DD'),
          dEndDate: '',
          nCategoryId: '',
          nSpikeThreshold: 1.5,
          isActive: true,
        });
      }
    }
  }, [initialData, open, reset]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5221/api'}/Categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFormSubmit = async (data: IRecurRuleForm) => {
    setIsLoading(true);
    try {
      // Ensure numeric fields are valid numbers before sending
      const payload = {
        ...data,
        nAmount: Number(data.nAmount) || 0,
        nDayOfMonth: Number(data.nDayOfMonth) || 1,
        nSpikeThreshold: Number(data.nSpikeThreshold) || 1.5,
        nCategoryId: Number(data.nCategoryId),
        dEndDate: data.dEndDate || null,
      };
      await onSave(payload);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            color: 'text.primary',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 3,
        fontFamily: 'Syne, sans-serif',
        fontWeight: 700,
        fontSize: '1.25rem'
      }}>
        {initialData ? 'Edit Recurring Rule' : 'Create New Recurring Rule'}
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <Controller
            name="sName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Rule Name"
                variant="outlined"
                placeholder="e.g. Office Rent, SaaS Subscription"
                sx={{
                  input: { color: 'text.primary' },
                  label: { color: 'text.secondary' },
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.default',
                    '& fieldset': { borderColor: 'divider' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                  }
                }}
              />
            )}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="nAmount"
              control={control}
              rules={{ required: true, min: 0 }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Amount (THB)"
                  type="number"
                  variant="outlined"
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === '' ? '' : Number(val));
                  }}
                  sx={{
                    input: { color: 'text.primary' },
                    label: { color: 'text.secondary' },
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.default',
                      '& fieldset': { borderColor: 'divider' },
                    }
                  }}
                />
              )}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ color: 'text.secondary' }}>Category</InputLabel>
              <Controller
                name="nCategoryId"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Category"
                    sx={{
                      color: 'text.primary',
                      bgcolor: 'background.default',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                    }}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.nCategoriesId} value={cat.nCategoriesId.toString()}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <span>{cat.sName}</span>
                          <Typography variant="caption" sx={{ color: cat.sType?.toLowerCase() === 'income' ? '#10b981' : '#ef4444', ml: 2 }}>
                            {cat.sType}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'text.secondary' }}>Frequency</InputLabel>
              <Controller
                name="sFrequency"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Frequency"
                    sx={{
                      color: 'text.primary',
                      bgcolor: 'background.default',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                    }}
                  >
                    <MenuItem value="Daily">Daily</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="Yearly">Yearly</MenuItem>
                  </Select>
                )}
              />
            </FormControl>

            <Controller
              name="nDayOfMonth"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Day of Month"
                  type="number"
                  variant="outlined"
                  disabled={sFrequency !== 'Monthly'}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === '' ? '' : Number(val));
                  }}
                  sx={{
                    input: { color: 'text.primary' },
                    label: { color: 'text.secondary' },
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.default',
                      '& fieldset': { borderColor: 'divider' },
                    },
                    '& .Mui-disabled': {
                      bgcolor: 'action.disabledBackground',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' }
                    }
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="dStartDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Start Date"
                  type="date"
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    input: { color: 'text.primary' },
                    label: { color: 'text.secondary' },
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.default',
                      '& fieldset': { borderColor: 'divider' },
                    }
                  }}
                />
              )}
            />

            <Controller
              name="dEndDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="End Date (Optional)"
                  type="date"
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    input: { color: 'text.primary' },
                    label: { color: 'text.secondary' },
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.default',
                      '& fieldset': { borderColor: 'divider' },
                    }
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="nSpikeThreshold"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Spike Threshold"
                  type="number"
                  variant="outlined"
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === '' ? '' : Number(val));
                  }}
                  sx={{
                    input: { color: 'text.primary' },
                    label: { color: 'text.secondary' },
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.default',
                      '& fieldset': { borderColor: 'divider' },
                    }
                  }}
                />
              )}
            />
          </Box>


        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={isLoading}
          sx={{
            bgcolor: 'primary.main',
            color: 'background.default',
            fontWeight: 'bold',
            textTransform: 'none',
            px: 4,
            borderRadius: 2,
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          {isLoading ? 'Saving...' : (initialData ? 'Update Rule' : 'Create Rule')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecurRuleForm;
