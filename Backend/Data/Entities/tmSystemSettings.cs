using System;
using System.Collections.Generic;

namespace Data.Entities;

public partial class tmSystemSettings
{
    public int nSystemSettingsId { get; set; }

    public string? sCompanyName { get; set; }

    public string? sTaxId { get; set; }

    public string? sFiscalYearStart { get; set; }

    public decimal? nSafetyBuffer { get; set; }

    public bool? isEnableSpike { get; set; }

    public decimal? nSpikeThreshold { get; set; }

    public bool? isCheckFixedCost { get; set; }

    public int? nForecastHorizonDays { get; set; }

    public bool? isEmailNotifyActive { get; set; }

    public string? sNotificationEmail { get; set; }

    public string? sWebhookUrl { get; set; }

    public bool? isTwoFactorEnabled { get; set; }

    public bool? isAuditLogEnabled { get; set; }

    public DateTime? dUpdatedAt { get; set; }
}
