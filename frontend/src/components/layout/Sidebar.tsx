'use client';
import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Badge } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { lstNavItems } from '@/enum';

export const Sidebar = () => {
    const sPathname = usePathname();
    const objRouter = useRouter();

    return (
        <Box sx={{ width: 228, bgcolor: 'background.paper', borderRight: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800, fontFamily: 'Syne' }}>
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
                                    '&.Mui-selected': { bgcolor: 'rgba(0, 229, 160, 0.08)', color: 'primary.main' }
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

            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" fontWeight={600}>SoftHouse Co.</Typography>
                    <Typography variant="caption" color="text.secondary">THB ONLY</Typography>
                </Box>
            </Box>
        </Box>
    );
};