using Backend.Models;

namespace Backend.Interfaces
{
    public interface ITagService
    {
        object GetTagsSummaryAsync();
        object SaveTagAsync(TagInputDto req);
    }
}