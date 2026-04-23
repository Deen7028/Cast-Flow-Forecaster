using System;
using System.Collections.Generic;

namespace Infrastructure.Data.Entities;

public partial class tbRecurringRules
{
    public int nId { get; set; }

    public string sName { get; set; } = null!;

    public decimal nAmount { get; set; }

    public string sFrequency { get; set; } = null!;

    public int? nDayOfMonth { get; set; }

    public DateTime dStartDate { get; set; }

    public DateTime? dEndDate { get; set; }

    public int nCategoryId { get; set; }

    public decimal? nSpikeThreshold { get; set; }

    public bool? isActive { get; set; }

    public DateTime? dNextRunDate { get; set; }

    public virtual tmCategories nCategory { get; set; } = null!;

    public virtual ICollection<tbTransactions> tbTransactions { get; set; } = new List<tbTransactions>();
}
