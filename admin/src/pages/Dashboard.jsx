import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, DollarSign, MessageSquare, ShoppingCart } from 'lucide-react';
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getOrders } from '@/api/orders';
import { getProducts } from '@/api/products';
import { getReviews, toggleReviewStatus } from '@/api/reviews';
import { KpiCard } from '@/components/common/KpiCard';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const COLORS = [
  'hsl(229,32%,38%)',
  'hsl(121,23%,44%)',
  'hsl(40,72%,52%)',
  'hsl(3,72%,55%)',
  'hsl(214,35%,50%)',
  'hsl(340,50%,55%)',
];

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toDateKey(value) {
  if (!value) return null;

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return formatDateKey(parsed);
}

function isCanceledStatus(status) {
  const value = String(status || '').toLowerCase();
  return value.includes('취소') || value.includes('cancel');
}

function isPaidStatus(status) {
  const value = String(status || '').toLowerCase();
  return value.includes('완료') || value.includes('paid');
}

function isReviewVisible(status) {
  const value = String(status || '').toLowerCase();
  return value.includes('노출') || value.includes('visible');
}

function calcTrend(today, previous) {
  if (!previous) return today ? 100 : 0;
  return Math.round(((today - previous) / previous) * 100);
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const ordersQuery = useQuery({
    queryKey: ['dashboard', 'orders'],
    queryFn: () => getOrders({ page: 1, pageSize: 200 }),
  });

  const productsQuery = useQuery({
    queryKey: ['dashboard', 'products'],
    queryFn: () => getProducts({ page: 1, pageSize: 200 }),
  });

  const reviewsQuery = useQuery({
    queryKey: ['dashboard', 'reviews'],
    queryFn: () => getReviews({ page: 1, pageSize: 200 }),
  });

  const orders = ordersQuery.data?.data || [];
  const products = productsQuery.data?.data || [];
  const reviews = reviewsQuery.data?.data || [];

  const todayKey = useMemo(() => formatDateKey(new Date()), []);
  const yesterdayKey = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return formatDateKey(date);
  }, []);

  const ordersSorted = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [orders]
  );

  const reviewsSorted = useMemo(
    () =>
      [...reviews].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [reviews]
  );

  const todayOrders = orders.filter(
    (order) =>
      toDateKey(order.createdAt) === todayKey && !isCanceledStatus(order.paymentStatus)
  );

  const yesterdayOrders = orders.filter(
    (order) =>
      toDateKey(order.createdAt) === yesterdayKey && !isCanceledStatus(order.paymentStatus)
  );

  const todayRevenue = orders
    .filter(
      (order) => toDateKey(order.createdAt) === todayKey && isPaidStatus(order.paymentStatus)
    )
    .reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

  const yesterdayRevenue = orders
    .filter(
      (order) =>
        toDateKey(order.createdAt) === yesterdayKey && isPaidStatus(order.paymentStatus)
    )
    .reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

  const lowStock = products.filter((product) => Number(product.stock) <= 5).length;
  const recentReviews = reviewsSorted.slice(0, 7);
  const recentOrders = ordersSorted.slice(0, 10);

  const salesData = useMemo(() => {
    const rows = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));

      return {
        date: formatDateKey(date),
        name: `${date.getMonth() + 1}/${date.getDate()}`,
        매출: 0,
      };
    });

    const map = new Map(rows.map((row) => [row.date, row]));

    orders.forEach((order) => {
      if (!isPaidStatus(order.paymentStatus)) return;

      const key = toDateKey(order.createdAt);
      if (!key) return;

      const target = map.get(key);
      if (!target) return;

      target.매출 += Number(order.totalAmount) || 0;
    });

    return rows;
  }, [orders]);

  const categoryData = useMemo(() => {
    const categoryMap = {};
    products.forEach((product) => {
      const key = product.category || '기타';
      categoryMap[key] = (categoryMap[key] || 0) + 1;
    });
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  }, [products]);

  const toggleReviewMutation = useMutation({
    mutationFn: toggleReviewStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: () => {
      toast({ title: '리뷰 상태 변경에 실패했습니다.', variant: 'destructive' });
    },
  });

  const loading =
    ordersQuery.isLoading || productsQuery.isLoading || reviewsQuery.isLoading;
  const hasError = ordersQuery.isError || productsQuery.isError || reviewsQuery.isError;

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">로딩 중...</div>;
  }

  if (hasError) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="대시보드"
          description="서점 관리 현황을 한눈에 확인하세요."
        />
        <Card>
          <CardContent className="space-y-3 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              대시보드 데이터를 불러오지 못했습니다.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                ordersQuery.refetch();
                productsQuery.refetch();
                reviewsQuery.refetch();
              }}
            >
              다시 시도
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orderTrendValue = calcTrend(todayOrders.length, yesterdayOrders.length);
  const revenueTrendValue = calcTrend(todayRevenue, yesterdayRevenue);

  return (
    <div>
      <PageHeader
        title="대시보드"
        description="서점 관리 현황을 한눈에 확인하세요."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="오늘 주문 수"
          value={`${todayOrders.length}건`}
          icon={ShoppingCart}
          trend={{ value: orderTrendValue, label: '전일 대비' }}
        />
        <KpiCard
          title="오늘 매출"
          value={`₩${todayRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: revenueTrendValue, label: '전일 대비' }}
        />
        <KpiCard
          title="품절 임박"
          value={`${lowStock}개`}
          icon={AlertTriangle}
          description="재고 5개 이하"
        />
        <KpiCard
          title="최근 리뷰"
          value={`${recentReviews.length}건`}
          icon={MessageSquare}
          description="최근 7건"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">최근 7일 매출</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
                />
                <Tooltip
                  formatter={(value) => `₩${Number(value || 0).toLocaleString()}`}
                />
                <Line
                  type="monotone"
                  dataKey="매출"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">카테고리별 판매 비중</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  fontSize={11}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">최근 주문</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>주문번호</TableHead>
                  <TableHead>고객</TableHead>
                  <TableHead>결제</TableHead>
                  <TableHead>배송</TableHead>
                  <TableHead className="text-right">금액</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <TableCell className="font-mono text-sm">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.paymentStatus} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.fulfillmentStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      ₩{Number(order.totalAmount || 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">최근 리뷰</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reviewsSorted.slice(0, 5).map((review) => (
              <div
                key={review.id}
                className="flex items-start justify-between gap-2 border-b pb-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{review.productTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {review.customerName} · {'★'.repeat(review.rating)}
                  </p>
                </div>
                <Switch
                  checked={isReviewVisible(review.status)}
                  onCheckedChange={() => toggleReviewMutation.mutate(review.id)}
                  aria-label="리뷰 노출 변경"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
