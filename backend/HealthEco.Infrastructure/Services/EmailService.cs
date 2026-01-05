using Microsoft.Extensions.Logging;

namespace HealthEco.Infrastructure.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;

        public EmailService(ILogger<EmailService> logger)
        {
            _logger = logger;
        }

        public Task SendEmailAsync(string to, string subject, string body)
        {
            // For development, just log the email
            _logger.LogInformation($"Sending email to: {to}, Subject: {subject}");
            _logger.LogInformation($"Body: {body}");

            return Task.CompletedTask;
        }
    }
}