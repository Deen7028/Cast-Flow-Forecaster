namespace Backend.DTOs;

public class AnomalyAlertDto
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Severity { get; set; } = "MEDIUM"; // HIGH, MEDIUM, LOW
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Date { get; set; } = DateTime.UtcNow.ToString("MMM dd, yyyy");
    public int? TransactionId { get; set; }
    public decimal? SuggestedAmount { get; set; }
    public int? SuggestedCategoryId { get; set; }
    public int? RecurringRuleId { get; set; }
    public List<AnomalyTagDto> Tags { get; set; } = new();
}

public class AnomalyTagDto
{
    public string Label { get; set; } = string.Empty;
}

public class DetectionRuleDto
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public decimal? Threshold { get; set; } // สำหรับบาง Rule ที่มีค่า Threshold
    public int? FixedCostAlertDay { get; set; } // วันที่เริ่มเตือนสำหรับ Fixed Cost
}

public class UpdateRuleParametersDto
{
    public decimal? Threshold { get; set; }
    public int? FixedCostAlertDay { get; set; }
}
