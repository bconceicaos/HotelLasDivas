import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <main className="flex-grow-1 p-4 bg-light">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
