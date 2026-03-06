import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { AdminHeader } from './AdminHeader';
import { SidebarProvider } from '@/components/ui/sidebar';

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="bukchon-shell min-h-screen w-full">
        <div className="bukchon-glow pointer-events-none" />

        <div className="relative z-10 flex min-h-screen w-full">
          <AppSidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <AdminHeader />
            <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-7">
              <div className="animate-fade-in-up mx-auto w-full max-w-[1600px]">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
