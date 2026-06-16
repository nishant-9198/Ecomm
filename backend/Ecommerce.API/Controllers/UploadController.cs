using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using Ecommerce.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Ecommerce.API.Controllers
{
    [ApiController]
    [Route("api/upload")]
    public class UploadController : ControllerBase
    {
        private readonly IUploadService _uploadService;

        public UploadController(IUploadService uploadService)
        {
            _uploadService = uploadService;
        }

        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { Message = "No file uploaded ❌" });
            }

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            var bytes = ms.ToArray();
            var base64 = Convert.ToBase64String(bytes);
            var mimeType = file.ContentType;
            var dataUrl = $"data:{mimeType};base64,{base64}";

            var fileUrl = await _uploadService.UploadAsync(dataUrl, fileName);
            return Ok(new { Url = fileUrl });
        }

        public class Base64UploadRequest
        {
            public string Base64 { get; set; } = string.Empty;
            public string FileName { get; set; } = string.Empty;
        }

        [HttpPost("base64")]
        public async Task<IActionResult> UploadBase64([FromBody] Base64UploadRequest request)
        {
            if (string.IsNullOrEmpty(request.Base64))
            {
                return BadRequest(new { Message = "No base64 data provided ❌" });
            }

            var fileName = string.IsNullOrEmpty(request.FileName) 
                ? $"{Guid.NewGuid()}.jpg" 
                : request.FileName;

            var fileUrl = await _uploadService.UploadAsync(request.Base64, fileName);
            return Ok(new { Url = fileUrl });
        }
    }
}
