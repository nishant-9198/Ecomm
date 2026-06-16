using System;
using System.IO;
using System.Threading.Tasks;
using Ecommerce.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Ecommerce.Infrastructure.Services
{
    public class LocalUploadService : IUploadService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LocalUploadService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<string> UploadAsync(string base64OrFile, string fileName)
        {
            try
            {
                var base64Data = base64OrFile;
                if (base64OrFile.Contains(","))
                {
                    base64Data = base64OrFile.Split(',')[1];
                }

                // If it is not a base64 string but a URL, return it directly
                if (!base64OrFile.StartsWith("data:image") && Uri.IsWellFormedUriString(base64OrFile, UriKind.Absolute))
                {
                    return base64OrFile;
                }

                var bytes = Convert.FromBase64String(base64Data);

                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, fileName);
                await File.WriteAllBytesAsync(filePath, bytes);

                var request = _httpContextAccessor.HttpContext?.Request;
                if (request != null)
                {
                    var scheme = request.Scheme;
                    var host = request.Host;
                    return $"{scheme}://{host}/uploads/{fileName}";
                }

                return $"/uploads/{fileName}";
            }
            catch
            {
                // Fallback to returning the input if parsing fails (e.g. if it is already a URL)
                return base64OrFile;
            }
        }
    }
}
