import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { changePasswordApi } from '@/api/auth';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [logoutOpen, setLogoutOpen] = useState(false);
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const handlePwChange = async (event) => {
    event.preventDefault();

    if (!pw.current || !pw.newPw || !pw.confirm) {
      toast({ title: '모든 항목을 입력해주세요.', variant: 'destructive' });
      return;
    }

    if (pw.newPw !== pw.confirm) {
      toast({ title: '새 비밀번호가 일치하지 않습니다.', variant: 'destructive' });
      return;
    }

    if (pw.newPw.length < 8) {
      toast({ title: '비밀번호는 8자 이상이어야 합니다.', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      await changePasswordApi(pw.current, pw.newPw);
      toast({ title: '비밀번호가 변경되었습니다.' });
      setPw({ current: '', newPw: '', confirm: '' });
    } catch {
      toast({ title: '비밀번호 변경에 실패했습니다.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <PageHeader
        title="설정"
        description="관리자 프로필과 계정 보안 설정을 관리합니다."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">관리자 프로필</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-3">
            <span className="text-muted-foreground">이름</span>
            <span className="font-medium">{user?.name || '관리자'}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">이메일</span>
            <span className="font-medium">{user?.email || '-'}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">비밀번호 변경</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePwChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">현재 비밀번호</Label>
              <Input
                id="current-password"
                type="password"
                value={pw.current}
                onChange={(event) =>
                  setPw((prev) => ({ ...prev, current: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">새 비밀번호</Label>
              <Input
                id="new-password"
                type="password"
                value={pw.newPw}
                onChange={(event) =>
                  setPw((prev) => ({ ...prev, newPw: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
              <Input
                id="confirm-password"
                type="password"
                value={pw.confirm}
                onChange={(event) =>
                  setPw((prev) => ({ ...prev, confirm: event.target.value }))
                }
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? '변경 중...' : '비밀번호 변경'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Button variant="destructive" onClick={() => setLogoutOpen(true)}>
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
        </CardContent>
      </Card>

      <ConfirmModal
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="로그아웃"
        description="현재 계정에서 로그아웃 하시겠습니까?"
        variant="destructive"
        confirmLabel="로그아웃"
        cancelLabel="취소"
        onConfirm={logout}
      />
    </section>
  );
}
