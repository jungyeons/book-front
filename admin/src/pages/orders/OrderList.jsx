import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/api/orders';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { FilterBar } from '@/components/common/FilterBar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export default function OrderListPage() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [fulfillmentStatus, setFulfillmentStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { data, isLoading } = useQuery({
        queryKey: ['orders', keyword, paymentStatus, fulfillmentStatus, startDate, endDate, page, pageSize],
        queryFn: () => getOrders({ keyword, paymentStatus, fulfillmentStatus, startDate, endDate, page, pageSize }),
    });
    const columns = [
        { key: 'orderNumber', header: '주문번호', render: o => <span className="font-mono text-sm">{o.orderNumber}</span> },
        { key: 'customerName', header: '고객', sortable: true },
        { key: 'paymentStatus', header: '결제상태', render: o => <StatusBadge status={o.paymentStatus}/> },
        { key: 'fulfillmentStatus', header: '배송상태', render: o => <StatusBadge status={o.fulfillmentStatus}/> },
        { key: 'totalAmount', header: '총액', sortable: true, render: o => <span className="font-medium">₩{o.totalAmount.toLocaleString()}</span> },
        { key: 'createdAt', header: '주문일', sortable: true },
    ];
    return (<div>
      <PageHeader title="주문 관리" description={`총 ${data?.total || 0}건의 주문`}/>
      <FilterBar keyword={keyword} onKeywordChange={v => { setKeyword(v); setPage(1); }} keywordPlaceholder="주문번호/고객명 검색" onReset={() => { setKeyword(''); setPaymentStatus(''); setFulfillmentStatus(''); setStartDate(''); setEndDate(''); setPage(1); }}>
        <Select value={paymentStatus} onValueChange={v => { setPaymentStatus(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-28"><SelectValue placeholder="결제상태"/></SelectTrigger>
          <SelectContent><SelectItem value="all">전체</SelectItem><SelectItem value="결제대기">결제대기</SelectItem><SelectItem value="결제완료">결제완료</SelectItem><SelectItem value="결제취소">결제취소</SelectItem></SelectContent>
        </Select>
        <Select value={fulfillmentStatus} onValueChange={v => { setFulfillmentStatus(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-28"><SelectValue placeholder="배송상태"/></SelectTrigger>
          <SelectContent><SelectItem value="all">전체</SelectItem><SelectItem value="주문접수">주문접수</SelectItem><SelectItem value="상품준비중">상품준비중</SelectItem><SelectItem value="배송중">배송중</SelectItem><SelectItem value="배송완료">배송완료</SelectItem></SelectContent>
        </Select>
        <div className="flex items-end gap-2">
          <div className="space-y-1"><Label className="text-xs">시작일</Label><Input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1); }} className="w-36"/></div>
          <div className="space-y-1"><Label className="text-xs">종료일</Label><Input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1); }} className="w-36"/></div>
        </div>
      </FilterBar>
      <DataTable columns={columns} data={data?.data || []} total={data?.total || 0} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} onRowClick={o => navigate(`/orders/${o.id}`)} loading={isLoading}/>
    </div>);
}
