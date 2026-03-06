import { Input } from '@/components/ui/input';
import { forwardRef } from 'react';
export const CurrencyInput = forwardRef(({ value, onChange, placeholder = '0', disabled, className }, ref) => {
    const display = typeof value === 'number' && value > 0 ? value.toLocaleString('ko-KR') : typeof value === 'string' ? value : '';
    return (<div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₩</span>
        <Input ref={ref} value={display} onChange={e => {
            const raw = e.target.value.replace(/[^\d]/g, '');
            const num = parseInt(raw, 10);
            onChange(isNaN(num) ? 0 : Math.max(0, num));
        }} placeholder={placeholder} disabled={disabled} className={`pl-8 ${className || ''}`}/>
      </div>);
});
CurrencyInput.displayName = 'CurrencyInput';
