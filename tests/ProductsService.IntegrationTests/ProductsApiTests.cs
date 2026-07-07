using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using ProductsService.Api.Models;
using ProductsService.Application.DTOs;

namespace ProductsService.IntegrationTests;

public class ProductsApiTests(ProductsWebApplicationFactory factory) : IClassFixture<ProductsWebApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient();
    private readonly JsonSerializerOptions _jsonOptions = new() { PropertyNameCaseInsensitive = true };

    [Fact]
    public async Task Health_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/health");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("OK");
    }

    [Fact]
    public async Task GetProducts_WithoutToken_ReturnsUnauthorized()
    {
        var response = await _client.GetAsync("/api/products");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task CreateAndGetProducts_WithValidToken_WorksEndToEnd()
    {
        var client = await CreateAuthenticatedClientAsync();
        var createRequest = new CreateProductRequest("Laptop", "Silver", 999.99m);

        var createResponse = await client.PostAsJsonAsync("/api/products", createRequest);
        createResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        var created = await createResponse.Content.ReadFromJsonAsync<ProductResponse>(_jsonOptions);
        created.Should().NotBeNull();
        created!.Name.Should().Be("Laptop");

        var listResponse = await client.GetAsync("/api/products");
        listResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var products = await listResponse.Content.ReadFromJsonAsync<List<ProductResponse>>(_jsonOptions);
        products.Should().Contain(p => p.Id == created.Id);
    }

    [Fact]
    public async Task GetProducts_ByColour_ReturnsFilteredResults()
    {
        var client = await CreateAuthenticatedClientAsync();

        await client.PostAsJsonAsync("/api/products", new CreateProductRequest("Chair", "Red", 49.99m));
        await client.PostAsJsonAsync("/api/products", new CreateProductRequest("Desk", "Blue", 199.99m));

        var response = await client.GetAsync("/api/products?colour=Red");
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var products = await response.Content.ReadFromJsonAsync<List<ProductResponse>>(_jsonOptions);
        products.Should().NotBeNull();
        products!.Should().OnlyContain(p => p.Colour.Equals("Red", StringComparison.OrdinalIgnoreCase));
    }

    private async Task<HttpClient> CreateAuthenticatedClientAsync()
    {
        var client = factory.CreateClient();
        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest("admin", "P@ssw0rd!"));
        loginResponse.EnsureSuccessStatusCode();

        var login = await loginResponse.Content.ReadFromJsonAsync<LoginResponse>(_jsonOptions);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", login!.AccessToken);
        return client;
    }
}
