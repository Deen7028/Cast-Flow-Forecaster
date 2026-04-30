using System;
using System.Collections.Generic;

namespace Data.Entities;

public partial class tbTransactions
{
    public int nTransactionsId { get; set; }

    public string sType { get; set; } = null!;

    public int nCategoryId { get; set; }

    public string sDescription { get; set; } = null!;

    public decimal nAmount { get; set; }

    public DateTime dTransactionDate { get; set; }

    public string sStatus { get; set; }

    public string? sNotes { get; set; }

    public int? nRecurringRuleId { get; set; }

    public bool? isAnomaly { get; set; }

    public DateTime? dCreatedAt { get; set; }

    public bool isActive { get; set; }

    public virtual tmCategories nCategory { get; set; } = null!;

    public virtual tbRecurringRules? nRecurringRule { get; set; }

    public virtual ICollection<tbAnomalies> tbAnomalies { get; set; } = new List<tbAnomalies>();

    public virtual ICollection<tmTags> nTag { get; set; } = new List<tmTags>();
}
