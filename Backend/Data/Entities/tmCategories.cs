using System;
using System.Collections.Generic;

namespace Infrastructure.Data.Entities;

public partial class tmCategories
{
    public int nId { get; set; }

    public string sName { get; set; } = null!;

    public string sType { get; set; } = null!;

    public bool? isActive { get; set; }

    public virtual ICollection<tbRecurringRules> tbRecurringRules { get; set; } = new List<tbRecurringRules>();

    public virtual ICollection<tbTransactions> tbTransactions { get; set; } = new List<tbTransactions>();
}
