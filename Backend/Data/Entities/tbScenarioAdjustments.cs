using System;
using System.Collections.Generic;

namespace Backend.Data.Entities;

public partial class tbScenarioAdjustments
{
    public int nScenarioAdjustmentsId { get; set; }

    public int nScenarioId { get; set; }

    public string sTargetType { get; set; } = null!;

    public int? nTargetId { get; set; }

    public string sAdjustedValue { get; set; } = null!;

    public virtual tbScenarios nScenario { get; set; } = null!;
}
