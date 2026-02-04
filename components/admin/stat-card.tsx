import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    trend?: number;
    trendLabel?: string;
}

export default function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendLabel
}: StatCardProps) {
    return (
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <p className="text-muted-foreground text-sm font-medium">{title}</p>
                {Icon && (
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <Icon size={20} className="text-accent" />
                    </div>
                )}
            </div>

            <p className="text-4xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent mb-2">
                {value}
            </p>

            {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}

            {trend !== undefined && (
                <div className="mt-3 pt-3 border-t border-border/50">
                    <span className={`text-xs font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                    {trendLabel && (
                        <span className="text-xs text-muted-foreground ml-2">{trendLabel}</span>
                    )}
                </div>
            )}
        </Card>
    );
}
