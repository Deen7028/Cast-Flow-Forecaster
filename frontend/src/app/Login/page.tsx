"use client";

import React from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Checkbox, 
  FormControlLabel, 
  Link,
  IconButton,
  InputAdornment,
  Container,Grid
} from '@mui/material';

export default function LoginPage(){ 
  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        bgcolor: '#000000ff' 
      }}
    >
      <Grid container sx={{ justifyContent: 'center', width: '100%' }}>
        <Grid size={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              borderRadius: 2
            }}
          >

            <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
              Login
            </Typography>

            <Box component="form" sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="Username"
                label="๊Username"
                name="Username"
                autoFocus
                type="text"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="password"
                id="password"
                type="password"
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary"/>}
                  label="จดจำฉัน"
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
              >
                <Link href="/Dashboard" color="inherit" underline="none">
                  Login
                </Link>
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}