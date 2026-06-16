using System;
using System.IO;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Ecommerce.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Ecommerce.Infrastructure.Services
{
    public class CloudinaryService : IUploadService
    {
        private readonly Cloudinary? _cloudinary;

        public CloudinaryService(IConfiguration configuration)
        {
            var cloudName = configuration["Cloudinary:CloudName"];
            var apiKey = configuration["Cloudinary:ApiKey"];
            var apiSecret = configuration["Cloudinary:ApiSecret"];

            if (!string.IsNullOrEmpty(cloudName) && !string.IsNullOrEmpty(apiKey) && !string.IsNullOrEmpty(apiSecret))
            {
                var account = new Account(cloudName, apiKey, apiSecret);
                _cloudinary = new Cloudinary(account);
            }
        }

        public async Task<string> UploadAsync(string base64OrFile, string fileName)
        {
            if (_cloudinary == null)
            {
                // Fallback to returning the input if Cloudinary account is not configured
                return base64OrFile;
            }

            try
            {
                var base64Data = base64OrFile;
                if (base64OrFile.Contains(","))
                {
                    base64Data = base64OrFile.Split(',')[1];
                }

                if (!base64OrFile.StartsWith("data:image") && Uri.IsWellFormedUriString(base64OrFile, UriKind.Absolute))
                {
                    return base64OrFile;
                }

                var bytes = Convert.FromBase64String(base64Data);
                using var stream = new MemoryStream(bytes);

                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(fileName, stream),
                    Folder = "shopease_products"
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                return uploadResult.SecureUrl?.ToString() ?? base64OrFile;
            }
            catch
            {
                return base64OrFile;
            }
        }
    }
}
