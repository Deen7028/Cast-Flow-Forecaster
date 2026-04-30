namespace Backend.DTOs;

public class AnomalyAlertDto
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Severity { get; set; } = "MEDIUM"; // HIGH, MEDIUM, LOW
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Date { get; set; } = DateTime.UtcNow.ToString("MMM dd, yyyy");
    public int? TransactionId { get; set; }
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
}
