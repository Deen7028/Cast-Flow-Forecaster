using System;
using System.Collections.Generic;

namespace Backend.Data.Entities;

public partial class tbScenarios
{
    public int nId { get; set; }

    public string sName { get; set; } = null!;

    public string? sStatus { get; set; }

    public DateTime? dCreatedAt { get; set; }

    public virtual ICollection<tbScenarioAdjustments> tbScenarioAdjustments { get; set; } = new List<tbScenarioAdjustments>();
}
