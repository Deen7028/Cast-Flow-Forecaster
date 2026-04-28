'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Box, Grid } from '@mui/material';
import { TagCard } from './TagCard';
import { TagFormDialog } from './TagFormDialog';
import { ITag, IApiResponse } from '@/interfaces';
import { LogoLoader } from '../common/LogoLoader';
import DownloadIcon from '@mui/icons-material/Download';
import { tagService } from '@/services/tag.service';
import { useNotification } from '@/hooks/useNotification';
import { exportToCSV } from '@/utils/exportCsv';

export const TagsContainer = () => {
    const [lstTags, setLstTags] = useState<ITag[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [objSelectedTag, setObjSelectedTag] = useState<ITag | null>(null);

    const { notify, NotificationComponent } = useNotification();

    const fetchTags = useCallback(async () => {
        setIsLoading(true);
        try {
            const objResult = await tagService.getAll() as IApiResponse<ITag[]>;
            if (objResult.status === 'success') {
                setLstTags(objResult.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch tags', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTags();
    }, [fetchTags]);

    //  ฟังก์ชันเปิดหน้าสร้างใหม่
    const handleAddNew = () => {
        setObjSelectedTag(null);
        setIsFormOpen(true);
    };

    //  ฟังก์ชันเปิดหน้าแก้ไข
    const handleEdit = (objTag: ITag) => {
        setObjSelectedTag(objTag);
        setIsFormOpen(true);
    };

    const handleDownloadCSV = () => {
        if (lstTags.length === 0) return;

        const headers = ['ID', 'Name', 'Color', 'Is Active', 'Total Income', 'Total Expense', 'Net', 'Transaction Count'];
        
        const rows = lstTags.map(objTag => [
            objTag.nTagsId,
            objTag.sName,
            objTag.sColorCode,
            objTag.isActive ? 'Active' : 'Hidden',
            objTag.nTotalIncome,
            objTag.nTotalExpense,
            objTag.nNet,
            objTag.nTransactionCount
        ]);

        exportToCSV(`Tags_Export_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    จัดการ Tags และ Projects
                </Typography>
                <Grid container spacing={2} sx={{ width: 'auto' }}>
                    <Grid>
                        <Button 
                            size='small'
                            variant="outlined" 
                            color="inherit" 
                            startIcon={<DownloadIcon />}    
                            onClick={handleDownloadCSV}
                            disabled={lstTags.length === 0}
                        >
                            Download CSV
                        </Button>
                    </Grid>
                    <Grid>
                        <Button size='small' variant="contained" color="primary" onClick={handleAddNew}>
                            ＋ New Tag
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <LogoLoader />
                </Box>
            ) : (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(3, 1fr)'
                    },
                    gap: 2
                }}>
                    {lstTags.map((objTag) => (
                        <TagCard key={objTag.nTagsId} objTag={objTag} onEdit={() => handleEdit(objTag)} />
                    ))}
                </Box>
            )}

            <TagFormDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSaved={() => {
                    notify(objSelectedTag ? 'อัปเดต Tag สำเร็จ' : 'เพิ่ม Tag สำเร็จ');
                    fetchTags();
                }}
                objEditData={objSelectedTag}
            />

            <NotificationComponent />
        </Box>
    );
};
