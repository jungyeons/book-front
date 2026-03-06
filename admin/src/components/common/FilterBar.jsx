import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RotateCcw, Search } from 'lucide-react';
export function FilterBar({ keyword, onKeywordChange, keywordPlaceholder = '검색...', onReset, children }) {
    return (<div className="flex flex-wrap gap-3 items-end p-4 bg-card rounded-lg border mb-4">
      {onKeywordChange !== undefined && (<div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
          <Input value={keyword || ''} onChange={e => onKeywordChange(e.target.value)} placeholder={keywordPlaceholder} className="pl-9"/>
        </div>)}
      {children}
      {onReset && (<Button variant="ghost" size="sm" onClick={onReset} aria-label="필터 초기화">
          <RotateCcw className="h-4 w-4 mr-1"/>
          초기화
        </Button>)}
    </div>);
}
