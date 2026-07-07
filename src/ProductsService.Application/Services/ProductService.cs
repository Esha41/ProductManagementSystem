using ProductsService.Application.DTOs;
using ProductsService.Application.Interfaces;
using ProductsService.Domain.Entities;

namespace ProductsService.Application.Services;

public class ProductService(IProductRepository repository) : IProductService
{
    public async Task<ProductResponse> CreateAsync(CreateProductRequest request, CancellationToken cancellationToken = default)
    {
        ValidateCreateRequest(request);

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Colour = request.Colour.Trim(),
            Price = request.Price,
            CreatedAtUtc = DateTime.UtcNow
        };

        var created = await repository.AddAsync(product, cancellationToken);
        return MapToResponse(created);
    }

    public async Task<IReadOnlyList<ProductResponse>> GetAllAsync(string? colour = null, CancellationToken cancellationToken = default)
    {
        var products = await repository.GetAllAsync(colour?.Trim(), cancellationToken);
        return products.Select(MapToResponse).ToList();
    }

    private static void ValidateCreateRequest(CreateProductRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ArgumentException("Product name is required.", nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.Colour))
        {
            throw new ArgumentException("Product colour is required.", nameof(request));
        }

        if (request.Price <= 0)
        {
            throw new ArgumentException("Product price must be greater than zero.", nameof(request));
        }
    }

    private static ProductResponse MapToResponse(Product product) =>
        new(product.Id, product.Name, product.Colour, product.Price, product.CreatedAtUtc);
}
