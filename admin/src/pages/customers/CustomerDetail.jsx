import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomer, getCustomerOrders, updateCustomerMemberAccess } from '@/api/customers';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
export default function CustomerDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState('');
    const [roleDraft, setRoleDraft] = useState('');
    const { data: customer, isLoading: isCustomerLoading } = useQuery({ queryKey: ['customer', id], queryFn: () => getCustomer(id) });
    const { data: customerOrders } = useQuery({ queryKey: ['customer-orders', id], queryFn: () => getCustomerOrders(id) });
    const statusMutation = useMutation({
        mutationFn: (status) => updateCustomerMemberAccess(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customer', id] });
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            toast({ title: '회원 상태가 변경되었습니다.' });
        },
    });
    const roleMutation = useMutation({
        mutationFn: (memberRole) => updateCustomerMemberAccess(id, { memberRole }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customer', id] });
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            setRoleDraft('');
            toast({ title: '회원 권한이 변경되었습니다.' });
        },
    });
    if (isCustomerLoading || !customer)
        return <div className="p-8 text-center text-muted-foreground">로딩 중...</div>;
    const isSuspended = customer.status === '정지';
    const selectedRole = roleDraft || customer.memberRole || '일반회원';
    const roleChanged = selectedRole !== (customer.memberRole || '일반회원');
    const nextStatus = isSuspended ? '활성' : '정지';
    return (<div>
      <PageHeader title={customer.name} actions={<Button variant="outline" onClick={() => navigate('/customers')}><ArrowLeft className="h-4 w-4 mr-1"/>목록</Button>}/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
        <Card>
          <CardHeader><CardTitle className="text-base">고객 정보</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">이름</span><span>{customer.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">이메일</span><span>{customer.email}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">전화</span><span>{customer.phone}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">회원상태</span><StatusBadge status={customer.status}/></div>
            <div className="flex justify-between"><span className="text-muted-foreground">권한</span><StatusBadge status={customer.memberRole}/></div>
            <div className="flex justify-between"><span className="text-muted-foreground">등급</span><StatusBadge status={customer.grade}/></div>
            <div className="flex justify-between"><span className="text-muted-foreground">누적주문</span><span>{customer.totalOrders}건</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">누적금액</span><span>₩{customer.totalSpent.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">가입일</span><span>{customer.createdAt}</span></div>
            <div className="pt-3 border-t space-y-3">
              <Button variant={isSuspended ? 'outline' : 'destructive'} className="w-full" disabled={statusMutation.isPending} onClick={() => { setPendingStatus(nextStatus); setConfirmOpen(true); }}>
                {isSuspended ? '정지 해제' : '불량 회원 정지'}
              </Button>
              <div className="space-y-2">
                <Label>권한 변경</Label>
                <div className="flex gap-2">
                  <Select value={selectedRole} onValueChange={setRoleDraft}>
                    <SelectTrigger><SelectValue placeholder="권한 선택"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="일반회원">일반회원</SelectItem>
                      <SelectItem value="VIP회원">VIP회원</SelectItem>
                      <SelectItem value="VVIP회원">VVIP회원</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" disabled={!roleChanged || roleMutation.isPending} onClick={() => roleMutation.mutate(selectedRole)}>저장</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">주문 이력</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>주문번호</TableHead><TableHead>결제</TableHead><TableHead>배송</TableHead><TableHead className="text-right">금액</TableHead><TableHead>주문일</TableHead></TableRow></TableHeader>
              <TableBody>
                {(customerOrders || []).map(o => (<TableRow key={o.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/orders/${o.id}`)}>
                    <TableCell className="font-mono text-sm">{o.orderNumber}</TableCell>
                    <TableCell><StatusBadge status={o.paymentStatus}/></TableCell>
                    <TableCell><StatusBadge status={o.fulfillmentStatus}/></TableCell>
                    <TableCell className="text-right">₩{o.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{o.createdAt}</TableCell>
                  </TableRow>))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <ConfirmModal open={confirmOpen} onOpenChange={setConfirmOpen} title={pendingStatus === '정지' ? '회원 정지' : '정지 해제'} description={`회원 상태를 "${pendingStatus}"로 변경하시겠습니까?`} confirmLabel="변경" variant={pendingStatus === '정지' ? 'destructive' : 'default'} onConfirm={() => { if (pendingStatus) {
        statusMutation.mutate(pendingStatus);
    } setConfirmOpen(false); }}/>
    </div>);
}
