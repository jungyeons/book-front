import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/api/coupons';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { FilterBar } from '@/components/common/FilterBar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { CurrencyInput } from '@/components/common/CurrencyInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
const emptyCoupon = { code: '', name: '', discountType: '정액', discountValue: 0, minOrderAmount: 0, maxDiscountAmount: 0, startAt: '', endAt: '', status: '활성' };
export default function CouponsPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [keyword, setKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [form, setForm] = useState(emptyCoupon);
    const { data, isLoading } = useQuery({ queryKey: ['coupons', keyword, statusFilter, page, pageSize], queryFn: () => getCoupons({ keyword, status: statusFilter, page, pageSize }) });
    const createMut = useMutation({ mutationFn: createCoupon, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['coupons'] }); toast({ title: '쿠폰 생성 완료' }); setFormOpen(false); } });
    const updateMut = useMutation({ mutationFn: ({ id, data }) => updateCoupon(id, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['coupons'] }); toast({ title: '수정 완료' }); setFormOpen(false); } });
    const deleteMut = useMutation({ mutationFn: deleteCoupon, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['coupons'] }); toast({ title: '삭제 완료' }); } });
    const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
    const openEdit = (c) => {
        setEditId(c.id);
        setForm({ code: c.code, name: c.name, discountType: c.discountType, discountValue: c.discountValue, minOrderAmount: c.minOrderAmount || 0, maxDiscountAmount: c.maxDiscountAmount || 0, startAt: c.startAt, endAt: c.endAt, status: c.status });
        setFormOpen(true);
    };
    const handleSubmit = () => {
        if (!form.code || !form.name || !form.startAt || !form.endAt) {
            toast({ title: '필수 항목을 입력해주세요.', variant: 'destructive' });
            return;
        }
        if (editId)
            updateMut.mutate({ id: editId, data: form });
        else
            createMut.mutate(form);
    };
    const columns = [
        { key: 'code', header: '코드', render: c => <span className="font-mono text-sm">{c.code}</span> },
        { key: 'name', header: '이름' },
        { key: 'discountType', header: '유형' },
        { key: 'discountValue', header: '할인', render: c => c.discountType === '정률' ? `${c.discountValue}%` : `₩${c.discountValue.toLocaleString()}` },
        { key: 'startAt', header: '시작일' },
        { key: 'endAt', header: '종료일' },
        { key: 'status', header: '상태', render: c => <StatusBadge status={c.status}/> },
        { key: 'actions', header: '', render: c => (<div className="flex gap-1" onClick={e => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)} aria-label="수정"><Edit className="h-4 w-4"/></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setDeleteId(c.id); setDeleteOpen(true); }} aria-label="삭제"><Trash2 className="h-4 w-4 text-destructive"/></Button>
      </div>) },
    ];
    return (<div>
      <PageHeader title="쿠폰 관리" actions={<Button onClick={() => { setEditId(null); setForm(emptyCoupon); setFormOpen(true); }}><Plus className="h-4 w-4 mr-1"/>쿠폰 생성</Button>}/>
      <FilterBar keyword={keyword} onKeywordChange={v => { setKeyword(v); setPage(1); }} keywordPlaceholder="코드/이름 검색" onReset={() => { setKeyword(''); setStatusFilter(''); setPage(1); }}>
        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-28"><SelectValue placeholder="상태"/></SelectTrigger>
          <SelectContent><SelectItem value="all">전체</SelectItem><SelectItem value="활성">활성</SelectItem><SelectItem value="비활성">비활성</SelectItem><SelectItem value="만료">만료</SelectItem></SelectContent>
        </Select>
      </FilterBar>
      <DataTable columns={columns} data={data?.data || []} total={data?.total || 0} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} loading={isLoading}/>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? '쿠폰 수정' : '쿠폰 생성'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>코드 *</Label><Input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())}/></div>
              <div className="space-y-2"><Label>이름 *</Label><Input value={form.name} onChange={e => set('name', e.target.value)}/></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>할인 유형</Label>
                <Select value={form.discountType} onValueChange={v => set('discountType', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="정액">정액</SelectItem><SelectItem value="정률">정률</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>할인 값</Label>{form.discountType === '정액' ? <CurrencyInput value={form.discountValue} onChange={v => set('discountValue', v)}/> : <Input type="number" min={0} max={100} value={form.discountValue} onChange={e => set('discountValue', Number(e.target.value))}/>}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>최소 주문금액</Label><CurrencyInput value={form.minOrderAmount || 0} onChange={v => set('minOrderAmount', v)}/></div>
              {form.discountType === '정률' && <div className="space-y-2"><Label>최대 할인금액</Label><CurrencyInput value={form.maxDiscountAmount || 0} onChange={v => set('maxDiscountAmount', v)}/></div>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>시작일 *</Label><Input type="date" value={form.startAt} onChange={e => set('startAt', e.target.value)}/></div>
              <div className="space-y-2"><Label>종료일 *</Label><Input type="date" value={form.endAt} onChange={e => set('endAt', e.target.value)}/></div>
            </div>
            <div className="space-y-2">
              <Label>상태</Label>
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="활성">활성</SelectItem><SelectItem value="비활성">비활성</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>취소</Button>
            <Button onClick={handleSubmit}>{editId ? '수정' : '생성'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmModal open={deleteOpen} onOpenChange={setDeleteOpen} title="쿠폰 삭제" description="이 쿠폰을 삭제하시겠습니까?" variant="destructive" confirmLabel="삭제" onConfirm={() => { if (deleteId)
        deleteMut.mutate(deleteId); setDeleteOpen(false); }}/>
    </div>);
}
