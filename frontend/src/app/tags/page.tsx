import { Box, Typography } from '@mui/material';
import { TagsContainer } from '@/components/tags';

export default function TagsPage() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h5" sx={{ fontFamily: 'Syne', fontWeight: 700 }}>Tags & Projects</Typography>
            <TagsContainer />
        </Box>
    );
}