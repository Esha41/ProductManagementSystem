namespace ProductsService.Application.DTOs;

public record ProductResponse(Guid Id, string Name, string Colour, decimal Price, DateTime CreatedAtUtc);
