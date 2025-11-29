import { AppBar, Toolbar, Typography, Button, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../features/auth/authSlice';
import { useSnackbar } from './SnackbarNotification';

interface NavbarProps {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

export const Navbar = ({ toggleTheme, mode }: NavbarProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    dispatch(logout());
    showSnackbar('Logged out successfully', 'info');
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          component="div"
          sx={{
            flexGrow: 1,
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          {isMobile ? 'Issue Tracker' : 'Agile Issue Tracker'}
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 2 } }}>
            <Typography
              variant="body2"
              sx={{
                display: { xs: 'none', md: 'block' }
              }}
            >
              Welcome, {user.name}
            </Typography>
            {isMobile ? (
              <IconButton
                color="inherit"
                onClick={toggleTheme}
                size="small"
              >
                {mode === 'dark' ? <LightMode /> : <DarkMode />}
              </IconButton>
            ) : (
              <Button
                color="inherit"
                onClick={toggleTheme}
                startIcon={mode === 'dark' ? <LightMode /> : <DarkMode />}
              >
                {mode === 'dark' ? 'Light' : 'Dark'}
              </Button>
            )}
            <Button
              color="inherit"
              onClick={handleLogout}
              size={isMobile ? 'small' : 'medium'}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
