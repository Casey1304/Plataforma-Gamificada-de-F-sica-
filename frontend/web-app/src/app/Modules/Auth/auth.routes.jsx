/* eslint-disable react-refresh/only-export-components */
import { Route } from 'react-router-dom';
import { ROUTES } from '@/app/Core/Models/rutas.js';
import { LoginPage } from './pages/pagina-login/pagina-login.jsx';
import { RegisterPage } from './pages/pagina-registro/pagina-registro.jsx';

/** Rutas del módulo Auth: /auth/login, /auth/register */
export const authRoutes = (
  <>
    <Route element={<LoginPage />} path="login" />
    <Route element={<RegisterPage />} path="register" />
  </>
);

export const AUTH_BASE = ROUTES.AUTH;
