'use client';
import { CategoriesContainer } from '@/components/transactions/CategoriesContainer';
import { Box, Typography, Paper } from '@mui/material';

export default function CategoriesPage() {
    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Syne', mb: 1 }}>
                    Categories
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    จัดการหมวดหมู่รายรับและรายจ่ายเพื่อการจัดระเบียบข้อมูลที่แม่นยำ
                </Typography>
            </Box>

            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', backgroundImage: 'none', border: '1px solid', borderColor: 'divider' }}>
                <CategoriesContainer />
            </Paper>
        </Box>
    );
}
