namespace ProductsService.Application.DTOs;

public record CreateProductRequest(string Name, string Colour, decimal Price);
