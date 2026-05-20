import AdminHeader from './AdminHeader.jsx';
import AdminNav from './AdminNav.jsx';

function AdminLayout({ status, onRefreshStatus, statusLoading, onLogout, children }) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-sm text-gray-800">
      <AdminHeader status={status} onRefreshStatus={onRefreshStatus} loading={statusLoading} onLogout={onLogout} />
      <AdminNav />
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}

export default AdminLayout;
