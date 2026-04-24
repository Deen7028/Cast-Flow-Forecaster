'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Switch, Box, Grid } from '@mui/material';
import { ITag } from '@/interfaces';

interface ITagFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void; 
    objEditData: ITag | null; // ถ้าเป็น null คือสร้างใหม่, ถ้ามีข้อมูลคือโหมด Edit
}

export const TagFormDialog = ({ isOpen, onClose, onSaved, objEditData }: ITagFormDialogProps) => {
    const [sName, setSName] = useState('');
    const [sColorCode, setSColorCode] = useState('#00e5a0');
    const [isActive, setIsActive] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // เมื่อเปิด Modal ให้เช็คว่ามีข้อมูลส่งมาให้แก้ไหม
    useEffect(() => {
        if (objEditData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSName(objEditData.sName || '');
            setSColorCode(objEditData.sColorCode || '#00e5a0');
            setIsActive(objEditData.isActive ?? true);
        } else {
            setSName('');
            setSColorCode('#00e5a0');
            setIsActive(true);
        }
    }, [objEditData, isOpen]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const objPayload = {
                nId: objEditData ? objEditData.nId : 0,
                sName: sName,
                sColorCode: sColorCode,
                isActive: isActive
            };

            const objResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL as string }/Tags`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(objPayload)
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
                        <TextField 
                            label="Tag Name" 
                            variant="outlined" 
                            fullWidth 
                            value={sName}
                            onChange={(e) => setSName(e.target.value)}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Grid container spacing={2}>
                            <Grid size="grow">
                                <TextField 
                                    label="Color Code" 
                                    variant="outlined" 
                                    fullWidth 
                                    value={sColorCode}
                                    onChange={(e) => setSColorCode(e.target.value)}
                                />
                            </Grid>
                            <Grid size="auto">
                                <Box
                                    component="input"
                                    type="color"
                                    value={sColorCode}
                                    onChange={(e) => setSColorCode(e.target.value)}
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
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid size={12}>
                        <FormControlLabel 
                            control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />} 
                            label="Active Status" 
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" disabled={isLoading || !sName}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};