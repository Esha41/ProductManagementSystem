using Microsoft.EntityFrameworkCore;
using ProductsService.Application.Interfaces;
using ProductsService.Domain.Entities;

namespace ProductsService.Infrastructure.Persistence;

public class ProductRepository(ProductsDbContext dbContext) : IProductRepository
{
    public async Task<Product> AddAsync(Product product, CancellationToken cancellationToken = default)
    {
        dbContext.Products.Add(product);
        await dbContext.SaveChangesAsync(cancellationToken);
        return product;
    }

    public async Task<IReadOnlyList<Product>> GetAllAsync(string? colour = null, CancellationToken cancellationToken = default)
    {
        var query = dbContext.Products.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(colour))
        {
            query = query.Where(p => p.Colour.ToLower() == colour.ToLower());
        }

        return await query.OrderBy(p => p.Name).ToListAsync(cancellationToken);
    }
}
