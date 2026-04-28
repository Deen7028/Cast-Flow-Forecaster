using System;
using System.Collections.Generic;

namespace Data.Entities;

public partial class tbAuditLogs
{
    public long nAuditLogsId { get; set; }

    public int? nUserId { get; set; }

    public string sAction { get; set; } = null!;

    public string? sDescription { get; set; }

    public string? sIpAddress { get; set; }

    public DateTime? dActionDate { get; set; }

    public virtual tbUsers? nUser { get; set; }
}
