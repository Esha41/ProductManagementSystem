using ProductsService.Domain.Entities;

namespace ProductsService.Application.Interfaces;

public interface IProductRepository
{
    Task<Product> AddAsync(Product product, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Product>> GetAllAsync(string? colour = null, CancellationToken cancellationToken = default);
}
