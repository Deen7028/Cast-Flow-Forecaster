using System;
using System.Collections.Generic;
using Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Context;

public partial class WebAppDbContext : DbContext
{
    public WebAppDbContext(DbContextOptions<WebAppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<tbAnomalies> tbAnomalies { get; set; }

    public virtual DbSet<tbAuditLogs> tbAuditLogs { get; set; }

    public virtual DbSet<tbRecurringRules> tbRecurringRules { get; set; }

    public virtual DbSet<tbScenarioAdjustments> tbScenarioAdjustments { get; set; }

    public virtual DbSet<tbScenarios> tbScenarios { get; set; }

    public virtual DbSet<tbTransactions> tbTransactions { get; set; }

    public virtual DbSet<tmCategories> tmCategories { get; set; }

    public virtual DbSet<tmSystemSettings> tmSystemSettings { get; set; }

    public virtual DbSet<tmTags> tmTags { get; set; }

    public virtual DbSet<tmUsers> tmUsers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<tbAnomalies>(entity =>
        {
            entity.HasKey(e => e.nId).HasName("PK__tbAnomal__DF98CDDDAC773F77");

            entity.Property(e => e.dDetectedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.isReviewed).HasDefaultValue(false);
            entity.Property(e => e.sSeverity)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.sTitle).HasMaxLength(200);
            entity.Property(e => e.sType)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.nTransaction).WithMany(p => p.tbAnomalies)
                .HasForeignKey(d => d.nTransactionId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbAnomalies_tbTransactions");
        });

        modelBuilder.Entity<tbAuditLogs>(entity =>
        {
            entity.HasKey(e => e.nId).HasName("PK__tbAuditL__DF98CDDD6CB6F20D");

            entity.Property(e => e.dActionDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.sAction).HasMaxLength(100);
            entity.Property(e => e.sIpAddress)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.nUser).WithMany(p => p.tbAuditLogs)
                .HasForeignKey(d => d.nUserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_tbAuditLogs_tmUsers");
        });

        modelBuilder.Entity<tbRecurringRules>(entity =>
        {
            entity.HasKey(e => e.nId).HasName("PK__tbRecurr__DF98CDDD05797915");

            entity.Property(e => e.dEndDate).HasColumnType("datetime");
            entity.Property(e => e.dNextRunDate).HasColumnType("datetime");
            entity.Property(e => e.dStartDate).HasColumnType("datetime");
            entity.Property(e => e.isActive).HasDefaultValue(true);
            entity.Property(e => e.nAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.nSpikeThreshold)
                .HasDefaultValue(2.0m)
                .HasColumnType("decimal(4, 2)");
            entity.Property(e => e.sFrequency)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.sName).HasMaxLength(100);

            entity.HasOne(d => d.nCategory).WithMany(p => p.tbRecurringRules)
                .HasForeignKey(d => d.nCategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tbRecurringRules_tmCategories");
        });

