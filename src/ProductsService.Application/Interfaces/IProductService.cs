using ProductsService.Application.DTOs;

namespace ProductsService.Application.Interfaces;

public interface IProductService
{
    Task<ProductResponse> CreateAsync(CreateProductRequest request, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ProductResponse>> GetAllAsync(string? colour = null, CancellationToken cancellationToken = default);
}
