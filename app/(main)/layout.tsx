import { NavigationSidebar } from '@/components/navigation-sidebar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-screen'>
      <div className='hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0'>
        <NavigationSidebar />
      </div>
      <main className='md:pl-[72px] h-full'>{children}</main>
    </div>
  )
}
