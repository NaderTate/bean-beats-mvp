import Dashboard from '@/components/shared/dashboard-nav'

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className="flex min-h-screen overflow-x-hidden bg-gray-100">
      <Dashboard />
      {children}
    </div>
  )
}

export default Layout
