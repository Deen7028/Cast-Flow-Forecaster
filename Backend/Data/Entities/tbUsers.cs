using System;
using System.Collections.Generic;

namespace Backend.Data.Entities;

public partial class tbUsers
{
    public int nUsersId { get; set; }

    public string sUsername { get; set; } = null!;

    public string sPasswordHash { get; set; } = null!;

    public string? sFullName { get; set; }

    public string? sEmail { get; set; }

    public string sRole { get; set; } = null!;

    public bool? isActive { get; set; }

    public DateTime? dLastLogin { get; set; }

    public DateTime? dCreatedAt { get; set; }

    public virtual ICollection<tbAuditLogs> tbAuditLogs { get; set; } = new List<tbAuditLogs>();
}
