namespace ProductsService.Domain.Entities;

public class Product
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Colour { get; set; }
    public decimal Price { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
