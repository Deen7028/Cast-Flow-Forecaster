export interface IKpiCardProps {
    sTitle: string;
    sValue: string;
    sValueColor: string;
    sTopBorderColor: string;
    sSubtextPrefix?: string;
    sSubtextPrefixColor?: string;
    sSubtextSuffix?: string;
    sBottomLeftText: string;
    nProgress?: number;
    sProgressColor?: string;
    sBottomRightText: string;
    sBottomRightColor?: string;
}