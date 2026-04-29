export interface RecurringRule {
  nRecurringRulesId: number;
  sName: string;
  nAmount: number;
  sFrequency: string;
  nDayOfMonth?: number | null;
  dStartDate: string;
  dEndDate?: string | null;
  nCategoryId: number;
  categoryName: string;
  categoryType: string;
  nSpikeThreshold?: number | null;
  isActive: boolean;
  dNextRunDate?: string | null;

}

export interface IRecurRuleForm {
  nRecurringRulesId: number;
  sName: string;
  nAmount: number;
  sFrequency: string;
  nDayOfMonth: number;
  dStartDate: string;
  dEndDate: string;
  nCategoryId: string;
  nSpikeThreshold: number;
  isActive: boolean;
}

export interface RuleCardProps {
  title: string;
  status?: string;
  isActive: boolean;
  isSelected?: boolean;
  amount: string;
  type: string;
  categoryType?: string;
  frequency: string;
  date: string;
  nextRunDate?: string | null;
  color: string;
  warning?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleActive?: () => void;
  onSelect?: () => void;
  onViewHistory?: (e: React.MouseEvent) => void;
}