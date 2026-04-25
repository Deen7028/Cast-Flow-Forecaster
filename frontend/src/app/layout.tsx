'use client';
import React, { useState } from 'react';
import ThemeRegistry from '@/components/providers/ThemeRegistry';
import { AuthProvider } from '@/components/providers/AuthContext';
import { Sidebar, Topbar } from '@/components/layout';
import { Box } from '@mui/material';
import './globals.css';

import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Sarabun:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeRegistry>
          <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
            {/* 1. Sidebar ด้านซ้าย */}
            <Sidebar />

            {/* 2. พื้นที่ด้านขวา (Topbar + Content) */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <Topbar />

              {/* 3. Main Content Area */}
              <Box component="main" sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
                {children}
              </Box>
            </Box>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
