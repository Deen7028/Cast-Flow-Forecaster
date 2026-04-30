using System;

namespace Backend.DTOs.Anomalies
{
    public class AnomalyDto
    {
        public int nIAnomaliesId { get; set; }
        public string sTitle { get; set; } = null!;
        public string sDescription { get; set; } = null!;
        public string sSeverity { get; set; } = null!;
        public string sType { get; set; } = null!;
        public int? nTransactionId { get; set; }
        public DateTime? dDetectedAt { get; set; }
        public bool isReviewed { get; set; }
    }
}
