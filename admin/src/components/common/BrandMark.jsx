import { BookOpen, Moon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BrandMark({
  compact = false,
  tone = 'default',
  showTagline = false,
  className,
}) {
  const sidebarTone = tone === 'sidebar';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'relative grid h-11 w-11 place-items-center rounded-full border',
          sidebarTone
            ? 'border-sidebar-border/80 bg-sidebar-accent/80'
            : 'border-[#6f5335]/30 bg-[#f6efe0]'
        )}
      >
        <span
          className={cn(
            'absolute inset-[3px] rounded-full border',
            sidebarTone ? 'border-sidebar-border/70' : 'border-[#6f5335]/25'
          )}
        />
        <BookOpen
          className={cn(
            'relative z-10 h-5 w-5',
            sidebarTone ? 'text-sidebar-primary' : 'text-[#2f355f]'
          )}
        />
        <Moon
          className={cn(
            'absolute -right-0.5 -top-0.5 h-3.5 w-3.5',
            sidebarTone ? 'text-[#e2ba59]' : 'text-[#cf9f3d]'
          )}
        />
        <Sparkles
          className={cn(
            'absolute -left-1 bottom-1 h-3 w-3',
            sidebarTone ? 'text-sidebar-foreground/70' : 'text-[#5a7b4c]'
          )}
        />
      </div>

      {!compact && (
        <div className="min-w-0 leading-tight">
          <p
            className={cn(
              'font-brand text-xl tracking-tight',
              sidebarTone ? 'text-sidebar-accent-foreground' : 'text-[#382216]'
            )}
          >
            북촌
          </p>
          <p
            className={cn(
              'text-[10px] uppercase tracking-[0.22em]',
              sidebarTone ? 'text-sidebar-foreground/80' : 'text-[#6d533f]/85'
            )}
          >
            Bukchon Book Village
          </p>
          {showTagline && (
            <p
              className={cn(
                'mt-0.5 text-[11px]',
                sidebarTone ? 'text-sidebar-foreground/70' : 'text-[#6d533f]'
              )}
            >
              책 읽는 마을 관리자 서비스
            </p>
          )}
        </div>
      )}
    </div>
  );
}
