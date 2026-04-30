'use client';
import React, { useState, useEffect, useMemo } from 'react';

import SyncIcon from '@mui/icons-material/Sync';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Box, Select, MenuItem, InputLabel, FormControl, Typography
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import { useForm, Controller, useWatch } from 'react-hook-form';
import { ITag, ITransaction, ITransactionForm, ICategory, IApiResponse, IRecurringRule } from '@/interfaces';
import { TransactionStatus } from '@/enum';
import { transactionService } from '@/services/transaction.service';
import { tagService } from '@/services/tag.service';
import { CategoryFormDialog } from './CategoryFormDialog';
import { TagFormDialog } from '../tags/TagFormDialog';
import { Divider, InputAdornment } from '@mui/material';
import { useNotification } from '@/hooks/useNotification';

interface ITransactionFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
    objEditData: ITransaction | null;
}

export const TransactionFormDialog = ({ isOpen, onClose, onSaved, objEditData }: ITransactionFormDialogProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [lstTags, setLstTags] = useState<ITag[]>([]);
    const [lstCategories, setLstCategories] = useState<ICategory[]>([]);
    const [lstRecurringRules, setLstRecurringRules] = useState<IRecurringRule[]>([]);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

    const { notify, NotificationComponent } = useNotification();
    const { control, handleSubmit, reset, setValue } = useForm<ITransactionForm>({
        defaultValues: {
            nTransactionsId: 0,
            sDescription: '',
            nAmount: null,
            sType: '',
            dDate: '',
            nTagId: null as unknown as number,
            nCategoryId: null as unknown as number,
            sStatus: '',
            nRecurringRuleId: null as unknown as number
        }
    });

    const sType = useWatch({
        control,
        name: 'sType'
    });

    // ดึงข้อมูล Tags และ Categories มาเตรียมไว้ใน Dropdown
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [objResTags, objResCats, objResRecur] = await Promise.all([
                    tagService.getAll() as Promise<IApiResponse<ITag[]>>,
                    transactionService.getCategories() as Promise<IApiResponse<ICategory[]>>,
                    transactionService.getRecurringRules() as Promise<IApiResponse<IRecurringRule[]>>
                ]);

                if (objResTags.status === 'success') {
                    setLstTags(objResTags.data || []);
                }
                if (objResCats.status === 'success') {
                    setLstCategories(objResCats.data || []);
                }
                if (objResRecur.status === 'success') {
                    setLstRecurringRules(objResRecur.data || []);
                }
            } catch (objError) {
                console.error('Failed to fetch master data', objError);
            }
        };
        if (isOpen) fetchData();
    }, [isOpen]);

    // Get unique categories by name and type
    const lstUniqueCategories = useMemo(() => {
        const lstUnique: ICategory[] = [];
        const setKeys = new Set<string>();

        // Filter active or selected categories first (Support 0/1, "0"/"1", and true/false)
        const lstFiltered = lstCategories.filter(c => c.isActive !== false || c.nCategoriesId === objEditData?.nCategoryId);

        lstFiltered.forEach(c => {
            if (c.sName) {
                const sKey = `${c.sName.trim().toLowerCase()}_${(c.sType || '').trim().toLowerCase()}`;
                if (!setKeys.has(sKey)) {
                    setKeys.add(sKey);
                    lstUnique.push(c);
                }
            }
        });
        return lstUnique;
    }, [lstCategories, objEditData]);

    // Get unique tags by name
    const lstUniqueTags = useMemo(() => {
        const lstUnique: ITag[] = [];
        const setNames = new Set<string>();

        // Filter active or selected tags first (Support 0/1, "0"/"1", and true/false)
        const lstFiltered = lstTags.filter(t =>
            (Number(t.isActive) === 1 || t.isActive === true) ||
            t.nTagsId === objEditData?.nTagsId
        );

        lstFiltered.forEach(t => {
            if (t.sName && !setNames.has(t.sName.trim().toLowerCase())) {
                setNames.add(t.sName.trim().toLowerCase());
                lstUnique.push(t);
            }
        });
        return lstUnique;
    }, [lstTags, objEditData]);

    // จัดการข้อมูลเมื่อเปิด Form (โหมด Create / Edit)
    useEffect(() => {
        if (isOpen) {
            if (objEditData) {
                reset({
                    nTransactionsId: objEditData.nTransactionsId,
                    sDescription: objEditData.sDescription || '',
                    nAmount: objEditData.nAmount || 0,
                    sType: objEditData.sType?.toUpperCase() || '',
                    dDate: objEditData.dDate ? objEditData.dDate.split('T')[0] : '',
                    nTagId: objEditData.nTagsId || null as unknown as number,
                    nCategoryId: objEditData.nCategoryId || null as unknown as number,
                    sStatus: objEditData.sStatus || '',
                    nRecurringRuleId: objEditData.nRecurringRuleId || null as unknown as number
                });
            } else {
                reset({
                    nTransactionsId: 0,
                    sDescription: '',
                    nAmount: null,
                    sType: '',
                    dDate: '',
                    nTagId: null as unknown as number,
                    nCategoryId: null as unknown as number,
                    sStatus: '',
                    nRecurringRuleId: null as unknown as number
                });
            }
        }
    }, [objEditData, isOpen, reset]);

    const handleSave = async (data: ITransactionForm) => {
        setIsLoading(true);
        try {
            const objResult = await transactionService.save(data) as IApiResponse;

            if (objResult.status === 'success') {
                onSaved();
                onClose();
            } else {
                notify(objResult.message || 'บันทึกไม่สำเร็จ', 'error');
            }
        } catch (objError) {
            console.error('Save failed', objError);
            const sErrorMessage = objError instanceof Error ? objError.message : 'บันทึกข้อมูลไม่สำเร็จ';
            notify(sErrorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategorySaved = async () => {
        try {
            const objResult = await transactionService.getCategories() as IApiResponse<ICategory[]>;
            if (objResult.status === 'success') {
                setLstCategories(objResult.data || []);
                notify('เพิ่มหมวดหมู่สำเร็จ');
            }
            setIsCategoryDialogOpen(false);
        } catch (objError) {
            console.error('Failed to refresh categories', objError);
            notify('เพิ่มหมวดหมู่ไม่สำเร็จ', 'error');
        }
    };

    const handleTagSaved = async () => {
        try {
            const objResult = await tagService.getAll() as IApiResponse<ITag[]>;
            if (objResult.status === 'success') {
                setLstTags(objResult.data || []);
                notify('เพิ่ม Tag สำเร็จ');
            }
            setIsTagDialogOpen(false);
        } catch (objError) {
            console.error('Failed to refresh tags', objError);
            notify('เพิ่ม Tag ไม่สำเร็จ', 'error');
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: 2, bgcolor: 'background.paper', backgroundImage: 'none' } } }}>
            <DialogTitle sx={{ fontFamily: 'Syne', fontWeight: 700 }}>
                {objEditData ? 'Edit Transaction' : 'New Transaction'}
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: 'divider' }}>
                <Grid container spacing={3} sx={{ pt: 1 }}>
                    <Grid size={12}>
                        <Controller
                            name="sDescription"
                            control={control}
                            rules={{ required: 'กรุณากรอกรายละเอียด' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label={
                                        <span>
                                            Description <span style={{ color: '#ff4d6d' }}>*</span>
                                        </span>
                                    }
                                    variant="outlined"
                                    fullWidth
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    placeholder="เช่น ค่าข้าว, เงินเดือน..."
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="nAmount"
                            control={control}
                            rules={{
                                required: 'กรุณากรอกจำนวนเงิน',
                                min: { value: 0.01, message: 'จำนวนเงินต้องมากกว่า 0' }
                            }}
                            render={({ field, fieldState }) => {
                                return (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ''}
                                        label={
                                            <span>
                                                Amount <span style={{ color: '#ff4d6d' }}>*</span>
                                            </span>
                                        }
                                        type="number"
                                        variant="outlined"
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                );
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel>
                                Type <span style={{ color: '#ff4d6d' }}>*</span>
                            </InputLabel>
                            <Controller
                                name="sType"
                                control={control}
                                rules={{ required: 'กรุณาเลือกประเภท' }}
                                render={({ field, fieldState }) => (
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }} >
                                        <Select
                                            {...field}
                                            label={
                                                <span>
                                                    Type <span style={{ color: '#ff4d6d' }}>*</span>
                                                </span>
                                            }
                                            error={!!fieldState.error}
                                        >
                                            <MenuItem value="" disabled><em>เลือกประเภท</em></MenuItem>
                                            <MenuItem value="EXPENSE" sx={{ color: 'error.main' }}>Expense</MenuItem>
                                            <MenuItem value="INCOME" sx={{ color: 'primary.main' }}>Income</MenuItem>
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

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="dDate"
                            control={control}
                            rules={{ required: 'กรุณาเลือกวันที่' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label={
                                        <span>
                                            Date <span style={{ color: '#ff4d6d' }}>*</span>
                                        </span>
                                    }
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    sx={{
                                        '& input::-webkit-calendar-picker-indicator': {
                                            filter: 'invert(1)',
                                            cursor: 'pointer'
                                        }
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel>
                                Category <span style={{ color: '#ff4d6d' }}>*</span>
                            </InputLabel>
                            <Controller
                                name="nCategoryId"
                                control={control}
                                rules={{ required: 'กรุณาเลือกหมวดหมู่' }}
                                render={({ field, fieldState }) => (
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Select
                                            {...field}
                                            value={
                                                lstUniqueCategories
                                                    .filter(c => !sType || !c.sType || (c.sType || '').toUpperCase() === (sType || '').toUpperCase())
                                                    .some(c => c.nCategoriesId === field.value)
                                                    ? field.value
                                                    : ''
                                            }
                                            label={
                                                <span>
                                                    Category <span style={{ color: '#ff4d6d' }}>*</span>
                                                </span>
                                            }
                                            error={!!fieldState.error}
                                            onChange={(objEvent) => {
                                                const val = objEvent.target.value as string | number;
                                                if (val === 'ADD_NEW') {
                                                    setIsCategoryDialogOpen(true);
                                                } else {
                                                    field.onChange(val);
                                                    // Sync sType with the selected category
                                                    const selectedCat = lstCategories.find(c => c.nCategoriesId === val);
                                                    if (selectedCat && selectedCat.sType) {
                                                        setValue('sType', selectedCat.sType.toUpperCase());
                                                    }
                                                }
                                            }}
                                        >
                                            <MenuItem value="" disabled><em>เลือกหมวดหมู่</em></MenuItem>
                                            {lstUniqueCategories
                                                .filter(c => !sType || !c.sType || (c.sType || '').toUpperCase() === (sType || '').toUpperCase())
                                                .map((cat) => (
                                                    <MenuItem key={cat.nCategoriesId} value={cat.nCategoriesId}>
                                                        {cat.sName} {(!sType || !cat.sType) && cat.sType && `(${cat.sType})`}
                                                    </MenuItem>
                                                ))
                                            }
                                            <Divider />
                                            <MenuItem value="ADD_NEW" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                                ＋ Add New Category
                                            </MenuItem>
                                        </Select>
                                        {fieldState.error && (
                                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                                {fieldState.error.message}
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            />
                        </FormControl>
                    </Grid>

                    <Grid size={12}>
                        <FormControl fullWidth>
                            <InputLabel>Tag / Project</InputLabel>
                            <Controller
                                name="nTagId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        value={
                                            lstUniqueTags.some(t => t.nTagsId === field.value)
                                                ? field.value
                                                : ''
                                        }
                                        label="Tag / Project"
                                        onChange={(objEvent) => {
                                            const val = objEvent.target.value as string | number;
                                            if (val === 'ADD_NEW_TAG') {
                                                setIsTagDialogOpen(true);
                                            } else {
                                                field.onChange(val);
                                            }
                                        }}
                                    >
                                        <MenuItem value="" disabled><em>Select Tag</em></MenuItem>
                                        {lstUniqueTags.map((tag) => (
                                            <MenuItem key={tag.nTagsId} value={tag.nTagsId}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: tag.sColorCode }} />
                                                    {tag.sName}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                        <Divider />
                                        <MenuItem value="ADD_NEW_TAG" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                            ＋ Add New Tag
                                        </MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Grid>
                    <Grid size={12}>
                        <FormControl fullWidth>
                            <InputLabel>
                                Status <span style={{ color: '#ff4d6d' }}>*</span>
                            </InputLabel>
                            <Controller
                                name="sStatus"
                                control={control}
                                rules={{ required: 'กรุณาเลือกสถานะ' }}
                                render={({ field, fieldState }) => (
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Select
                                            {...field}
                                            label={
                                                <span>
                                                    Status <span style={{ color: '#ff4d6d' }}>*</span>
                                                </span>
                                            }
                                            error={!!fieldState.error}
                                        >
                                            <MenuItem value="" disabled><em>เลือกสถานะ</em></MenuItem>
                                            {Object.values(TransactionStatus).map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box sx={{
                                                            width: 10,
                                                            height: 10,
                                                            borderRadius: '50%',
                                                            bgcolor: status === TransactionStatus.COMPLETED ? '#00e5a0' : status === TransactionStatus.PENDING ? '#ffcc00' : '#ff4d6d'
                                                        }} />
                                                        {status}
                                                    </Box>
                                                </MenuItem>
                                            ))}
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
                    <Grid size={12}>
                        <FormControl fullWidth>
                            <InputLabel>Recurring Rule (Optional)</InputLabel>
                            <Controller
                                name="nRecurringRuleId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        value={lstRecurringRules.some(r => r.nRecurringRulesId === field.value) ? field.value : ''}
                                        label="Recurring Rule (Optional)"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <SyncIcon fontSize="small" sx={{ color: 'text.secondary', ml: 1, mr: -0.5 }} />
                                            </InputAdornment>
                                        }
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            field.onChange(val);
                                            // Auto-fill amount if rule is selected and amount is empty
                                            if (val) {
                                                const rule = lstRecurringRules.find(r => r.nRecurringRulesId === val);
                                                const currentAmount = control._formValues.nAmount;
                                                if (rule && (!currentAmount || currentAmount === 0)) {
                                                    setValue('nAmount', rule.nAmount);
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem value=""><em>None (Manual Entry)</em></MenuItem>
                                        {lstRecurringRules.map((rule) => (
                                            <MenuItem key={rule.nRecurringRulesId} value={rule.nRecurringRulesId}>
                                                {rule.sName} (฿{rule.nAmount.toLocaleString()})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderColor: 'divider' }}>
                <Button onClick={onClose} disabled={isLoading} sx={{ color: 'text.secondary' }}>Cancel</Button>
                <Button onClick={handleSubmit(handleSave)} variant="contained" color="primary" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Transaction'}
                </Button>
            </DialogActions>

            <CategoryFormDialog
                isOpen={isCategoryDialogOpen}
                onClose={() => setIsCategoryDialogOpen(false)}
                onSaved={handleCategorySaved}
            />

            <TagFormDialog
                isOpen={isTagDialogOpen}
                onClose={() => setIsTagDialogOpen(false)}
                onSaved={handleTagSaved}
                objEditData={null}
            />

            {NotificationComponent}
        </Dialog>
    );
};