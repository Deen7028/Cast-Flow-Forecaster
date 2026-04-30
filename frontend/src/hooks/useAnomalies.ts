import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { anomalyService, AnomalyAlert, DetectionRule } from '@/services/anomaly.service';
import { ITransaction } from '@/interfaces';

export const useAnomalies = () => {
  const router = useRouter();
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
  const [rules, setRules] = useState<DetectionRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<DetectionRule | null>(null);

  // Transaction Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [prefilledData, setPrefilledData] = useState<ITransaction | null>(null);
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const [fetchedAlerts, fetchedRules] = await Promise.all([
        anomalyService.getAlerts(),
        anomalyService.getRules()
      ]);
      setAlerts(fetchedAlerts);
      setRules(fetchedRules);
      window.dispatchEvent(new CustomEvent('refreshAnomalyCount'));
    } catch (error: any) {
      console.error("Failed to fetch anomalies", error);
      setErrorMsg(error.message || "Failed to load anomalies data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchData();
      // Auto-run detection in background on load
      handleRunDetection();
    };
    init();
  }, []);

  const handleToggleRule = async (id: string, newStatus: boolean) => {
    try {
      await anomalyService.toggleRule(id, newStatus);
      setSuccessMsg("Rule updated successfully");
    } catch (error) {
      console.error("Failed to toggle rule", error);
      throw error; 
    }
  };

  const handleMarkAsReviewed = async (id: string) => {
    try {
      await anomalyService.markAsReviewed(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
      window.dispatchEvent(new CustomEvent('refreshAnomalyCount'));
      setSuccessMsg("Alert marked as reviewed");
    } catch (error) {
      console.error("Failed to mark as reviewed", error);
      setErrorMsg("Failed to update alert status.");
    }
  };

  const handleViewTransaction = (txId: number) => {
    router.push(`/transactions?highlight=${txId}`);
  };

  const handleRecordNow = (alert: AnomalyAlert) => {
    const mockTx: ITransaction = {
      nTransactionsId: 0,
      sDescription: alert.title.replace("Missing Fixed Cost: ", ""),
      nAmount: alert.suggestedAmount || 0,
      sType: "Expense",
      dDate: new Date().toISOString().split('T')[0],
      nCategoryId: alert.suggestedCategoryId || 1,
      nRecurringRuleId: alert.recurringRuleId,
      nTagsId: 0 
    };

    setPrefilledData(mockTx);
    setActiveAlertId(alert.id);
    setIsFormOpen(true);
  };

  const handleTransactionSaved = async () => {
    setIsFormOpen(false);
    setSuccessMsg("Transaction recorded successfully!");
    
    if (activeAlertId) {
      await handleMarkAsReviewed(activeAlertId);
      setActiveAlertId(null);
    }
    
    await fetchData();
  };

  const handleEditRule = (rule: DetectionRule) => {
    setSelectedRule(rule);
    setIsSettingsOpen(true);
  };

  const handleSaveRuleParameters = async (id: string, params: { isActive?: boolean; threshold?: number; fixedCostAlertDay?: number }) => {
    try {
      await anomalyService.updateRuleParameters(id, params);
      setSuccessMsg("Rule settings updated successfully");
      await fetchData(); 
    } catch (error) {
      console.error("Failed to save rule parameters", error);
      setErrorMsg("Failed to save rule settings.");
    }
  };

  const handleRunDetection = async (force: boolean = false) => {
    try {
      setIsDetecting(true);
      await anomalyService.triggerDetection(force);
      await fetchData();
      if (force) setSuccessMsg("Scan completed. Reviewed anomalies have been re-evaluated.");
      else setSuccessMsg("Detection completed. New anomalies identified if any.");
    } catch (error) {
      console.error("Failed to run detection", error);
      setErrorMsg("Failed to run detection process.");
    } finally {
      setIsDetecting(false);
    }
  };

  return {
    alerts,
    rules,
    isLoading,
    isDetecting,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    isSettingsOpen,
    setIsSettingsOpen,
    selectedRule,
    isFormOpen,
    setIsFormOpen,
    prefilledData,
    handleToggleRule,
    handleMarkAsReviewed,
    handleViewTransaction,
    handleRecordNow,
    handleTransactionSaved,
    handleEditRule,
    handleSaveRuleParameters,
    handleRunDetection,
  };
};
