import { Card, CardContent } from '@/components/ui/card';
export function KpiCard({ title, value, icon: Icon, description, trend }) {
    return (<Card className="bg-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            {trend && (<p className={`text-xs font-medium ${trend.value >= 0 ? 'text-success' : 'text-destructive'}`}>
                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
              </p>)}
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary"/>
          </div>
        </div>
      </CardContent>
    </Card>);
}
