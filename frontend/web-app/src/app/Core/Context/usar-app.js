import { useContext } from 'react';
import { AppContext } from './contexto-app.js';

export function useApp() {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error('useApp debe usarse dentro de <AppProvider>.');
  }
  return value;
}
