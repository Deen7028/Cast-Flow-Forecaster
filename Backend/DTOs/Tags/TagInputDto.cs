namespace Backend.DTOs.Tags
{
    public class TagInputDto
    {
        public int nId { get; set; } // ถ้าเป็น 0 คือสร้างใหม่
        public string sName { get; set; } = string.Empty;
        public string sColorCode { get; set; } = "#00e5a0";
        public bool isActive { get; set; } = true;
    }
}