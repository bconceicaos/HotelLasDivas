// layouts/PublicLayout.jsx
import '../assets/styles/main.css';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

import 'bootstrap/dist/css/bootstrap.min.css';

const PublicLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
