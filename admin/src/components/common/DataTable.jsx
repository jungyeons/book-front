import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
export function DataTable({ columns, data, total, page, pageSize, onPageChange, onPageSizeChange, selectable, selectedIds = [], onSelectionChange, onRowClick, getId = (item) => item.id, loading, emptyMessage, }) {
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const handleSort = (key) => {
        if (sortKey === key)
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else {
            setSortKey(key);
            setSortDir('asc');
        }
    };
    let sortedData = [...data];
    if (sortKey) {
        sortedData.sort((a, b) => {
            const av = a[sortKey], bv = b[sortKey];
            const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }
    const allSelected = data.length > 0 && data.every(item => selectedIds.includes(getId(item)));
    if (loading) {
        return (<div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full"/>)}
      </div>);
    }
    return (<div className="space-y-4">
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {selectable && (<TableHead className="w-12">
                  <Checkbox checked={allSelected} onCheckedChange={(checked) => {
                onSelectionChange?.(checked ? data.map(getId) : []);
            }} aria-label="전체 선택"/>
                </TableHead>)}
              {columns.map(col => (<TableHead key={col.key} style={col.width ? { width: col.width } : undefined}>
                  {col.sortable ? (<button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort(col.key)}>
                      {col.header}
                      <ArrowUpDown className="h-3 w-3"/>
                    </button>) : col.header}
                </TableHead>))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (<TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)}>
                  <EmptyState message={emptyMessage}/>
                </TableCell>
              </TableRow>) : sortedData.map(item => {
            const id = getId(item);
            return (<TableRow key={id} className={`cursor-pointer hover:bg-muted/50 transition-colors ${selectedIds.includes(id) ? 'bg-primary/5' : ''}`} onClick={() => onRowClick?.(item)}>
                  {selectable && (<TableCell onClick={e => e.stopPropagation()}>
                      <Checkbox checked={selectedIds.includes(id)} onCheckedChange={(checked) => {
                        onSelectionChange?.(checked ? [...selectedIds, id] : selectedIds.filter(x => x !== id));
                    }} aria-label={`행 ${id} 선택`}/>
                    </TableCell>)}
                  {columns.map(col => (<TableCell key={col.key}>
                      {col.render ? col.render(item) : item[col.key]}
                    </TableCell>))}
                </TableRow>);
        })}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>페이지당</span>
          <Select value={String(pageSize)} onValueChange={v => { onPageSizeChange(Number(v)); onPageChange(1); }}>
            <SelectTrigger className="w-20 h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span>총 {total}건</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="이전 페이지">
            <ChevronLeft className="h-4 w-4"/>
          </Button>
          <span className="text-sm px-3">{page} / {totalPages}</span>
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} aria-label="다음 페이지">
            <ChevronRight className="h-4 w-4"/>
          </Button>
        </div>
      </div>
    </div>);
}
