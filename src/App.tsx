import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { restoreSession } from './features/auth/authSlice';
import { loadIssues } from './features/issues/issuesSlice';
import { Login } from './components/Auth/Login';
import { Navbar } from './components/Layout/Navbar';
import { Board } from './components/Board/Board';

interface AppProps {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

function App({ toggleTheme, mode }: AppProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreSession());
    dispatch(loadIssues());
  }, [dispatch]);

  if (!isAuthenticated) {
    return <Login toggleTheme={toggleTheme} mode={mode} />;
  }

  return (
    <Box>
      <Navbar toggleTheme={toggleTheme} mode={mode} />
      <Board />
    </Box>
  );
}

export default App;
