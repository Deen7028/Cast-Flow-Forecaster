'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Switch, Box } from '@mui/material';
import { ITag } from '@/interfaces';

interface ITagFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void; // เอาไว้สั่งให้หน้ารายการดึงข้อมูลใหม่
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

            const objResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Tags`, {
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                    <TextField 
                        label="Tag Name" 
                        variant="outlined" 
                        fullWidth 
                        value={sName}
                        onChange={(e) => setSName(e.target.value)}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField 
                            label="Color Code" 
                            variant="outlined" 
                            fullWidth 
                            value={sColorCode}
                            onChange={(e) => setSColorCode(e.target.value)}
                            sx={{ flex: 1 }}
                        />
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
                    </Box>
                    <FormControlLabel 
                        control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />} 
                        label="Active Status" 
                    />
                </Box>
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