using Backend.Interfaces;
using global::Data.Context;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs.Tags;
using global::Data.Entities;

namespace Backend.Services
{
    public class TagService : ITagService
    {
        private readonly WebAppDbContext _objContext;

        public TagService(WebAppDbContext objContext)
        {
            _objContext = objContext;
        }

        public object GetTagsSummary()
        {
            var lstTags = _objContext.tmTags
                .Select(t => new
                {
                    nTagsId = t.nTagsId,
                    sName = t.sName,
                    sColorCode = t.sColorCode,
                    isActive = t.isActive ?? false,

                    nTotalIncome = t.nTransactionTags
                        .Where(tx => (tx.sType == "INCOME" || tx.sType == "Income") && (tx.sStatus == "Confirmed" || tx.sStatus == "Completed"))
                        .Sum(tx => (decimal?)tx.nAmount) ?? 0,

                    nTotalExpense = t.nTransactionTags
                        .Where(tx => (tx.sType == "EXPENSE" || tx.sType == "Expense") && (tx.sStatus == "Confirmed" || tx.sStatus == "Completed"))
                        .Sum(tx => (decimal?)tx.nAmount) ?? 0,

                    nTransactionCount = t.nTransactionTags.Count()
                })
                .ToList()
                .Select(t => new
                {
                    t.nTagsId,
                    t.sName,
                    t.sColorCode,
                    t.isActive,
                    t.nTotalIncome,
                    t.nTotalExpense,
                    nNet = t.nTotalIncome - t.nTotalExpense,
                    t.nTransactionCount
                })
                .ToList();

            return new { status = "success", data = lstTags };
        }

        public object SaveTag(TagInputDto req)
        {
            if (req.nTagsId == 0)
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
                var existingTag = _objContext.tmTags.Find(req.nTagsId);
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