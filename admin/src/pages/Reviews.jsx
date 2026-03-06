import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviews, toggleReviewStatus } from '@/api/reviews';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { FilterBar } from '@/components/common/FilterBar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
export default function ReviewsPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [keyword, setKeyword] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { data, isLoading } = useQuery({ queryKey: ['reviews', keyword, status, page, pageSize], queryFn: () => getReviews({ keyword, status, page, pageSize }) });
    const toggleMut = useMutation({
        mutationFn: toggleReviewStatus,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['reviews'] }); toast({ title: '상태 변경 완료' }); },
    });
    const columns = [
        { key: 'productTitle', header: '상품명', render: r => <span className="font-medium max-w-[200px] truncate block">{r.productTitle}</span> },
        { key: 'customerName', header: '작성자' },
        { key: 'rating', header: '별점', sortable: true, render: r => <span className="text-warning">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span> },
        { key: 'content', header: '내용', render: r => <span className="text-sm text-muted-foreground max-w-[300px] truncate block">{r.content}</span> },
        { key: 'createdAt', header: '작성일', sortable: true },
        { key: 'status', header: '상태', render: r => (<div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
        <Switch checked={r.status === '노출'} onCheckedChange={() => toggleMut.mutate(r.id)} aria-label="노출 토글"/>
        <StatusBadge status={r.status}/>
      </div>) },
    ];
    return (<div>
      <PageHeader title="리뷰 관리" description={`총 ${data?.total || 0}건`}/>
      <FilterBar keyword={keyword} onKeywordChange={v => { setKeyword(v); setPage(1); }} keywordPlaceholder="상품명/작성자/내용 검색" onReset={() => { setKeyword(''); setStatus(''); setPage(1); }}>
        <Select value={status} onValueChange={v => { setStatus(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-28"><SelectValue placeholder="상태"/></SelectTrigger>
          <SelectContent><SelectItem value="all">전체</SelectItem><SelectItem value="노출">노출</SelectItem><SelectItem value="숨김">숨김</SelectItem></SelectContent>
        </Select>
      </FilterBar>
      <DataTable columns={columns} data={data?.data || []} total={data?.total || 0} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} loading={isLoading}/>
    </div>);
}
