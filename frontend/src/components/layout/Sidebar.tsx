'use client';
import React, { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery, useTheme, Badge, IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { lstNavItems } from '@/enum';
import { useAuth } from '@/components/providers/AuthContext';

interface ISidebarProps {
    isMobileOpen: boolean;
    onMobileClose: () => void;
}

export const Sidebar = ({ isMobileOpen, onMobileClose }: ISidebarProps) => {
    const objTheme = useTheme();
    const isMobile = useMediaQuery(objTheme.breakpoints.down('md'));
    const sPathname = usePathname();
    const objRouter = useRouter();
    const { objUser, logout } = useAuth();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    const sDrawerWidth = isMobile ? '280px' : '20%';

    const SidebarContent = (
        <Box sx={{ pt: 3, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            <Box sx={{ px: 3, pb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'Syne' }}>
                    Cash<Box component="span" sx={{ color: 'text.primary', fontStyle: 'italic' }}>Flow</Box>
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace', letterSpacing: 1 }}>
                    v2.0
                </Typography>
            </Box>

            <List sx={{ flex: 1, overflowY: 'auto', px: 1 }}>
                {lstNavItems.map((objItem) => {
                    const isSelected = sPathname === objItem.sRoute;
                    return (
                        <ListItem key={objItem.sRoute} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => {
                                    objRouter.push(objItem.sRoute);
                                    if (isMobile) onMobileClose();
                                }}
                                sx={{
                                    borderRadius: 1.5,
                                    bgcolor: isSelected ? 'rgba(0, 229, 160, 0.08)' : 'transparent',
                                    color: isSelected ? 'primary.main' : 'text.secondary',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
                                }}
                            >
                                <ListItemIcon sx={{ color: isSelected ? 'primary.main' : 'inherit', minWidth: 40, fontSize: 20 }}>
                                    {objItem.sIcon}
                                </ListItemIcon>

                                <ListItemText
                                    disableTypography
                                    primary={
                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                fontWeight: isSelected ? 700 : 500,
                                                color: 'inherit'
                                            }}
                                        >
                                            {objItem.sLabel}
                                        </Typography>
                                    }
                                />

                                {objItem.nBadgeCount && (
                                    <Badge badgeContent={objItem.nBadgeCount} color="error" sx={{ mr: 1 }} />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', mt: 'auto' }}>
                {objUser && (
                    <Box sx={{ mb: 2, p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2 }}>
                        <Box sx={{ 
                            width: 32, height: 32, borderRadius: '50%', 
                            bgcolor: 'primary.main', display: 'flex', 
                            alignItems: 'center', justifyContent: 'center', 
                            color: 'white', fontWeight: 'bold', fontSize: 14
                        }}>
                            {(objUser.fullName || objUser.username || 'U').charAt(0).toUpperCase()}
                        </Box>
                        <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {objUser.fullName || objUser.username || 'User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                กำลังใช้งานอยู่
                            </Typography>
                        </Box>
                        <IconButton onClick={logout} size="small" color="error" title="ออกจากระบบ" sx={{ bgcolor: 'rgba(211, 47, 47, 0.08)', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.15)' } }}>
                            <Logout fontSize="small" />
                        </IconButton>
                        </Box>
                )}
            </Box>
        </Box>
    );

    if (!isMounted) return null;

    return (
        <Box component="nav" sx={{ width: { md: sDrawerWidth }, flexShrink: { md: 0 } }}>
            <Drawer
                variant="temporary"
                open={isMobileOpen}
                onClose={onMobileClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sDrawerWidth, borderRight: 'none' },
                }}
            >
                {SidebarContent}
            </Drawer>

            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: sDrawerWidth,
                        borderRight: '1px solid',
                        borderColor: 'divider'
                    },
                }}
                open
            >
                {SidebarContent}
            </Drawer>
        </Box>
    );
};
