using FluentAssertions;
using Moq;
using ProductsService.Application.DTOs;
using ProductsService.Application.Interfaces;
using ProductsService.Application.Services;
using ProductsService.Domain.Entities;

namespace ProductsService.UnitTests.Services;

public class ProductServiceTests
{
    private readonly Mock<IProductRepository> _repositoryMock = new();
    private readonly ProductService _sut;

    public ProductServiceTests()
    {
        _sut = new ProductService(_repositoryMock.Object);
    }

    [Fact]
    public async Task CreateAsync_WithValidRequest_ReturnsCreatedProduct()
    {
        var request = new CreateProductRequest("Widget", "Blue", 19.99m);
        _repositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product product, CancellationToken _) => product);

        var result = await _sut.CreateAsync(request);

        result.Name.Should().Be("Widget");
        result.Colour.Should().Be("Blue");
        result.Price.Should().Be(19.99m);
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Theory]
    [InlineData("", "Blue", 10)]
    [InlineData("Widget", "", 10)]
    [InlineData("Widget", "Blue", 0)]
    [InlineData("Widget", "Blue", -1)]
    public async Task CreateAsync_WithInvalidRequest_ThrowsArgumentException(string name, string colour, decimal price)
    {
        var request = new CreateProductRequest(name, colour, price);

        var act = () => _sut.CreateAsync(request);

        await act.Should().ThrowAsync<ArgumentException>();
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task GetAllAsync_WithoutColour_ReturnsMappedProducts()
    {
        var products = new List<Product>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Widget",
                Colour = "Blue",
                Price = 10m,
                CreatedAtUtc = DateTime.UtcNow
            }
        };

        _repositoryMock
            .Setup(r => r.GetAllAsync(null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(products);

        var result = await _sut.GetAllAsync();

        result.Should().HaveCount(1);
        result[0].Name.Should().Be("Widget");
    }

    [Fact]
    public async Task GetAllAsync_WithColour_PassesFilterToRepository()
    {
        _repositoryMock
            .Setup(r => r.GetAllAsync("Red", It.IsAny<CancellationToken>()))
            .ReturnsAsync(Array.Empty<Product>());

        await _sut.GetAllAsync(" Red ");

        _repositoryMock.Verify(r => r.GetAllAsync("Red", It.IsAny<CancellationToken>()), Times.Once);
    }
}
