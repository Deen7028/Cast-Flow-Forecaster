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
                .Include(x => x.nRecurringRule)
                .Where(x => x.isActive == true)
                .Select(t => new
                {
                    nTransactionsId = t.nTransactionsId,
                    sDescription = t.sDescription,
                    nAmount = t.nAmount,
                    sType = t.sType,
                    dDate = t.dTransactionDate,
                    nCategoryId = t.nCategoryId,
                    sCategoryName = t.nCategory != null ? t.nCategory.sName : "General",
                    sCategoryType = t.nCategory != null ? t.nCategory.sType : t.sType,
                    sStatus = t.sStatus,
                    sRecurringRuleName = t.nRecurringRule != null ? t.nRecurringRule.sName : null,
                    nRecurringRuleId = t.nRecurringRuleId,
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

        public object GetCategories()
        {
            var lstData = _objContext.tmCategories
                .Where(x => x.isActive == true)
                .Select(x => new
                {
                    nCategoriesId = x.nCategoriesId,
                    sName = x.sName,
                    sType = x.sType
                })
                .ToList();
            return new { status = "success", data = lstData };
        }

        public object GetRecurringRules()
        {
            var lstData = _objContext.tbRecurringRules
                .Where(x => x.isActive == true)
                .Select(x => new
                {
                    nRecurringRulesId = x.nRecurringRulesId,
                    sName = x.sName,
                    nAmount = x.nAmount,
                    sFrequency = x.sFrequency
                })
                .ToList();
            return new { status = "success", data = lstData };
        }

        public object SaveCategory(CategoryInputDto req)
        {
            if (req.nCategoriesId == 0)
            {
                var objNew = new tmCategories
                {
                    sName = req.sName,
                    sType = req.sType,
                    isActive = true
                };
                _objContext.tmCategories.Add(objNew);
            }
            else
            {
                var objEdit = _objContext.tmCategories.Find(req.nCategoriesId);
                if (objEdit == null) throw new Exception("ไม่พบหมวดหมู่");
                objEdit.sName = req.sName;
                objEdit.sType = req.sType;
                objEdit.isActive = true;
            }
            _objContext.SaveChanges();
            return new { status = "success", message = "บันทึกหมวดหมู่เรียบร้อย" };
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
                    nCategoryId = req.nCategoryId > 0 ? req.nCategoryId : 1,
                    sStatus = req.sStatus,
                    isActive = true,
                    dCreatedAt = DateTime.Now,
                    nRecurringRuleId = req.nRecurringRuleId > 0 ? req.nRecurringRuleId : null,
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
                if (req.nCategoryId > 0) objEdit.nCategoryId = req.nCategoryId;
                objEdit.isActive = true;
                objEdit.nRecurringRuleId = req.nRecurringRuleId > 0 ? req.nRecurringRuleId : null;

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
            return new { status = "success", message = "ลบรายการเรียบร้อย" };
        }
    }
}