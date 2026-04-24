using Backend.Interfaces;
using Backend.DTOs.Transaction;
using Backend.Data.Context;
using Microsoft.EntityFrameworkCore;
using Backend.Data.Entities;

namespace Backend.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly WebAppDbContext _objContext;

        public TransactionService(WebAppDbContext objContext)
        {
            _objContext = objContext;
        }

        public object GetTransactions()
        {
            var lstData = _objContext.tbTransactions
                .Include(x => x.nTag)
                .Include(x => x.nCategory)
                .Select(t => new
                {
                    nId = t.nId,
                    sDescription = t.sDescription,
                    nAmount = t.nAmount,
                    sType = t.sType,
                    dDate = t.dTransactionDate,
                    nCategoryId = t.nCategoryId,
                    sCategoryName = t.nCategory.sName,
                    sStatus = t.sStatus,
                    // ดึงข้อมูล Tag แรกเพื่อความเข้ากันได้กับ Frontend เดิม
                    nTagId = t.nTag.OrderBy(x => x.nId).Select(x => x.nId).FirstOrDefault(),
                    sTagName = t.nTag.OrderBy(x => x.nId).Select(x => x.sName).FirstOrDefault(),
                    sTagColor = t.nTag.OrderBy(x => x.nId).Select(x => x.sColorCode).FirstOrDefault(),
                    // และส่งรายการทั้งหมดไปด้วย
                    lstTags = t.nTag.Select(x => new
                    {
                        nId = x.nId,
                        sName = x.sName,
                        sColorCode = x.sColorCode
                    }).ToList()
                })
                .OrderByDescending(x => x.dDate)
                .ToList();

            return new { status = "success", data = lstData };
        }

        public object SaveTransaction(TransactionInputDto req)
        {
            if (req.nId == 0)
            {
                var objNew = new tbTransactions
                {
                    sDescription = req.sDescription,
                    nAmount = req.nAmount,
                    sType = req.sType,
                    dTransactionDate = req.dDate,
                    nCategoryId = 1,
                    sStatus = "Completed"
                };

                if (req.nTagId > 0)
                {
                    var objTag = _objContext.tmTags.Find(req.nTagId);
                    if (objTag != null) objNew.nTag.Add(objTag);
                }

                _objContext.tbTransactions.Add(objNew);
            }
            else
            {
                // เคสแก้ไข
                var objEdit = _objContext.tbTransactions
                    .Include(x => x.nTag)
                    .FirstOrDefault(x => x.nId == req.nId);

                if (objEdit == null) throw new Exception("ไม่พบรายการ");

                objEdit.sDescription = req.sDescription;
                objEdit.nAmount = req.nAmount;
                objEdit.sType = req.sType;
                objEdit.dTransactionDate = req.dDate;

                // อัปเดต Tag
                objEdit.nTag.Clear();
                if (req.nTagId > 0)
                {
                    var objTag = _objContext.tmTags.Find(req.nTagId);
                    if (objTag != null) objEdit.nTag.Add(objTag);
                }
            }

            _objContext.SaveChanges();
            return new { status = "success", message = "บันทึกธุรกรรมเรียบร้อย" };
        }
    }
}