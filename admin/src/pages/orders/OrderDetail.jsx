import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrder, updateOrderStatus } from '@/api/orders';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
const fulfillmentFlow = ['주문접수', '상품준비중', '배송중', '배송완료'];
export default function OrderDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);
    const { data: order, isLoading } = useQuery({ queryKey: ['order', id], queryFn: () => getOrder(id) });
    const mutation = useMutation({
        mutationFn: (status) => updateOrderStatus(id, { fulfillmentStatus: status }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['order', id] }); toast({ title: '상태가 변경되었습니다.' }); },
    });
    if (isLoading || !order)
        return <div className="p-8 text-center text-muted-foreground">로딩 중...</div>;
    return (<div>
      <PageHeader title={`주문 ${order.orderNumber}`} actions={<Button variant="outline" onClick={() => navigate('/orders')}><ArrowLeft className="h-4 w-4 mr-1"/>목록</Button>}/>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        <Card>
          <CardHeader><CardTitle className="text-base">주문 정보</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">주문번호</span><span className="font-mono">{order.orderNumber}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">고객</span><span>{order.customerName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">주문일</span><span>{order.createdAt}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">결제상태</span><StatusBadge status={order.paymentStatus}/></div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">배송상태</span>
              <StatusBadge status={order.fulfillmentStatus}/>
            </div>
            <div className="flex justify-between"><span className="text-muted-foreground">총 금액</span><span className="font-bold">₩{order.totalAmount.toLocaleString()}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">배송지</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">수령인</span><span>{order.delivery.receiverName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">전화번호</span><span>{order.delivery.phone}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">주소</span><span>{order.delivery.address1} {order.delivery.address2}</span></div>
            {order.delivery.memo && <div className="flex justify-between"><span className="text-muted-foreground">메모</span><span>{order.delivery.memo}</span></div>}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">주문 상품</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>상품명</TableHead><TableHead className="text-right">단가</TableHead><TableHead className="text-right">수량</TableHead><TableHead className="text-right">소계</TableHead></TableRow></TableHeader>
              <TableBody>
                {order.items.map((item, i) => (<TableRow key={i}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell className="text-right">₩{item.unitPrice.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right font-medium">₩{(item.unitPrice * item.quantity).toLocaleString()}</TableCell>
                  </TableRow>))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {order.fulfillmentStatus !== '주문취소' && order.fulfillmentStatus !== '배송완료' && (<Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">상태 변경</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <div className="space-y-2">
                  <Label>배송 상태</Label>
                  <Select value="" onValueChange={v => { setPendingStatus(v); setConfirmOpen(true); }}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="상태 변경"/></SelectTrigger>
                    <SelectContent>
                      {fulfillmentFlow.filter(s => fulfillmentFlow.indexOf(s) > fulfillmentFlow.indexOf(order.fulfillmentStatus)).map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>

      <ConfirmModal open={confirmOpen} onOpenChange={setConfirmOpen} title="상태 변경" description={`배송 상태를 "${pendingStatus}"로 변경하시겠습니까?`} confirmLabel="변경" onConfirm={() => { if (pendingStatus)
        mutation.mutate(pendingStatus); setConfirmOpen(false); }}/>
    </div>);
}
