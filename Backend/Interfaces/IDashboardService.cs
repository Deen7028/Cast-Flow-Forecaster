using Backend.DTOs.Dashboard;

namespace Backend.Interfaces
{
    public interface IDashboardService
    {
        DashboardMetricsDto GetDashboardMetrics();
    }
}
