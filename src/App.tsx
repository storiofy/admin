import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from '@components/layout/Sidebar';
import Header from '@components/layout/Header';
import ProtectedRoute from '@components/ProtectedRoute';
import LoginPage from '@pages/LoginPage';
import DashboardPage from '@pages/DashboardPage';
import BooksPage from '@pages/BooksPage';
import BookFormPage from '@pages/BookFormPage';
import OrdersPage from '@pages/OrdersPage';
import OrderDetailPage from '@pages/OrderDetailPage';
import UsersPage from '@pages/UsersPage';
import UserDetailPage from '@pages/UserDetailPage';
import AdminUsersPage from '@pages/AdminUsersPage';
import SettingsPage from '@pages/SettingsPage';
import DeliveryTypesPage from '@pages/DeliveryTypesPage';
import { useAuthStore } from '@store/authStore';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function AppContent() {
  const initializeFromStorage = useAuthStore((state) => state.initializeFromStorage);

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/books" element={<BooksPage />} />
                      <Route path="/books/new" element={<BookFormPage />} />
                      <Route path="/books/:id/edit" element={<BookFormPage />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/orders/:orderNumber" element={<OrderDetailPage />} />
                      <Route path="/users" element={<UsersPage />} />
                      <Route path="/users/:id" element={<UserDetailPage />} />
                      <Route path="/admin-users" element={<AdminUsersPage />} />
                      <Route path="/delivery-types" element={<DeliveryTypesPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
