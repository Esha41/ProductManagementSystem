import { useCallback, useEffect, useState } from 'react';
import { apiClient } from './api/client';
import { LoginForm } from './components/LoginForm';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import type { CreateProductRequest, Product } from './types/product';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [healthStatus, setHealthStatus] = useState<string>('Checking...');
  const [products, setProducts] = useState<Product[]>([]);
  const [colourFilter, setColourFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

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
    setError(null);
    try {
      const data = await apiClient.getProducts(colour?.trim() || undefined);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products.');
    } finally {
      setIsBusy(false);
    }
  }, []);

  useEffect(() => {
    void loadHealth();
  }, [loadHealth]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const timeout = setTimeout(() => {
      void loadProducts(colourFilter);
    }, 300);

    return () => clearTimeout(timeout);
  }, [colourFilter, isAuthenticated, loadProducts]);

  async function handleLogin(username: string, password: string) {
    setIsBusy(true);
    setError(null);
    try {
      const response = await apiClient.login(username, password);
      apiClient.setToken(response.accessToken);
      setIsAuthenticated(true);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setIsBusy(false);
    }
  }

  async function handleCreate(payload: CreateProductRequest) {
    setIsBusy(true);
    setError(null);
    try {
      await apiClient.createProduct(payload);
      await loadProducts(colourFilter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product.');
    } finally {
      setIsBusy(false);
    }
  }

  function handleLogout() {
    apiClient.setToken(null);
    setIsAuthenticated(false);
    setProducts([]);
    setColourFilter('');
  }

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Products Service</p>
          <h1>Catalog management dashboard</h1>
          <p className="muted">
            React frontend consuming the secured .NET Products API with JWT authentication.
          </p>
        </div>
        <div className="status-pill" data-state={healthStatus === 'OK' ? 'ok' : 'warn'}>
          Health: {healthStatus}
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {!isAuthenticated ? (
        <LoginForm onLogin={handleLogin} isLoading={isBusy} />
      ) : (
        <div className="grid">
          <ProductForm onCreate={handleCreate} isLoading={isBusy} />
          <ProductList
            products={products}
            colourFilter={colourFilter}
            onColourFilterChange={setColourFilter}
            onRefresh={() => loadProducts(colourFilter)}
            isLoading={isBusy}
          />
        </div>
      )}

      {isAuthenticated && (
        <button type="button" className="ghost-button" onClick={handleLogout}>
          Sign out
        </button>
      )}
    </div>
  );
}

export default App;
