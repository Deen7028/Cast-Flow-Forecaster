'use client';
import React, { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery, useTheme, Badge } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { lstNavItems } from '@/enum';

interface ISidebarProps {
    isMobileOpen: boolean;
    onMobileClose: () => void;
}

export const Sidebar = ({ isMobileOpen, onMobileClose }: ISidebarProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const sPathname = usePathname();
    const objRouter = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const sDrawerWidth = isMobile ? '280px' : '25%';

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
                {/*  วนลูปจาก lstNavItems ใน enum */}
                {lstNavItems.map((objItem) => {
                    const isSelected = sPathname === objItem.sRoute;
                    return (
                        <ListItem key={objItem.sRoute} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => {
                                    objRouter.push(objItem.sRoute);
                                    if (isMobile) onMobileClose(); // กดแล้วให้ปิด Sidebar บนมือถือ
                                }}
                                sx={{
                                    borderRadius: 1.5,
                                    bgcolor: isSelected ? 'rgba(0, 229, 160, 0.08)' : 'transparent',
                                    color: isSelected ? 'primary.main' : 'text.secondary',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
                                }}
                            >
                                {/*  ใช้ sIcon จาก enum (ที่เป็น Emoji) */}
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
                                                color: 'inherit' // ให้ดึงสีมาจากตัวแม่ (ListItemButton)
                                            }}
                                        >
                                            {objItem.sLabel}
                                        </Typography>
                                    }
                                />

                                {/*  แสดง Badge ถ้ามี */}
                                {objItem.nBadgeCount && (
                                    <Badge badgeContent={objItem.nBadgeCount} color="error" sx={{ mr: 1 }} />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* ส่วน Footer (SoftHouse Co.) ด้านล่างสุด */}
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', mt: 'auto' }}>
                <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" fontWeight={600}>SoftHouse Co.</Typography>
                    <Typography variant="caption" color="text.secondary">THB ONLY</Typography>
                </Box>
            </Box>
        </Box>
    );

    if (!isMounted) return null;

    return (
        <Box component="nav" sx={{ width: { md: sDrawerWidth }, flexShrink: { md: 0 } }}>
            {/* Mobile View: Drawer แบบเปิด-ปิด */}
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

            {/* Desktop View: Sidebar ถาวรกว้าง 25% */}
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
