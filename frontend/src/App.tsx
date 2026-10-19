import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { ContractsPage } from './pages/ContractsPage';

const queryClient = new QueryClient();

/**
 * Rotas do painel. Cada página fica em src/pages e busca dados via src/api.
 * TODO: proteger as rotas (redirecionar para /login quando não houver token).
 */
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/contracts" element={<ContractsPage />} />
          {/* TODO: /contracts/new, /contracts/:id, /customers */}
          <Route path="*" element={<Navigate to="/contracts" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
