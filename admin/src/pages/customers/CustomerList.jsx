import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '@/api/customers';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { FilterBar } from '@/components/common/FilterBar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export default function CustomerListPage() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [grade, setGrade] = useState('');
    const [status, setStatus] = useState('');
    const [role, setRole] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { data, isLoading } = useQuery({
        queryKey: ['customers', keyword, grade, status, role, page, pageSize],
        queryFn: () => getCustomers({ keyword, grade, status, role, page, pageSize }),
    });
    const columns = [
        { key: 'name', header: '이름', sortable: true, render: c => <span className="font-medium">{c.name}</span> },
        { key: 'email', header: '이메일' },
        { key: 'status', header: '회원상태', render: c => <StatusBadge status={c.status}/> },
        { key: 'memberRole', header: '권한', render: c => <StatusBadge status={c.memberRole}/> },
        { key: 'grade', header: '등급', render: c => <StatusBadge status={c.grade}/> },
        { key: 'totalOrders', header: '주문수', sortable: true, render: c => `${c.totalOrders}건` },
        { key: 'totalSpent', header: '누적금액', sortable: true, render: c => `₩${c.totalSpent.toLocaleString()}` },
        { key: 'lastOrderAt', header: '최근주문', sortable: true },
    ];
    return (<div>
      <PageHeader title="고객 관리" description={`총 ${data?.total || 0}명`}/>
      <FilterBar keyword={keyword} onKeywordChange={v => { setKeyword(v); setPage(1); }} keywordPlaceholder="이름/이메일 검색" onReset={() => { setKeyword(''); setGrade(''); setStatus(''); setRole(''); setPage(1); }}>
        <Select value={grade} onValueChange={v => { setGrade(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-28"><SelectValue placeholder="등급"/></SelectTrigger>
          <SelectContent><SelectItem value="all">전체</SelectItem><SelectItem value="일반">일반</SelectItem><SelectItem value="VIP">VIP</SelectItem><SelectItem value="VVIP">VVIP</SelectItem></SelectContent>
        </Select>
        <Select value={status} onValueChange={v => { setStatus(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-28"><SelectValue placeholder="상태"/></SelectTrigger>
          <SelectContent><SelectItem value="all">전체</SelectItem><SelectItem value="활성">활성</SelectItem><SelectItem value="정지">정지</SelectItem></SelectContent>
        </Select>
        <Select value={role} onValueChange={v => { setRole(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-32"><SelectValue placeholder="권한"/></SelectTrigger>
          <SelectContent><SelectItem value="all">전체</SelectItem><SelectItem value="일반회원">일반회원</SelectItem><SelectItem value="VIP회원">VIP회원</SelectItem><SelectItem value="VVIP회원">VVIP회원</SelectItem></SelectContent>
        </Select>
      </FilterBar>
      <DataTable columns={columns} data={data?.data || []} total={data?.total || 0} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} onRowClick={c => navigate(`/customers/${c.id}`)} loading={isLoading}/>
    </div>);
}
