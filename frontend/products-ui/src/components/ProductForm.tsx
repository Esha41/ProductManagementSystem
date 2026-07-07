import { type FormEvent, useState } from 'react';
import type { CreateProductRequest } from '../types/product';

interface ProductFormProps {
  onCreate: (payload: CreateProductRequest) => Promise<void>;
  isLoading: boolean;
}

export function ProductForm({ onCreate, isLoading }: ProductFormProps) {
  const [name, setName] = useState('');
  const [colour, setColour] = useState('');
  const [price, setPrice] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await onCreate({
      name,
      colour,
      price: Number(price),
    });
    setName('');
    setColour('');
    setPrice('');
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Create product</h2>
      <label>
        Name
        <input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label>
        Colour
        <input value={colour} onChange={(event) => setColour(event.target.value)} required />
      </label>
      <label>
        Price
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create product'}
      </button>
    </form>
  );
}
