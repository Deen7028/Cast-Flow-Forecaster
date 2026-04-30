using Backend.DTOs.Anomalies;
using System.Collections.Generic;

namespace Backend.Interfaces
{
    public interface IAnomalyService
    {
        IEnumerable<AnomalyDto> GetActiveAnomalies();
        bool MarkAsReviewed(int nId);
    }
}
