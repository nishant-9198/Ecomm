using System.Threading.Tasks;

namespace Ecommerce.Application.Interfaces
{
    public interface IUploadService
    {
        Task<string> UploadAsync(string base64OrFile, string fileName);
    }
}
