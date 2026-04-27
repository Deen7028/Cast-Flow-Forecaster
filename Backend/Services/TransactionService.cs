using Backend.Interfaces;
using Backend.DTOs.Transaction;
using global::Data.Context;
using Microsoft.EntityFrameworkCore;
using global::Data.Entities;

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
                .Where(x => x.isActive == true)
                .Select(t => new
                {
                    nTransactionsId = t.nTransactionsId,
                    sDescription = t.sDescription,
                    nAmount = t.nAmount,
                    sType = t.sType,
                    dDate = t.dTransactionDate,
                    nCategoryId = t.nCategoryId,
                    sCategoryName = t.nCategory.sName,
                    sStatus = t.sStatus,
                    // ดึงข้อมูล Tag แรกเพื่อความเข้ากันได้กับ Frontend เดิม
                    nTagsId = t.nTag.OrderBy(x => x.nTagsId).Select(x => x.nTagsId).FirstOrDefault(),
                    sTagName = t.nTag.OrderBy(x => x.nTagsId).Select(x => x.sName).FirstOrDefault(),
                    sTagColor = t.nTag.OrderBy(x => x.nTagsId).Select(x => x.sColorCode).FirstOrDefault(),
                    // และส่งรายการทั้งหมดไปด้วย
                    lstTags = t.nTag.Select(x => new
                    {
                        nTagsId = x.nTagsId,
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
            if (req.nTransactionsId == 0)
            {
                var objNew = new tbTransactions
                {
                    sDescription = req.sDescription,
                    nAmount = req.nAmount,
                    sType = req.sType,
                    dTransactionDate = req.dDate,
                    nCategoryId = 1,
                    sStatus = req.sStatus
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
                    .FirstOrDefault(x => x.nTransactionsId == req.nTransactionsId);

                if (objEdit == null) throw new Exception("ไม่พบรายการ");

                objEdit.sDescription = req.sDescription;
                objEdit.nAmount = req.nAmount;
                objEdit.sType = req.sType;
                objEdit.dTransactionDate = req.dDate;
                objEdit.sStatus = req.sStatus;

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

        public object DeleteTransaction(int nTransactionsId)
        {
            var objData = _objContext.tbTransactions.Find(nTransactionsId);
            if (objData != null)
            {
                objData.isActive = false;
                _objContext.SaveChanges();
            }
            return new { status = "success",message = "ลบรายการเรียบร้อย" };
        }
    }
}