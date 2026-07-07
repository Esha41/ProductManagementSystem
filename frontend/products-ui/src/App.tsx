import { useCallback, useEffect, useState } from 'react';
import { apiClient } from './api/client';
import { DashboardLayout, type DashboardPage } from './components/DashboardLayout';
import { LoginForm } from './components/LoginForm';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { ToastContainer, type ToastItem, type ToastType } from './components/Toast';
import type { CreateProductRequest, Product } from './types/product';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState<DashboardPage>('list');
  const [healthStatus, setHealthStatus] = useState<string>('Checking...');
  const [products, setProducts] = useState<Product[]>([]);
  const [colourFilter, setColourFilter] = useState('');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToasts([{ id, type, message }]);
  }, []);

  const handlePageChange = useCallback((page: DashboardPage) => {
    setToasts([]);
    setActivePage(page);
  }, []);

  const loadHealth = useCallback(async () => {
    try {
      const health = await apiClient.getHealth();
      setHealthStatus(health.status);
    } catch {
      setHealthStatus('Unavailable');
    }
  }, []);

  const loadProducts = useCallback(async (colour?: string) => {
    setIsBusy(true);
    try {
      const data = await apiClient.getProducts(colour?.trim() || undefined);
      setProducts(data);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to load products.');
    } finally {
      setIsBusy(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadHealth();
  }, [loadHealth]);

  useEffect(() => {
    if (!isAuthenticated || activePage !== 'list') {
      return;
    }

    const timeout = setTimeout(() => {
      void loadProducts(colourFilter);
    }, 300);

    return () => clearTimeout(timeout);
  }, [colourFilter, isAuthenticated, activePage, loadProducts]);

  async function handleLogin(username: string, password: string) {
    setIsBusy(true);
    try {
      const response = await apiClient.login(username, password);
      apiClient.setToken(response.accessToken);
      setIsAuthenticated(true);
      setActivePage('list');
      setToasts([]);
      await loadProducts();
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setIsBusy(false);
    }
  }

  async function handleCreate(payload: CreateProductRequest) {
    setIsBusy(true);
    try {
      await apiClient.createProduct(payload);
      await loadProducts(colourFilter);
      showToast('success', 'Product saved successfully.');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to create product.');
    } finally {
      setIsBusy(false);
    }
  }

  function handleLogout() {
    apiClient.setToken(null);
    setIsAuthenticated(false);
    setActivePage('list');
    setProducts([]);
    setColourFilter('');
    setToasts([]);
  }

  return (
    <div className={`app${isAuthenticated ? ' app-dashboard' : ''}`}>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {!isAuthenticated ? (
        <>
          <header className="hero hero-centered">
            <h1>Product Management System</h1>
          </header>

          <div className="login-wrapper">
            <LoginForm onLogin={handleLogin} isLoading={isBusy} />
          </div>
        </>
      ) : (
        <DashboardLayout
          activePage={activePage}
          onPageChange={handlePageChange}
          healthStatus={healthStatus}
          onLogout={handleLogout}
        >
          {activePage === 'list' ? (
            <ProductList
              products={products}
              colourFilter={colourFilter}
              onColourFilterChange={setColourFilter}
              onRefresh={() => loadProducts(colourFilter)}
              isLoading={isBusy}
            />
          ) : (
            <div className="form-page">
              <ProductForm onCreate={handleCreate} isLoading={isBusy} />
            </div>
          )}
        </DashboardLayout>
      )}
    </div>
  );
}

export default App;
