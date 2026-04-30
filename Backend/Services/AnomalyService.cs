using Backend.DTOs.Anomalies;
using Backend.Interfaces;
using Data.Context;
using Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Services
{
    public class AnomalyService : IAnomalyService
    {
        private readonly WebAppDbContext _objContext;

        public AnomalyService(WebAppDbContext objContext)
        {
            _objContext = objContext;
        }

        public IEnumerable<AnomalyDto> GetActiveAnomalies()
        {
            var lstAnomalies = _objContext.tbAnomalies.ToList();
            if (!lstAnomalies.Any())
            {
                // Seed sample data
                _objContext.tbAnomalies.AddRange(new List<tbAnomalies>
                {
                    new tbAnomalies {
                        sTitle = "AWS Invoice (Aug) สูงกว่าปกติ 3.2x",
                        sDescription = "ตรวจพบ Cloud Cost ผิดปกติ — ค่าใช้จ่ายปัจจุบัน ฿113,600 เทียบค่าเฉลี่ย ฿35,400",
                        sSeverity = "Warning",
                        sType = "Anomaly",
                        dDetectedAt = DateTime.Now.AddHours(-2),
                        isReviewed = false
                    },
                    new tbAnomalies {
                        sTitle = "Office Rent (Aug) ยังไม่พบรายการ",
                        sDescription = "Fixed Cost ประจำเดือน ฿85,000 ครบกำหนดแล้วแต่ยังไม่มีรายการบันทึก",
                        sSeverity = "Critical",
                        sType = "Missing",
                        dDetectedAt = DateTime.Now.AddHours(-1),
                        isReviewed = false
                    }
                });
                _objContext.SaveChanges();
            }

            return _objContext.tbAnomalies
                .Where(x => x.isReviewed == false)
                .OrderByDescending(x => x.dDetectedAt)
                .Select(x => new AnomalyDto
                {
                    nIAnomaliesId = x.nIAnomaliesId,
                    sTitle = x.sTitle,
                    sDescription = x.sDescription,
                    sSeverity = x.sSeverity,
                    sType = x.sType,
                    nTransactionId = x.nTransactionId,
                    dDetectedAt = x.dDetectedAt,
                    isReviewed = x.isReviewed ?? false
                })
                .ToList();
        }

        public bool MarkAsReviewed(int nId)
        {
            var objData = _objContext.tbAnomalies.Find(nId);
            if (objData == null) return false;

            objData.isReviewed = true;
            _objContext.SaveChanges();
            return true;
        }
    }
}
