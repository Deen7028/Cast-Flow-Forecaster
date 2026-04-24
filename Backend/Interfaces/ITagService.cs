using Backend.DTOs.Tags;

namespace Backend.Interfaces
{
    public interface ITagService
    {
        object GetTagsSummary();
        object SaveTag(TagInputDto req);
    }
}