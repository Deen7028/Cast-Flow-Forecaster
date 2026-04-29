'use client';
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

interface ITopbarProps {
    onOpenSidebar: () => void;
}

export const Topbar = ({ onOpenSidebar }: ITopbarProps) => {
    return (
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        onClick={onOpenSidebar}
                        sx={{ mr: 2, display: { md: 'none' }, color: 'text.primary' }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700, fontFamily: 'Syne' }}>
                        Enterprise Finance
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton sx={{ color: 'text.secondary' }}>
                        <NotificationsNoneIcon />
                    </IconButton>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: '#000', fontSize: '0.875rem', fontWeight: 700 }}>
                        KM
                    </Avatar>
                </Box>
            </Toolbar>
        </AppBar>
    );
};