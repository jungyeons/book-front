import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AdminHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="relative z-20 flex h-16 shrink-0 items-center justify-between border-b border-border/70 bg-card/80 px-4 backdrop-blur md:px-6">
      <div className="flex h-full items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

        <div className="hidden h-full items-center md:flex">
          <p className="text-xl font-semibold tracking-tight text-foreground">
            책 읽는 마을 운영 대시보드
          </p>
        </div>

        <p className="text-base font-semibold text-foreground md:hidden">운영 대시보드</p>
      </div>

      <div className="flex h-full items-center gap-2">
        <span className="hidden rounded-full border border-[#ccb17a]/40 bg-[#f2e4c8]/70 px-2.5 py-1 text-xs font-medium text-[#765425] lg:inline-flex">
          운영중
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 rounded-full px-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#6f5335]/20 bg-[#f7ecda]">
                <User className="h-4 w-4 text-[#6f5335]" />
              </div>
              <span className="text-sm font-medium">{user?.name || '관리자'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
