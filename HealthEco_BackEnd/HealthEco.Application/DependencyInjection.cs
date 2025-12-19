using Microsoft.Extensions.DependencyInjection;

namespace HealthEco.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Services will be registered here later
        return services;
    }
}