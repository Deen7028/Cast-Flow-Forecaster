'use client';
import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, Box, Select, MenuItem, InputLabel, FormControl 
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { ITag, ITransactionForm } from '@/interfaces';

interface ITransactionFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
    objEditData: ITransactionForm | null; 
}

export const TransactionFormDialog = ({ isOpen, onClose, onSaved, objEditData }: ITransactionFormDialogProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [lstTags, setLstTags] = useState<ITag[]>([]); 

    const { control, handleSubmit, reset } = useForm<ITransactionForm>({
        defaultValues: {
            nId: 0,
            sDescription: '',
            nAmount: 0,
            sType: 'Expense',
            dDate: new Date().toISOString().split('T')[0],
            nTagId: null
        }
    });

    // ดึงข้อมูล Tags มาเตรียมไว้ใน Dropdown
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Tags`);
                const result = await res.json();
                if (result.status === 'success') {
                    setLstTags(result.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch tags', error);
            }
        };
        if (isOpen) fetchTags();
    }, [isOpen]);

    // จัดการข้อมูลเมื่อเปิด Form (โหมด Create / Edit)
    useEffect(() => {
        if (isOpen) {
            if (objEditData) {
                reset({
                    nId: objEditData.nId,
                    sDescription: objEditData.sDescription || '',
                    nAmount: objEditData.nAmount || 0,
                    sType: objEditData.sType || 'Expense',
                    dDate: objEditData.dDate ? objEditData.dDate.split('T')[0] : '',
                    nTagId: objEditData.nTagId || null
                });
            } else {
                reset({
                    nId: 0,
                    sDescription: '',
                    nAmount: 0,
                    sType: 'Expense',
                    dDate: new Date().toISOString().split('T')[0],
                    nTagId: null
                });
            }
        }
    }, [objEditData, isOpen, reset]);

    const handleSave = async (data: ITransactionForm) => {
        setIsLoading(true);
        try {
            const objResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Transactions`, {
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
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: 2, bgcolor: 'background.paper', backgroundImage: 'none' } } }}>
            <DialogTitle sx={{ fontFamily: 'Syne', fontWeight: 700 }}>
                {objEditData ? 'Edit Transaction' : 'New Transaction'}
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                    
                    <Controller
                        name="sDescription"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField 
                                {...field}
                                label="Description" 
                                variant="outlined" 
                                fullWidth 
                                placeholder="e.g. ค่าเช่าออฟฟิศ"
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
                                    label="Amount (THB)" 
                                    type="number"
                                    variant="outlined" 
                                    fullWidth 
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            )}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Controller
                                name="sType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Type"
                                    >
                                        <MenuItem value="Expense" sx={{ color: 'error.main' }}>Expense</MenuItem>
                                        <MenuItem value="Income" sx={{ color: 'primary.main' }}>Income</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Controller
                            name="dDate"
                            control={control}
                            render={({ field }) => (
                                <TextField 
                                    {...field}
                                    label="Date" 
                                    type="date"
                                    variant="outlined" 
                                    fullWidth 
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                            )}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Category / Tag</InputLabel>
                            <Controller
                                name="nTagId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        value={field.value || ''}
                                        label="Category / Tag"
                                        onChange={(e) => field.onChange(e.target.value)}
                                    >
                                        {lstTags.map((tag) => (
                                            <MenuItem key={tag.nId} value={tag.nId}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: tag.sColorCode }} />
                                                    {tag.sName}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Box>

                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderColor: 'divider' }}>
                <Button onClick={onClose} disabled={isLoading} sx={{ color: 'text.secondary' }}>Cancel</Button>
                <Button onClick={handleSubmit(handleSave)} variant="contained" color="primary" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Transaction'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};