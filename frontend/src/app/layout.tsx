'use client';
import React, { useState } from 'react';
import ThemeRegistry from '@/components/providers/ThemeRegistry';
import { Sidebar, Topbar } from '@/components/layout';
import { Box } from '@mui/material';
import './globals.css';

import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleSidebarToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const isLoginPage = pathname === '/Login';

  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Sarabun:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
          <ThemeRegistry>
            <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
              {!isLoginPage && (
                <Sidebar isMobileOpen={isMobileOpen} onMobileClose={() => setIsMobileOpen(false)} />
              )}

              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {!isLoginPage && (
                  <Topbar onOpenSidebar={handleSidebarToggle} />
                )}

                <Box component="main" sx={{ flex: 1, overflowY: 'auto', p: isLoginPage ? 0 : 3 }}>
                  {children}
                </Box>
              </Box>
            </Box>
          </ThemeRegistry>
      </body>
    </html>
  );
}