        modelBuilder.Entity<tbScenarioAdjustments>(entity =>
        {
            entity.HasKey(e => e.nId).HasName("PK__tbScenar__DF98CDDD32DCA5CD");

            entity.Property(e => e.sAdjustedValue)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.sTargetType)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.nScenario).WithMany(p => p.tbScenarioAdjustments)
                .HasForeignKey(d => d.nScenarioId)
                .HasConstraintName("FK_tbScenarioAdjustments_tbScenarios");
        });

        modelBuilder.Entity<tbScenarios>(entity =>
        {
            entity.HasKey(e => e.nId).HasName("PK__tbScenar__DF98CDDDCFA8C601");

            entity.Property(e => e.dCreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.sName).HasMaxLength(100);
            entity.Property(e => e.sStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Draft");
        });

        modelBuilder.Entity<tbTransactions>(entity =>
        {
            entity.HasKey(e => e.nId).HasName("PK__tbTransa__DF98CDDDF8C5B4B4");

            entity.Property(e => e.dCreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.dTransactionDate).HasColumnType("datetime");
            entity.Property(e => e.isAnomaly).HasDefaultValue(false);
            entity.Property(e => e.nAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.sDescription).HasMaxLength(255);
            entity.Property(e => e.sStatus)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.sType)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.nCategory).WithMany(p => p.tbTransactions)
                .HasForeignKey(d => d.nCategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tbTransactions_tmCategories");

            entity.HasOne(d => d.nRecurringRule).WithMany(p => p.tbTransactions)
                .HasForeignKey(d => d.nRecurringRuleId)
                .HasConstraintName("FK_tbTransactions_tbRecurringRules");

            entity.HasMany(d => d.nTag).WithMany(p => p.nTransaction)
                .UsingEntity<Dictionary<string, object>>(
                    "tbTransactionTags",
                    r => r.HasOne<tmTags>().WithMany()
                        .HasForeignKey("nTagId")
                        .HasConstraintName("FK_tbTransactionTags_tmTags"),
                    l => l.HasOne<tbTransactions>().WithMany()
                        .HasForeignKey("nTransactionId")
                        .HasConstraintName("FK_tbTransactionTags_tbTransactions"),
                    j =>
                    {
                        j.HasKey("nTransactionId", "nTagId").HasName("PK__tbTransa__2DC3B09B8830FA25");
                    });
        });

        modelBuilder.Entity<tmCategories>(entity =>
        {
            entity.HasKey(e => e.nId).HasName("PK__tmCatego__DF98CDDDEA29F327");

            entity.Property(e => e.isActive).HasDefaultValue(true);
            entity.Property(e => e.sName).HasMaxLength(100);
            entity.Property(e => e.sType)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tmSystemSettings>(entity =>
        {
            entity.HasKey(e => e.nId).HasName("PK__tmSystem__DF98CDDDA84D54F9");

            entity.Property(e => e.nId).HasDefaultValue(1);
            entity.Property(e => e.dUpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.isAuditLogEnabled).HasDefaultValue(true);
            entity.Property(e => e.isCheckFixedCost).HasDefaultValue(true);
            entity.Property(e => e.isEmailNotifyActive).HasDefaultValue(false);
            entity.Property(e => e.isEnableSpike).HasDefaultValue(true);
            entity.Property(e => e.isTwoFactorEnabled).HasDefaultValue(false);
            entity.Property(e => e.nForecastHorizonDays).HasDefaultValue(45);
            entity.Property(e => e.nSafetyBuffer)
                .HasDefaultValue(3000000m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.nSpikeThreshold)
                .HasDefaultValue(2.5m)
                .HasColumnType("decimal(4, 2)");
            entity.Property(e => e.sCompanyName).HasMaxLength(100);
            entity.Property(e => e.sFiscalYearStart)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.sNotificationEmail).HasMaxLength(100);
            entity.Property(e => e.sTaxId)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<tmTags>(entity =>
        {
            entity.HasKey(e => e.nId).HasName("PK__tmTags__DF98CDDD4AC6668F");

            entity.Property(e => e.isActive).HasDefaultValue(true);
            entity.Property(e => e.sColorCode)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.sName).HasMaxLength(100);
        });

        modelBuilder.Entity<tmUsers>(entity =>
        {
            entity.HasKey(e => e.nId).HasName("PK__tmUsers__DF98CDDDB8DCE167");

            entity.HasIndex(e => e.sUsername, "UQ__tmUsers__3FEB876712903040").IsUnique();

            entity.Property(e => e.dCreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.dLastLogin).HasColumnType("datetime");
            entity.Property(e => e.isActive).HasDefaultValue(true);
            entity.Property(e => e.sEmail).HasMaxLength(100);
            entity.Property(e => e.sFullName).HasMaxLength(100);
            entity.Property(e => e.sRole)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("VIEWER");
            entity.Property(e => e.sUsername).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
