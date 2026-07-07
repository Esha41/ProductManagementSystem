import type { Product } from '../types/product';

interface ProductListProps {
  products: Product[];
  colourFilter: string;
  onColourFilterChange: (value: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function ProductList({
  products,
  colourFilter,
  onColourFilterChange,
  onRefresh,
  isLoading,
}: ProductListProps) {
  return (
    <section className="card">
      <div className="list-header">
        <h2>Products</h2>
        <button type="button" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <label>
        Filter by colour
        <input
          value={colourFilter}
          onChange={(event) => onColourFilterChange(event.target.value)}
          placeholder="e.g. Red"
        />
      </label>

      {products.length === 0 ? (
        <p className="muted">No products found.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Colour</th>
                <th>Price</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>
                    <span className="colour-badge">{product.colour}</span>
                  </td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{new Date(product.createdAtUtc).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
