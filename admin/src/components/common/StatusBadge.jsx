import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusMap = {
  OPEN: 'warning',
  ANSWERED: 'success',
  ACTIVE: 'success',
  VISIBLE: 'success',
  PAID: 'success',
  DELIVERED: 'success',
  PENDING: 'warning',
  PREPARING: 'warning',
  SHIPPING: 'info',
  RECEIVED: 'info',
  CANCELED: 'danger',
  CANCELLED: 'danger',
  HIDDEN: 'danger',
  SUSPENDED: 'danger',
  EXPIRED: 'danger',
  입고: 'success',
  출고: 'danger',
  조정: 'info',
};

const variantClasses = {
  success: 'bg-success/10 text-success border-success/20 hover:bg-success/10',
  warning: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/10',
  danger: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10',
  info: 'bg-info/10 text-info border-info/20 hover:bg-info/10',
  muted: 'bg-muted text-muted-foreground border-muted hover:bg-muted',
};

export function StatusBadge({ status, className }) {
  const normalized = String(status || '').trim();
  const variant = statusMap[normalized] || 'muted';

  return (
    <Badge
      variant="outline"
      className={cn('font-medium text-xs', variantClasses[variant], className)}
    >
      {normalized || '-'}
    </Badge>
  );
}
