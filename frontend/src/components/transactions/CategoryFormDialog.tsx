'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, InputLabel, FormControl, Box, Typography,Grid } from '@mui/material';
import { useNotification } from '@/hooks/useNotification';
import { useForm, Controller } from 'react-hook-form';
import { ICategory, IApiResponse } from '@/interfaces';
import { transactionService } from '@/services/transaction.service';

interface ICategoryFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
    objEditData?: ICategory | null;
}

export const CategoryFormDialog = ({ isOpen, onClose, onSaved, objEditData }: ICategoryFormDialogProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { notify, NotificationComponent } = useNotification();
    const { control, handleSubmit, reset } = useForm<ICategory>({
        defaultValues: {
            nCategoriesId: 0,
            sName: '',
            sType: ''
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (objEditData) {
                reset(objEditData);
            } else {
                reset({
                    nCategoriesId: 0,
                    sName: '',
                    sType: ''
                });
            }
        }
    }, [objEditData, isOpen, reset]);

    const handleSave = async (data: ICategory) => {
        setIsLoading(true);
        try {
            const objResult = await transactionService.saveCategory(data) as IApiResponse;
            if (objResult.status === 'success') {
                onSaved();
                onClose();
            }
        } catch (objError: unknown) {
            console.error('Save category failed', objError);
            const sErrorMessage = objError instanceof Error ? objError.message : 'บันทึกข้อมูลไม่สำเร็จ';
            notify(sErrorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>{objEditData ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <form onSubmit={handleSubmit(handleSave)}>
                <DialogContent>
                    <Grid container spacing={2.5} sx={{ mt: 1 }}>
                        <Grid size={12}>
                            <Controller
                                name="sName"
                                control={control}
                                rules={{ required: 'กรุณากรอกชื่อหมวดหมู่' }}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label={
                                            <span>
                                                Category Name <span style={{ color: '#ff4d6d' }}>*</span>
                                            </span>
                                        }
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={12}>
                            <FormControl fullWidth error={false}>
                                <InputLabel>
                                    Type <span style={{ color: '#ff4d6d' }}>*</span>
                                </InputLabel>
                                <Controller
                                    name="sType"
                                    control={control}
                                    rules={{ required: 'กรุณาเลือกประเภท' }}
                                    render={({ field, fieldState }) => (
                                        <Box>
                                            <Select
                                                {...field}
                                                label={
                                                    <span>
                                                        Type <span style={{ color: '#ff4d6d' }}>*</span>
                                                    </span>
                                                }
                                                fullWidth
                                                error={!!fieldState.error}
                                            >
                                                <MenuItem value="EXPENSE">Expense</MenuItem>
                                                <MenuItem value="INCOME">Income</MenuItem>
                                            </Select>
                                            {fieldState.error && (
                                                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5, display: 'block' }}>
                                                    {fieldState.error.message}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} color="inherit">Cancel</Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={isLoading}
                        sx={{ borderRadius: '8px', px: 3 }}
                    >
                        {isLoading ? 'Saving...' : 'Save Category'}
                    </Button>
                </DialogActions>
            </form>
            <NotificationComponent />
        </Dialog>
    );
};
