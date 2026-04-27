'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Box, Grid } from '@mui/material';
import { TagCard } from './TagCard';
import { TagFormDialog } from './TagFormDialog';
import { ITag } from '@/interfaces';
import { LogoLoader } from '../common/LogoLoader';
import DownloadIcon from '@mui/icons-material/Download';

export const TagsContainer = () => {
    const [lstTags, setLstTags] = useState<ITag[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [objSelectedTag, setObjSelectedTag] = useState<ITag | null>(null);

    const fetchTags = useCallback(async () => {
        setIsLoading(true);
        try {
            const objResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Tags`);
            if (!objResponse.ok) throw new Error('Fetch failed');
            const objResult = await objResponse.json();
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

    // ฟังก์ชันดาวน์โหลด CSV
    const handleDownloadCSV = () => {
        if (lstTags.length === 0) return;

        // กำหนด Header ของ CSV
        const arrHeaders = ['ID', 'Name', 'Color', 'Is Active', 'Total Income', 'Total Expense', 'Net', 'Transaction Count'];
        
        // แปลงข้อมูลเป็นแถวของ CSV
        const arrRows = lstTags.map(objTag => [
            objTag.nTagsId,
            `"${objTag.sName}"`, // ใส่ "" เพื่อกัน comma ในชื่อ
            objTag.sColorCode,
            objTag.isActive ? 'Active' : 'Hidden',
            objTag.nTotalIncome,
            objTag.nTotalExpense,
            objTag.nNet,
            objTag.nTransactionCount
        ]);

        // รวม Header และ Rows
        const sCsvContent = [
            arrHeaders.join(','),
            ...arrRows.map(row => row.join(','))
        ].join('\n');

        // สร้าง Blob และดาวน์โหลด
        const blob = new Blob(['\ufeff' + sCsvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Tags_Export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

            {/*  เรียกใช้ Component Form Dialog */}
            <TagFormDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSaved={fetchTags}
                objEditData={objSelectedTag}
            />
        </Box>
    );
};
