import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  adjustInventory,
  getInventoryLogs,
  getInventoryProducts,
} from '@/api/inventory';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { FilterBar } from '@/components/common/FilterBar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function InventoryPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState('stock');
  const [keyword, setKeyword] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [logType, setLogType] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [intakeIsbn, setIntakeIsbn] = useState('');
  const [intakeQuantity, setIntakeQuantity] = useState(1);
  const [intakeReason, setIntakeReason] = useState('');

  const productsQ = useQuery({
    queryKey: ['inv-products', keyword, author, isbn, page, pageSize],
    queryFn: () => getInventoryProducts({ keyword, author, isbn13: isbn, page, pageSize }),
    enabled: tab === 'stock',
  });

  const logsQ = useQuery({
    queryKey: ['inv-logs', keyword, logType, page, pageSize],
    queryFn: () => getInventoryLogs({ keyword, type: logType, page, pageSize }),
    enabled: tab === 'logs',
  });

  const intakeMut = useMutation({
    mutationFn: () =>
      adjustInventory({
        isbn13: intakeIsbn,
        type: '입고',
        quantity: intakeQuantity,
        reason: intakeReason || 'ISBN intake',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inv-products'] });
      queryClient.invalidateQueries({ queryKey: ['inv-logs'] });
      setIntakeQuantity(1);
      setIntakeReason('');
      toast({ title: '입고 처리가 완료되었습니다.' });
    },
    onError: (error) => {
      toast({
        title: error?.message || '입고 처리에 실패했습니다.',
        variant: 'destructive',
      });
    },
  });

  const stockCols = [
    { key: 'title', header: '상품명', sortable: true },
    { key: 'author', header: '작가', sortable: true },
    { key: 'isbn13', header: 'ISBN' },
    {
      key: 'stock',
      header: '현재재고',
      sortable: true,
      render: (p) => (
        <span className={p.stock <= 5 ? 'text-destructive font-bold' : ''}>{p.stock}</span>
      ),
    },
    { key: 'status', header: '상태', render: (p) => <StatusBadge status={p.status} /> },
  ];

  const logCols = [
    { key: 'productTitle', header: '상품명' },
    { key: 'type', header: '유형', render: (l) => <StatusBadge status={l.type} /> },
    {
      key: 'quantity',
      header: '수량',
      render: (l) => (
        <span className={l.quantity < 0 ? 'text-destructive' : 'text-success'}>
          {l.quantity > 0 ? '+' : ''}
          {l.quantity}
        </span>
      ),
    },
    { key: 'reason', header: '사유' },
    { key: 'actor', header: '관리자' },
    { key: 'createdAt', header: '일시', sortable: true },
  ];

  return (
    <div>
      <PageHeader title="재고 관리" />

      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v);
          setPage(1);
          setKeyword('');
        }}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="stock">재고 현황</TabsTrigger>
          <TabsTrigger value="logs">재고 로그</TabsTrigger>
        </TabsList>

        <TabsContent value="stock">
          <div className="mb-4 grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-4">
            <Input
              placeholder="ISBN 입력"
              value={intakeIsbn}
              onChange={(e) => setIntakeIsbn(e.target.value)}
            />
            <Input
              type="number"
              min={1}
              value={intakeQuantity}
              onChange={(e) => setIntakeQuantity(Math.max(1, Number(e.target.value) || 1))}
            />
            <Input
              placeholder="입고 사유"
              value={intakeReason}
              onChange={(e) => setIntakeReason(e.target.value)}
            />
            <Button
              onClick={() => intakeMut.mutate()}
              disabled={intakeMut.isPending || !intakeIsbn || intakeQuantity <= 0}
            >
              {intakeMut.isPending ? '처리중...' : 'ISBN 입고'}
            </Button>
          </div>

          <FilterBar
            keyword={keyword}
            onKeywordChange={(v) => {
              setKeyword(v);
              setPage(1);
            }}
            keywordPlaceholder="상품명 검색"
            onReset={() => {
              setKeyword('');
              setAuthor('');
              setIsbn('');
              setPage(1);
            }}
          >
            <Input
              className="w-44"
              placeholder="작가"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                setPage(1);
              }}
            />
            <Input
              className="w-52"
              placeholder="ISBN"
              value={isbn}
              onChange={(e) => {
                setIsbn(e.target.value);
                setPage(1);
              }}
            />
          </FilterBar>

          <DataTable
            columns={stockCols}
            data={productsQ.data?.data || []}
            total={productsQ.data?.total || 0}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            loading={productsQ.isLoading}
          />
        </TabsContent>

        <TabsContent value="logs">
          <FilterBar
            keyword={keyword}
            onKeywordChange={(v) => {
              setKeyword(v);
              setPage(1);
            }}
            keywordPlaceholder="상품명 검색"
            onReset={() => {
              setKeyword('');
              setLogType('');
              setPage(1);
            }}
          >
            <Select
              value={logType}
              onValueChange={(v) => {
                setLogType(v === 'all' ? '' : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-28">
                <SelectValue placeholder="유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="입고">입고</SelectItem>
                <SelectItem value="출고">출고</SelectItem>
                <SelectItem value="조정">조정</SelectItem>
              </SelectContent>
            </Select>
          </FilterBar>

          <DataTable
            columns={logCols}
            data={logsQ.data?.data || []}
            total={logsQ.data?.total || 0}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            loading={logsQ.isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
