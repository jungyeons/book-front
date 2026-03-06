import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAccessLogs } from '@/api/monitoring';
import { DataTable } from '@/components/common/DataTable';
import { FilterBar } from '@/components/common/FilterBar';
import { PageHeader } from '@/components/common/PageHeader';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const methodColors = {
  LOGIN: 'bg-success/10 text-success border-success/20',
  LOGIN_FAIL: 'bg-destructive/10 text-destructive border-destructive/20',
  GET: 'bg-info/10 text-info border-info/20',
  POST: 'bg-warning/10 text-warning border-warning/20',
  PATCH: 'bg-warning/10 text-warning border-warning/20',
  PUT: 'bg-warning/10 text-warning border-warning/20',
  DELETE: 'bg-destructive/10 text-destructive border-destructive/20',
};

function MethodBadge({ value }) {
  const method = String(value || '').toUpperCase();
  const cls = methodColors[method] || 'bg-muted text-muted-foreground border-muted';
  return (
    <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${cls}`}>
      {method || '-'}
    </span>
  );
}

export default function MonitoringPage() {
  const [keyword, setKeyword] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [method, setMethod] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ['monitoring-access-logs', keyword, endpoint, method, ipAddress, page, pageSize],
    queryFn: () =>
      getAccessLogs({
        keyword,
        endpoint,
        method,
        ipAddress,
        page,
        pageSize,
      }),
  });

  const columns = [
    { key: 'createdAt', header: '접속시각', sortable: true },
    {
      key: 'userName',
      header: '사용자',
      render: (row) => (
        <div>
          <p className="font-medium">{row.userName || 'Unknown'}</p>
          <p className="text-xs text-muted-foreground">
            {row.userEmail || row.userId || '-'}
          </p>
        </div>
      ),
    },
    { key: 'ipAddress', header: 'IP 주소' },
    {
      key: 'method',
      header: '이벤트',
      render: (row) => <MethodBadge value={row.method} />,
    },
    {
      key: 'endpoint',
      header: '엔드포인트',
      render: (row) => <span className="font-mono text-xs">{row.endpoint}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="접속 모니터링"
        description={`로그인/접속 로그 ${data?.total || 0}건`}
      />

      <FilterBar
        keyword={keyword}
        onKeywordChange={(value) => {
          setKeyword(value);
          setPage(1);
        }}
        keywordPlaceholder="이름/이메일/IP/엔드포인트 검색"
        onReset={() => {
          setKeyword('');
          setEndpoint('');
          setMethod('');
          setIpAddress('');
          setPage(1);
        }}
      >
        <Input
          className="w-56"
          value={endpoint}
          placeholder="엔드포인트 필터"
          onChange={(event) => {
            setEndpoint(event.target.value);
            setPage(1);
          }}
        />
        <Input
          className="w-44"
          value={ipAddress}
          placeholder="IP 필터"
          onChange={(event) => {
            setIpAddress(event.target.value);
            setPage(1);
          }}
        />
        <Select
          value={method || 'all'}
          onValueChange={(value) => {
            setMethod(value === 'all' ? '' : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="이벤트" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="LOGIN">LOGIN</SelectItem>
            <SelectItem value="LOGIN_FAIL">LOGIN_FAIL</SelectItem>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      <DataTable
        columns={columns}
        data={data?.data || []}
        total={data?.total || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        loading={isLoading}
        emptyMessage="접속 로그가 없습니다."
      />
    </div>
  );
}
