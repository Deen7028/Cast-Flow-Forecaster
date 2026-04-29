'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Box, Paper, Chip } from '@mui/material';
import { ICategory, IApiResponse } from '@/interfaces';
import { LogoLoader } from '../common/LogoLoader';
import { transactionService } from '@/services/transaction.service';
import { CategoryFormDialog } from './CategoryFormDialog';

export const CategoriesContainer = () => {
    const [lstCategories, setLstCategories] = useState<ICategory[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [objSelectedCategory, setObjSelectedCategory] = useState<ICategory | null>(null);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const objResult = await transactionService.getCategories() as IApiResponse<ICategory[]>;
            if (objResult.status === 'success') {
                setLstCategories(objResult.data || []);
            }
        } catch (error: unknown) {
            console.error('Failed to fetch categories', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCategories();
    }, [fetchCategories]);

    const handleAddNew = () => {
        setObjSelectedCategory(null);
        setIsFormOpen(true);
    };

    const handleEdit = (objCat: ICategory) => {
        setObjSelectedCategory(objCat);
        setIsFormOpen(true);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    จัดการหมวดหมู่รายรับ-รายจ่าย
                </Typography>
                <Button size='small' variant="contained" color="primary" onClick={handleAddNew}>
                    ＋ New Category
                </Button>
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
                        lg: 'repeat(4, 1fr)'
                    },
                    gap: 2
                }}>
                    {lstCategories.map((objCat) => (
                        <Paper key={objCat.nCategoriesId} sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                            transition: 'all 0.2s',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 }
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontFamily: 'Syne' }}>
                                    {objCat.sName}
                                </Typography>
                                <Chip 
                                    label={objCat.sType} 
                                    color={objCat.sType === 'Income' ? 'primary' : 'error'} 
                                    size="small" 
                                    sx={{ height: 20, fontSize: 10 }}
                                />
                            </Box>
                            <Button 
                                variant="outlined" 
                                size="small" 
                                fullWidth 
                                onClick={() => handleEdit(objCat)}
                                sx={{ borderColor: 'divider', color: 'text.secondary' }}
                            >
                                Edit
                            </Button>
                        </Paper>
                    ))}
                </Box>
            )}

            <CategoryFormDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSaved={fetchCategories}
                objEditData={objSelectedCategory}
            />
        </Box>
    );
};
