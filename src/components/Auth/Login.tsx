import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../features/auth/authSlice';
import { useSnackbar } from '../Layout/SnackbarNotification';

const MOCK_USERS = [
  { id: '1', email: 'admin@test.com', name: 'Admin User', password: 'password123' },
  { id: '2', email: 'user@test.com', name: 'Test User', password: 'password123' },
];

interface LoginProps {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

export const Login = ({ toggleTheme, mode }: LoginProps) => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      dispatch(login(userWithoutPassword));
      showSnackbar(`Welcome back, ${user.name}!`, 'success');
    } else {
      showSnackbar('Invalid credentials. Try admin@test.com / password123', 'error');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, position: 'relative' }}>
          <IconButton
            onClick={toggleTheme}
            sx={{ position: 'absolute', top: 16, right: 16 }}
          >
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Agile Issue Tracker
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Sign in to manage your issues
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
            >
              Sign In
            </Button>
          </form>
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Demo credentials:<br />
              Email: admin@test.com<br />
              Password: password123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
