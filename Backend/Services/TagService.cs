using Backend.Interfaces;
using Backend.Data.Context;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Data.Entities;

namespace Backend.Services
{
    public class TagService : ITagService
    {
        private readonly WebAppDbContext _objContext;

        public TagService(WebAppDbContext objContext)
        {
            _objContext = objContext;
        }

        public object GetTagsSummaryAsync()
        {

            var rawTags = _objContext.tmTags
            .Include(t => t.nTransaction)
            .ToList();

            var lstTags = rawTags.Select(t => new
            {
                nId = t.nId,
                sName = t.sName,
                sColorCode = t.sColorCode,
                isActive = t.isActive ?? false,

                // เนื่องจาก nAmount เป็น decimal อยู่แล้ว ไม่ต้อง cast (decimal?) แล้วครับ
                nTotalIncome = t.nTransaction
                    .Where(tx => tx.sType == "INCOME" && tx.sStatus == "Confirmed")
                    .Sum(tx => tx.nAmount),

                nTotalExpense = t.nTransaction
                    .Where(tx => tx.sType == "EXPENSE" && tx.sStatus == "Confirmed")
                    .Sum(tx => tx.nAmount),

                nNet = t.nTransaction.Where(tx => tx.sType == "INCOME" && tx.sStatus == "Confirmed").Sum(tx => tx.nAmount) -
                       t.nTransaction.Where(tx => tx.sType == "EXPENSE" && tx.sStatus == "Confirmed").Sum(tx => tx.nAmount),

                nTransactionCount = t.nTransaction.Count()
            }).ToList();

            return lstTags;
        }

        public object SaveTagAsync(TagInputDto req)
        {
            if (req.nId == 0)
            {

                var newTag = new tmTags
                {
                    sName = req.sName,
                    sColorCode = req.sColorCode,
                    isActive = req.isActive
                };
                _objContext.tmTags.Add(newTag);
            }
            else
            {
                // เคสแก้ไข (Update)
                var existingTag = _objContext.tmTags.Find(req.nId);
                if (existingTag == null) throw new Exception("ไม่พบข้อมูล Tag ที่ต้องการแก้ไข");

                existingTag.sName = req.sName;
                existingTag.sColorCode = req.sColorCode;
                existingTag.isActive = req.isActive;
                _objContext.tmTags.Update(existingTag);
            }
            _objContext.SaveChanges();
            return new { status = "success", message = "บันทึกข้อมูลเรียบร้อย" };
        }
    }
}