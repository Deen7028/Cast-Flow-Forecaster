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
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Container
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { useLogin } from '@/hooks/useLogin';

export default function LoginPage() {
  const { form, showPassword, setShowPassword, sError, isLoading, onSubmit } = useLogin();
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'radial-gradient(circle at top left, #1a1a1a, #000000)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Decorative Elements */}
      <Box sx={{ 
        position: 'absolute', width: '40vw', height: '40vw', 
        borderRadius: '50%', background: 'rgba(25, 118, 210, 0.05)', 
        filter: 'blur(80px)', top: '-10%', left: '-10%' 
      }} />
      <Box sx={{ 
        position: 'absolute', width: '30vw', height: '30vw', 
        borderRadius: '50%', background: 'rgba(156, 39, 176, 0.05)', 
        filter: 'blur(80px)', bottom: '-5%', right: '-5%' 
      }} />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, md: 5 }, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderRadius: 4,
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          <Box 
            sx={{ 
              width: 56, height: 56, borderRadius: '50%', 
              bgcolor: 'primary.main', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', mb: 2,
              boxShadow: '0 0 20px rgba(25, 118, 210, 0.4)'
            }}
          >
            <LockOutlined sx={{ color: 'white' }} />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.5px' }}>
            Welcome
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            เข้าสู่ระบบเพื่อจัดการกระแสเงินสดของคุณ
          </Typography>

          {sError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
              {sError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            <TextField
              {...register('Username')}
              margin="normal"
              fullWidth
              id="Username"
              label="Username"
              autoFocus
              error={!!errors.Username}
              helperText={errors.Username?.message}
              slotProps={{ 
                input: { sx: { borderRadius: 2 } } 
              }}
            />
            <TextField
              {...register('Password')}
              margin="normal"
              fullWidth
              label="Password"
              id="password"
              type={showPassword ? 'text' : 'password'}
              error={!!errors.Password}
              helperText={errors.Password?.message}
              slotProps={{
                input: {
                  sx: { borderRadius: 2 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <FormControlLabel
                control={<Checkbox {...register('remember')} color="primary" sx={{ borderRadius: 1 }} />}
                label={<Typography variant="body2">จดจำฉัน</Typography>}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ 
                mt: 3, mb: 2, py: 1.5, 
                fontWeight: 'bold', 
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 10px 15px -3px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  boxShadow: '0 20px 25px -5px rgba(25, 118, 210, 0.4)',
                }
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}