import { InboxIcon } from 'lucide-react';
export function EmptyState({ message = '데이터가 없습니다.' }) {
    return (<div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <InboxIcon className="h-12 w-12 mb-4 opacity-40"/>
      <p className="text-sm">{message}</p>
    </div>);
}
