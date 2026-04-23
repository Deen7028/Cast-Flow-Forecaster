using System;
using System.Collections.Generic;

namespace Infrastructure.Data.Entities;

public partial class tmTags
{
    public int nId { get; set; }

    public string sName { get; set; } = null!;

    public string? sColorCode { get; set; }

    public bool? isActive { get; set; }

    public virtual ICollection<tbTransactions> nTransaction { get; set; } = new List<tbTransactions>();
}
