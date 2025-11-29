import { StrictMode, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './store/store';
import { getTheme } from './utils/theme';
import { SnackbarProvider } from './components/Layout/SnackbarNotification';
import App from './App.tsx';

function Root() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme', newMode);
  };

  return (
    <StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider>
            <App toggleTheme={toggleTheme} mode={mode} />
          </SnackbarProvider>
        </ThemeProvider>
      </Provider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
