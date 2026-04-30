using Backend.DTOs;

namespace Backend.Interfaces;

public interface IAnomalyService
{
    IEnumerable<AnomalyAlertDto> GetAlerts();
    IEnumerable<DetectionRuleDto> GetRules();
    bool ToggleRule(string id, bool isActive);
    bool MarkAsReviewed(int id);
    void RunDetection();
}
