// App.jsx
import './assets/styles/main.css';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import PublicLayout from './layouts/PublicLayout';

import Home from './pages/Home';
import Servicios from './pages/Servicios';
import Reservas from './pages/Reservas';
import Contacto from './pages/Contacto';
import Club from './pages/Club'; 

import ConfirmacionReserva from './components/ConfirmacionReserva';
import Confirmada from './vista/confirmada';

import MisReservas from './pages/MisReservas';

import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import Guest from './pages/Guest';
import Booking from './pages/Booking';
import Rooms from './pages/Rooms';
import Staff from './pages/Staff';
import Notifications from './pages/Notifications';

import ProtectedRoute from './components/ProtectedRoute'; // Importante

function App() {
  return (
    <div className="App">
      <Routes>

        {/* Rutas públicas con layout general */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/confirmacion-reserva/:id" element={<ConfirmacionReserva />} />
          <Route path="/confirmada" element={<Confirmada />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/club" element={<Club />} />

          {/* RUTAS PROTEGIDAS POR USUARIO REGISTRADO */}
          <Route element={<ProtectedRoute role="user" />}>
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/confirmacion-reserva/:id" element={<ConfirmacionReserva />} />
            <Route path="/misreservas" element={<MisReservas />} />
          </Route>
        </Route>
          
          {/* Ruta protegida sin header/footer para admin */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/gerencia" element={<AdminDashboard />} />
              <Route path="/guest" element={<Guest />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>
          </Route>
      </Routes>
    </div>
  );
}

export default App
