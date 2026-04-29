'use client';

import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

interface ITopbarProps {
    onOpenSidebar: () => void;
}

export const Topbar = (objProps: ITopbarProps) => {
    const { onOpenSidebar } = objProps;

    return (
        <AppBar 
            position="sticky" 
            elevation={0}
            sx={{ 
                bgcolor: 'background.default', 
                borderBottom: '1px solid', 
                borderColor: 'divider',
                display: { md: 'none' } 
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onOpenSidebar}
                    sx={{ mr: 2, color: 'text.primary' }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 800, fontFamily: 'Syne' }}>
                    Cash<Box component="span" sx={{ color: 'text.primary', fontStyle: 'italic' }}>Flow</Box>
                </Typography>
            </Toolbar>
        </AppBar>
    );
};
