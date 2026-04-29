namespace Backend.DTOs.Transaction
{
    public class CategoryInputDto
    {
        public int nCategoriesId { get; set; }
        public string sName { get; set; } = string.Empty;
        public string sType { get; set; } = string.Empty;
        public bool isActive { get; set; } = true;
    }
}
