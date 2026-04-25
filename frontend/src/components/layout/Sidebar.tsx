'use client';
import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Badge } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { lstNavItems } from '@/enum';
import { useAuth } from '@/components/providers/AuthContext';

interface ISidebarProps {
    isMobileOpen: boolean;
    onMobileClose: () => void;
}

export const Sidebar = () => {
    const sPathname = usePathname();
    const objRouter = useRouter();

<<<<<<< HEAD
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    const sDrawerWidth = isMobile ? '250px' : '20%';

    const SidebarContent = (
        <Box sx={{ pt: 3, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            <Box sx={{ px: 3, pb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'Syne' }}>
=======
    return (
        <Box sx={{ width: 228, bgcolor: 'background.paper', borderRight: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800, fontFamily: 'Syne' }}>
>>>>>>> dev
                    Cash<Box component="span" sx={{ color: 'text.primary', fontStyle: 'italic' }}>Flow</Box>
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace', letterSpacing: 1 }}>
                    v2.0
                </Typography>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
                <List>
                    {lstNavItems.map((objItem) => (
                        <ListItem key={objItem.sRoute} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => objRouter.push(objItem.sRoute)}
                                selected={sPathname === objItem.sRoute}
                                sx={{
                                    borderRadius: 1.5,
                                    bgcolor: isSelected ? 'rgba(0, 229, 160, 0.08)' : 'transparent',
                                    color: isSelected ? 'primary.main' : 'text.secondary',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 32, fontSize: 16 }}>{objItem.sIcon}</ListItemIcon>
                                <ListItemText primary={objItem.sLabel} primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }} />
                                {objItem.nBadgeCount && (
                                    <Badge badgeContent={objItem.nBadgeCount} color="error" sx={{ mr: 1 }} />
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

<<<<<<< HEAD
            {/* ส่วน Footer (SoftHouse Co.) ด้านล่างสุด */}
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', mt: 'auto' }}>
                <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>SoftHouse Co.</Typography>
=======
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" fontWeight={600}>SoftHouse Co.</Typography>
>>>>>>> dev
                    <Typography variant="caption" color="text.secondary">THB ONLY</Typography>
                </Box>
            </Box>
        </Box>
    );
};