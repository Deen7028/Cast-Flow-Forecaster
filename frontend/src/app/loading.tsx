import { Box } from '@mui/material';
import { LogoLoader } from '@/components/common/LogoLoader';

export default function GlobalLoading() {
    return (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogoLoader sMessage="Preparing your workspace..." />
        </Box>
    );
}