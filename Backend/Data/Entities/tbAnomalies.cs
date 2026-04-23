using System;
using System.Collections.Generic;

namespace Infrastructure.Data.Entities;

public partial class tbAnomalies
{
    public int nId { get; set; }

    public string sTitle { get; set; } = null!;

    public string sDescription { get; set; } = null!;

    public string sSeverity { get; set; } = null!;

    public string sType { get; set; } = null!;

    public int? nTransactionId { get; set; }

    public DateTime? dDetectedAt { get; set; }

    public bool? isReviewed { get; set; }

    public virtual tbTransactions? nTransaction { get; set; }
}
