import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrandMark } from '@/components/common/BrandMark';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      toast({ title: '아이디와 비밀번호를 입력해주세요.', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      await login(username, password, remember);
      toast({ title: '로그인 성공', description: '북촌 관리자 페이지로 이동합니다.' });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast({
        title: '로그인 실패',
        description: error.message || '로그인 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(58,83,133,0.16)_0%,_rgba(58,83,133,0)_68%)]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(199,159,85,0.25)_0%,_rgba(199,159,85,0)_68%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="animate-fade-in hidden rounded-3xl border border-[#bfa57f]/45 bg-[#f7efdf]/75 p-10 text-[#3f2c1d] shadow-[0_24px_72px_-42px_rgba(66,40,20,0.65)] backdrop-blur lg:flex lg:flex-col lg:justify-between">
          <BrandMark showTagline />

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#745738]">
              Bukchon Service
            </p>
            <h1 className="font-brand text-5xl leading-tight">
              북촌
              <br />
              책 읽는 마을
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-[#6d533f]">
              한옥의 온기와 독서 문화의 감성을 담은 북촌 서비스 운영 공간입니다.
              주문, 상품, 고객, 리뷰를 한 화면에서 안정적으로 관리하세요.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-2xl border border-[#c7ac83]/50 bg-white/50 p-3">
              <p className="font-semibold">상품</p>
              <p className="mt-1 text-[#6d533f]">재고/상태 관리</p>
            </div>
            <div className="rounded-2xl border border-[#c7ac83]/50 bg-white/50 p-3">
              <p className="font-semibold">주문</p>
              <p className="mt-1 text-[#6d533f]">결제/배송 추적</p>
            </div>
            <div className="rounded-2xl border border-[#c7ac83]/50 bg-white/50 p-3">
              <p className="font-semibold">고객</p>
              <p className="mt-1 text-[#6d533f]">리뷰/문의 대응</p>
            </div>
          </div>
        </section>

        <Card className="animate-fade-in-up relative overflow-hidden rounded-3xl border border-[#c5ae8a]/45 bg-white/85 shadow-[0_26px_70px_-42px_rgba(66,40,20,0.65)] backdrop-blur">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,_rgba(201,170,112,0.24)_0%,_rgba(201,170,112,0)_100%)]" />

          <CardHeader className="relative space-y-3 pb-2 text-center">
            <div className="mx-auto lg:hidden">
              <BrandMark />
            </div>
            <CardTitle className="font-brand text-3xl text-[#3f2c1d]">북촌 관리자 로그인</CardTitle>
            <CardDescription className="text-[#6d533f]">
              북촌 Book Village 운영자 계정으로 접속하세요.
            </CardDescription>
          </CardHeader>

          <CardContent className="relative">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">아이디</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="admin"
                  autoFocus
                  className="h-11 border-[#cdb89a] bg-white/80 focus-visible:ring-[#395386]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="비밀번호 입력"
                  className="h-11 border-[#cdb89a] bg-white/80 focus-visible:ring-[#395386]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(value) => setRemember(Boolean(value))}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal text-muted-foreground"
                >
                  로그인 상태 유지
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-[#2f355f] text-white hover:bg-[#23284b]"
              >
                {loading ? '로그인 중...' : '로그인'}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                테스트 계정: <span className="font-medium">admin / admin1234</span>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
