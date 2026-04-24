'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Switch, Box, Grid } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { ITag } from '@/interfaces';

interface ITagFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void; 
    objEditData: ITag | null; 
}

export const TagFormDialog = ({ isOpen, onClose, onSaved, objEditData }: ITagFormDialogProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, reset } = useForm<ITag>({
        defaultValues: {
            nId: 0,
            sName: '',
            sColorCode: '#00e5a0',
            isActive: true
        }
    });

    // เมื่อเปิด Modal ให้เช็คว่ามีข้อมูลส่งมาให้แก้ไหม
    useEffect(() => {
        if (isOpen) {
            if (objEditData) {
                reset({
                    nId: objEditData.nId,
                    sName: objEditData.sName || '',
                    sColorCode: objEditData.sColorCode || '#00e5a0',
                    isActive: objEditData.isActive ?? true
                });
            } else {
                reset({
                    nId: 0,
                    sName: '',
                    sColorCode: '#00e5a0',
                    isActive: true
                });
            }
        }
    }, [objEditData, isOpen, reset]);

    const handleSave = async (data: ITag) => {
        setIsLoading(true);
        try {
            const objResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL as string }/Tags`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const objResult = await objResponse.json();
            if (objResult.status === 'success') {
                onSaved();
                onClose();
            } else {
                alert('Error: ' + objResult.message);
            }
        } catch (error) {
            console.error('Save failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{objEditData ? 'Edit Tag' : 'New Tag'}</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3} sx={{ pt: 1 }}>
                    <Grid size={12}>
                        <Controller
                            name="sName"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField 
                                    {...field}
                                    label="Tag Name" 
                                    variant="outlined" 
                                    fullWidth 
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Grid container spacing={2}>
                            <Grid size="grow">
                                <Controller
                                    name="sColorCode"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField 
                                            {...field}
                                            label="Color Code" 
                                            variant="outlined" 
                                            fullWidth 
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size="auto">
                                <Controller
                                    name="sColorCode"
                                    control={control}
                                    render={({ field }) => (
                                        <Box
                                            component="input"
                                            type="color"
                                            {...field}
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                p: 0.5,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                borderRadius: 1,
                                                cursor: 'pointer',
                                                bgcolor: 'background.paper'
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid size={12}>
                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel 
                                    control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} 
                                    label="Active Status" 
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
                <Button onClick={handleSubmit(handleSave)} variant="contained" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};