namespace Backend.DTOs.Recurring;

public class CreateRecurringRuleDto
{
    public int? nRecurringRulesId { get; set; }
    public string sName { get; set; } = null!;
    public decimal nAmount { get; set; }
    public string sFrequency { get; set; } = null!;
    public int? nDayOfMonth { get; set; }
    public DateTime dStartDate { get; set; }
    public DateTime? dEndDate { get; set; }
    public int nCategoryId { get; set; }
    public decimal? nSpikeThreshold { get; set; }
    public bool? isActive { get; set; }
}
